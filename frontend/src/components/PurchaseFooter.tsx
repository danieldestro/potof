interface PurchaseFooterProps {
  count: number;
  total: number;
  ctaLabel: string;
  onCta: () => void;
}

function formatBRL(value: number): string {
  return value.toFixed(2).replace('.', ',');
}

export function PurchaseFooter({ count, total, ctaLabel, onCta }: PurchaseFooterProps) {
  return (
    <div className="purchase-footer">
      <div className="purchase-footer__info">
        <span className="purchase-footer__count">
          {count} {count === 1 ? 'foto selecionada' : 'fotos selecionadas'}
        </span>
        <span className="purchase-footer__total">R$ {formatBRL(total)}</span>
      </div>
      <button type="button" className="purchase-footer__cta" disabled={count === 0} onClick={onCta}>
        {ctaLabel}
      </button>
    </div>
  );
}
