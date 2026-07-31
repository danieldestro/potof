import { useNavigate } from 'react-router-dom';
import type { Photo } from '../types';

interface PurchaseFooterProps {
  eventId: string;
  count: number;
  total: number;
  photos: Photo[];
}

function formatBRL(value: number): string {
  return value.toFixed(2).replace('.', ',');
}

export function PurchaseFooter({ eventId, count, total, photos }: PurchaseFooterProps) {
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
        onClick={() => navigate(`/evento/${eventId}/favoritas`, { state: { photos } })}
      >
        Comprar
      </button>
    </div>
  );
}
