interface FilterOption {
  id: string;
  label: string;
}

interface FilterSelectsProps {
  categories: FilterOption[];
  states: FilterOption[];
  categoryFilter: string;
  stateFilter: string;
  onCategoryChange: (value: string) => void;
  onStateChange: (value: string) => void;
}

export function FilterSelects({
  categories,
  states,
  categoryFilter,
  stateFilter,
  onCategoryChange,
  onStateChange,
}: FilterSelectsProps) {
  return (
    <div className="filter-selects">
      <select
        className="potof-pill-select"
        value={categoryFilter}
        onChange={(e) => onCategoryChange(e.target.value)}
      >
        <option value="all">Todas categorias</option>
        {categories.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.label}
          </option>
        ))}
      </select>
      <select
        className="potof-pill-select"
        value={stateFilter}
        onChange={(e) => onStateChange(e.target.value)}
      >
        <option value="all">Todos os estados</option>
        {states.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
