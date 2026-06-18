'use client';

import React, { createContext, useState, useCallback, useEffect } from 'react';

export enum AdminRole {
  ADMIN = 'admin',
  COCINA = 'cocina',
}

interface AdminUser {
  id: string;
  role: AdminRole;
  nombre: string;
}

interface AuthContextType {
  user: AdminUser | null;
  login: (password: string, role: AdminRole) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'rincon_admin_user';
const ADMIN_PASSWORD = 'rincon123'; // Contraseña para acceso Admin/Cocina

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(() => {
    if (typeof window === 'undefined') {
      return null;
    }
    const usuarioGuardado = localStorage.getItem(STORAGE_KEY);
    if (usuarioGuardado) {
      try {
        const userData = JSON.parse(usuarioGuardado);
        return userData;
      } catch {
        // Si hay error, no cargar nada
        return null;
      }
    }
    return null;
  });
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const login = useCallback((password: string, role: AdminRole): boolean => {
    if (password !== ADMIN_PASSWORD) {
      return false;
    }

    const usuario: AdminUser = {
      id: `${role}-1`,
      role,
      nombre: role === AdminRole.ADMIN ? 'Administrador' : 'Cocina',
    };
    setUser(usuario);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(usuario));
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  if (!isHydrated) {
    return null;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: user !== null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}
