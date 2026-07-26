interface CategoryPillItem {
  id: string;
  label: string;
}

interface CategoryPillsProps {
  categories: CategoryPillItem[];
  onSelect: (categoryId: string) => void;
  size?: 'default' | 'small';
}

export function CategoryPills({ categories, onSelect, size = 'default' }: CategoryPillsProps) {
  return (
    <div className={`category-pills${size === 'small' ? ' category-pills--small' : ''}`}>
      {categories.map((cat) => (
        <button
          key={cat.id}
          type="button"
          className="category-pill"
          onClick={() => onSelect(cat.id)}
        >
          <span className="category-pill__circle">
            <i className={`fi-estacao-${cat.id}`} aria-hidden="true" />
          </span>
          <span className="category-pill__label">{cat.label}</span>
        </button>
      ))}
    </div>
  );
}
