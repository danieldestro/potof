import { existsSync } from 'node:fs';
import path from 'node:path';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import cookie from '@fastify/cookie';
import multipart from '@fastify/multipart';
import fastifyStatic from '@fastify/static';
import { eventosRoutes } from './routes/eventos';
import { configRoutes } from './routes/config';
import { aiEffectsRoutes } from './routes/aiEffects';

const PORT = Number(process.env.PORT ?? 4000);
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN ?? 'http://localhost:5173';
const FRONTEND_DIST = path.join(__dirname, '../../frontend/dist');

async function main(): Promise<void> {
  const app = Fastify({ logger: true });

  await app.register(cors, {
    origin: FRONTEND_ORIGIN,
    credentials: true,
  });
  await app.register(cookie);
  await app.register(multipart, {
    limits: { fileSize: 10 * 1024 * 1024 },
  });

  await app.register(eventosRoutes);
  await app.register(configRoutes);
  await app.register(aiEffectsRoutes);

  app.get('/api/health', async () => ({ status: 'ok' }));

  // Em produção, backend e frontend rodam no mesmo processo/origem (o build do Vite é
  // servido diretamente daqui), evitando os problemas de cookie cross-site que o
  // SameSite=Lax de potof_sid teria se front e back ficassem em domínios diferentes.
  if (existsSync(FRONTEND_DIST)) {
    await app.register(fastifyStatic, { root: FRONTEND_DIST });

    app.setNotFoundHandler(async (request, reply) => {
      if (request.raw.url?.startsWith('/api/')) {
        return reply.status(404).send({ error: 'Not found' });
      }
      return reply.sendFile('index.html');
    });
  }

  await app.listen({ port: PORT, host: '0.0.0.0' });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
