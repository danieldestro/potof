import { useCallback, useEffect, useState } from 'react';

const STORAGE_PREFIX = 'potof:favorites:';
export const FAVORITES_CHANGED_EVENT = 'potof:favorites-changed';

function storageKey(eventId: string): string {
  return `${STORAGE_PREFIX}${eventId}`;
}

function loadFavorites(eventId: string): Set<string> {
  try {
    const raw = localStorage.getItem(storageKey(eventId));
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

// Scans every event's favorites in localStorage to power the header badge,
// which (like the design mockup) shows a single count across all events.
export function getTotalFavoritesCount(): number {
  let total = 0;
  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i);
    if (!key || !key.startsWith(STORAGE_PREFIX)) continue;
    try {
      const raw = localStorage.getItem(key);
      const ids = raw ? (JSON.parse(raw) as string[]) : [];
      total += ids.length;
    } catch {
      // ignore malformed entries
    }
  }
  return total;
}

export function useFavorites(eventId: string) {
  const [favorites, setFavorites] = useState<Set<string>>(() => loadFavorites(eventId));

  useEffect(() => {
    setFavorites(loadFavorites(eventId));
  }, [eventId]);

  // Persisting + notifying the header badge here (instead of inline in the state
  // updater below) keeps the DOM-event dispatch out of React's render/reconcile
  // pass — dispatching synchronously inside a setState updater let Header's
  // listener call its own setState mid-update, which React flags as an
  // illegal cross-component render-phase update.
  useEffect(() => {
    localStorage.setItem(storageKey(eventId), JSON.stringify([...favorites]));
    window.dispatchEvent(new Event(FAVORITES_CHANGED_EVENT));
  }, [eventId, favorites]);

  const toggleFavorite = useCallback((photoId: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(photoId)) {
        next.delete(photoId);
      } else {
        next.add(photoId);
      }
      return next;
    });
  }, []);

  const isFavorite = useCallback((photoId: string) => favorites.has(photoId), [favorites]);

  return { favorites, toggleFavorite, isFavorite };
}
