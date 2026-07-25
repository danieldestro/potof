import type { Photo } from '../types';

interface PhotoGridProps {
  photos: Photo[];
  onSelect: (index: number) => void;
}

export function PhotoGrid({ photos, onSelect }: PhotoGridProps) {
  return (
    <div className="photo-grid">
      {photos.map((photo, index) => (
        <button
          key={photo.id}
          type="button"
          className="photo-grid__item"
          onClick={() => onSelect(index)}
        >
          <img src={photo.thumbs.m} alt="" loading="lazy" />
        </button>
      ))}
    </div>
  );
}
