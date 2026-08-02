import type { FastifyInstance } from 'fastify';
import { config } from '../config';

export async function configRoutes(app: FastifyInstance): Promise<void> {
  app.get('/api/config', async () => ({
    features: { aiPhotoEdit: config.aiPhotoEditEnabled },
  }));
}
