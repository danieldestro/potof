import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../../db/prisma';
import { registerCrudRoutes } from '../../admin/crud';
import { optionalDateTime, optionalUrl } from '../../admin/zodHelpers';

const createSchema = z.object({
  eventoId: z.coerce.number().int().positive(),
  fotografoId: z.coerce.number().int().positive(),
  urlFoto: z.string().trim().url(),
  urlThumb: optionalUrl,
  takenAt: optionalDateTime,
  ativo: z.boolean().optional(),
});

const updateSchema = createSchema.partial();

function buildFilters(query: Record<string, string | undefined>): Record<string, unknown> {
  const where: Record<string, unknown> = {};
  if (query.eventoId) where.eventoId = Number.parseInt(query.eventoId, 10);
  if (query.fotografoId) where.fotografoId = Number.parseInt(query.fotografoId, 10);
  return where;
}

export async function adminFotosRoutes(app: FastifyInstance): Promise<void> {
  registerCrudRoutes(app, {
    path: '/api/admin/fotos',
    delegate: prisma.foto,
    createSchema,
    updateSchema,
    searchFields: ['evento.nome', 'fotografo.usuario.nome'],
    buildFilters,
    include: { evento: true, fotografo: { include: { usuario: true } } },
  });
}
