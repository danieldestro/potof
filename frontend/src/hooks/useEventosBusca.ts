import { useEffect, useState } from 'react';
import { fetchEventos } from '../api/client';
import type { EventSummary } from '../types';

// "all" (used by the selects for "todas categorias"/"todos os estados") isn't a real
// fotop filter value — the API expects it omitted entirely to mean "no filter".
export function toApiFilter(value: string): string | undefined {
  return value === 'all' ? undefined : value;
}

export interface UseEventosBuscaParams {
  estado?: string;
  cat?: string;
  dataInicio?: string;
  dataFim?: string;
  nomeEvento?: string;
}

// Shared page-by-page "carregar mais" mechanism for GET /api/eventos/busca, used by both
// the home page's recent-events feed and the /eventos browse screen. Any change to the
// filter params clears the current results and starts over from page 1.
export function useEventosBusca(params: UseEventosBuscaParams) {
  const { estado, cat, dataInicio, dataFim, nomeEvento } = params;

  const [events, setEvents] = useState<EventSummary[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setEvents([]);
    setPage(1);
    setHasMore(false);

    fetchEventos({ page: 1, estado, cat, dataInicio, dataFim, nomeEvento })
      .then((res) => {
        if (cancelled) return;
        setEvents(res.events);
        setPage(res.page);
        setHasMore(res.hasMore);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Falha ao carregar eventos.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [estado, cat, dataInicio, dataFim, nomeEvento]);

  async function loadMore() {
    setLoadingMore(true);
    try {
      const res = await fetchEventos({ page: page + 1, estado, cat, dataInicio, dataFim, nomeEvento });
      setEvents((prev) => [...prev, ...res.events]);
      setPage(res.page);
      setHasMore(res.hasMore);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao carregar mais eventos.');
    } finally {
      setLoadingMore(false);
    }
  }

  return { events, loading, loadingMore, error, hasMore, loadMore };
}
