import type { FastifyBaseLogger } from 'fastify';
import { prisma } from './prisma';

// Investigação (ver conversa/PR): o índice FULLTEXT eventos_busca_fulltext (InnoDB,
// multi-coluna) foi flagrado fora de sincronia com as linhas reais da tabela depois de uma
// rajada de UPDATEs — MATCH()/AGAINST() deixava de bater até pra palavras presentes no próprio
// registro (contagem de documentos indexados < total de linhas). OPTIMIZE TABLE (mesmo com
// innodb_optimize_fulltext_only=ON) não corrigiu; só um DROP+ADD do índice (reconstrução
// completa) resolveu. syncEventos agora evita escrever linhas sem mudança real (menos UPDATE em
// rajada, a causa mais provável), mas isso é um seguro barato contra a mesma degradação voltar —
// roda só depois de um sync completo (full=true), o cenário de maior volume de UPDATE, nunca no
// ciclo incremental frequente do scheduler.
export async function rebuildEventosFulltextIndex(log: FastifyBaseLogger): Promise<void> {
  try {
    await prisma.$executeRawUnsafe('ALTER TABLE eventos DROP INDEX eventos_busca_fulltext');
    await prisma.$executeRawUnsafe(
      'ALTER TABLE eventos ADD FULLTEXT INDEX eventos_busca_fulltext (nome, local, cidade, uf, descricao)'
    );
    log.info('fulltext maintenance: eventos_busca_fulltext reconstruído com sucesso');
  } catch (err) {
    log.error({ err }, 'fulltext maintenance: falha ao reconstruir eventos_busca_fulltext');
  }
}
