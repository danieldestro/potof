import type { Photo } from '../types';

// In-memory only (not sessionStorage) — scoped to keep the selfie search results alive
// while the user bounces between the event page and Favoritas within the same SPA
// session, without re-running face recognition. A hard refresh starts fresh, same as
// the rest of the search flow (e.g. EventoPage's own header-info fetch).
interface CachedSearch {
  photos: Photo[];
  hasSearched: boolean;
  error: string | null;
}

const cache = new Map<string, CachedSearch>();

export function getCachedSearch(eventId: string): CachedSearch | undefined {
  return cache.get(eventId);
}

export function setCachedSearch(eventId: string, search: CachedSearch): void {
  cache.set(eventId, search);
}
