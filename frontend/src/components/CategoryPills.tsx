import { useEffect, useRef, useState } from 'react';

interface CategoryPillItem {
  id: string;
  label: string;
}

interface CategoryPillsProps {
  categories: CategoryPillItem[];
  onSelect: (categoryId: string) => void;
  size?: 'default' | 'small';
}

// How much of the visible track to advance per arrow click.
const SCROLL_STEP_RATIO = 0.8;

export function CategoryPills({ categories, onSelect, size = 'default' }: CategoryPillsProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  function updateScrollState() {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 1);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    updateScrollState();
    const observer = new ResizeObserver(updateScrollState);
    observer.observe(el);
    return () => observer.disconnect();
  }, [categories]);

  function scrollByDirection(direction: 1 | -1) {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * SCROLL_STEP_RATIO, behavior: 'smooth' });
  }

  return (
    <div className={`category-pills-carousel${size === 'small' ? ' category-pills-carousel--small' : ''}`}>
      <button
        type="button"
        className="category-pills-nav category-pills-nav--prev"
        onClick={() => scrollByDirection(-1)}
        aria-label="Categorias anteriores"
        disabled={!canScrollLeft}
      >
        ‹
      </button>

      <div
        className={`category-pills${size === 'small' ? ' category-pills--small' : ''}`}
        ref={trackRef}
        onScroll={updateScrollState}
      >
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

      <button
        type="button"
        className="category-pills-nav category-pills-nav--next"
        onClick={() => scrollByDirection(1)}
        aria-label="Próximas categorias"
        disabled={!canScrollRight}
      >
        ›
      </button>
    </div>
  );
}
