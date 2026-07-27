export type EventsViewMode = 'list' | 'compact';

interface ViewToggleProps {
  value: EventsViewMode;
  onChange: (mode: EventsViewMode) => void;
}

// Only meant to be shown on mobile — see `.home-view-toggle` in home.css, which stays
// hidden above the mobile breakpoint since the grid already fits several columns there.
export function ViewToggle({ value, onChange }: ViewToggleProps) {
  return (
    <div className="home-view-toggle" role="group" aria-label="Modo de exibição dos eventos">
      <button
        type="button"
        className={`home-view-toggle__btn${value === 'list' ? ' home-view-toggle__btn--active' : ''}`}
        onClick={() => onChange('list')}
        aria-pressed={value === 'list'}
        aria-label="Lista contínua"
        title="Lista contínua"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="5" width="18" height="4.5" rx="1.2" fill="currentColor" />
          <rect x="3" y="14.5" width="18" height="4.5" rx="1.2" fill="currentColor" />
        </svg>
      </button>
      <button
        type="button"
        className={`home-view-toggle__btn${value === 'compact' ? ' home-view-toggle__btn--active' : ''}`}
        onClick={() => onChange('compact')}
        aria-pressed={value === 'compact'}
        aria-label="Duas colunas"
        title="Duas colunas"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="5" width="7.5" height="14" rx="1.2" fill="currentColor" />
          <rect x="13.5" y="5" width="7.5" height="14" rx="1.2" fill="currentColor" />
        </svg>
      </button>
    </div>
  );
}
