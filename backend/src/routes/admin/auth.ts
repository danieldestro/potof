import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../../db/prisma';
import { ADMIN_SESSION_COOKIE, ADMIN_SESSION_MAX_AGE_SECONDS, verifyPassword } from '../../admin/auth';
import { requireAdmin } from '../../admin/requireAdmin';

const loginSchema = z.object({
  email: z.string().trim().email(),
  senha: z.string().min(1),
});

export async function adminAuthRoutes(app: FastifyInstance): Promise<void> {
  app.post('/api/admin/login', async (request, reply) => {
    const parsed = loginSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Informe email e senha.' });
    }

    const { email, senha } = parsed.data;
    const admin = await prisma.adminUsuario.findUnique({ where: { email } });
    if (!admin || !admin.ativo || !(await verifyPassword(senha, admin.senhaHash))) {
      return reply.status(401).send({ error: 'Email ou senha inválidos.' });
    }

    reply.setCookie(ADMIN_SESSION_COOKIE, String(admin.id), {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      signed: true,
      maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
    });

    return reply.send({ id: admin.id, nome: admin.nome, email: admin.email });
  });

  app.post('/api/admin/logout', async (_request, reply) => {
    reply.clearCookie(ADMIN_SESSION_COOKIE, { path: '/' });
    return reply.send({ ok: true });
  });

  app.get('/api/admin/me', { preHandler: requireAdmin }, async (request, reply) => {
    return reply.send(request.admin);
  });
}
