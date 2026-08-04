import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../../db/prisma';
import { registerCrudRoutes } from '../../admin/crud';
import { optionalText, optionalUrl } from '../../admin/zodHelpers';

const createSchema = z.object({
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
    searchFields: ['nome', 'descricao'],
  });
}
