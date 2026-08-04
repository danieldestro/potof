import { useState } from 'react';
import { provedoresApi, syncProvedor } from '../api';
import { EntityCrudPage } from '../components/EntityCrudPage';
import type { EntityColumn } from '../components/EntityTable';
import type { EntityField } from '../components/EntityForm';
import type { Provedor } from '../types';

const COLUMNS: EntityColumn<Provedor>[] = [
  { key: 'nome', label: 'Nome' },
  { key: 'slug', label: 'Slug' },
  { key: 'descricao', label: 'Descrição', render: (p) => p.descricao ?? '—' },
  { key: 'urlSite', label: 'URL', render: (p) => p.urlSite ?? '—' },
  { key: 'proprio', label: 'Próprio', render: (p) => (p.proprio ? 'Sim' : 'Não') },
];

const FIELDS: EntityField[] = [
  { key: 'nome', label: 'Nome', type: 'text', required: true },
  { key: 'slug', label: 'Slug', type: 'text', required: true },
  { key: 'descricao', label: 'Descrição', type: 'textarea' },
  { key: 'urlSite', label: 'URL do site', type: 'text' },
  { key: 'proprio', label: 'Provedor próprio', type: 'boolean' },
  { key: 'ativo', label: 'Ativo', type: 'boolean' },
];

function SincronizarButton({ provedor }: { provedor: Provedor }) {
  const [syncing, setSyncing] = useState(false);

  async function handleClick() {
    setSyncing(true);
    try {
      const result = await syncProvedor(provedor.id);
      alert(`Sincronizado: ${result.created} criados, ${result.updated} atualizados, ${result.skipped} pulados.`);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Falha ao sincronizar.');
    } finally {
      setSyncing(false);
    }
  }

  return (
    <button type="button" className="admin-btn admin-btn--ghost" onClick={handleClick} disabled={syncing}>
      {syncing ? 'Sincronizando…' : 'Sincronizar'}
    </button>
  );
}

export function ProvedoresPage() {
  return (
    <EntityCrudPage
      title="Provedores"
      api={provedoresApi}
      columns={COLUMNS}
      fields={FIELDS}
      defaultCreateValues={{ ativo: true, proprio: false }}
      renderRowExtra={(provedor) => <SincronizarButton provedor={provedor} />}
    />
  );
}
