import type { Evento } from '@prisma/client';
import type { EventoComProvedor } from './types';

export function requireIdEventoProvedor(evento: EventoComProvedor, provedorNome: string): string {
  if (!evento.idEventoProvedor) {
    throw new Error(`Evento ${evento.id} (provedor ${provedorNome}) sem idEventoProvedor configurado.`);
  }
  return evento.idEventoProvedor;
}

// syncEventos dos dois provedores externos varre o catálogo inteiro a cada rodada e, até este
// ponto, chamava prisma.evento.update() incondicionalmente pra toda linha já existente — mesmo
// quando nada mudou de verdade. Essa rajada de UPDATE repetida (a cada ciclo do scheduler, pra
// milhares de linhas que na prática ficam paradas) foi o gatilho mais provável da degradação do
// índice FULLTEXT eventos_busca_fulltext investigada (ver fulltextMaintenance.ts). Comparar antes
// de escrever elimina esse UPDATE redundante sem mudar a contagem "updated" que os dois adapters
// já reportavam pra toda linha existente (mudada ou não) — só evita o write em si.
export function eventoDataChanged(existing: Evento, data: Record<string, unknown>): boolean {
  const existingRecord = existing as unknown as Record<string, unknown>;
  return Object.keys(data).some((key) => {
    const next = data[key];
    const current = existingRecord[key];
    const nextComparable = next instanceof Date ? next.getTime() : next;
    const currentComparable = current instanceof Date ? current.getTime() : current;
    return nextComparable !== currentComparable;
  });
}
