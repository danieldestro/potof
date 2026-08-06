import type { Provedor } from '@prisma/client';
import { fotopAdapter } from './fotopAdapter';
import { focoRadicalAdapter } from './focoRadicalAdapter';
import type { ProviderAdapter } from './types';

const ADAPTERS: Record<string, ProviderAdapter> = {
  fotop: fotopAdapter,
  'foco-radical': focoRadicalAdapter,
};

// Provedor "próprio" nunca passa por aqui — ver o comentário em ./types.ts.
export function getAdapter(provedor: Provedor): ProviderAdapter | null {
  return ADAPTERS[provedor.slug] ?? null;
}
