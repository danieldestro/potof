import { PrismaClient } from '@prisma/client';

// senhaHash never leaves the process by default (admin CRUD listing, público,
// etc. all go through this client) — the one legitimate place that needs it,
// the login handler in routes/admin/auth.ts, opts back in per-query with
// `omit: { senhaHash: false }`.
export const prisma = new PrismaClient({
  omit: { usuario: { senhaHash: true } },
});
