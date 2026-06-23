'use client';

import React, { createContext, useState, useCallback } from 'react';
import {
  User,
  getIdTokenResult,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth } from '@/app/lib/firebase';

export enum AdminRole {
  ADMIN = 'admin',
  COCINA = 'cocina',
}

type AuthMigrationMode = 'firebase';

// Fase 3A: Firebase Auth es el único mecanismo válido
const AUTH_MIGRATION_MODE: AuthMigrationMode = 'firebase';

interface AdminUser {
  id: string;
  role: AdminRole;
  nombre: string;
  authSource: 'legacy' | 'firebase';
}

interface AuthContextType {
  user: AdminUser | null;
  login: (password: string, role: AdminRole) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  migrationMode: AuthMigrationMode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'rincon_admin_auth';
const STORAGE_TIMESTAMP_KEY = 'rincon_admin_timestamp';
// Fase 3A: ADMIN_PASSWORD eliminada. Firebase Auth es obligatorio.
const FIREBASE_ROLE_EMAILS: Record<AdminRole, string | undefined> = {
  [AdminRole.ADMIN]: process.env.NEXT_PUBLIC_FIREBASE_ADMIN_EMAIL,
  [AdminRole.COCINA]: process.env.NEXT_PUBLIC_FIREBASE_COCINA_EMAIL,
};

// Fase 3A: Forzar Firebase Auth. No hay alternativa.
const isFirebaseAuthEnabled = auth !== null;
const isFirebaseOnlyMode = true; // Always true in Fase 3A

function toAdminRole(role: unknown): AdminRole | null {
  if (role === AdminRole.ADMIN || role === AdminRole.COCINA) {
    return role;
  }
  return null;
}

// Fase 3A: buildLegacyUser removido. Firebase Auth es el único mecanismo.

async function buildFirebaseUser(firebaseUser: User): Promise<AdminUser | null> {
  let role: AdminRole | null = null;

  try {
    const token = await getIdTokenResult(firebaseUser);
    role = toAdminRole(token.claims.role);
  } catch {
    role = null;
  }

  if (!role && firebaseUser.email) {
    if (firebaseUser.email === FIREBASE_ROLE_EMAILS[AdminRole.ADMIN]) {
      role = AdminRole.ADMIN;
    } else if (firebaseUser.email === FIREBASE_ROLE_EMAILS[AdminRole.COCINA]) {
      role = AdminRole.COCINA;
    }
  }

  if (!role) {
    return null;
  }

  return {
    id: firebaseUser.uid,
    role,
    nombre: role === AdminRole.ADMIN ? 'Administrador' : 'Cocina',
    authSource: 'firebase',
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Fase 3A: No restaurar usuario desde localStorage. Depender de onAuthStateChanged.
  const [user, setUser] = useState<AdminUser | null>(null);
  React.useEffect(() => {
    if (!isFirebaseAuthEnabled || !auth) {
      return;
    }

    // Fase 3A: Única fuente de verdad es Firebase Auth via onAuthStateChanged
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(STORAGE_TIMESTAMP_KEY);
        return;
      }

      const firebaseAdminUser = await buildFirebaseUser(firebaseUser);
      if (!firebaseAdminUser) {
        setUser(null);
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(STORAGE_TIMESTAMP_KEY);
        return;
      }

      setUser(firebaseAdminUser);
      // Fase 3A: Solo guardar timestamp de autenticación, no el usuario
      localStorage.setItem(STORAGE_TIMESTAMP_KEY, Date.now().toString());
    });
  }, []);

  const login = useCallback(
    async (password: string, role: AdminRole): Promise<boolean> => {
      // Fase 3A: Firebase Auth es obligatorio. Sin fallback legacy.
      if (!isFirebaseAuthEnabled || !auth) {
        return false;
      }

      const email = FIREBASE_ROLE_EMAILS[role];
      if (!email) {
        // Email no configurado para este rol
        return false;
      }

      try {
        const credentials = await signInWithEmailAndPassword(auth, email, password);
        const firebaseAdminUser = await buildFirebaseUser(credentials.user);
        if (firebaseAdminUser) {
          setUser(firebaseAdminUser);
          // Fase 3A: Solo guardar timestamp
          localStorage.setItem(STORAGE_TIMESTAMP_KEY, Date.now().toString());
          return true;
        }
        return false;
      } catch (error) {
        // Firebase Auth fallo. No hay fallback legacy. Retornar false.
        return false;
      }
    },
    []
  );

  const logout = useCallback(async () => {
    if (auth?.currentUser) {
      try {
        await signOut(auth);
      } catch {
        // Firebase logout fallo, pero limpiar estado de todas formas
      }
    }

    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_TIMESTAMP_KEY);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: user !== null,
        migrationMode: AUTH_MIGRATION_MODE,
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
