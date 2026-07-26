import { useEffect, useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import { fetchEventInfo, fetchEventPhotos, sendSelfie } from '../api/client';
import { useFavorites } from '../hooks/useFavorites';
import { getMockEventMeta } from '../data/exploreCatalog';
import { setLastEventId } from '../lib/lastEvent';
import { SelfieUpload } from '../components/SelfieUpload';
import { PhotoGrid } from '../components/PhotoGrid';
import { PhotoViewer } from '../components/PhotoViewer';
import { UpsellBanner } from '../components/UpsellBanner';
import { StickyFavBar } from '../components/StickyFavBar';
import type { HeaderContext } from '../layouts/headerContext';
import type { Photo } from '../types';

type Status = 'idle' | 'loading' | 'results' | 'empty';

export function EventoPage() {
  const { eventId = '' } = useParams();
  const { setEventTitle } = useOutletContext<HeaderContext>();
  const [eventName, setEventName] = useState<string | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const { isFavorite, toggleFavorite, favorites } = useFavorites(eventId);

  useEffect(() => {
    setLastEventId(eventId);
  }, [eventId]);

  useEffect(() => {
    let cancelled = false;
    fetchEventInfo(eventId)
      .then((info) => {
        if (!cancelled) setEventName(info.name);
      })
      .catch((err) => console.error('[EventoPage] falha ao buscar nome do evento', err));
    return () => {
      cancelled = true;
    };
  }, [eventId]);

  useEffect(() => {
    document.title = eventName ? `${eventName} · potof` : 'potof';
    // No cleanup here: Header only reads this title while the route matches
    // /evento/:id or /evento/:id/favoritas, so a stale value is harmless and
    // clearing it in an unmount cleanup fires a cross-component setState
    // warning during route transitions (this page unmounting while the next
    // page mounts in the same commit).
    setEventTitle(eventName);
  }, [eventName, setEventTitle]);

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

  const status: Status = loading
    ? 'loading'
    : photos.length > 0
      ? 'results'
      : hasSearched
        ? 'empty'
        : 'idle';

  const favCount = photos.filter((p) => favorites.has(p.id)).length;
  const { pricePerPhoto, packagePrice } = getMockEventMeta(eventId);

  return (
    <div className="evento-page">
      {(status === 'idle' || status === 'empty') && (
        <div>
          <SelfieUpload onSearch={handleSearch} loading={loading} />
          {status === 'empty' && error && <p className="evento-page__error">{error}</p>}
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
          <p className="evento-page__results-count">{photos.length} fotos encontradas</p>
          <PhotoGrid
            photos={photos}
            onSelect={setViewerIndex}
            isFavorite={isFavorite}
            onToggleFavorite={toggleFavorite}
          />
        </div>
      )}

      {status === 'results' && favCount > 0 && (
        <StickyFavBar eventId={eventId} count={favCount} photos={photos} />
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
        />
      )}
    </div>
  );
}
