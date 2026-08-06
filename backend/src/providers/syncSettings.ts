import { prisma } from '../db/prisma';

export const DEFAULT_SYNC_INCREMENTAL_DIAS = 30;

// Configuracao é singleton (id=1) e pode não existir ainda num banco novo (a linha não é criada
// por migration, só por upsert sob demanda — ver routes/admin/configuracoes.ts) — nesse caso cai
// no default em vez de falhar, então o sync incremental sempre tem uma janela válida pra usar.
export async function getSyncIncrementalDias(): Promise<number> {
  const config = await prisma.configuracao.findUnique({ where: { id: 1 } });
  return config?.syncIncrementalDias ?? DEFAULT_SYNC_INCREMENTAL_DIAS;
}
