import { useNavigate } from 'react-router-dom';
import type { Photo } from '../types';

interface StickyFavBarProps {
  eventId: string;
  count: number;
  photos: Photo[];
}

export function StickyFavBar({ eventId, count, photos }: StickyFavBarProps) {
  const navigate = useNavigate();

  return (
    <div className="sticky-fav-bar">
      <span className="sticky-fav-bar__count">{count} fotos selecionadas</span>
      <button
        type="button"
        className="sticky-fav-bar__btn"
        onClick={() => navigate(`/evento/${eventId}/favoritas`, { state: { photos } })}
      >
        Ver favoritas
      </button>
    </div>
  );
}
