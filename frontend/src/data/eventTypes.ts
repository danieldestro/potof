// Full taxonomy of event types supported by the system. Shared list so any
// screen (event creation, filters, badges, etc.) can reuse the same ids/labels
// instead of redefining its own subset.

export interface EventType {
  id: string;
  name: string;
  label: string;
  /** Icon identifier/name for this event type. Filled in as icons are defined. */
  icon?: string;
}

export const EVENT_TYPES: EventType[] = [
  { id: "1", name: "corridaderua", label: "Corrida de rua" },
  { id: "22", name: "Treinos", label: "Treinos" },
  { id: "3", name: "futebol", label: "Futebol" },
  { id: "4", name: "ciclismo", label: "Ciclismo" },
  { id: "11", name: "triathlon", label: "Duathlon / Triathlon" },
  { id: "18", name: "corridatrail", label: "Corrida de montanha" },
  { id: "77", name: "carnaval", label: "Carnaval" },
  { id: "78", name: "show-festival", label: "Show / Festival" },
  { id: "24", name: "Acampamentos", label: "Acampamentos" },
  { id: "26", name: "beachtennis", label: "Beach Tênis" },
  { id: "27", name: "crossfit", label: "Crossfit" },
  { id: "12", name: "artemarcial", label: "Arte Marcial" },
  { id: "17", name: "esportesamotor", label: "Esportes a motor" },
  { id: "20", name: "turismo", label: "Turismo" },
  { id: "23", name: "Formatura", label: "Formatura" },
  { id: "19", name: "escolar", label: "Escolar" },
  { id: "13", name: "eventosocial", label: "Evento Social" },
  { id: "14", name: "ensaio", label: "Ensaio" },
  { id: "28", name: "futevolei", label: "Futevôlei" },
  { id: "33", name: "natacao", label: "Natação" },
  { id: "39", name: "esportesaquaticos", label: "Esportes Aquáticos" },
  { id: "41", name: "corridaobstaculos", label: "Corrida de Obstáculos" },
  { id: "25", name: "basquete", label: "Basquete" },
  { id: "9", name: "tenis", label: "Tenis" },
  { id: "36", name: "handball", label: "Handebol" },
  { id: "32", name: "hipismo", label: "Hipismo" },
  { id: "31", name: "golfe", label: "Golfe" },
  { id: "40", name: "padel", label: "Padel" },
  { id: "2", name: "rally", label: "Rally" },
  { id: "37", name: "rugby", label: "Rugby" },
  { id: "16", name: "surf", label: "Surf" },
  { id: "34", name: "volei", label: "Vôlei" },
  { id: "35", name: "baseball", label: "Baseball" },
  { id: "30", name: "ginasticaartistica", label: "Ginástica Artística" },
  { id: "38", name: "futebolamericano", label: "Futebol Americano" },
  { id: "42", name: "airsoft", label: "AirSoft" },
  { id: "43", name: "atletismo", label: "Atletismo" },
  { id: "44", name: "badminton", label: "Badminton" },
  { id: "45", name: "beachsoccer", label: "Beach Soccer" },
  { id: "46", name: "Canoagem", label: "Canoagem" },
  { id: "61", name: "capoeira", label: "Capoeira" },
  { id: "47", name: "danca", label: "Dança" },
  { id: "48", name: "equestre", label: "Equestre" },
  { id: "62", name: "fisiculturismo", label: "Fisiculturismo" },
  { id: "63", name: "futsal", label: "Futsal" },
  { id: "49", name: "hockey", label: "Hockey" },
  { id: "64", name: "iatismo", label: "Iatismo" },
  { id: "50", name: "ioga", label: "Ioga" },
  { id: "65", name: "jiu-jítzu", label: "Jiu-jítzu" },
  { id: "66", name: "judo", label: "Judô" },
  { id: "67", name: "karate", label: "Karatê" },
  { id: "51", name: "kitesurf", label: "Kitesurf" },
  { id: "52", name: "mergulho", label: "Mergulho" },
  { id: "68", name: "motociclismo", label: "Motociclismo" },
  { id: "69", name: "motocros", label: "Motocros" },
  { id: "70", name: "muaythai", label: "Muay Thai" },
  { id: "53", name: "paintball", label: "Paintball" },
  { id: "72", name: "parapente", label: "Parapente" },
  { id: "71", name: "paraquedismo", label: "Paraquedismo" },
  { id: "54", name: "patinação", label: "Patinação" },
  { id: "55", name: "pescaria", label: "Pescaria" },
  { id: "73", name: "pets", label: "Pets" },
  { id: "56", name: "pickleball", label: "Pickleball" },
  { id: "57", name: "pilates", label: "Pilates" },
  { id: "74", name: "poloaquatico", label: "Polo aquático" },
  { id: "58", name: "rodeio", label: "Rodeio" },
  { id: "59", name: "skate", label: "Skate" },
  { id: "60", name: "tenisdemesa", label: "Tênis de mesa" },
  { id: "75", name: "xadrez", label: "Xadrez" },
  { id: "79", name: "hyrox", label: "Hyrox" },
  { id: "80", name: "moda", label: "Moda" },
  { id: "15", name: "outrosesportes", label: "Outros Esportes" },
  { id: "5", name: "outros", label: "Outros" }
];

// App-wide default category filter (see HomePage) — id "22" per product decision,
// even though today it's labeled "Treinos" rather than "Corrida de rua".
export const DEFAULT_CATEGORY_ID = '22';

export function eventTypeLabel(id: string): string {
  return EVENT_TYPES.find((t) => t.id === id)?.label ?? id;
}

export function eventTypeIcon(id: string): string | undefined {
  return EVENT_TYPES.find((t) => t.id === id)?.icon;
}
