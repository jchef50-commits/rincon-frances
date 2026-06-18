'use client';

import React, { useState } from 'react';
import { EstadoPedido, Pedido, TipoConsumo, ItemCarrito } from '@/app/types';
import { usePedidos } from '@/app/context/PedidosContext';
import { useAuth, AdminRole } from '@/app/context/AuthContext';
import { OrderCard, StatusBadge, Button } from '@/app/components';
import { ManualOrderForm } from '@/app/components/ManualOrderForm';
import { ProtectedRoute } from '@/app/components/ProtectedRoute';
import { menuProductos } from '@/app/data/menu';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const estados = [
  EstadoPedido.PENDIENTE,
  EstadoPedido.PREPARANDO,
  EstadoPedido.LISTO,
  EstadoPedido.ENTREGADO,
  EstadoPedido.CANCELADO,
];

const coloresColumnas: Record<EstadoPedido, string> = {
  [EstadoPedido.PENDIENTE]: 'bg-yellow-50 border-yellow-200',
  [EstadoPedido.PREPARANDO]: 'bg-blue-50 border-blue-200',
  [EstadoPedido.LISTO]: 'bg-green-50 border-green-200',
  [EstadoPedido.ENTREGADO]: 'bg-gray-50 border-gray-200',
  [EstadoPedido.CANCELADO]: 'bg-red-50 border-red-200',
};

interface ModalState {
  isOpen: boolean;
  pedidoId?: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const { pedidos, cambiarEstadoPedido, agregarPedido } = usePedidos();
  const { logout } = useAuth();
  const [selectedModal, setSelectedModal] = useState<ModalState>({ isOpen: false });
  const [showManualForm, setShowManualForm] = useState(false);
  const [isSubmittingManual, setIsSubmittingManual] = useState(false);

  const pedidoSeleccionado = selectedModal.pedidoId
    ? pedidos.find((p) => p.id === selectedModal.pedidoId)
    : null;

  const handleCambiarEstado = (pedidoId: string, nuevoEstado: EstadoPedido) => {
    cambiarEstadoPedido(pedidoId, nuevoEstado);
    setSelectedModal({ isOpen: false });
  };

  const handleEliminarPedido = (pedidoId: string) => {
    cambiarEstadoPedido(pedidoId, EstadoPedido.CANCELADO);
    setSelectedModal({ isOpen: false });
  };

  const handleSubmitManualOrder = async (data: {
    nombreCliente: string;
    items: { productoId: number; cantidad: number }[];
    tipoConsumo: TipoConsumo;
    numeroMesa?: number;
    observaciones?: string;
  }) => {
    setIsSubmittingManual(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const itemsCarrito: ItemCarrito[] = data.items.map((item) => {
        const producto = menuProductos.find((p) => p.id === item.productoId);
        if (!producto) throw new Error('Producto no encontrado');

        return {
          id: `manual-${item.productoId}-${Date.now()}`,
          productoId: item.productoId,
          producto,
          cantidad: item.cantidad,
        };
      });

      const pedidoId = agregarPedido(
        itemsCarrito,
        data.tipoConsumo,
        data.numeroMesa,
        data.observaciones
      );

      alert(
        `✅ Pedido manual creado!\nPedido: ${pedidoId}\nCliente: ${data.nombreCliente}`
      );

      setShowManualForm(false);
    } catch (error) {
      alert('Error al crear el pedido. Intenta de nuevo.');
    } finally {
      setIsSubmittingManual(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/admin');
  };

  return (
    <ProtectedRoute allowedRoles={[AdminRole.ADMIN]}>
      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="max-w-full mx-auto px-4 py-4 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">📊 Dashboard Administrativo</h1>
              <p className="text-gray-600 text-sm mt-1">
                Total de pedidos: <span className="font-bold">{pedidos.length}</span>
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowManualForm(true)}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded transition-colors"
              >
                ✍️ Captura Manual
              </button>
              <Link href="/admin/menu">
                <Button variant="primary" tamaño="sm">
                  🍽️ Gestionar Menú
                </Button>
              </Link>
              <Link href="/admin/cocina">
                <Button variant="primary" tamaño="sm">
                  👨‍🍳 Pantalla Cocina
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

        {/* Tablero Kanban */}
        <main className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {estados.map((estado) => {
              const pedidosEnEstado = pedidos.filter((p) => p.estado === estado);

              return (
                <div
                  key={estado}
                  className={`rounded-lg border-2 p-4 min-h-96 ${coloresColumnas[estado]}`}
                >
                  {/* Header de columna */}
                  <div className="mb-4">
                    <StatusBadge estado={estado} tamaño="lg" />
                    <p className="text-sm text-gray-600 mt-2 font-semibold">
                      {pedidosEnEstado.length} pedido{pedidosEnEstado.length !== 1 ? 's' : ''}
                    </p>
                  </div>

                  {/* Cards de pedidos */}
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {pedidosEnEstado.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">Sin pedidos</p>
                    ) : (
                      pedidosEnEstado.map((pedido) => (
                        <button
                          key={pedido.id}
                          onClick={() =>
                            setSelectedModal({ isOpen: true, pedidoId: pedido.id })
                          }
                          className="w-full text-left"
                        >
                          <OrderCard pedido={pedido} showItems={true} />
                        </button>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </main>

        {/* Modal de detalles y acciones */}
        {selectedModal.isOpen && pedidoSeleccionado && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-96 overflow-y-auto">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold">{pedidoSeleccionado.id}</h2>
                  <p className="text-gray-500 text-sm">
                    Creado:{' '}
                    {new Date(pedidoSeleccionado.createdAt).toLocaleString('es-MX')}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedModal({ isOpen: false })}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ✕
                </button>
              </div>

              {/* Información del pedido */}
              <div className="space-y-4 mb-6 pb-6 border-b">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Estado</p>
                    <StatusBadge estado={pedidoSeleccionado.estado} tamaño="md" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tipo de Consumo</p>
                    <p className="font-semibold">
                      {pedidoSeleccionado.tipoConsumo === 'mesa'
                        ? `🪑 Mesa ${pedidoSeleccionado.numeroMesa}`
                        : pedidoSeleccionado.tipoConsumo === 'para_llevar'
                          ? '🛍️ Para Llevar'
                          : '📦 Para Recoger'}
                    </p>
                  </div>
                </div>

                {/* Items */}
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-2">PRODUCTOS</p>
                  <div className="space-y-2">
                    {pedidoSeleccionado.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm bg-gray-50 p-2 rounded">
                        <span>
                          {item.cantidad}x {item.producto.nombre}
                        </span>
                        <span className="font-semibold">
                          ${item.producto.precio * item.cantidad}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total:</span>
                  <span>${pedidoSeleccionado.total}</span>
                </div>

                {/* Observaciones */}
                {pedidoSeleccionado.observacionesGenerales && (
                  <div>
                    <p className="text-sm font-semibold text-gray-600">
                      OBSERVACIONES
                    </p>
                    <p className="text-gray-700 italic">
                      {pedidoSeleccionado.observacionesGenerales}
                    </p>
                  </div>
                )}
              </div>

              {/* Acciones */}
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-600 mb-3">
                  CAMBIAR ESTADO
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {estados.map((estado) => (
                    pedidoSeleccionado.estado !== estado && (
                      <button
                        key={estado}
                        onClick={() =>
                          handleCambiarEstado(pedidoSeleccionado.id, estado)
                        }
                        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium transition-colors"
                      >
                        → {estado.charAt(0).toUpperCase() + estado.slice(1)}
                      </button>
                    )
                  ))}
                </div>

                {pedidoSeleccionado.estado !== EstadoPedido.CANCELADO && (
                  <Button
                    variant="danger"
                    className="w-full mt-4"
                    onClick={() => handleEliminarPedido(pedidoSeleccionado.id)}
                  >
                    Cancelar Pedido
                  </Button>
                )}

                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => setSelectedModal({ isOpen: false })}
                >
                  Cerrar
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Captura Manual */}
        {showManualForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="my-8">
              <button
                onClick={() => setShowManualForm(false)}
                className="absolute top-4 right-4 text-white bg-red-600 hover:bg-red-700 w-10 h-10 rounded-full flex items-center justify-center text-2xl z-50"
              >
                ✕
              </button>
              <ManualOrderForm
                onSubmit={handleSubmitManualOrder}
                isLoading={isSubmittingManual}
                onCancel={() => setShowManualForm(false)}
              />
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
