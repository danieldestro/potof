import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchEventInfo, fetchEventPhotos, sendSelfie } from '../api/client';
import { useFavorites } from '../hooks/useFavorites';
import { SelfieUpload } from '../components/SelfieUpload';
import { PhotoGrid } from '../components/PhotoGrid';
import { PhotoViewer } from '../components/PhotoViewer';
import type { Photo } from '../types';

export function EventoPage() {
  const { eventId = '' } = useParams();
  const [eventName, setEventName] = useState<string | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const { isFavorite, toggleFavorite } = useFavorites(eventId);

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
  }, [eventName]);

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
    }
  }

  return (
    <div className="evento-page">
      <header className="evento-page__header">
        <h1>{eventName ?? `Evento ${eventId}`}</h1>
      </header>

      <SelfieUpload onSearch={handleSearch} loading={loading} />

      {error && <p className="evento-page__error">{error}</p>}

      {photos.length > 0 && <PhotoGrid photos={photos} onSelect={setViewerIndex} />}

      {viewerIndex !== null && (
        <PhotoViewer
          photos={photos}
          index={viewerIndex}
          onIndexChange={setViewerIndex}
          onClose={() => setViewerIndex(null)}
          isFavorite={isFavorite}
          onToggleFavorite={toggleFavorite}
        />
      )}
    </div>
  );
}
