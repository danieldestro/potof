import type { Provedor } from '@prisma/client';
import { fotopAdapter } from './fotopAdapter';
import type { ProviderAdapter } from './types';

const ADAPTERS: Record<string, ProviderAdapter> = {
  fotop: fotopAdapter,
};

// Provedor "próprio" nunca passa por aqui — ver o comentário em ./types.ts.
export function getAdapter(provedor: Provedor): ProviderAdapter | null {
  return ADAPTERS[provedor.slug] ?? null;
}
