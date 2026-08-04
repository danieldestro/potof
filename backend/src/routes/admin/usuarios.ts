import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../../db/prisma';
import { registerCrudRoutes } from '../../admin/crud';
import { hashPassword } from '../../admin/auth';
import { optionalDateTime, optionalText } from '../../admin/zodHelpers';

const optionalSenha = z.preprocess(
  (v) => (typeof v === 'string' && v.trim() === '' ? undefined : v),
  z.string().min(6).optional()
);

const createSchema = z
  .object({
    nome: z.string().trim().min(1),
    email: z.string().trim().email(),
    cpf: optionalText,
    dataNascimento: optionalDateTime,
    cidade: optionalText,
    uf: optionalText,
    pais: optionalText,
    perfil: z.enum(['admin', 'user']).optional(),
    // Texto plano vindo do form — nunca gravado como está, ver beforeCreate/beforeUpdate.
    senha: optionalSenha,
    ativo: z.boolean().optional(),
  })
  .refine((data) => data.perfil !== 'admin' || !!data.senha, {
    message: 'Senha é obrigatória para perfil admin.',
    path: ['senha'],
  });

const updateSchema = z.object({
  nome: z.string().trim().min(1).optional(),
  email: z.string().trim().email().optional(),
  cpf: optionalText,
  dataNascimento: optionalDateTime,
  cidade: optionalText,
  uf: optionalText,
  pais: optionalText,
  perfil: z.enum(['admin', 'user']).optional(),
  senha: optionalSenha,
  ativo: z.boolean().optional(),
});

// senha nunca vai direto pro Prisma (o model não tem esse campo — tem
// senhaHash) — troca por senhaHash com bcrypt, ou some do payload se vazia
// (edição sem trocar a senha).
async function withHashedSenha(data: Record<string, unknown>): Promise<Record<string, unknown>> {
  const { senha, ...rest } = data;
  if (typeof senha === 'string' && senha) {
    return { ...rest, senhaHash: await hashPassword(senha) };
  }
  return rest;
}

export async function adminUsuariosRoutes(app: FastifyInstance): Promise<void> {
  registerCrudRoutes(app, {
    path: '/api/admin/usuarios',
    delegate: prisma.usuario,
    createSchema,
    updateSchema,
    searchFields: ['nome', 'email', 'cpf'],
    beforeCreate: withHashedSenha,
    beforeUpdate: withHashedSenha,
  });
}
