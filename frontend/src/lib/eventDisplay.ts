// fotop dates come as "YYYY-MM-DD" — reformat to the site's usual "DD.MM.YY".
export function formatDateLabel(date: string | null): string | null {
  if (!date) return null;
  const [y, m, d] = date.split('-');
  if (!y || !m || !d) return date;
  return `${d}.${m}.${y.slice(2)}`;
}

export function formatLocationLabel(city: string | null, state: string | null): string | null {
  if (!city) return state;
  return state ? `${city}, ${state}` : city;
}

// Matches fotop's own "26.062 fotos" formatting (dot as thousands separator).
export function formatPhotosCount(count: number | null): string | null {
  if (count == null) return null;
  return count.toLocaleString('pt-BR');
}
