import type { FastifyInstance } from 'fastify';
import { prisma } from '../db/prisma';

// Público (sem auth) — diferente de /api/admin/categorias. Fonte de dados
// pros filtros/pills de categoria do site público (substitui o antigo
// array estático frontend/src/data/eventTypes.ts).
export async function categoriasRoutes(app: FastifyInstance): Promise<void> {
  app.get('/api/categorias', async (_request, reply) => {
    const categorias = await prisma.categoria.findMany({
      where: { ativo: true },
      orderBy: { nome: 'asc' },
      select: { id: true, slug: true, nome: true },
    });
    return reply.send({ categorias });
  });
}
