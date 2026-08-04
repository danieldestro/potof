import { useEffect, useState } from 'react';
import { fetchCategorias } from '../api/client';
import type { Categoria } from '../types';

// Singleton promise so every page/component mounting this hook at the same
// time only triggers a single GET /api/categorias — same pattern as
// useAppConfig.ts, but for the category taxonomy (replaces the old static
// frontend/src/data/eventTypes.ts array).
let cachedCategoriasPromise: ReturnType<typeof fetchCategorias> | null = null;

function getCategorias() {
  if (!cachedCategoriasPromise) {
    cachedCategoriasPromise = fetchCategorias();
  }
  return cachedCategoriasPromise;
}

export function useCategorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getCategorias()
      .then((result) => {
        if (!cancelled) setCategorias(result.categorias);
      })
      .catch((err) => console.error('[useCategorias] falha ao buscar categorias', err))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { categorias, loading };
}
