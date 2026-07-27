export type DatePresetId = 'hoje' | 'ontem' | 'amanha' | 'ultimos3' | 'ultimos7' | 'ultimos30';

export interface DateRange {
  dataInicio: string;
  dataFim: string;
}

function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function addDays(date: Date, days: number): Date {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

export const DATE_PRESET_OPTIONS: { id: DatePresetId; label: string }[] = [
  { id: 'hoje', label: 'Hoje' },
  { id: 'ontem', label: 'Ontem' },
  { id: 'amanha', label: 'Amanhã' },
  { id: 'ultimos3', label: 'Últimos 3 dias' },
  { id: 'ultimos7', label: 'Últimos 7 dias' },
  { id: 'ultimos30', label: 'Últimos 30 dias' },
];

// "Últimos N dias" is a trailing window that includes today (today included as day 1).
export function rangeForPreset(preset: DatePresetId): DateRange {
  const today = new Date();
  switch (preset) {
    case 'hoje': {
      const iso = toIsoDate(today);
      return { dataInicio: iso, dataFim: iso };
    }
    case 'ontem': {
      const iso = toIsoDate(addDays(today, -1));
      return { dataInicio: iso, dataFim: iso };
    }
    case 'amanha': {
      const iso = toIsoDate(addDays(today, 1));
      return { dataInicio: iso, dataFim: iso };
    }
    case 'ultimos3':
      return { dataInicio: toIsoDate(addDays(today, -2)), dataFim: toIsoDate(today) };
    case 'ultimos7':
      return { dataInicio: toIsoDate(addDays(today, -6)), dataFim: toIsoDate(today) };
    case 'ultimos30':
      return { dataInicio: toIsoDate(addDays(today, -29)), dataFim: toIsoDate(today) };
  }
}

export function presetLabel(preset: DatePresetId): string {
  return DATE_PRESET_OPTIONS.find((o) => o.id === preset)?.label ?? preset;
}

// Reformats an ISO "YYYY-MM-DD" (native <input type="date"> value) to the app's usual "DD/MM/YYYY".
export function formatIsoDateBR(iso: string): string {
  const [y, m, d] = iso.split('-');
  if (!y || !m || !d) return iso;
  return `${d}/${m}/${y}`;
}
