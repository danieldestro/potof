import axios, { AxiosInstance } from 'axios';
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';
import FormData from 'form-data';
import { getOrCreateJar } from './cookieSession';

export const FOTOP_BASE_URL = 'https://fotop.com.br';

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

export async function ensureEventSession(potofSessionId: string, eventId: string): Promise<void> {
  const jar = getOrCreateJar(potofSessionId);
  const client = buildClient(jar);
  await client.get('/fotos/eventos', { params: { evento: eventId } });
}

export async function fetchSearchResultsHtml(
  potofSessionId: string,
  eventId: string,
  page: number
): Promise<string> {
  const jar = getOrCreateJar(potofSessionId);
  const client = buildClient(jar);
  const res = await client.get(`/fotos/eventos/busca/evento/${eventId}/rc/${page}`);
  return typeof res.data === 'string' ? res.data : '';
}

// Assumptions pending confirmation from a fuller HAR capture of the salva-face request/response.
// Adjust FOTOP_SELFIE_FIELD_NAME (env var) once the real multipart field name is known.
const SELFIE_FIELD_NAME = process.env.FOTOP_SELFIE_FIELD_NAME ?? 'foto';

export interface SelfieSearchResult {
  success: boolean;
  raw: unknown;
}

export async function sendSelfie(
  potofSessionId: string,
  eventId: string,
  file: { buffer: Buffer; filename: string; mimeType: string }
): Promise<SelfieSearchResult> {
  const jar = getOrCreateJar(potofSessionId);
  const client = buildClient(jar);

  const form = new FormData();
  form.append(SELFIE_FIELD_NAME, file.buffer, {
    filename: file.filename,
    contentType: file.mimeType,
  });
  form.append('evento', eventId);

  const res = await client.post('/fotos/eventos/salva-face', form, {
    headers: form.getHeaders(),
  });

  return {
    success: res.status >= 200 && res.status < 300,
    raw: res.data,
  };
}
