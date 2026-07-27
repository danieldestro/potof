const LAST_EVENT_KEY = 'potof:lastEventId';

export function getLastEventId(): string | null {
  return localStorage.getItem(LAST_EVENT_KEY);
}

export function setLastEventId(eventId: string): void {
  localStorage.setItem(LAST_EVENT_KEY, eventId);
}
