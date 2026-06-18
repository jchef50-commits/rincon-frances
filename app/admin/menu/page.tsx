'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, AdminRole } from '@/app/context/AuthContext';
import { ProtectedRoute } from '@/app/components/ProtectedRoute';
import Link from 'next/link';
import ProductManagementPanel from '@/app/components/admin/ProductManagementPanel';

export default function AdminMenuPage() {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/admin');
  };

  return (
    <ProtectedRoute allowedRoles={[AdminRole.ADMIN]}>
      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <header className="bg-white shadow-md sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">🇫🇷 Rincón Francés</h1>
              <p className="text-sm text-gray-600">Gestión de Menú y Productos</p>
            </div>
            <div className="flex gap-3 items-center">
              <Link href="/admin/dashboard">
                <button className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition">
                  📊 Pedidos
                </button>
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-6">
          <ProductManagementPanel />
        </main>
      </div>
    </ProtectedRoute>
  );
}
