import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../../db/prisma';
import { registerCrudRoutes } from '../../admin/crud';
import { optionalDateTime, optionalText } from '../../admin/zodHelpers';

const createSchema = z.object({
  nome: z.string().trim().min(1),
  email: z.string().trim().email(),
  cpf: optionalText,
  dataNascimento: optionalDateTime,
  cidade: optionalText,
  uf: optionalText,
  pais: optionalText,
  ativo: z.boolean().optional(),
});

const updateSchema = createSchema.partial();

export async function adminUsuariosRoutes(app: FastifyInstance): Promise<void> {
  registerCrudRoutes(app, {
    path: '/api/admin/usuarios',
    delegate: prisma.usuario,
    createSchema,
    updateSchema,
    searchFields: ['nome', 'email', 'cpf'],
  });
}
