interface UpsellBannerProps {
  photosCount: number;
  pricePerPhoto: number;
  packagePrice: number;
  onAddAllFavorites: () => void;
}

function formatBRL(value: number): string {
  return value.toFixed(2).replace('.', ',');
}

export function UpsellBanner({ photosCount, packagePrice, onAddAllFavorites }: UpsellBannerProps) {
  const packageTotal = photosCount * packagePrice;

  return (
    <div className="upsell-banner">
      <p className="upsell-banner__headline">
        Leve todas as {photosCount} fotos por R$ {formatBRL(packageTotal)}!
      </p>
      <p className="upsell-banner__subtext">Apenas R$ {packagePrice},00 por foto</p>
      <button type="button" className="upsell-banner__cta" onClick={onAddAllFavorites}>
        Adicionar todas aos favoritos
      </button>
    </div>
  );
}
