// MOCK DATA — placeholder until the backend exposes real event pricing. Event listing
// (home/eventos) and category/state catalogs now come from the real fotop.com.br API
// (see hooks/useEventosBusca.ts, data/eventTypes.ts, data/estados.ts). This file only
// still supplies commerce copy (price per photo / package price) via `getMockEventMeta`,
// since the real backend has no pricing data at all yet.

export interface MockEvent {
  id: string;
  name: string;
  category: string;
  state: string;
  location: string;
  dateDay: string;
  dateLabel: string;
  photosCount: number;
  videosCount: number;
  pricePerPhoto: number;
  packagePrice: number;
}

export interface EventMeta {
  pricePerPhoto: number;
  packagePrice: number;
}

export const MOCK_EVENTS: MockEvent[] = [
  { id: 'ev1', name: 'Treino USP', category: 'treinos', state: 'SP', location: 'São Paulo, SP', dateDay: 'sábado', dateLabel: '25.07.2026', photosCount: 15, videosCount: 3, pricePerPhoto: 5, packagePrice: 3 },
  { id: 'ev2', name: 'Night Run Orla', category: 'corrida', state: 'RJ', location: 'Rio de Janeiro, RJ', dateDay: 'domingo', dateLabel: '02.08.2026', photosCount: 22, videosCount: 5, pricePerPhoto: 5, packagePrice: 3 },
  { id: 'ev3', name: 'Copa Amadores', category: 'futebol', state: 'SP', location: 'São Paulo, SP', dateDay: 'quarta', dateLabel: '15.07.2026', photosCount: 18, videosCount: 8, pricePerPhoto: 5, packagePrice: 3 },
  { id: 'ev4', name: 'Desafio da Serra', category: 'ciclismo', state: 'SP', location: 'Campinas, SP', dateDay: 'quinta', dateLabel: '30.07.2026', photosCount: 12, videosCount: 2, pricePerPhoto: 6, packagePrice: 4 },
  { id: 'ev5', name: 'Ironman Challenge', category: 'triathlon', state: 'SC', location: 'Florianópolis, SC', dateDay: 'segunda', dateLabel: '10.08.2026', photosCount: 30, videosCount: 10, pricePerPhoto: 7, packagePrice: 4 },
  { id: 'ev6', name: 'Treino Ibirapuera', category: 'treinos', state: 'SP', location: 'São Paulo, SP', dateDay: 'segunda', dateLabel: '20.07.2026', photosCount: 10, videosCount: 1, pricePerPhoto: 5, packagePrice: 3 },
];

export const DEFAULT_EVENT_META: EventMeta = { pricePerPhoto: 5, packagePrice: 3 };

// Real fotop event ids won't coincide with the mock catalog's ids, so this
// falls back to a fixed placeholder price for every real event.
export function getMockEventMeta(eventId: string): EventMeta {
  const match = MOCK_EVENTS.find((e) => e.id === eventId);
  return match ? { pricePerPhoto: match.pricePerPhoto, packagePrice: match.packagePrice } : DEFAULT_EVENT_META;
}
