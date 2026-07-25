import { useCallback, useEffect, useState } from 'react';

function storageKey(eventId: string): string {
  return `potof:favorites:${eventId}`;
}

function loadFavorites(eventId: string): Set<string> {
  try {
    const raw = localStorage.getItem(storageKey(eventId));
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

export function useFavorites(eventId: string) {
  const [favorites, setFavorites] = useState<Set<string>>(() => loadFavorites(eventId));

  useEffect(() => {
    setFavorites(loadFavorites(eventId));
  }, [eventId]);

  const toggleFavorite = useCallback(
    (photoId: string) => {
      setFavorites((prev) => {
        const next = new Set(prev);
        if (next.has(photoId)) {
          next.delete(photoId);
        } else {
          next.add(photoId);
        }
        localStorage.setItem(storageKey(eventId), JSON.stringify([...next]));
        return next;
      });
    },
    [eventId]
  );

  const isFavorite = useCallback((photoId: string) => favorites.has(photoId), [favorites]);

  return { favorites, toggleFavorite, isFavorite };
}
