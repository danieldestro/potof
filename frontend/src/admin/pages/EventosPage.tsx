import { categoriasApi, eventosApi, provedoresApi } from '../api';
import { EntityCrudPage } from '../components/EntityCrudPage';
import type { EntityColumn } from '../components/EntityTable';
import type { EntityField } from '../components/EntityForm';
import { formatDateTimeBR } from '../formatters';
import type { Evento } from '../types';

const COLUMNS: EntityColumn<Evento>[] = [
  { key: 'nome', label: 'Nome' },
  { key: 'categoria', label: 'Categoria', render: (e) => e.categoria?.nome ?? e.categoriaId },
  { key: 'provedor', label: 'Provedor', render: (e) => e.provedor?.nome ?? e.provedorId },
  { key: 'dataHora', label: 'Data/hora', render: (e) => formatDateTimeBR(e.dataHora) },
  { key: 'cidade', label: 'Cidade/UF', render: (e) => [e.cidade, e.uf].filter(Boolean).join(' - ') || '—' },
];

const FIELDS: EntityField[] = [
  { key: 'nome', label: 'Nome', type: 'text', required: true },
  { key: 'descricao', label: 'Descrição', type: 'textarea' },
  { key: 'local', label: 'Local', type: 'text' },
  { key: 'dataHora', label: 'Data/hora', type: 'datetime', required: true },
  { key: 'cidade', label: 'Cidade', type: 'text' },
  { key: 'uf', label: 'UF', type: 'text' },
  { key: 'pais', label: 'País', type: 'text' },
  {
    key: 'categoriaId',
    label: 'Categoria',
    type: 'select',
    required: true,
    loadOptions: () =>
      categoriasApi
        .list({ ativo: true, pageSize: 200 })
        .then((res) => res.items.map((c) => ({ value: c.id, label: c.nome }))),
  },
  {
    key: 'provedorId',
    label: 'Provedor',
    type: 'select',
    required: true,
    loadOptions: () =>
      provedoresApi
        .list({ ativo: true, pageSize: 200 })
        .then((res) => res.items.map((p) => ({ value: p.id, label: p.nome }))),
  },
  { key: 'idEventoProvedor', label: 'ID do evento no provedor', type: 'text' },
  { key: 'urlSite', label: 'URL do site', type: 'text' },
  { key: 'searchSelfie', label: 'Busca por selfie', type: 'boolean' },
  { key: 'searchBib', label: 'Busca por número de peito', type: 'boolean' },
  { key: 'searchName', label: 'Busca por nome', type: 'boolean' },
  { key: 'ativo', label: 'Ativo', type: 'boolean' },
];

export function EventosPage() {
  return (
    <EntityCrudPage
      title="Eventos"
      api={eventosApi}
      columns={COLUMNS}
      fields={FIELDS}
      defaultCreateValues={{ ativo: true, pais: 'BR', searchSelfie: false, searchBib: false, searchName: false }}
    />
  );
}
