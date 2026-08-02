import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { AI_EFFECTS, generatePhotoEffect, type AiEffect } from '../../backend/src/ai/photoEffects';
import { config } from '../../backend/src/config';
import { installDebugFetch } from './debugFetch';

// Reusa o mesmo mecanismo do backend (backend/src/ai/photoEffects.ts + prompts.json),
// só que apontando para um arquivo local em vez de baixar a foto do fotop — assim dá
// pra testar prompts/efeitos sem subir backend nem frontend.

const MIME_BY_EXT: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
};

const EXT_BY_MIME: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
};

function parseArgs(argv: string[]): Record<string, string> {
  const opts: Record<string, string> = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg.startsWith('--')) {
      opts[arg.slice(2)] = argv[i + 1];
      i++;
    }
  }
  return opts;
}

function printUsageAndExit(message?: string): never {
  if (message) console.error(`Erro: ${message}\n`);
  console.error(`Uso:
  npm run generate -- --image <caminho> [--effect <efeito>] [--provider openai|gemini] [--out <pasta>] [-X]

Efeitos disponíveis: ${AI_EFFECTS.join(', ')}
Se --effect for omitido, todos os efeitos serão gerados, um de cada vez.
-X: loga a request completa (url, headers, params) e a response completa (headers,
    dado original retornado pela API) de cada chamada. Também salva cada uma em
    <out>/debug/.
`);
  process.exit(1);
}

async function main(): Promise<void> {
  const argv = process.argv.slice(2);
  const debug = argv.includes('-X');
  const opts = parseArgs(argv.filter((arg) => arg !== '-X'));
  if (!opts.image) printUsageAndExit('--image é obrigatório');

  const imagePath = path.resolve(opts.image);
  if (!existsSync(imagePath)) printUsageAndExit(`arquivo não encontrado: ${imagePath}`);

  const ext = path.extname(imagePath).toLowerCase();
  const mimeType = MIME_BY_EXT[ext];
  if (!mimeType) printUsageAndExit(`extensão não suportada: ${ext} (use .jpg, .jpeg, .png ou .webp)`);

  const effectsToRun = (opts.effect ? [opts.effect] : AI_EFFECTS) as AiEffect[];
  for (const effect of effectsToRun) {
    if (!AI_EFFECTS.includes(effect)) printUsageAndExit(`efeito inválido: ${effect}. Use um de: ${AI_EFFECTS.join(', ')}`);
  }

  if (opts.provider) {
    if (opts.provider !== 'openai' && opts.provider !== 'gemini') printUsageAndExit('--provider deve ser "openai" ou "gemini"');
    config.aiProvider = opts.provider;
  }

  const outDir = path.resolve(opts.out ?? path.join(__dirname, '..', 'output'));
  mkdirSync(outDir, { recursive: true });

  if (debug) {
    const debugDir = path.join(outDir, 'debug');
    installDebugFetch(debugDir);
    console.log(`Debug (-X): logando requests/responses completos em ${debugDir}\n`);
  }

  const imageBuffer = readFileSync(imagePath);
  const logger = { info: console.info, error: console.error } as unknown as Parameters<typeof generatePhotoEffect>[3];

  console.log(`Provedor: ${config.aiProvider}`);
  console.log(`Imagem:   ${imagePath}`);
  console.log(`Efeitos:  ${effectsToRun.join(', ')}\n`);

  for (const effect of effectsToRun) {
    const start = Date.now();
    console.log(`→ Gerando efeito "${effect}"...`);
    try {
      const result = await generatePhotoEffect(imageBuffer, mimeType, effect, logger);
      const outExt = EXT_BY_MIME[result.mimeType] ?? 'png';
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const outPath = path.join(outDir, `${path.parse(imagePath).name}_${effect}_${timestamp}.${outExt}`);
      writeFileSync(outPath, Buffer.from(result.base64, 'base64'));
      console.log(`  ✓ salvo em ${outPath} (${((Date.now() - start) / 1000).toFixed(1)}s)\n`);
    } catch (err) {
      console.error(`  ✗ falhou (${((Date.now() - start) / 1000).toFixed(1)}s):`, err instanceof Error ? err.message : err);
      console.error('');
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
