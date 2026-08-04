import { fotografosApi, usuariosApi } from '../api';
import { EntityCrudPage } from '../components/EntityCrudPage';
import type { EntityColumn } from '../components/EntityTable';
import type { EntityField } from '../components/EntityForm';
import type { Fotografo } from '../types';

const COLUMNS: EntityColumn<Fotografo>[] = [
  { key: 'usuario', label: 'Usuário', render: (f) => f.usuario?.nome ?? f.usuarioId },
  { key: 'email', label: 'Email', render: (f) => f.usuario?.email ?? '—' },
];

const FIELDS: EntityField[] = [
  {
    key: 'usuarioId',
    label: 'Usuário',
    type: 'select',
    required: true,
    loadOptions: () =>
      usuariosApi
        .list({ ativo: true, pageSize: 200 })
        .then((res) => res.items.map((u) => ({ value: u.id, label: `${u.nome} (${u.email})` }))),
  },
  { key: 'ativo', label: 'Ativo', type: 'boolean' },
];

export function FotografosPage() {
  return <EntityCrudPage title="Fotógrafos" api={fotografosApi} columns={COLUMNS} fields={FIELDS} />;
}
