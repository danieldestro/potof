import { categoriasApi } from '../api';
import { EntityCrudPage } from '../components/EntityCrudPage';
import type { EntityColumn } from '../components/EntityTable';
import type { EntityField } from '../components/EntityForm';
import type { Categoria } from '../types';

const COLUMNS: EntityColumn<Categoria>[] = [
  {
    key: 'icone',
    label: 'Ícone',
    render: (c) => (c.icone ? <img src={c.icone} alt="" className="admin-table__icon" /> : '—'),
  },
  { key: 'nome', label: 'Nome' },
  { key: 'slug', label: 'Slug' },
  { key: 'descricao', label: 'Descrição', render: (c) => c.descricao ?? '—' },
  { key: 'ordem', label: 'Ordem' },
];

const FIELDS: EntityField[] = [
  { key: 'nome', label: 'Nome', type: 'text', required: true },
  { key: 'slug', label: 'Slug', type: 'text', required: true },
  { key: 'descricao', label: 'Descrição', type: 'textarea' },
  { key: 'icone', label: 'Ícone (caminho, ex: /categoria-icons/treino.svg)', type: 'text' },
  { key: 'ordem', label: 'Ordem no carrossel (menor primeiro)', type: 'number' },
  { key: 'ativo', label: 'Ativo', type: 'boolean' },
];

export function CategoriasPage() {
  return (
    <EntityCrudPage
      title="Categorias"
      api={categoriasApi}
      columns={COLUMNS}
      fields={FIELDS}
      defaultCreateValues={{ ativo: true, ordem: 0 }}
    />
  );
}
