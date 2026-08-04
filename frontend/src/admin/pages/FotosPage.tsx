import { eventosApi, fotografosApi, fotosApi } from '../api';
import { EntityCrudPage } from '../components/EntityCrudPage';
import type { EntityColumn } from '../components/EntityTable';
import type { EntityField } from '../components/EntityForm';
import { formatDateTimeBR } from '../formatters';
import type { Foto } from '../types';

const COLUMNS: EntityColumn<Foto>[] = [
  {
    key: 'thumb',
    label: 'Miniatura',
    render: (f) => (f.urlThumb ? <img src={f.urlThumb} alt="" className="admin-thumb" /> : '—'),
  },
  { key: 'evento', label: 'Evento', render: (f) => f.evento?.nome ?? f.eventoId },
  { key: 'fotografo', label: 'Fotógrafo', render: (f) => f.fotografo?.usuario?.nome ?? f.fotografoId },
  { key: 'takenAt', label: 'Tirada em', render: (f) => formatDateTimeBR(f.takenAt) },
];

const FIELDS: EntityField[] = [
  {
    key: 'eventoId',
    label: 'Evento',
    type: 'select',
    required: true,
    loadOptions: () =>
      eventosApi.list({ ativo: true, pageSize: 200 }).then((res) => res.items.map((e) => ({ value: e.id, label: e.nome }))),
  },
  {
    key: 'fotografoId',
    label: 'Fotógrafo',
    type: 'select',
    required: true,
    loadOptions: () =>
      fotografosApi
        .list({ ativo: true, pageSize: 200 })
        .then((res) => res.items.map((f) => ({ value: f.id, label: f.usuario?.nome ?? `#${f.id}` }))),
  },
  { key: 'urlFoto', label: 'URL da foto', type: 'text', required: true },
  { key: 'urlThumb', label: 'URL da miniatura', type: 'text' },
  { key: 'takenAt', label: 'Tirada em', type: 'datetime' },
  { key: 'ativo', label: 'Ativo', type: 'boolean' },
];

export function FotosPage() {
  return <EntityCrudPage title="Fotos" api={fotosApi} columns={COLUMNS} fields={FIELDS} />;
}
