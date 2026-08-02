import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

// Ativado pela flag -X do generate.ts. Troca o fetch global por um wrapper que
// registra toda chamada HTTP feita pelos SDKs da OpenAI e do Gemini (ambos usam
// o fetch global internamente, então isso cobre os dois provedores sem precisar
// mexer no backend). Cada request/response completo (incluindo o payload
// original retornado pela API, antes de extrairmos só a imagem) é salvo em
// disco, já que o base64 da imagem é grande demais para o console ser útil.

const REDACTED = '***redacted***';
const SENSITIVE_HEADERS = new Set(['authorization', 'x-goog-api-key', 'api-key']);

function redactHeaders(headers: Headers): Record<string, string> {
  const out: Record<string, string> = {};
  headers.forEach((value, key) => {
    out[key] = SENSITIVE_HEADERS.has(key.toLowerCase()) ? REDACTED : value;
  });
  return out;
}

function safeJsonParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return undefined;
  }
}

async function describeRequestBody(body: BodyInit | null | undefined): Promise<unknown> {
  if (body == null) return undefined;
  if (typeof body === 'string') return safeJsonParse(body) ?? body;
  if (body instanceof FormData) {
    const fields: Record<string, unknown> = {};
    for (const [key, value] of body.entries()) {
      fields[key] =
        value instanceof Blob
          ? { type: 'file', name: 'name' in value ? (value as File).name : undefined, mimeType: value.type, sizeBytes: value.size }
          : value;
    }
    return fields;
  }
  return `<${body.constructor?.name ?? typeof body} body — não inspecionado>`;
}

function truncate(text: string, max = 2000): string {
  return text.length > max ? `${text.slice(0, max)}… (${text.length} chars ao todo, veja o arquivo de log para o conteúdo completo)` : text;
}

export function installDebugFetch(logDir: string): void {
  mkdirSync(logDir, { recursive: true });
  const originalFetch = globalThis.fetch;
  let counter = 0;

  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const request = input instanceof Request ? input : undefined;
    const url = request ? request.url : input instanceof URL ? input.href : input;

    // chamada de sonda interna do SDK da OpenAI (supportsFormData) — sem interesse para debug
    if (typeof url === 'string' && url.startsWith('data:')) return originalFetch(input, init);

    const id = ++counter;
    const method = init?.method ?? request?.method ?? 'GET';
    const headers = redactHeaders(new Headers(init?.headers ?? request?.headers));
    const requestBody = await describeRequestBody(init?.body).catch(() => '<falha ao inspecionar o body>');

    console.log(`\n[-X] → #${id} ${method} ${url}`);
    console.log(`[-X]   request headers: ${JSON.stringify(headers)}`);
    console.log(`[-X]   request params: ${truncate(JSON.stringify(requestBody))}`);

    const response = await originalFetch(input, init);

    const responseHeaders = Object.fromEntries(response.headers.entries());
    const responseText = await response.clone().text();
    const responseBody = safeJsonParse(responseText) ?? responseText;

    console.log(`[-X] ← #${id} ${response.status} ${response.statusText}`);
    console.log(`[-X]   response headers: ${JSON.stringify(responseHeaders)}`);
    console.log(`[-X]   response body: ${truncate(JSON.stringify(responseBody))}`);

    const logFile = path.join(logDir, `${new Date().toISOString().replace(/[:.]/g, '-')}_${String(id).padStart(2, '0')}.json`);
    writeFileSync(
      logFile,
      JSON.stringify(
        {
          request: { method, url, headers, params: requestBody },
          response: { status: response.status, statusText: response.statusText, headers: responseHeaders, originalData: responseBody },
        },
        null,
        2
      )
    );
    console.log(`[-X]   request/response completos (dado original) salvos em ${logFile}`);

    return response;
  }) as typeof fetch;
}
