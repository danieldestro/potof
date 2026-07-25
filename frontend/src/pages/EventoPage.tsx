import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchEventPhotos, sendSelfie } from '../api/client';
import { useFavorites } from '../hooks/useFavorites';
import { SelfieUpload } from '../components/SelfieUpload';
import { PhotoGrid } from '../components/PhotoGrid';
import { PhotoViewer } from '../components/PhotoViewer';
import type { Photo } from '../types';

export function EventoPage() {
  const { eventId = '' } = useParams();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const { isFavorite, toggleFavorite } = useFavorites(eventId);

  async function handleSearch(file: File) {
    setLoading(true);
    setError(null);
    try {
      await sendSelfie(eventId, file);
      const result = await fetchEventPhotos(eventId);
      setPhotos(result.photos);
    } catch {
      setError('Não foi possível buscar suas fotos agora. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="evento-page">
      <header className="evento-page__header">
        <h1>potof</h1>
        <span className="evento-page__event-id">Evento {eventId}</span>
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
