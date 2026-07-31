import { randomUUID } from 'node:crypto';
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import {
  ensureEventSession,
  fetchEventosBusca,
  fetchSearchResultsHtml,
  searchEventosPorNome,
  sendSelfie,
  FOTOP_PHOTOS_BASE_URL,
} from '../fotop/fotopClient';
import {
  parsePhotoGrid,
  parseNoResultsMessage,
  parseEventName,
  parseEventLocalData,
  type Photo,
} from '../fotop/photoParser';

const POTOF_SESSION_COOKIE = 'potof_sid';
const MAX_PAGES = 20;
const EVENTOS_BUSCA_PAGE_SIZE = 40;

function getOrSetPotofSessionId(request: FastifyRequest, reply: FastifyReply): string {
  const existing = request.cookies[POTOF_SESSION_COOKIE];
  if (existing) return existing;

  const sessionId = randomUUID();
  reply.setCookie(POTOF_SESSION_COOKIE, sessionId, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
  });
  return sessionId;
}

export async function eventosRoutes(app: FastifyInstance): Promise<void> {
  app.get<{
    Querystring: {
      pag?: string;
      estado?: string;
      cat?: string;
      dataInicio?: string;
      dataFim?: string;
      nome_evento?: string;
    };
  }>('/api/eventos/busca', async (request, reply) => {
    const { pag, estado, cat, dataInicio, dataFim, nome_evento: nomeEvento } = request.query;
    const page = Math.max(1, Number.parseInt(pag ?? '1', 10) || 1);
    const log = request.log.child({ route: 'eventos-busca', page, estado, cat, dataInicio, dataFim, nomeEvento });

    try {
      const raw = await fetchEventosBusca({ page, estado, cat, dataInicio, dataFim, nomeEvento }, log);
      const events = raw.map((e) => ({
        id: e.id_produtos_eventos,
        name: e.nome.trim(),
        city: e.cidade,
        state: e.estado,
        location: e.local,
        date: e.data,
        dateEnd: e.data_fim && e.data_fim !== '0000-00-00' ? e.data_fim : null,
        categoryId: e.id_estacoes,
        photosCount: Number.parseInt(e.qtd_fotos, 10) || 0,
        hasEventPhoto: e.tem_foto_evento === '1',
        coverUrl: `${FOTOP_PHOTOS_BASE_URL}/fotos/imagens/produtos_eventos/foto_${e.id_produtos_eventos}_g.jpg`,
      }));

      return reply.send({ page, events, hasMore: raw.length >= EVENTOS_BUSCA_PAGE_SIZE });
    } catch (err) {
      log.error({ err }, 'failed to reach fotop.com.br while listing eventos');
      return reply.status(502).send({ error: 'Falha ao comunicar com o fotop.com.br.' });
    }
  });

  app.get<{ Querystring: { nome?: string; estado?: string } }>(
    '/api/eventos/autocomplete',
    async (request, reply) => {
      const { nome, estado } = request.query;
      const log = request.log.child({ route: 'eventos-autocomplete', nome, estado });

      if (!nome || !nome.trim()) {
        return reply.send({ events: [] });
      }

      try {
        const raw = await searchEventosPorNome({ nome: nome.trim(), estado }, log);
        const events = raw.map((e) => ({
          id: e.id,
          name: e.nome.trim(),
          date: e.data,
          location: e.local,
          slug: e.slug,
          status: e.status,
        }));

        return reply.send({ events });
      } catch (err) {
        log.error({ err }, 'failed to reach fotop.com while searching eventos by name');
        return reply.status(502).send({ error: 'Falha ao comunicar com o fotop.com.' });
      }
    }
  );

  app.get<{ Params: { id: string } }>('/api/eventos/:id', async (request, reply) => {
    const sessionId = getOrSetPotofSessionId(request, reply);
    const { id: eventId } = request.params;
    const log = request.log.child({ potofSessionId: sessionId, eventId, route: 'evento' });

    try {
      const html = await ensureEventSession(sessionId, eventId, log);
      const name = parseEventName(html);
      if (!name) {
        log.warn('parseEventName: h1.nome-evento-interna a not found on the event page');
      }
      const { city, state, date, photosCount } = parseEventLocalData(html);
      return reply.send({
        eventId,
        name,
        city,
        state,
        location: city && state ? `${city}, ${state}` : city ?? state,
        date,
        photosCount,
        categoryId: null,
      });
    } catch (err) {
      log.error({ err }, 'failed to reach fotop.com.br while fetching event info');
      return reply.status(502).send({ error: 'Falha ao comunicar com o fotop.com.br.' });
    }
  });

  app.post<{ Params: { id: string } }>('/api/eventos/:id/selfie', async (request, reply) => {
    const sessionId = getOrSetPotofSessionId(request, reply);
    const { id: eventId } = request.params;
    const log = request.log.child({ potofSessionId: sessionId, eventId, route: 'selfie' });

    const data = await request.file();
    if (!data) {
      log.warn('selfie upload rejected: no multipart file field found');
      return reply.status(400).send({ error: 'Nenhuma imagem enviada.' });
    }
    const buffer = await data.toBuffer();
    log.info({ filename: data.filename, mimeType: data.mimetype, sizeBytes: buffer.length }, 'received selfie upload');

    try {
      await ensureEventSession(sessionId, eventId, log);

      const result = await sendSelfie(
        sessionId,
        eventId,
        { buffer, filename: data.filename, mimeType: data.mimetype },
        log
      );

      if (!result.success) {
        log.warn({ raw: result.raw }, 'fotop.com.br rejected the selfie search');
        return reply.status(502).send({
          success: false,
          error: 'O fotop.com.br não conseguiu processar a selfie enviada.',
          raw: result.raw,
        });
      }

      return reply.send(result);
    } catch (err) {
      log.error({ err }, 'failed to reach fotop.com.br while sending selfie');
      return reply.status(502).send({ success: false, error: 'Falha ao comunicar com o fotop.com.br.' });
    }
  });

  app.get<{ Params: { id: string } }>('/api/eventos/:id/fotos', async (request, reply) => {
    const sessionId = getOrSetPotofSessionId(request, reply);
    const { id: eventId } = request.params;
    const log = request.log.child({ potofSessionId: sessionId, eventId, route: 'fotos' });

    try {
      await ensureEventSession(sessionId, eventId, log);

      const photos: Photo[] = [];
      const seenIds = new Set<string>();
      let page = 1;
      let noResultsMessage: string | null = null;

      // No pagination observed today — every /rc/{n} returns the exact same full grid — so we
      // stop as soon as a page adds nothing new instead of blindly walking all MAX_PAGES and
      // piling up duplicates. This still supports real pagination if fotop.com.br adds it.
      while (page <= MAX_PAGES) {
        const html = await fetchSearchResultsHtml(sessionId, eventId, page, log);
        const pagePhotos = parsePhotoGrid(html, log);

        if (pagePhotos.length === 0) {
          if (page === 1) {
            // fotop renders an explicit "no results" message in #resultado instead of any
            // .foto-selecionar markup when the face search comes back empty — surface it so
            // the user (and these logs) get a real reason instead of a silent empty grid.
            noResultsMessage = parseNoResultsMessage(html);
            if (noResultsMessage) {
              log.info({ noResultsMessage }, 'fotop reported no matching photos');
            }
          }
          break;
        }

        const newPhotos = pagePhotos.filter((p) => !seenIds.has(p.id));
        if (newPhotos.length === 0) {
          log.info({ page }, 'fotop: page repeats the previous page\'s photos, stopping pagination');
          break;
        }

        for (const p of newPhotos) seenIds.add(p.id);
        photos.push(...newPhotos);
        page += 1;
      }

      log.info({ total: photos.length, pagesFetched: page }, 'photo search finished');

      return reply.send({ eventId, total: photos.length, photos, message: noResultsMessage ?? undefined });
    } catch (err) {
      log.error({ err }, 'failed to reach fotop.com.br while fetching photos');
      return reply.status(502).send({ error: 'Falha ao comunicar com o fotop.com.br.' });
    }
  });
}
