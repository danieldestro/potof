import { useNavigate } from 'react-router-dom';
import type { EventSummary } from '../types';
import { eventTypeLabel } from '../data/eventTypes';
import { formatDateLabel } from '../lib/eventDisplay';

interface EventSummaryCardProps {
  event: EventSummary;
}

export function EventSummaryCard({ event }: EventSummaryCardProps) {
  const navigate = useNavigate();
  const dateLabel = formatDateLabel(event.date);

  return (
    <div
      className="event-card potof-card"
      onClick={() => navigate(`/evento/${event.id}`, { state: { event } })}
    >
      <div className="event-card__cover event-card__cover--photo">
        <img
          src={event.coverUrl}
          alt={event.name}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.style.visibility = 'hidden';
          }}
        />
      </div>
      <div className="event-card__body">
        <span className="potof-badge">{eventTypeLabel(event.categoryId)}</span>
        <h3 className="event-card__name">{event.name}</h3>
        <div className="event-card__meta">
          <span>
            📍 {event.city}
            {event.state ? `, ${event.state}` : ''}
          </span>
          {dateLabel && <span>🗓 {dateLabel}</span>}
        </div>
      </div>
    </div>
  );
}
