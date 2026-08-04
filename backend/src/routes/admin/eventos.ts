import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../../db/prisma';
import { registerCrudRoutes } from '../../admin/crud';
import { optionalDateTime, optionalText, optionalUrl, requiredDateTime } from '../../admin/zodHelpers';

const createSchema = z.object({
  nome: z.string().trim().min(1),
  descricao: optionalText,
  local: optionalText,
  dataHora: requiredDateTime,
  cidade: optionalText,
  uf: optionalText,
  pais: optionalText,
  categoriaId: z.coerce.number().int().positive(),
  provedorId: z.coerce.number().int().positive(),
  idEventoProvedor: optionalText,
  urlSite: optionalUrl,
  urlCapa: optionalUrl,
  searchSelfie: z.boolean().optional(),
  searchBib: z.boolean().optional(),
  searchName: z.boolean().optional(),
  ativo: z.boolean().optional(),
});

const updateSchema = createSchema.partial();

function buildFilters(query: Record<string, string | undefined>): Record<string, unknown> {
  const where: Record<string, unknown> = {};
  if (query.categoriaId) where.categoriaId = Number.parseInt(query.categoriaId, 10);
  if (query.provedorId) where.provedorId = Number.parseInt(query.provedorId, 10);
  if (query.uf) where.uf = query.uf;
  return where;
}

export async function adminEventosRoutes(app: FastifyInstance): Promise<void> {
  registerCrudRoutes(app, {
    path: '/api/admin/eventos',
    delegate: prisma.evento,
    createSchema,
    updateSchema,
    searchFields: ['nome', 'cidade', 'local'],
    buildFilters,
    include: { categoria: true, provedor: true },
  });
}
