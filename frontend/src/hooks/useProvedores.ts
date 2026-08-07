import { useEffect, useState } from 'react';
import { fetchProvedores } from '../api/client';
import type { Provedor } from '../types';

// Singleton promise so every page/component mounting this hook at the same
// time only triggers a single GET /api/provedores — same pattern as useCategorias.
let cachedProvedoresPromise: ReturnType<typeof fetchProvedores> | null = null;

function getProvedores() {
  if (!cachedProvedoresPromise) {
    cachedProvedoresPromise = fetchProvedores();
  }
  return cachedProvedoresPromise;
}

export function useProvedores() {
  const [provedores, setProvedores] = useState<Provedor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getProvedores()
      .then((result) => {
        if (!cancelled) setProvedores(result.provedores);
      })
      .catch((err) => console.error('[useProvedores] falha ao buscar provedores', err))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { provedores, loading };
}
