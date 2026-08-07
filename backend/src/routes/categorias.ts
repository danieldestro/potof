import type { FastifyInstance } from 'fastify';
import { prisma } from '../db/prisma';

// Público (sem auth) — diferente de /api/admin/categorias. Fonte de dados
// pros filtros/pills de categoria do site público (substitui o antigo
// array estático frontend/src/data/eventTypes.ts).
export async function categoriasRoutes(app: FastifyInstance): Promise<void> {
  app.get('/api/categorias', async (_request, reply) => {
    // Ordem de exibição do carrossel (CategoryPills) — ver Categoria.ordem no schema. O <select>
    // de filtro (FilterSelects) reordena por nome no próprio front, ignorando este orderBy.
    const categorias = await prisma.categoria.findMany({
      where: { ativo: true },
      orderBy: [{ ordem: 'asc' }, { nome: 'asc' }],
      select: { id: true, slug: true, nome: true, icone: true },
    });
    return reply.send({ categorias });
  });
}
