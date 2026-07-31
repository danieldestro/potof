import type { Photo } from '../types';

interface PhotoGridProps {
  photos: Photo[];
  onSelect: (index: number) => void;
  isFavorite?: (photoId: string) => boolean;
  onToggleFavorite?: (photoId: string) => void;
}

export function PhotoGrid({ photos, onSelect, isFavorite, onToggleFavorite }: PhotoGridProps) {
  return (
    <div className="photo-grid">
      {photos.map((photo, index) => (
        <div key={photo.id} className="photo-grid__item">
          <button type="button" className="photo-grid__open" onClick={() => onSelect(index)}>
            <img src={photo.thumbs.m} alt="" loading="lazy" />
          </button>
          {onToggleFavorite && (
            <button
              type="button"
              className="photo-grid__fav-btn"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(photo.id);
              }}
              aria-label="Favoritar"
            >
              <svg width="15" height="15" viewBox="0 0 24 24">
                <path
                  d="M12 21s-7.5-4.6-10-9.2C0.3 8 2 4 6 4c2.3 0 3.8 1.3 6 3.6C14.2 5.3 15.7 4 18 4c4 0 5.7 4 4 7.8-2.5 4.6-10 9.2-10 9.2Z"
                  fill={isFavorite?.(photo.id) ? 'var(--potof-yellow-accent)' : 'rgba(0,0,0,0)'}
                  stroke="#fff"
                  strokeWidth="2"
                />
              </svg>
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
