import { useCallback, useEffect, useState } from 'react';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import type { CrudApi, ListParams } from './api';

// Shared list/search/paginate/reload state machine backing every admin entity
// page (Provedores, Categorias, Eventos, ...) — same pattern as
// hooks/useEventosBusca.ts on the public site, generalized over the entity type.
export function useEntityCrud<T>(api: CrudApi<T>, extraParams: ListParams = {}) {
  const [items, setItems] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  const debouncedSearch = useDebouncedValue(search, 300);
  const extraParamsKey = JSON.stringify(extraParams);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, extraParamsKey]);

  const reload = useCallback(() => setReloadToken((t) => t + 1), []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    api
      .list({ page, q: debouncedSearch || undefined, ...extraParams })
      .then((res) => {
        if (cancelled) return;
        setItems(res.items);
        setTotal(res.total);
        setPageSize(res.pageSize);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Falha ao carregar.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, debouncedSearch, extraParamsKey, reloadToken]);

  return { items, page, setPage, pageSize, total, search, setSearch, loading, error, reload };
}
