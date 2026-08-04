import type { FastifyInstance, FastifyReply } from 'fastify';
import type { ZodType } from 'zod';
import { requireAdmin } from './requireAdmin';

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 200;

// Minimal shape shared by every Prisma model delegate (prisma.provedor,
// prisma.categoria, ...) that registerCrudRoutes actually uses. Kept loose
// (args typed as `any`) because a single generic helper can't line up with
// six different Prisma delegate types — each entity route file supplies its
// own typed zod schemas, which is where the real input safety comes from.
interface CrudDelegate {
  findMany: (args: any) => Promise<any[]>;
  count: (args: any) => Promise<number>;
  findUnique: (args: any) => Promise<any | null>;
  create: (args: any) => Promise<any>;
  update: (args: any) => Promise<any>;
}

export interface CrudOptions<TCreate, TUpdate> {
  path: string;
  delegate: CrudDelegate;
  createSchema: ZodType<TCreate>;
  updateSchema: ZodType<TUpdate>;
  /** Field paths eligible for the `?q=` search, dot notation for relations (e.g. "usuario.nome"). */
  searchFields?: string[];
  /** Extra `where` filters derived from other query params (e.g. ?categoriaId=, ?ativo=). */
  buildFilters?: (query: Record<string, string | undefined>) => Record<string, unknown>;
  orderBy?: Record<string, 'asc' | 'desc'>;
  include?: Record<string, unknown>;
  /** Runs after zod validation, before the Prisma call — e.g. hashing a plaintext password field. */
  beforeCreate?: (data: TCreate) => Promise<Record<string, unknown>>;
  beforeUpdate?: (data: TUpdate) => Promise<Record<string, unknown>>;
}

function containsFilter(fieldPath: string, q: string): Record<string, unknown> {
  const [head, ...rest] = fieldPath.split('.');
  if (rest.length === 0) return { [head]: { contains: q } };
  return { [head]: containsFilter(rest.join('.'), q) };
}

function handlePrismaError(err: unknown, reply: FastifyReply) {
  const message = err instanceof Error ? err.message : 'Erro desconhecido.';
  return reply.status(409).send({ error: 'Não foi possível salvar o registro.', detail: message });
}

export function registerCrudRoutes<TCreate, TUpdate>(
  app: FastifyInstance,
  opts: CrudOptions<TCreate, TUpdate>
): void {
  const {
    path,
    delegate,
    createSchema,
    updateSchema,
    searchFields = [],
    buildFilters,
    orderBy,
    include,
    beforeCreate,
    beforeUpdate,
  } = opts;

  app.get(path, { preHandler: requireAdmin }, async (request, reply) => {
    const query = request.query as Record<string, string | undefined>;
    const page = Math.max(1, Number.parseInt(query.page ?? '1', 10) || 1);
    const pageSize = Math.min(
      MAX_PAGE_SIZE,
      Math.max(1, Number.parseInt(query.pageSize ?? '', 10) || DEFAULT_PAGE_SIZE)
    );
    const q = query.q?.trim();

    const where: Record<string, unknown> = buildFilters ? buildFilters(query) : {};
    // Every entity has `ativo` — support filtering by it (e.g. ?ativo=true for
    // relation-select dropdowns) without every route file repeating this.
    if (query.ativo === 'true') where.ativo = true;
    if (query.ativo === 'false') where.ativo = false;
    if (q && searchFields.length > 0) {
      where.OR = searchFields.map((field) => containsFilter(field, q));
    }

    const [items, total] = await Promise.all([
      delegate.findMany({
        where,
        include,
        orderBy: orderBy ?? { id: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      delegate.count({ where }),
    ]);

    return reply.send({ page, pageSize, total, items });
  });

  app.get<{ Params: { id: string } }>(`${path}/:id`, { preHandler: requireAdmin }, async (request, reply) => {
    const id = Number.parseInt(request.params.id, 10);
    const item = await delegate.findUnique({ where: { id }, include });
    if (!item) return reply.status(404).send({ error: 'Não encontrado.' });
    return reply.send(item);
  });

  app.post(path, { preHandler: requireAdmin }, async (request, reply) => {
    const parsed = createSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Dados inválidos.', issues: parsed.error.issues });
    }
    try {
      const data = beforeCreate ? await beforeCreate(parsed.data) : parsed.data;
      const item = await delegate.create({ data, include });
      return reply.status(201).send(item);
    } catch (err) {
      return handlePrismaError(err, reply);
    }
  });

  app.put<{ Params: { id: string } }>(`${path}/:id`, { preHandler: requireAdmin }, async (request, reply) => {
    const id = Number.parseInt(request.params.id, 10);
    const parsed = updateSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Dados inválidos.', issues: parsed.error.issues });
    }
    try {
      const data = beforeUpdate ? await beforeUpdate(parsed.data) : parsed.data;
      const item = await delegate.update({ where: { id }, data, include });
      return reply.send(item);
    } catch (err) {
      return handlePrismaError(err, reply);
    }
  });
}
