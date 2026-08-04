import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../../db/prisma';
import { registerCrudRoutes } from '../../admin/crud';
import { requireAdmin } from '../../admin/requireAdmin';
import { optionalText, optionalUrl } from '../../admin/zodHelpers';
import { getAdapter } from '../../providers/registry';

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

  // Sincronização de catálogo sob demanda (sem cron por enquanto) — só
  // provedores externos com adapter.syncEventos suportam isso.
  app.post<{ Params: { id: string } }>(
    '/api/admin/provedores/:id/sync',
    { preHandler: requireAdmin },
    async (request, reply) => {
      const id = Number.parseInt(request.params.id, 10);
      const provedor = await prisma.provedor.findUnique({ where: { id } });
      if (!provedor) {
        return reply.status(404).send({ error: 'Provedor não encontrado.' });
      }

      const adapter = getAdapter(provedor);
      if (!adapter?.syncEventos) {
        return reply.status(400).send({ error: 'Este provedor não suporta sincronização de eventos.' });
      }

      try {
        const result = await adapter.syncEventos(provedor, request.log);
        return reply.send(result);
      } catch (err) {
        request.log.error({ err }, 'falha ao sincronizar eventos do provedor');
        return reply.status(502).send({ error: 'Falha ao sincronizar eventos do provedor.' });
      }
    }
  );
}
