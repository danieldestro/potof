import type { Provedor } from '@prisma/client';
import type { FastifyBaseLogger } from 'fastify';
import { prisma } from '../db/prisma';
import { fetchCompetitions, FOCO_RADICAL_BASE_URL, type FocoRadicalCompetitionRaw } from '../focoRadical/focoRadicalClient';
import { getSyncIncrementalDias } from './syncSettings';
import type { EventoComProvedor, FotosResult, ProviderAdapter, SelfieResult, SyncOptions, SyncResult } from './types';

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

// Janela única dos últimos `dias` dias até hoje — usada no sync incremental. Cobre praticamente
// toda a mudança real (evento novo, foto de capa adicionada/trocada, correção de detalhe) porque
// competições ficam "paradas" pouco tempo depois de acontecer; eventos mais antigos que isso só
// são revisitados num sync completo.
function recentDayRange(dias: number, now: Date): { dataDe: string; dataAte: string } {
  const from = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - dias));
  return { dataDe: formatDate(from), dataAte: formatDate(now) };
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

interface RangeTotals {
  created: number;
  updated: number;
  skipped: number;
}

// Varre um único intervalo de datas, paginando até acabar ou até MAX_PAGES_PER_MONTH — usado
// tanto pelo sweep mês-a-mês do sync completo quanto pela janela única do sync incremental.
async function syncDateRange(
  dataDe: string,
  dataAte: string,
  provedor: Provedor,
  log: FastifyBaseLogger
): Promise<RangeTotals> {
  const totals: RangeTotals = { created: 0, updated: 0, skipped: 0 };
  let page = 1;
  let pageCount = 1;

  do {
    const { items, _meta } = await fetchCompetitions({ dataDe, dataAte, page }, log);
    pageCount = _meta.pageCount || 1;

    for (const item of items) {
      const outcome = await upsertCompetition(item, provedor, log);
      if (outcome === 'created') totals.created += 1;
      else if (outcome === 'updated') totals.updated += 1;
      else totals.skipped += 1;
    }

    page += 1;
    if (page <= pageCount && page <= MAX_PAGES_PER_MONTH) await sleep(REQUEST_PACING_MS);
  } while (page <= pageCount && page <= MAX_PAGES_PER_MONTH);

  log.info({ dataDe, dataAte, ...totals }, 'sync foco radical: intervalo concluído');
  return totals;
}

// Importa/atualiza o catálogo de eventos do Foco Radical no BD local, sob demanda (disparado
// pelo admin) ou periodicamente (scheduler.ts).
//
// - full=true: varre os últimos MONTHS_BACK meses — usado no primeiro sync do provedor e sob
//   pedido explícito do admin ("Sincronizar completo"). Cobre o histórico inteiro que a Home
//   ainda expõe, mas é caro (dezenas de requests, ~1 request/600ms pra não levar 429 do
//   Cloudflare — ver focoRadicalClient.fetchCompetitions).
// - full=false: varre só os últimos N dias (Configuracao.syncIncrementalDias — ver
//   syncSettings.ts). Suficiente pro que muda de verdade dia a dia (evento novo, foto de capa),
//   e barato o bastante pra rodar em todo ciclo do scheduler sem repetir o custo do sweep
//   completo.
async function syncEventos(provedor: Provedor, log: FastifyBaseLogger, options: SyncOptions): Promise<SyncResult> {
  const now = new Date();
  const ranges = options.full
    ? lastMonthRanges(MONTHS_BACK, now)
    : [recentDayRange(await getSyncIncrementalDias(), now)];

  const result: SyncResult = { created: 0, updated: 0, skipped: 0 };
  for (const { dataDe, dataAte } of ranges) {
    const totals = await syncDateRange(dataDe, dataAte, provedor, log);
    result.created += totals.created;
    result.updated += totals.updated;
    result.skipped += totals.skipped;
  }

  log.info({ full: options.full, ...result }, 'sync foco radical finished');
  return result;
}

export const focoRadicalAdapter: ProviderAdapter = {
  slug: 'foco-radical',
  sendSelfie,
  fetchPhotos,
  syncEventos,
};
