import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { EVENT_TYPES } from '../data/eventTypes';
import { ESTADOS } from '../data/estados';
import { CategoryPills } from '../components/CategoryPills';
import { FilterSelects } from '../components/FilterSelects';
import { DateRangeFilter } from '../components/DateRangeFilter';
import { EventSummaryCard } from '../components/EventSummaryCard';
import { useEventosBusca, toApiFilter } from '../hooks/useEventosBusca';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { getUserPreferences, setUserPreferredCategoria, setUserPreferredEstado } from '../lib/userPreferences';
import type { DateRange } from '../lib/dateRanges';

const STATE_FILTER_OPTIONS = ESTADOS.map((e) => ({ id: e.id, label: e.descricao }));

export function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get('categoria') ?? 'all');
  // Same 3-tier mechanism as Home: search filter (this page's own state, seeded from the URL
  // if a link brought one along) → user_preferences in localStorage → app default.
  const [stateFilter, setStateFilter] = useState(
    () => searchParams.get('estado') ?? getUserPreferences().estado
  );
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebouncedValue(searchInput);
  const [dateRange, setDateRange] = useState<DateRange | null>(null);

  const { events, loading, loadingMore, error, hasMore, loadMore } = useEventosBusca({
    estado: toApiFilter(stateFilter),
    cat: toApiFilter(categoryFilter),
    nomeEvento: debouncedSearch.trim() || undefined,
    dataInicio: dateRange?.dataInicio,
    dataFim: dateRange?.dataFim,
  });

  function applyCategory(id: string) {
    setCategoryFilter(id);
    setUserPreferredCategoria(id);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('categoria', id);
      return next;
    });
  }

  function handleCategoryFilterChange(value: string) {
    setCategoryFilter(value);
    setUserPreferredCategoria(value);
  }

  function handleStateFilterChange(value: string) {
    setStateFilter(value);
    setUserPreferredEstado(value);
  }

  return (
    <div className="explore-page">
      <h1>Todos os eventos</h1>

      <CategoryPills categories={EVENT_TYPES} onSelect={applyCategory} size="small" />

      <div className="explore-page__filters">
        <FilterSelects
          categories={EVENT_TYPES}
          states={STATE_FILTER_OPTIONS}
          categoryFilter={categoryFilter}
          stateFilter={stateFilter}
          onCategoryChange={handleCategoryFilterChange}
          onStateChange={handleStateFilterChange}
        />
        <DateRangeFilter onChange={setDateRange} />
        <input
          type="text"
          className="explore-page__search-input"
          placeholder="Buscar por nome do evento..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="home-recent-loading">Carregando eventos…</div>
      ) : error && events.length === 0 ? (
        <div className="home-recent-error">{error}</div>
      ) : events.length === 0 ? (
        <div className="explore-page__empty">Nenhum evento encontrado com esses filtros.</div>
      ) : (
        <div className="event-grid">
          {events.map((event) => (
            <EventSummaryCard key={event.id} event={event} />
          ))}
        </div>
      )}

      {hasMore && (
        <div className="home-more-cta">
          <button
            type="button"
            className="potof-btn potof-btn--primary"
            onClick={loadMore}
            disabled={loadingMore}
          >
            {loadingMore ? 'Carregando…' : 'Carregar mais eventos'}
          </button>
        </div>
      )}
    </div>
  );
}
