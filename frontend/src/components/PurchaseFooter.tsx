import { useNavigate } from 'react-router-dom';
import type { EventHeaderInfo, Photo } from '../types';

interface PurchaseFooterProps {
  eventId: string;
  count: number;
  total: number;
  photos: Photo[];
  eventInfo: EventHeaderInfo | null;
}

function formatBRL(value: number): string {
  return value.toFixed(2).replace('.', ',');
}

export function PurchaseFooter({ eventId, count, total, photos, eventInfo }: PurchaseFooterProps) {
  const navigate = useNavigate();

  return (
    <div className="purchase-footer">
      <div className="purchase-footer__info">
        <span className="purchase-footer__count">
          {count} {count === 1 ? 'foto selecionada' : 'fotos selecionadas'}
        </span>
        <span className="purchase-footer__total">R$ {formatBRL(total)}</span>
      </div>
      <button
        type="button"
        className="purchase-footer__cta"
        disabled={count === 0}
        // Hands the event data we already have over to the Favoritas page so it
        // doesn't need to re-fetch /api/eventos/{id} — see FavoritesPage.tsx.
        onClick={() => navigate(`/evento/${eventId}/favoritas`, { state: { photos, event: eventInfo } })}
      >
        Comprar
      </button>
    </div>
  );
}
