import type { Evento, Provedor } from '@prisma/client';
import type { FastifyBaseLogger } from 'fastify';
import type { Photo } from '../fotop/photoParser';

export type EventoComProvedor = Evento & { provedor: Provedor };

export interface SelfieResult {
  success: boolean;
  raw?: unknown;
}

export interface FotosResult {
  photos: Photo[];
  message?: string;
}

export interface SyncResult {
  created: number;
  updated: number;
  skipped: number;
}

// Um provedor "próprio" (Provedor.proprio=true) não é um adapter — as rotas
// tratam esse caso direto via Prisma (galeria local de Foto), sem passar por
// aqui. Isso existe só para provedores externos com busca/scraping próprios
// (hoje só o Fotop).
export interface ProviderAdapter {
  slug: string;
  sendSelfie(
    evento: EventoComProvedor,
    sessionId: string,
    file: { buffer: Buffer; filename: string; mimeType: string },
    log: FastifyBaseLogger
  ): Promise<SelfieResult>;
  fetchPhotos(evento: EventoComProvedor, sessionId: string, log: FastifyBaseLogger): Promise<FotosResult>;
  /** Opcional: nem todo provedor externo precisa suportar importar seu catálogo de eventos. */
  syncEventos?(provedor: Provedor, log: FastifyBaseLogger): Promise<SyncResult>;
}
