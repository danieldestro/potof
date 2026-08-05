import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../../db/prisma';
import { registerCrudRoutes } from '../../admin/crud';
import { requireAdmin } from '../../admin/requireAdmin';
import { optionalText, optionalUrl } from '../../admin/zodHelpers';
import { ProviderSyncUnsupportedError, runProviderSync } from '../../providers/syncRunner';

const createSchema = z.object({
  slug: z.string().trim().min(1),
  nome: z.string().trim().min(1),
  descricao: optionalText,
  urlSite: optionalUrl,
  ativo: z.boolean().optional(),
  proprio: z.boolean().optional(),
});

const updateSchema = createSchema.partial();

export async function adminProvedoresRoutes(app: FastifyInstance): Promise<void> {
  registerCrudRoutes(app, {
    path: '/api/admin/provedores',
    delegate: prisma.provedor,
    createSchema,
    updateSchema,
    searchFields: ['nome', 'slug', 'descricao'],
  });

  // Sincronização de catálogo sob demanda — o mesmo sync também roda sozinho
  // periodicamente (ver providers/scheduler.ts); os dois caminhos passam por
  // runProviderSync, que grava o resultado em ultimaSincronizacaoEm/Resultado.
  app.post<{ Params: { id: string } }>(
    '/api/admin/provedores/:id/sync',
    { preHandler: requireAdmin },
    async (request, reply) => {
      const id = Number.parseInt(request.params.id, 10);
      const provedor = await prisma.provedor.findUnique({ where: { id } });
      if (!provedor) {
        return reply.status(404).send({ error: 'Provedor não encontrado.' });
      }

      try {
        const result = await runProviderSync(provedor, request.log);
        return reply.send(result);
      } catch (err) {
        if (err instanceof ProviderSyncUnsupportedError) {
          return reply.status(400).send({ error: err.message });
        }
        request.log.error({ err }, 'falha ao sincronizar eventos do provedor');
        return reply.status(502).send({ error: 'Falha ao sincronizar eventos do provedor.' });
      }
    }
  );
}
