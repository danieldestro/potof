import axios from 'axios';
import { APIError as OpenAiApiError } from 'openai';
import type { FastifyInstance } from 'fastify';
import { config } from '../config';
import { AI_EFFECTS, AiNotConfiguredError, generatePhotoEffect, type AiEffect } from '../ai/photoEffects';
import { FOTOP_PHOTOS_BASE_URL } from '../fotop/fotopClient';

const BROWSER_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Mobile Safari/537.36',
};

const SUPPORTED_IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// The fotop CDN often answers with a generic content-type (e.g. application/octet-stream)
// instead of a real image mimetype, which OpenAI's images.edit rejects outright — fall back
// to image/jpeg (every photo URL here is a foto_{id}_{size}.jpg, per photoParser.ts) whenever
// the response doesn't already give us one of the three types the AI providers accept.
function resolveImageMimeType(contentTypeHeader: unknown): string {
  return typeof contentTypeHeader === 'string' && SUPPORTED_IMAGE_MIME_TYPES.includes(contentTypeHeader)
    ? contentTypeHeader
    : 'image/jpeg';
}

export async function aiEffectsRoutes(app: FastifyInstance): Promise<void> {
  app.post<{ Body: { photoUrl?: string; effect?: string } }>('/api/ai/photo-effect', async (request, reply) => {
    if (!config.aiPhotoEditEnabled) {
      return reply.status(404).send({ error: 'Recurso não encontrado.' });
    }

    const { photoUrl, effect } = request.body ?? {};
    const log = request.log.child({ route: 'ai-photo-effect', effect });

    if (!photoUrl || !photoUrl.startsWith(FOTOP_PHOTOS_BASE_URL)) {
      return reply.status(400).send({ error: 'URL de foto inválida.' });
    }
    if (!effect || !AI_EFFECTS.includes(effect as AiEffect)) {
      return reply.status(400).send({ error: 'Efeito de IA inválido.' });
    }

    try {
      const photoRes = await axios.get<ArrayBuffer>(photoUrl, {
        responseType: 'arraybuffer',
        headers: BROWSER_HEADERS,
      });
      const imageBuffer = Buffer.from(photoRes.data);
      const mimeType = resolveImageMimeType(photoRes.headers['content-type']);

      const result = await generatePhotoEffect(imageBuffer, mimeType, effect as AiEffect, log);
      return reply.send(result);
    } catch (err) {
      if (err instanceof AiNotConfiguredError) {
        log.warn({ err }, 'ai-photo-effect: provider not configured');
        return reply.status(503).send({ error: 'Efeito de IA ainda não configurado.' });
      }
      // Distinct from a transient failure — retrying won't help until the account's
      // billing is fixed, so the generic "tente novamente" message would be misleading.
      if (err instanceof OpenAiApiError && err.code === 'billing_hard_limit_reached') {
        log.error({ err }, 'ai-photo-effect: OpenAI billing hard limit reached');
        return reply.status(402).send({ error: 'Limite de faturamento da OpenAI atingido. Verifique o billing da conta na OpenAI.' });
      }
      log.error({ err }, 'ai-photo-effect: failed to generate image');
      return reply.status(502).send({ error: 'Falha ao gerar o efeito com IA. Tente novamente.' });
    }
  });
}
