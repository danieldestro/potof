import type { Categoria } from '../types';

// Fallback pro próprio id enquanto a lista ainda não carregou ou se o id não
// for encontrado — mesmo comportamento do antigo eventTypeLabel estático.
export function getCategoriaLabel(categorias: Categoria[], id: string | null | undefined): string {
  if (!id) return '';
  return categorias.find((c) => String(c.id) === id)?.nome ?? id;
}
