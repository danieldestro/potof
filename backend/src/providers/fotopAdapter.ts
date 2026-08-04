import type { Provedor } from '@prisma/client';
import type { FastifyBaseLogger } from 'fastify';
import { prisma } from '../db/prisma';
import {
  ensureEventSession,
  fetchEventosBusca,
  fetchSearchResultsHtml,
  sendSelfie as fotopSendSelfie,
  FOTOP_PHOTOS_BASE_URL,
} from '../fotop/fotopClient';
import { parseNoResultsMessage, parsePhotoGrid, type Photo } from '../fotop/photoParser';
import type { EventoComProvedor, FotosResult, ProviderAdapter, SelfieResult, SyncResult } from './types';

const MAX_PHOTO_PAGES = 20;
const MAX_SYNC_PAGES = 50;
const FOTOP_LIST_PAGE_SIZE = 40;

function requireIdEventoProvedor(evento: EventoComProvedor): string {
  if (!evento.idEventoProvedor) {
    throw new Error(`Evento ${evento.id} (provedor Fotop) sem idEventoProvedor configurado.`);
  }
  return evento.idEventoProvedor;
}

async function sendSelfie(
  evento: EventoComProvedor,
  sessionId: string,
  file: { buffer: Buffer; filename: string; mimeType: string },
  log: FastifyBaseLogger
): Promise<SelfieResult> {
  const fotopEventId = requireIdEventoProvedor(evento);
  await ensureEventSession(sessionId, fotopEventId, log);
  return fotopSendSelfie(sessionId, fotopEventId, file, log);
}

// Mesma estratégia de paginação de antes (backend/src/routes/eventos.ts na Fase 1):
// /rc/{n} não pagina de verdade hoje, então para assim que uma página não traz
// nenhum id novo em vez de andar cegamente até MAX_PHOTO_PAGES.
async function fetchPhotos(
  evento: EventoComProvedor,
  sessionId: string,
  log: FastifyBaseLogger
): Promise<FotosResult> {
  const fotopEventId = requireIdEventoProvedor(evento);
  await ensureEventSession(sessionId, fotopEventId, log);

  const photos: Photo[] = [];
  const seenIds = new Set<string>();
  let page = 1;
  let noResultsMessage: string | null = null;

  while (page <= MAX_PHOTO_PAGES) {
    const html = await fetchSearchResultsHtml(sessionId, fotopEventId, page, log);
    const pagePhotos = parsePhotoGrid(html, log);

    if (pagePhotos.length === 0) {
      if (page === 1) {
        noResultsMessage = parseNoResultsMessage(html);
        if (noResultsMessage) log.info({ noResultsMessage }, 'fotop reported no matching photos');
      }
      break;
    }

    const newPhotos = pagePhotos.filter((p) => !seenIds.has(p.id));
    if (newPhotos.length === 0) {
      log.info({ page }, "fotop: page repeats the previous page's photos, stopping pagination");
      break;
    }

    for (const p of newPhotos) seenIds.add(p.id);
    photos.push(...newPhotos);
    page += 1;
  }

  log.info({ total: photos.length, pagesFetched: page }, 'photo search finished');
  return { photos, message: noResultsMessage ?? undefined };
}

// Importa/atualiza o catálogo de eventos do fotop no BD local, sob demanda
// (disparado pelo admin — ver routes/admin/provedores.ts). Resolve a
// categoria local de cada evento via categorias_provedores; eventos cuja
// categoria não tem mapeamento são pulados (com log) em vez de travar o sync
// inteiro.
async function syncEventos(provedor: Provedor, log: FastifyBaseLogger): Promise<SyncResult> {
  let created = 0;
  let updated = 0;
  let skipped = 0;
  let page = 1;

  while (page <= MAX_SYNC_PAGES) {
    const raw = await fetchEventosBusca({ page }, log);
    if (raw.length === 0) break;

    for (const e of raw) {
      const mapping = await prisma.categoriaProvedor.findUnique({
        where: {
          provedorId_idCategoriaProvedor: { provedorId: provedor.id, idCategoriaProvedor: e.id_estacoes },
        },
      });
      if (!mapping) {
        log.warn(
          { idEstacoes: e.id_estacoes, eventoNome: e.nome },
          'sync fotop: sem mapeamento de categoria (categorias_provedores), evento pulado'
        );
        skipped += 1;
        continue;
      }

      const dataHora = e.data ? new Date(`${e.data}T00:00:00`) : null;
      if (!dataHora || Number.isNaN(dataHora.getTime())) {
        log.warn(
          { idEventoProvedor: e.id_produtos_eventos, data: e.data },
          'sync fotop: data inválida, evento pulado'
        );
        skipped += 1;
        continue;
      }

      const data = {
        nome: e.nome.trim(),
        dataHora,
        cidade: e.cidade || null,
        uf: e.estado || null,
        local: e.local || null,
        categoriaId: mapping.categoriaId,
        urlCapa: `${FOTOP_PHOTOS_BASE_URL}/fotos/imagens/produtos_eventos/foto_${e.id_produtos_eventos}_g.jpg`,
      };

      const existing = await prisma.evento.findUnique({
        where: {
          provedorId_idEventoProvedor: { provedorId: provedor.id, idEventoProvedor: e.id_produtos_eventos },
        },
      });

      if (existing) {
        await prisma.evento.update({ where: { id: existing.id }, data });
        updated += 1;
      } else {
        await prisma.evento.create({
          data: { ...data, provedorId: provedor.id, idEventoProvedor: e.id_produtos_eventos },
        });
        created += 1;
      }
    }

    if (raw.length < FOTOP_LIST_PAGE_SIZE) break;
    page += 1;
  }

  log.info({ created, updated, skipped, pagesFetched: page }, 'sync fotop finished');
  return { created, updated, skipped };
}

export const fotopAdapter: ProviderAdapter = {
  slug: 'fotop',
  sendSelfie,
  fetchPhotos,
  syncEventos,
};
