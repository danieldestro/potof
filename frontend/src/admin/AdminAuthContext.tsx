import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { adminLogin, adminLogout, adminMe } from './api';
import type { AdminSession } from './types';

interface AdminAuthState {
  admin: AdminSession | null;
  loading: boolean;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthState | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminMe()
      .then(setAdmin)
      .catch(() => setAdmin(null))
      .finally(() => setLoading(false));
  }, []);

  async function login(email: string, senha: string) {
    const session = await adminLogin(email, senha);
    setAdmin(session);
  }

  async function logout() {
    await adminLogout();
    setAdmin(null);
  }

  return <AdminAuthContext.Provider value={{ admin, loading, login, logout }}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth(): AdminAuthState {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth deve ser usado dentro de <AdminAuthProvider>.');
  return ctx;
}
