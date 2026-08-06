import axios from 'axios';
import type { FastifyBaseLogger } from 'fastify';

export const FOCO_RADICAL_BASE_URL = 'https://www.focoradical.com.br';

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
  Accept: 'application/json, text/plain, */*',
  'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
};

// Shape of GET /next-api/home/competitions — público e sem estado (confirmado: funciona sem
// cookies), então usa uma request avulsa como fetchEventosBusca do fotop, em vez de um client
// com cookie jar por sessão.
export interface FocoRadicalCompetitionRaw {
  id: number;
  name: string;
  path: string;
  date: string | null;
  place: string | null;
  sport?: { id: number; name: string } | null;
  state?: { abbreviation: string } | null;
  coverPhotoOrIcon?: { image: string } | null;
}

export interface FocoRadicalCompetitionsResponse {
  items: FocoRadicalCompetitionRaw[];
  _meta: { currentPage: number; pageCount: number; perPage: number; totalCount: number };
}

export interface FetchCompetitionsParams {
  /** yyyy-mm-dd */
  dataDe: string;
  /** yyyy-mm-dd */
  dataAte: string;
  page: number;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// O site coloca uma regra de rate limit do Cloudflare na frente dessa API (responde 429 com uma
// página de "Just a moment..." em vez de JSON) depois de uma rajada de requests sem pausa —
// confirmado manualmente que ela libera de novo sozinha após alguns segundos, sem exigir resolver
// nenhum desafio JS. Por isso o retry aqui é só backoff simples, não um bypass de bot-protection.
const MAX_RATE_LIMIT_RETRIES = 6;
const RATE_LIMIT_BACKOFF_MS = 8_000;

export async function fetchCompetitions(
  params: FetchCompetitionsParams,
  logger: FastifyBaseLogger = noopLogger,
  attempt = 0
): Promise<FocoRadicalCompetitionsResponse> {
  const res = await axios.get(`${FOCO_RADICAL_BASE_URL}/next-api/home/competitions`, {
    headers: BROWSER_HEADERS,
    validateStatus: () => true,
    params: {
      'CompetitionSearch[dates_multi]': `${params.dataDe},${params.dataAte}`,
      filters_override: 1,
      page: params.page,
    },
  });

  if (res.status === 429 && attempt < MAX_RATE_LIMIT_RETRIES) {
    const delayMs = RATE_LIMIT_BACKOFF_MS * (attempt + 1);
    logger.warn(
      { dataDe: params.dataDe, dataAte: params.dataAte, page: params.page, attempt, delayMs },
      'foco radical: rate limited (429), aguardando antes de tentar de novo'
    );
    await sleep(delayMs);
    return fetchCompetitions(params, logger, attempt + 1);
  }

  const items = Array.isArray(res.data?.items) ? (res.data.items as FocoRadicalCompetitionRaw[]) : [];
  const meta = res.data?._meta ?? { currentPage: params.page, pageCount: params.page, perPage: 0, totalCount: 0 };

  logger.info(
    { dataDe: params.dataDe, dataAte: params.dataAte, page: params.page, status: res.status, count: items.length, meta },
    'foco radical: fetchCompetitions response'
  );

  if (res.status >= 400) {
    logger.warn({ status: res.status, body: preview(res.data) }, 'foco radical: fetchCompetitions returned an error status');
  }

  return { items, _meta: meta };
}
