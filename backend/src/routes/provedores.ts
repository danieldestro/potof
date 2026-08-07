import type { FastifyInstance } from 'fastify';
import { prisma } from '../db/prisma';

// Público (sem auth) — diferente de /api/admin/provedores. Fonte de dados
// pro filtro de provedor do site público, mesmo padrão de categorias.ts.
export async function provedoresRoutes(app: FastifyInstance): Promise<void> {
  app.get('/api/provedores', async (_request, reply) => {
    const provedores = await prisma.provedor.findMany({
      where: { ativo: true },
      orderBy: { nome: 'asc' },
      select: { id: true, slug: true, nome: true },
    });
    return reply.send({ provedores });
  });
}
