interface PurchaseFooterProps {
  count: number;
  total: number;
  // Pre-discount price, shown struck through next to `total` when it's cheaper —
  // e.g. FavoritesPage passes this once every photo in the event is favorited and
  // the package rate kicks in.
  originalTotal?: number;
  ctaLabel: string;
  onCta: () => void;
}

function formatBRL(value: number): string {
  return value.toFixed(2).replace('.', ',');
}

export function PurchaseFooter({ count, total, originalTotal, ctaLabel, onCta }: PurchaseFooterProps) {
  const hasDiscount = originalTotal != null && originalTotal > total;
  return (
    <div className="purchase-footer">
      <div className="purchase-footer__info">
        <span className="purchase-footer__count">
          {count} {count === 1 ? 'foto selecionada' : 'fotos selecionadas'}
        </span>
        <span className="purchase-footer__price">
          {hasDiscount && (
            <span className="purchase-footer__original">R$ {formatBRL(originalTotal)}</span>
          )}
          <span className="purchase-footer__total">R$ {formatBRL(total)}</span>
        </span>
        {hasDiscount && <span className="purchase-footer__discount-tag">Preço com desconto</span>}
      </div>
      <button type="button" className="purchase-footer__cta" disabled={count === 0} onClick={onCta}>
        {ctaLabel}
      </button>
    </div>
  );
}
