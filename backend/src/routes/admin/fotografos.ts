import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../../db/prisma';
import { registerCrudRoutes } from '../../admin/crud';

const createSchema = z.object({
  usuarioId: z.coerce.number().int().positive(),
  ativo: z.boolean().optional(),
});

const updateSchema = createSchema.partial();

export async function adminFotografosRoutes(app: FastifyInstance): Promise<void> {
  registerCrudRoutes(app, {
    path: '/api/admin/fotografos',
    delegate: prisma.fotografo,
    createSchema,
    updateSchema,
    searchFields: ['usuario.nome', 'usuario.email'],
    include: { usuario: true },
  });
}
