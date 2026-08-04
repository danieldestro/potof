import { provedoresApi } from '../api';
import { EntityCrudPage } from '../components/EntityCrudPage';
import type { EntityColumn } from '../components/EntityTable';
import type { EntityField } from '../components/EntityForm';
import type { Provedor } from '../types';

const COLUMNS: EntityColumn<Provedor>[] = [
  { key: 'nome', label: 'Nome' },
  { key: 'descricao', label: 'Descrição', render: (p) => p.descricao ?? '—' },
  { key: 'urlSite', label: 'URL', render: (p) => p.urlSite ?? '—' },
  { key: 'proprio', label: 'Próprio', render: (p) => (p.proprio ? 'Sim' : 'Não') },
];

const FIELDS: EntityField[] = [
  { key: 'nome', label: 'Nome', type: 'text', required: true },
  { key: 'descricao', label: 'Descrição', type: 'textarea' },
  { key: 'urlSite', label: 'URL do site', type: 'text' },
  { key: 'proprio', label: 'Provedor próprio', type: 'boolean' },
  { key: 'ativo', label: 'Ativo', type: 'boolean' },
];

export function ProvedoresPage() {
  return (
    <EntityCrudPage
      title="Provedores"
      api={provedoresApi}
      columns={COLUMNS}
      fields={FIELDS}
      defaultCreateValues={{ ativo: true, proprio: false }}
    />
  );
}
