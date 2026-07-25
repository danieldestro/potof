import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

export function HomePage() {
  const [eventId, setEventId] = useState('');
  const navigate = useNavigate();

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (eventId.trim()) {
      navigate(`/evento/${eventId.trim()}`);
    }
  }

  return (
    <div className="home-page">
      <h1>potof</h1>
      <p>Encontre suas fotos de eventos esportivos com uma selfie.</p>
      <form onSubmit={handleSubmit} className="home-page__form">
        <input
          type="text"
          inputMode="numeric"
          placeholder="Código do evento"
          value={eventId}
          onChange={(e) => setEventId(e.target.value)}
        />
        <button type="submit">Buscar evento</button>
      </form>
    </div>
  );
}
