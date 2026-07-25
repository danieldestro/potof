import axios, { AxiosInstance } from 'axios';
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';
import FormData from 'form-data';
import type { FastifyBaseLogger } from 'fastify';
import { getOrCreateJar } from './cookieSession';

export const FOTOP_BASE_URL = 'https://fotop.com.br';

const noopLogger: FastifyBaseLogger = {
  info: () => {},
  warn: () => {},
  error: () => {},
  debug: () => {},
  trace: () => {},
  fatal: () => {},
  child: () => noopLogger,
  level: 'silent',
} as unknown as FastifyBaseLogger;

function preview(data: unknown, max = 500): string {
  const text = typeof data === 'string' ? data : JSON.stringify(data);
  if (text === undefined) return String(data);
  return text.length > max ? `${text.slice(0, max)}… (${text.length} bytes)` : text;
}

const BROWSER_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Mobile Safari/537.36',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
};

function buildClient(jar: CookieJar): AxiosInstance {
  return wrapper(
    axios.create({
      baseURL: FOTOP_BASE_URL,
      jar,
      withCredentials: true,
      headers: BROWSER_HEADERS,
      maxRedirects: 5,
      validateStatus: () => true,
    })
  );
}

export async function ensureEventSession(
  potofSessionId: string,
  eventId: string,
  logger: FastifyBaseLogger = noopLogger
): Promise<string> {
  const jar = getOrCreateJar(potofSessionId);
  const client = buildClient(jar);
  const res = await client.get('/fotos/eventos', { params: { evento: eventId } });
  const html = typeof res.data === 'string' ? res.data : '';

  logger.info(
    {
      potofSessionId,
      eventId,
      status: res.status,
      finalUrl: res.request?.res?.responseUrl,
      setCookieCount: res.headers['set-cookie']?.length ?? 0,
      cookiesInJar: (await jar.getCookies(FOTOP_BASE_URL)).map((c) => c.key),
    },
    'fotop: ensureEventSession response'
  );

  if (res.status >= 400) {
    logger.warn({ eventId, status: res.status, body: preview(res.data) }, 'fotop: ensureEventSession returned an error status');
  }

  return html;
}

export async function fetchSearchResultsHtml(
  potofSessionId: string,
  eventId: string,
  page: number,
  logger: FastifyBaseLogger = noopLogger
): Promise<string> {
  const jar = getOrCreateJar(potofSessionId);
  const client = buildClient(jar);
  const url = `/fotos/eventos/busca/evento/${eventId}/rc/${page}`;
  const res = await client.get(url);
  const html = typeof res.data === 'string' ? res.data : '';

  logger.info(
    {
      potofSessionId,
      eventId,
      page,
      status: res.status,
      htmlLength: html.length,
      hasFotoItemMarkup: html.includes('foto-item'),
    },
    'fotop: fetchSearchResultsHtml response'
  );

  if (res.status >= 400 || !html) {
    logger.warn({ url, status: res.status, body: preview(res.data) }, 'fotop: fetchSearchResultsHtml returned no usable HTML');
  }

  return html;
}

export interface SelfieSearchResult {
  success: boolean;
  raw: unknown;
}

export async function sendSelfie(
  potofSessionId: string,
  eventId: string,
  file: { buffer: Buffer; filename: string; mimeType: string },
  logger: FastifyBaseLogger = noopLogger
): Promise<SelfieSearchResult> {
  const jar = getOrCreateJar(potofSessionId);
  const client = buildClient(jar);

  // Field names and empty crop values mirror the real #formReconhecimento markup on
  // fotos/eventos?evento={id}: cropx/y/w/h and wresponsive/hresponsive stay blank whenever
  // the user doesn't manually crop (e.g. picking straight from gallery/camera).
  const form = new FormData();
  form.append('cropx', '');
  form.append('cropy', '');
  form.append('cropw', '');
  form.append('croph', '');
  form.append('wresponsive', '');
  form.append('hresponsive', '');
  form.append('evento', eventId);
  form.append('order', '');
  form.append('selfie', file.buffer, {
    filename: file.filename,
    contentType: file.mimeType,
  });

  logger.info(
    { potofSessionId, eventId, filename: file.filename, mimeType: file.mimeType, sizeBytes: file.buffer.length },
    'fotop: sending selfie to salva-face'
  );

  const res = await client.post('/fotos/eventos/salva-face', form, {
    headers: form.getHeaders(),
  });

  const success = res.status >= 200 && res.status < 300;

  logger.info(
    { potofSessionId, eventId, status: res.status, success, contentType: res.headers['content-type'], body: preview(res.data) },
    'fotop: salva-face response'
  );

  if (!success) {
    logger.warn({ eventId, status: res.status, body: preview(res.data) }, 'fotop: salva-face request failed');
  }

  return {
    success,
    raw: res.data,
  };
}
