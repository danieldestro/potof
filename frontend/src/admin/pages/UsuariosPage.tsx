import { usuariosApi } from '../api';
import { EntityCrudPage } from '../components/EntityCrudPage';
import type { EntityColumn } from '../components/EntityTable';
import type { EntityField } from '../components/EntityForm';
import { formatDateBR } from '../formatters';
import type { Usuario } from '../types';

const PERFIL_OPTIONS = [
  { value: 'user', label: 'Usuário' },
  { value: 'admin', label: 'Admin' },
];

const COLUMNS: EntityColumn<Usuario>[] = [
  { key: 'nome', label: 'Nome' },
  { key: 'email', label: 'Email' },
  { key: 'perfil', label: 'Perfil', render: (u) => (u.perfil === 'admin' ? 'Admin' : 'Usuário') },
  { key: 'cpf', label: 'CPF', render: (u) => u.cpf ?? '—' },
  { key: 'dataNascimento', label: 'Nascimento', render: (u) => formatDateBR(u.dataNascimento) },
  { key: 'cidade', label: 'Cidade/UF', render: (u) => [u.cidade, u.uf].filter(Boolean).join(' - ') || '—' },
];

const FIELDS: EntityField[] = [
  { key: 'nome', label: 'Nome', type: 'text', required: true },
  { key: 'email', label: 'Email', type: 'email', required: true },
  { key: 'perfil', label: 'Perfil', type: 'select', options: PERFIL_OPTIONS },
  {
    key: 'senha',
    label: 'Senha',
    type: 'password',
    placeholder: 'Deixe em branco para não alterar. Obrigatória pra perfil admin.',
  },
  { key: 'cpf', label: 'CPF', type: 'text' },
  { key: 'dataNascimento', label: 'Data de nascimento', type: 'date' },
  { key: 'cidade', label: 'Cidade', type: 'text' },
  { key: 'uf', label: 'UF', type: 'text' },
  { key: 'pais', label: 'País', type: 'text' },
  { key: 'ativo', label: 'Ativo', type: 'boolean' },
];

export function UsuariosPage() {
  return (
    <EntityCrudPage
      title="Usuários"
      api={usuariosApi}
      columns={COLUMNS}
      fields={FIELDS}
      defaultCreateValues={{ ativo: true, pais: 'BR', perfil: 'user' }}
    />
  );
}
