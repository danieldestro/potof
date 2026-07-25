import { randomUUID } from 'node:crypto';
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { ensureEventSession, fetchSearchResultsHtml, sendSelfie } from '../fotop/fotopClient';
import { parsePhotoGrid, type Photo } from '../fotop/photoParser';

const POTOF_SESSION_COOKIE = 'potof_sid';
const MAX_PAGES = 20;

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
  app.post<{ Params: { id: string } }>('/api/eventos/:id/selfie', async (request, reply) => {
    const sessionId = getOrSetPotofSessionId(request, reply);
    const { id: eventId } = request.params;

    const data = await request.file();
    if (!data) {
      return reply.status(400).send({ error: 'Nenhuma imagem enviada.' });
    }
    const buffer = await data.toBuffer();

    await ensureEventSession(sessionId, eventId);

    const result = await sendSelfie(sessionId, eventId, {
      buffer,
      filename: data.filename,
      mimeType: data.mimetype,
    });

    return reply.send(result);
  });

  app.get<{ Params: { id: string } }>('/api/eventos/:id/fotos', async (request, reply) => {
    const sessionId = getOrSetPotofSessionId(request, reply);
    const { id: eventId } = request.params;

    await ensureEventSession(sessionId, eventId);

    const photos: Photo[] = [];
    let page = 1;

    // No pagination observed today (single page returns the full result set), but we keep
    // walking /rc/{n} until an empty page shows up in case fotop.com.br starts paginating.
    while (page <= MAX_PAGES) {
      const html = await fetchSearchResultsHtml(sessionId, eventId, page);
      const pagePhotos = parsePhotoGrid(html);
      if (pagePhotos.length === 0) break;
      photos.push(...pagePhotos);
      page += 1;
    }

    return reply.send({ eventId, total: photos.length, photos });
  });
}
