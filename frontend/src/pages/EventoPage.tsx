import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { fetchEventInfo, fetchEventPhotos, sendSelfie } from '../api/client';
import { useFavorites } from '../hooks/useFavorites';
import { getMockEventMeta } from '../data/exploreCatalog';
import { eventTypeLabel } from '../data/eventTypes';
import { setLastEventId } from '../lib/lastEvent';
import { getCachedSearch, setCachedSearch } from '../lib/photoSearchCache';
import { getCachedEventInfo, setCachedEventInfo } from '../lib/eventInfoCache';
import { formatDateLabel, formatLocationLabel, formatPhotosCount } from '../lib/eventDisplay';
import { SelfieUpload } from '../components/SelfieUpload';
import { PhotoGrid } from '../components/PhotoGrid';
import { PhotoViewer } from '../components/PhotoViewer';
import { UpsellBanner } from '../components/UpsellBanner';
import { PurchaseFooter } from '../components/PurchaseFooter';
import type { HeaderContext } from '../layouts/headerContext';
import type { EventHeaderInfo, Photo } from '../types';

type Status = 'idle' | 'loading' | 'results' | 'empty';

export function EventoPage() {
  const { eventId = '' } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { setEventTitle } = useOutletContext<HeaderContext>();
  // A click from Home/Eventos hands the event data over via router state so this
  // page doesn't need to re-fetch/re-scrape it. Navigations without state (direct
  // URL visits, "voltar" buttons) fall back to eventInfoCache.ts first, then to
  // fetchEventInfo, which scrapes it from the fotop.com.br event page.
  const passedEvent = (location.state as { event?: EventHeaderInfo } | null)?.event ?? null;
  const [fetchedInfo, setFetchedInfo] = useState<EventHeaderInfo | null>(
    () => getCachedEventInfo(eventId) ?? null
  );
  const headerInfo = passedEvent && passedEvent.id === eventId ? passedEvent : fetchedInfo;
  const [photos, setPhotos] = useState<Photo[]>(() => getCachedSearch(eventId)?.photos ?? []);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(() => getCachedSearch(eventId)?.hasSearched ?? false);
  const [error, setError] = useState<string | null>(() => getCachedSearch(eventId)?.error ?? null);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const { isFavorite, toggleFavorite, favorites } = useFavorites(eventId);

  useEffect(() => {
    setLastEventId(eventId);
  }, [eventId]);

  // Keeps the search results alive across Evento ↔ Favoritas navigation (see
  // photoSearchCache.ts) — restored above via the states' lazy initializers.
  useEffect(() => {
    setCachedSearch(eventId, { photos, hasSearched, error });
  }, [eventId, photos, hasSearched, error]);

  useEffect(() => {
    if (passedEvent && passedEvent.id === eventId) {
      setCachedEventInfo(passedEvent);
      return;
    }
    const cached = getCachedEventInfo(eventId);
    if (cached) {
      setFetchedInfo(cached);
      return;
    }
    let cancelled = false;
    fetchEventInfo(eventId)
      .then((info) => {
        if (cancelled) return;
        const event = { id: eventId, ...info };
        setFetchedInfo(event);
        setCachedEventInfo(event);
      })
      .catch((err) => console.error('[EventoPage] falha ao buscar dados do evento', err));
    return () => {
      cancelled = true;
    };
  }, [eventId, passedEvent]);

  useEffect(() => {
    document.title = headerInfo?.name ? `${headerInfo.name} · potof` : 'potof';
  }, [headerInfo?.name]);

  useEffect(() => {
    // The event name is shown in a card in the page body instead of the app
    // header here — clear it so a name left over from a previous event page
    // doesn't flash in the header on mount.
    setEventTitle(null);
  }, [eventId, setEventTitle]);

  async function handleSearch(file: File) {
    setLoading(true);
    setError(null);
    setPhotos([]);
    try {
      await sendSelfie(eventId, file);
      const result = await fetchEventPhotos(eventId);
      setPhotos(result.photos);
      if (result.photos.length === 0) {
        setError(result.message ?? 'Nenhuma foto encontrada com essa selfie neste evento.');
      }
    } catch (err) {
      console.error('[EventoPage] busca de fotos falhou', err);
      const message = err instanceof Error ? err.message : undefined;
      setError(message ?? 'Não foi possível buscar suas fotos agora. Tente novamente.');
    } finally {
      setLoading(false);
      setHasSearched(true);
    }
  }

  function addAllFavorites() {
    photos.forEach((photo) => {
      if (!isFavorite(photo.id)) toggleFavorite(photo.id);
    });
  }

  function startNewSearch() {
    setPhotos([]);
    setHasSearched(false);
    setError(null);
    setViewerIndex(null);
  }

  const status: Status = loading
    ? 'loading'
    : photos.length > 0
      ? 'results'
      : hasSearched
        ? 'empty'
        : 'idle';

  const favCount = photos.filter((p) => favorites.has(p.id)).length;
  const { pricePerPhoto, packagePrice } = getMockEventMeta(eventId);
  const favTotal = favCount * pricePerPhoto;

  const locationLabel = headerInfo ? formatLocationLabel(headerInfo.city, headerInfo.state) : null;
  const dateLabel = headerInfo ? formatDateLabel(headerInfo.date) : null;
  const categoryLabel = headerInfo?.categoryId ? eventTypeLabel(headerInfo.categoryId) : null;

  return (
    <div className={`evento-page${status === 'results' ? ' evento-page--with-footer' : ''}`}>
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
          {status === 'results' && (
            <div className="evento-hero__results-row">
              <p className="evento-hero__results">{photos.length} fotos encontradas</p>
              <button type="button" className="evento-hero__new-search" onClick={startNewSearch}>
                Nova busca
              </button>
            </div>
          )}
        </div>
      )}

      {status === 'empty' && error && (
        <div className="evento-alert" role="alert">
          <span className="evento-alert__icon" aria-hidden="true">
            ⚠️
          </span>
          <p className="evento-alert__text">{error}</p>
        </div>
      )}

      {(status === 'idle' || status === 'empty') && (
        <div>
          <SelfieUpload onSearch={handleSearch} loading={loading} />
        </div>
      )}

      {status === 'loading' && (
        <div className="evento-loading potof-card">
          <div className="evento-loading__spinner" />
          <p>Buscando suas fotos com reconhecimento facial…</p>
        </div>
      )}

      {status === 'results' && (
        <div>
          <UpsellBanner
            photosCount={photos.length}
            pricePerPhoto={pricePerPhoto}
            packagePrice={packagePrice}
            onAddAllFavorites={addAllFavorites}
          />
          <PhotoGrid
            photos={photos}
            onSelect={setViewerIndex}
            isFavorite={isFavorite}
            onToggleFavorite={toggleFavorite}
          />
        </div>
      )}

      {status === 'results' && (
        <PurchaseFooter
          count={favCount}
          total={favTotal}
          ctaLabel="Ver Favoritas"
          onCta={() =>
            // Hands the event data and search results we already have over to the
            // Favoritas page so it doesn't need to re-fetch them — see FavoritesPage.tsx.
            navigate(`/evento/${eventId}/favoritas`, { state: { photos, event: headerInfo } })
          }
        />
      )}

      {viewerIndex !== null && (
        <PhotoViewer
          photos={photos}
          index={viewerIndex}
          onIndexChange={setViewerIndex}
          onClose={() => setViewerIndex(null)}
          isFavorite={isFavorite}
          onToggleFavorite={toggleFavorite}
          favoritesCount={favCount}
          variant="drawer"
        />
      )}
    </div>
  );
}
