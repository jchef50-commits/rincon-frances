'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, AdminRole } from '@/app/context/AuthContext';
import { Button } from '@/app/components';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<AdminRole>(AdminRole.ADMIN);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Si ya está autenticado, redirigir
  React.useEffect(() => {
    if (isAuthenticated) {
      router.push('/admin/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    await new Promise((res) => setTimeout(res, 500));

    const success = login(password, role);
    if (success) {
      router.push('/admin/dashboard');
    } else {
      setError('❌ Contraseña incorrecta');
      setPassword('');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">🔐 Acceso Admin</h1>
          <p className="text-gray-600">Ingresa tu contraseña para continuar</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Selector Rol */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Tipo de acceso:</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole(AdminRole.ADMIN)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  role === AdminRole.ADMIN
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-300 bg-white hover:border-gray-400'
                }`}
              >
                <div className="text-2xl mb-1">👔</div>
                <div className="font-medium text-sm">Administrador</div>
              </button>
              <button
                type="button"
                onClick={() => setRole(AdminRole.COCINA)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  role === AdminRole.COCINA
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-300 bg-white hover:border-gray-400'
                }`}
              >
                <div className="text-2xl mb-1">👨‍🍳</div>
                <div className="font-medium text-sm">Cocina</div>
              </button>
            </div>
          </div>

          {/* Contraseña */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña:
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingresa la contraseña"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
              autoFocus
            />
          </div>

          {/* Error */}
          {error && <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">{error}</div>}

          {/* Botón Submit */}
          <button
            type="submit"
            disabled={isLoading || !password}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
              isLoading || !password
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
            }`}
          >
            {isLoading ? '⏳ Verificando...' : '🔓 Ingresar'}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg text-center">
          <p className="text-xs text-gray-600">
            💡 <strong>Contraseña:</strong> rincón123
          </p>
        </div>

        {/* Link Atrás */}
        <div className="mt-4 text-center">
          <a href="/menu" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            ← Volver al menú
          </a>
        </div>
      </div>
    </div>
  );
}
