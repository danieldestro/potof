import type { FastifyBaseLogger } from 'fastify';
import type { Provedor } from '@prisma/client';
import { prisma } from '../db/prisma';
import { rebuildEventosFulltextIndex } from '../db/fulltextMaintenance';
import { getAdapter } from './registry';
import type { SyncOptions, SyncResult } from './types';

export class ProviderSyncUnsupportedError extends Error {}

// Usado tanto pelo botão "Sincronizar" manual (routes/admin/provedores.ts)
// quanto pelo agendador automático (scheduler.ts) — roda o adapter.syncEventos
// do provedor e sempre grava o resultado (sucesso ou erro) em
// ultimaSincronizacaoEm/Resultado, pra dar visibilidade no admin sem depender
// só de log de servidor.
export async function runProviderSync(
  provedor: Provedor,
  log: FastifyBaseLogger,
  options: SyncOptions
): Promise<SyncResult> {
  const adapter = getAdapter(provedor);
  if (!adapter?.syncEventos) {
    throw new ProviderSyncUnsupportedError(`Provedor "${provedor.nome}" não suporta sincronização de eventos.`);
  }

  const modo = options.full ? 'completo' : 'incremental';
  try {
    const result = await adapter.syncEventos(provedor, log, options);
    await prisma.provedor.update({
      where: { id: provedor.id },
      data: {
        ultimaSincronizacaoEm: new Date(),
        ultimaSincronizacaoResultado: `OK (${modo}): ${result.created} criados, ${result.updated} atualizados, ${result.skipped} pulados.`,
      },
    });

    // Só depois de sync completo — é a rajada de UPDATEs (varre o catálogo inteiro do provedor)
    // que reproduziu a degradação do índice FULLTEXT investigada, não o ciclo incremental
    // frequente. Ver comentário em fulltextMaintenance.ts.
    if (options.full) {
      await rebuildEventosFulltextIndex(log);
    }

    return result;
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido.';
    await prisma.provedor.update({
      where: { id: provedor.id },
      data: {
        ultimaSincronizacaoEm: new Date(),
        ultimaSincronizacaoResultado: `Erro (${modo}): ${message}`,
      },
    });
    throw err;
  }
}
