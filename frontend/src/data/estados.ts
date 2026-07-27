// Full list of Brazilian states (plus virtual/unspecified pseudo-states) used
// throughout the app. Shared list so any screen (filters, forms, badges,
// etc.) can reuse the same ids/labels instead of redefining its own subset.

export interface Estado {
  id: string;
  descricao: string;
}

export const ESTADOS: Estado[] = [
  { id: "AC", descricao: "Acre" },
  { id: "AL", descricao: "Alagoas" },
  { id: "AM", descricao: "Amazonas" },
  { id: "AP", descricao: "Amapá" },
  { id: "BA", descricao: "Bahia" },
  { id: "CE", descricao: "Ceará" },
  { id: "DF", descricao: "Distrito Federal" },
  { id: "ES", descricao: "Espírito Santo" },
  { id: "GO", descricao: "Goiás" },
  { id: "MA", descricao: "Maranhão" },
  { id: "MG", descricao: "Minas Gerais" },
  { id: "MS", descricao: "Mato Grosso do Sul" },
  { id: "MT", descricao: "Mato Grosso" },
  { id: "PA", descricao: "Pará" },
  { id: "PB", descricao: "Paraíba" },
  { id: "PE", descricao: "Pernambuco" },
  { id: "PI", descricao: "Piauí" },
  { id: "PR", descricao: "Paraná" },
  { id: "RN", descricao: "Rio Grande do Norte" },
  { id: "RO", descricao: "Rondônia" },
  { id: "RR", descricao: "Roraima" },
  { id: "RS", descricao: "Rio Grande do Sul" },
  { id: "SC", descricao: "Santa Catarina" },
  { id: "SE", descricao: "Sergipe" },
  { id: "SP", descricao: "São Paulo" },
  { id: "TO", descricao: "Tocantins" },
  { id: "RJ", descricao: "Rio de Janeiro" },
  { id: "VI", descricao: "Virtual" },
  { id: "IN", descricao: "Virtual" },
  { id: "NI", descricao: "Não Informado" }
];

// App-wide default state filter (see HomePage / lib/userPreferences).
export const DEFAULT_ESTADO_ID = 'SP';

export function estadoDescricao(id: string): string {
  return ESTADOS.find((e) => e.id === id)?.descricao ?? id;
}
