import { useEffect, useState } from 'react';
import { fetchAppConfig } from '../api/client';

// Singleton promise so EventoPage/FavoritesPage mounting the hook at the same time
// only trigger a single GET /api/config, same pattern as eventInfoCache.ts's intent
// but for a value shared across the whole app session instead of per-event.
let cachedConfigPromise: ReturnType<typeof fetchAppConfig> | null = null;

function getAppConfig() {
  if (!cachedConfigPromise) {
    cachedConfigPromise = fetchAppConfig();
  }
  return cachedConfigPromise;
}

export function useAppConfig() {
  // Fails closed: the AI button stays hidden until we hear back from the server.
  const [aiPhotoEditEnabled, setAiPhotoEditEnabled] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getAppConfig()
      .then((result) => {
        if (!cancelled) setAiPhotoEditEnabled(result.features.aiPhotoEdit);
      })
      .catch((err) => console.error('[useAppConfig] falha ao buscar config', err));
    return () => {
      cancelled = true;
    };
  }, []);

  return { aiPhotoEditEnabled };
}
