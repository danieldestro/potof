import { useState } from 'react';
import type { CrudApi, ListParams } from '../api';
import { useEntityCrud } from '../useEntityCrud';
import { EntityTable, type EntityColumn } from './EntityTable';
import { EntityForm, type EntityField } from './EntityForm';

interface EntityCrudPageProps<T extends { id: number; ativo: boolean }> {
  title: string;
  api: CrudApi<T>;
  columns: EntityColumn<T>[];
  fields: EntityField[];
  defaultCreateValues?: Record<string, unknown>;
  extraParams?: ListParams;
  toFormValues?: (item: T) => Record<string, unknown>;
}

// Shared list+search+paginate+create/edit+toggle-ativo shell reused by every
// admin entity page (Provedores, Categorias, Eventos, Usuários, Fotógrafos,
// Fotos) — each page just supplies its columns/fields/api.
export function EntityCrudPage<T extends { id: number; ativo: boolean }>({
  title,
  api,
  columns,
  fields,
  defaultCreateValues = { ativo: true },
  extraParams,
  toFormValues,
}: EntityCrudPageProps<T>) {
  const crud = useEntityCrud(api, extraParams);
  const [editing, setEditing] = useState<T | null>(null);
  const [creating, setCreating] = useState(false);

  async function handleCreate(values: Record<string, unknown>) {
    await api.create(values);
    setCreating(false);
    crud.reload();
  }

  async function handleUpdate(values: Record<string, unknown>) {
    if (!editing) return;
    await api.update(editing.id, values);
    setEditing(null);
    crud.reload();
  }

  async function handleToggleAtivo(item: T) {
    await api.update(item.id, { ativo: !item.ativo });
    crud.reload();
  }

  return (
    <>
      <EntityTable
        title={title}
        columns={columns}
        items={crud.items}
        loading={crud.loading}
        error={crud.error}
        page={crud.page}
        pageSize={crud.pageSize}
        total={crud.total}
        search={crud.search}
        onSearchChange={crud.setSearch}
        onPageChange={crud.setPage}
        onCreate={() => setCreating(true)}
        onEdit={setEditing}
        onToggleAtivo={handleToggleAtivo}
      />
      {creating && (
        <EntityForm
          title={`Novo — ${title}`}
          fields={fields}
          initialValues={defaultCreateValues}
          onSubmit={handleCreate}
          onClose={() => setCreating(false)}
        />
      )}
      {editing && (
        <EntityForm
          title={`Editar — ${title}`}
          fields={fields}
          initialValues={toFormValues ? toFormValues(editing) : (editing as unknown as Record<string, unknown>)}
          onSubmit={handleUpdate}
          onClose={() => setEditing(null)}
        />
      )}
    </>
  );
}
