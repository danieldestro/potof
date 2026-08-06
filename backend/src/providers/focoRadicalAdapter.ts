import type { Provedor } from '@prisma/client';
import type { FastifyBaseLogger } from 'fastify';
import { prisma } from '../db/prisma';
import { fetchCompetitions, FOCO_RADICAL_BASE_URL, type FocoRadicalCompetitionRaw } from '../focoRadical/focoRadicalClient';
import type { EventoComProvedor, FotosResult, ProviderAdapter, SelfieResult, SyncResult } from './types';

// Busca por selfie/fotos ainda não foi implementada pra este provedor (só o catálogo de
// eventos, via syncEventos, foi mapeado até agora). As rotas em routes/eventos.ts tratam
// qualquer erro daqui como "falha ao comunicar com o provedor".
const NOT_IMPLEMENTED_MESSAGE = 'Foco Radical: busca por fotos ainda não suportada.';

async function sendSelfie(): Promise<SelfieResult> {
  throw new Error(NOT_IMPLEMENTED_MESSAGE);
}

async function fetchPhotos(): Promise<FotosResult> {
  throw new Error(NOT_IMPLEMENTED_MESSAGE);
}

// Limite defensivo por mês, no mesmo espírito do MAX_SYNC_PAGES do fotop — o retorno da API
// já traz _meta.pageCount, isso só evita um loop infinito se a API se comportar de forma
// inesperada.
const MAX_PAGES_PER_MONTH = 50;
const MONTHS_BACK = 12;
// Pausa entre requests pra não disparar o rate limit do Cloudflare na frente da API (ver
// comentário em focoRadicalClient.fetchCompetitions) — request-a-request é mais barato que
// deixar o 429 acontecer e pagar o backoff.
const REQUEST_PACING_MS = 600;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function formatDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

// Últimos MONTHS_BACK meses (incluindo o mês corrente), do mais antigo pro mais recente. A API
// do Foco Radical exige um intervalo de datas por request (CompetitionSearch[dates_multi]) em
// vez de listar "todos os eventos ativos" como o fotop, então o catálogo é varrido mês a mês.
function lastMonthRanges(monthsBack: number, now: Date): { dataDe: string; dataAte: string }[] {
  const ranges: { dataDe: string; dataAte: string }[] = [];
  for (let i = monthsBack - 1; i >= 0; i--) {
    const first = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1));
    const last = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i + 1, 0));
    ranges.push({ dataDe: formatDate(first), dataAte: formatDate(last) });
  }
  return ranges;
}

async function upsertCompetition(
  item: FocoRadicalCompetitionRaw,
  provedor: Provedor,
  log: FastifyBaseLogger
): Promise<'created' | 'updated' | 'skipped'> {
  if (!item.sport) {
    log.warn({ id: item.id, nome: item.name }, 'sync foco radical: evento sem esporte, pulado');
    return 'skipped';
  }

  const mapping = await prisma.categoriaProvedor.findUnique({
    where: {
      provedorId_idCategoriaProvedor: { provedorId: provedor.id, idCategoriaProvedor: String(item.sport.id) },
    },
  });
  if (!mapping) {
    log.warn(
      { idCategoriaProvedor: item.sport.id, esporte: item.sport.name, eventoNome: item.name },
      'sync foco radical: sem mapeamento de categoria (categorias_provedores), evento pulado'
    );
    return 'skipped';
  }

  const dataHora = item.date ? new Date(`${item.date}T00:00:00`) : null;
  if (!dataHora || Number.isNaN(dataHora.getTime())) {
    log.warn({ id: item.id, data: item.date }, 'sync foco radical: data inválida, evento pulado');
    return 'skipped';
  }

  const idEventoProvedor = String(item.id);
  const data = {
    nome: item.name.trim(),
    dataHora,
    cidade: item.place || null,
    uf: item.state?.abbreviation || null,
    categoriaId: mapping.categoriaId,
    urlSite: `${FOCO_RADICAL_BASE_URL}/evento/${item.path}`,
    urlCapa: item.coverPhotoOrIcon?.image || null,
  };

  const existing = await prisma.evento.findUnique({
    where: { provedorId_idEventoProvedor: { provedorId: provedor.id, idEventoProvedor } },
  });

  if (existing) {
    await prisma.evento.update({ where: { id: existing.id }, data });
    return 'updated';
  }

  await prisma.evento.create({ data: { ...data, provedorId: provedor.id, idEventoProvedor } });
  return 'created';
}

// Importa/atualiza o catálogo de eventos do Foco Radical no BD local, sob demanda (disparado
// pelo admin) ou periodicamente (scheduler.ts). Varre os últimos MONTHS_BACK meses — este
// provedor é uma galeria de fotos pós-evento, então o que importa é o histórico recente, não
// eventos futuros.
async function syncEventos(provedor: Provedor, log: FastifyBaseLogger): Promise<SyncResult> {
  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const { dataDe, dataAte } of lastMonthRanges(MONTHS_BACK, new Date())) {
    let page = 1;
    let pageCount = 1;

    do {
      const { items, _meta } = await fetchCompetitions({ dataDe, dataAte, page }, log);
      pageCount = _meta.pageCount || 1;

      for (const item of items) {
        const outcome = await upsertCompetition(item, provedor, log);
        if (outcome === 'created') created += 1;
        else if (outcome === 'updated') updated += 1;
        else skipped += 1;
      }

      page += 1;
      if (page <= pageCount && page <= MAX_PAGES_PER_MONTH) await sleep(REQUEST_PACING_MS);
    } while (page <= pageCount && page <= MAX_PAGES_PER_MONTH);

    log.info({ dataDe, dataAte, created, updated, skipped }, 'sync foco radical: mês concluído');
  }

  log.info({ created, updated, skipped }, 'sync foco radical finished');
  return { created, updated, skipped };
}

export const focoRadicalAdapter: ProviderAdapter = {
  slug: 'foco-radical',
  sendSelfie,
  fetchPhotos,
  syncEventos,
};
