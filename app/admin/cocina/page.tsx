'use client';

import React, { useEffect, useState } from 'react';
import { EstadoPedido } from '@/app/types';
import { usePedidos } from '@/app/context/PedidosContext';
import { useAuth, AdminRole } from '@/app/context/AuthContext';
import { OrderCard, Button, StatusBadge } from '@/app/components';
import { ProtectedRoute } from '@/app/components/ProtectedRoute';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminCocinaPage() {
  const router = useRouter();
  const { pedidos, cambiarEstadoPedido } = usePedidos();
  const { logout } = useAuth();
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      setAutoRefresh((prev) => prev);
    }, 3000);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const pedidosPendientes = pedidos.filter((p) => p.estado === EstadoPedido.PENDIENTE);
  const pedidosEnPreparacion = pedidos.filter((p) => p.estado === EstadoPedido.PREPARANDO);

  const handleMarcarEnPreparacion = (pedidoId: string) => {
    cambiarEstadoPedido(pedidoId, EstadoPedido.PREPARANDO);
  };

  const handleMarcarListo = (pedidoId: string) => {
    cambiarEstadoPedido(pedidoId, EstadoPedido.LISTO);
  };

  const handleLogout = () => {
    logout();
    router.push('/admin');
  };

  return (
    <ProtectedRoute allowedRoles={[AdminRole.COCINA]}>
      <div className="min-h-screen bg-gray-900 text-white">
        {/* Header */}
        <header className="bg-black border-b-4 border-red-600">
          <div className="max-w-full mx-auto px-4 py-4 flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold">👨‍🍳 Pantalla de Cocina</h1>
              <p className="text-gray-400 text-sm mt-1">
                Optimizada para Tablet • Pendientes: {pedidosPendientes.length} • En preparación:{' '}
                {pedidosEnPreparacion.length}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`px-4 py-2 rounded font-medium transition-all ${
                  autoRefresh
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-gray-600 hover:bg-gray-700'
                }`}
              >
                {autoRefresh ? '🔄 Auto' : '⏸ Manual'}
              </button>
              <Link href="/admin/dashboard">
                <Button variant="secondary" tamaño="sm">
                  📊 Dashboard
                </Button>
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded transition-colors"
              >
                🚪 Logout
              </button>
            </div>
          </div>
        </header>

        {/* Contenido */}
        <main className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Pendientes */}
          <div className="bg-yellow-900 border-4 border-yellow-500 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b-2 border-yellow-500">
              <span className="text-3xl">⏳</span>
              <h2 className="text-2xl font-bold">PENDIENTES</h2>
              <span className="bg-yellow-500 text-black px-3 py-1 rounded-full font-bold ml-auto">
                {pedidosPendientes.length}
              </span>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {pedidosPendientes.length === 0 ? (
                <p className="text-center text-yellow-300 py-12 text-xl font-semibold">
                  ✅ ¡Sin pedidos pendientes!
                </p>
              ) : (
                pedidosPendientes.map((pedido) => (
                  <div
                    key={pedido.id}
                    className="bg-yellow-800 border-2 border-yellow-400 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-2xl font-bold">{pedido.id}</h3>
                      <span className="text-sm text-yellow-200">
                        {new Date(pedido.createdAt).toLocaleTimeString('es-MX')}
                      </span>
                    </div>

                    {/* Items */}
                    <div className="bg-yellow-700 rounded p-3 mb-3">
                      {pedido.items.map((item) => (
                        <div key={item.id} className="flex justify-between text-lg font-bold mb-1">
                          <span>
                            {item.cantidad}x {item.producto.nombre}
                          </span>
                        </div>
                      ))}
                      {pedido.observacionesGenerales && (
                        <p className="text-sm italic text-yellow-200 mt-2 border-t border-yellow-600 pt-2">
                          📝 {pedido.observacionesGenerales}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => handleMarcarEnPreparacion(pedido.id)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all"
                    >
                      ⚡ EMPEZAR PREPARACIÓN
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* En Preparación */}
          <div className="bg-blue-900 border-4 border-blue-500 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b-2 border-blue-500">
              <span className="text-3xl">🔥</span>
              <h2 className="text-2xl font-bold">EN PREPARACIÓN</h2>
              <span className="bg-blue-500 text-white px-3 py-1 rounded-full font-bold ml-auto">
                {pedidosEnPreparacion.length}
              </span>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {pedidosEnPreparacion.length === 0 ? (
                <p className="text-center text-blue-300 py-12 text-xl font-semibold">
                  📭 Sin pedidos en preparación
                </p>
              ) : (
                pedidosEnPreparacion.map((pedido) => (
                  <div
                    key={pedido.id}
                    className="bg-blue-800 border-2 border-blue-400 rounded-lg p-4 animate-pulse"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-2xl font-bold">{pedido.id}</h3>
                      <span className="text-sm text-blue-200">
                        {new Date(pedido.createdAt).toLocaleTimeString('es-MX')}
                      </span>
                    </div>

                    {/* Items */}
                    <div className="bg-blue-700 rounded p-3 mb-3">
                      {pedido.items.map((item) => (
                        <div key={item.id} className="flex justify-between text-lg font-bold mb-1">
                          <span>
                            {item.cantidad}x {item.producto.nombre}
                          </span>
                        </div>
                      ))}
                      {pedido.observacionesGenerales && (
                        <p className="text-sm italic text-blue-200 mt-2 border-t border-blue-600 pt-2">
                          📝 {pedido.observacionesGenerales}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => handleMarcarListo(pedido.id)}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-all"
                    >
                      ✅ MARCAR COMO LISTO
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
