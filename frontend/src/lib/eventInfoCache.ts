import type { EventHeaderInfo } from '../types';

// In-memory only, mirrors photoSearchCache.ts — avoids re-hitting GET /api/eventos/{id}
// (which scrapes fotop.com.br) when the user bounces between Evento/Favoritas/Checkout
// for the same event within a single SPA session. A hard refresh starts fresh.
const cache = new Map<string, EventHeaderInfo>();

export function getCachedEventInfo(eventId: string): EventHeaderInfo | undefined {
  return cache.get(eventId);
}

export function setCachedEventInfo(event: EventHeaderInfo): void {
  cache.set(event.id, event);
}
