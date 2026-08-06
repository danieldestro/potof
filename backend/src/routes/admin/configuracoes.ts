import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../../db/prisma';
import { requireAdmin } from '../../admin/requireAdmin';
import { DEFAULT_SYNC_INCREMENTAL_DIAS } from '../../providers/syncSettings';

const updateSchema = z.object({
  syncIncrementalDias: z.number().int().positive(),
});

// Configuracao é singleton (id=1, sem CRUD genérico — ver comentário no model em schema.prisma).
// GET nunca falha por falta de linha (banco novo sem essa linha ainda): responde com o default.
export async function adminConfiguracoesRoutes(app: FastifyInstance): Promise<void> {
  app.get('/api/admin/configuracoes', { preHandler: requireAdmin }, async () => {
    const config = await prisma.configuracao.findUnique({ where: { id: 1 } });
    return { syncIncrementalDias: config?.syncIncrementalDias ?? DEFAULT_SYNC_INCREMENTAL_DIAS };
  });

  app.put<{ Body: unknown }>('/api/admin/configuracoes', { preHandler: requireAdmin }, async (request, reply) => {
    const parsed = updateSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Dados inválidos.' });
    }

    const config = await prisma.configuracao.upsert({
      where: { id: 1 },
      update: { syncIncrementalDias: parsed.data.syncIncrementalDias },
      create: { id: 1, syncIncrementalDias: parsed.data.syncIncrementalDias },
    });
    return { syncIncrementalDias: config.syncIncrementalDias };
  });
}
