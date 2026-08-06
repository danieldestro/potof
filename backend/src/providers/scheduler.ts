import type { FastifyBaseLogger } from 'fastify';
import { prisma } from '../db/prisma';
import { getAdapter } from './registry';
import { runProviderSync } from './syncRunner';

const DEFAULT_INTERVAL_HOURS = 6;
// Dá tempo do servidor terminar de subir antes do primeiro sync automático,
// em vez de competir com as primeiras requisições logo no boot.
const STARTUP_DELAY_MS = 60_000;

let running = false;

async function runAllProviders(log: FastifyBaseLogger): Promise<void> {
  if (running) {
    log.warn('sync scheduler: ciclo anterior ainda em andamento, pulando esta rodada');
    return;
  }
  running = true;

  try {
    // proprio (BD local) nunca tem adapter — o filtro real é `adapter?.syncEventos`
    // abaixo, isso só evita a query trazer provedores óbvios de fora.
    const provedores = await prisma.provedor.findMany({ where: { ativo: true } });

    for (const provedor of provedores) {
      const adapter = getAdapter(provedor);
      if (!adapter?.syncEventos) continue;

      // Primeiro sync do provedor (nunca rodou) precisa ser completo pra trazer o catálogo
      // inteiro; a partir daí o agendador automático sempre roda incremental — sync completo
      // sob demanda fica a cargo do botão "Sincronizar completo" no admin.
      const full = provedor.ultimaSincronizacaoEm === null;
      try {
        const result = await runProviderSync(provedor, log, { full });
        log.info(
          { provedorSlug: provedor.slug, full, ...result },
          'sync scheduler: sincronização automática concluída'
        );
      } catch (err) {
        log.error({ err, provedorSlug: provedor.slug }, 'sync scheduler: falha na sincronização automática');
      }
    }
  } finally {
    running = false;
  }
}

export function startSyncScheduler(log: FastifyBaseLogger): void {
  if (process.env.SYNC_SCHEDULER_ENABLED === 'false') {
    log.info('sync scheduler: desabilitado via SYNC_SCHEDULER_ENABLED=false');
    return;
  }

  const intervalHours = Number.parseFloat(process.env.SYNC_INTERVAL_HOURS ?? '') || DEFAULT_INTERVAL_HOURS;
  const intervalMs = intervalHours * 60 * 60 * 1000;

  log.info({ intervalHours }, 'sync scheduler: iniciado');

  setTimeout(() => void runAllProviders(log), STARTUP_DELAY_MS).unref();
  setInterval(() => void runAllProviders(log), intervalMs).unref();
}
