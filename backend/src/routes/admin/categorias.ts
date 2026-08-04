import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../../db/prisma';
import { registerCrudRoutes } from '../../admin/crud';
import { optionalText } from '../../admin/zodHelpers';

const createSchema = z.object({
  slug: z.string().trim().min(1),
  nome: z.string().trim().min(1),
  descricao: optionalText,
  ativo: z.boolean().optional(),
});

const updateSchema = createSchema.partial();

export async function adminCategoriasRoutes(app: FastifyInstance): Promise<void> {
  registerCrudRoutes(app, {
    path: '/api/admin/categorias',
    delegate: prisma.categoria,
    createSchema,
    updateSchema,
    searchFields: ['nome', 'slug'],
  });
}
