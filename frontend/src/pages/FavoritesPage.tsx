import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { fetchEventInfo, fetchEventPhotos } from '../api/client';
import { useFavorites } from '../hooks/useFavorites';
import { getMockEventMeta } from '../data/exploreCatalog';
import { eventTypeLabel } from '../data/eventTypes';
import { formatDateLabel, formatLocationLabel, formatPhotosCount } from '../lib/eventDisplay';
import { PhotoViewer } from '../components/PhotoViewer';
import { Toast } from '../components/Toast';
import type { HeaderContext } from '../layouts/headerContext';
import type { EventHeaderInfo, Photo } from '../types';

function formatBRL(value: number): string {
  return value.toFixed(2).replace('.', ',');
}

export function FavoritesPage() {
  const { eventId = '' } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { setEventTitle } = useOutletContext<HeaderContext>();
  const { favorites, isFavorite, toggleFavorite } = useFavorites(eventId);

  const statePhotos = (location.state as { photos?: Photo[] } | null)?.photos ?? null;
  const [allPhotos, setAllPhotos] = useState<Photo[] | null>(statePhotos);
  const [headerInfo, setHeaderInfo] = useState<EventHeaderInfo | null>(null);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const [toast, setToast] = useState('');

  useEffect(() => {
    // The event name is shown in a card in the page body instead of the app
    // header here — see EventoPage.tsx for the same treatment.
    setEventTitle(null);
  }, [eventId, setEventTitle]);

  useEffect(() => {
    let cancelled = false;
    fetchEventInfo(eventId)
      .then((info) => {
        if (!cancelled) setHeaderInfo({ id: eventId, ...info });
      })
      .catch((err) => console.error('[FavoritesPage] falha ao buscar dados do evento', err));
    return () => {
      cancelled = true;
    };
  }, [eventId]);

  useEffect(() => {
    if (allPhotos !== null) return;
    let cancelled = false;
    fetchEventPhotos(eventId)
      .then((result) => {
        if (cancelled) return;
        setAllPhotos(result.photos);
        if (result.photos.length === 0 && favorites.size > 0) {
          setSessionExpired(true);
        }
      })
      .catch((err) => {
        console.error('[FavoritesPage] falha ao buscar fotos do evento', err);
        if (!cancelled) setSessionExpired(true);
      });
    return () => {
      cancelled = true;
    };
    // Only re-runs if we never got photos from navigation state — favorites/eventId
    // intentionally excluded so toggling favorites here doesn't retrigger a refetch.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allPhotos, eventId]);

  const favoritePhotos = (allPhotos ?? []).filter((p) => favorites.has(p.id));
  const { pricePerPhoto, packagePrice } = getMockEventMeta(eventId);
  const subtotal = favoritePhotos.length * pricePerPhoto;
  const totalPhotosCount = allPhotos?.length ?? 0;
  const packageTotal = totalPhotosCount * packagePrice;
  const showUpsell = favoritePhotos.length > 0 && favoritePhotos.length < totalPhotosCount;

  const locationLabel = headerInfo ? formatLocationLabel(headerInfo.city, headerInfo.state) : null;
  const dateLabel = headerInfo ? formatDateLabel(headerInfo.date) : null;
  const categoryLabel = headerInfo?.categoryId ? eventTypeLabel(headerInfo.categoryId) : null;

  function handleRemove(photoId: string) {
    toggleFavorite(photoId);
  }

  function finishSelection() {
    setToast('Seleção salva!');
    setTimeout(() => setToast(''), 2000);
  }

  return (
    <div className="favorites-page">
      {headerInfo?.name && (
        <div className="evento-hero potof-card">
          {categoryLabel && <span className="potof-badge">{categoryLabel}</span>}
          <h1 className="evento-hero__title">{headerInfo.name}</h1>
          {(locationLabel || dateLabel || headerInfo.photosCount != null) && (
            <div className="evento-hero__meta">
              {locationLabel && <span>📍 {locationLabel}</span>}
              {dateLabel && <span>🗓 {dateLabel}</span>}
              {headerInfo.photosCount != null && <span>📷 {formatPhotosCount(headerInfo.photosCount)} fotos</span>}
            </div>
          )}
        </div>
      )}

      <h2 className="favorites-page__title">Minhas Favoritas</h2>

      {sessionExpired && favoritePhotos.length === 0 && (
        <div className="favorites-page__empty">
          <p>Sua sessão de busca expirou. Busque suas fotos novamente para ver suas favoritas.</p>
          <button
            type="button"
            className="potof-btn potof-btn--primary"
            onClick={() => navigate(`/evento/${eventId}`)}
          >
            Buscar minhas fotos
          </button>
        </div>
      )}

      {!sessionExpired && favoritePhotos.length === 0 && (
        <div className="favorites-page__empty">
          <p>Você ainda não tem fotos favoritas neste evento.</p>
          <button
            type="button"
            className="potof-btn potof-btn--primary"
            onClick={() => navigate(`/evento/${eventId}`)}
          >
            Ver fotos do evento
          </button>
        </div>
      )}

      {favoritePhotos.length > 0 && (
        <>
          <div className="photo-grid favorites-page__grid">
            {favoritePhotos.map((photo, index) => (
              <div key={photo.id} className="photo-grid__item">
                <button
                  type="button"
                  className="photo-grid__open"
                  onClick={() => setViewerIndex(index)}
                >
                  <img src={photo.thumbs.m} alt="" loading="lazy" />
                </button>
                <button
                  type="button"
                  className="photo-grid__fav-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(photo.id);
                  }}
                  aria-label="Remover dos favoritos"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24">
                    <path
                      d="M12 21s-7.5-4.6-10-9.2C0.3 8 2 4 6 4c2.3 0 3.8 1.3 6 3.6C14.2 5.3 15.7 4 18 4c4 0 5.7 4 4 7.8-2.5 4.6-10 9.2-10 9.2Z"
                      fill="var(--potof-primary)"
                      stroke="var(--potof-primary)"
                      strokeWidth="2"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          <div className="favorites-summary potof-card">
            <div className="favorites-summary__row">
              <span>{favoritePhotos.length} fotos selecionadas</span>
              <span>R$ {formatBRL(subtotal)}</span>
            </div>
            {showUpsell && (
              <p className="favorites-summary__upsell">
                Leve todas as {totalPhotosCount} fotos por apenas R$ {formatBRL(packageTotal)} (R${' '}
                {packagePrice},00/foto)
              </p>
            )}
            <div className="favorites-summary__total">
              <span>Total</span>
              <span>R$ {formatBRL(subtotal)}</span>
            </div>
            <button
              type="button"
              className="potof-btn potof-btn--primary favorites-summary__cta"
              onClick={finishSelection}
            >
              Concluir seleção
            </button>
          </div>
        </>
      )}

      {toast && <Toast message={toast} />}

      {viewerIndex !== null && (
        <PhotoViewer
          photos={favoritePhotos}
          index={viewerIndex}
          onIndexChange={setViewerIndex}
          onClose={() => setViewerIndex(null)}
          isFavorite={isFavorite}
          onToggleFavorite={toggleFavorite}
          favoritesCount={favoritePhotos.length}
        />
      )}
    </div>
  );
}
