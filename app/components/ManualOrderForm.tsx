'use client';

import React, { useState } from 'react';
import { Producto, TipoConsumo } from '@/app/types';
import { menuProductos } from '@/app/data/menu';
import { Button, Input } from '@/app/components';

interface ManualOrderItem {
  productoId: number;
  cantidad: number;
}

interface ManualOrderFormProps {
  onSubmit: (data: {
    nombreCliente: string;
    items: ManualOrderItem[];
    tipoConsumo: TipoConsumo;
    numeroMesa?: number;
    observaciones?: string;
  }) => void;
  isLoading?: boolean;
  onCancel?: () => void;
}

export function ManualOrderForm({
  onSubmit,
  isLoading = false,
  onCancel,
}: ManualOrderFormProps) {
  const [nombreCliente, setNombreCliente] = useState('');
  const [tipoConsumo, setTipoConsumo] = useState<TipoConsumo | null>(null);
  const [numeroMesa, setNumeroMesa] = useState<number>();
  const [observaciones, setObservaciones] = useState('');
  const [items, setItems] = useState<ManualOrderItem[]>([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState<number | null>(null);
  const [cantidadProducto, setCantidadProducto] = useState(1);

  const handleAgregarProducto = () => {
    if (!productoSeleccionado || cantidadProducto <= 0) return;

    setItems((prev) => {
      const existente = prev.find((item) => item.productoId === productoSeleccionado);
      if (existente) {
        return prev.map((item) =>
          item.productoId === productoSeleccionado
            ? { ...item, cantidad: item.cantidad + cantidadProducto }
            : item
        );
      }
      return [...prev, { productoId: productoSeleccionado, cantidad: cantidadProducto }];
    });

    setCantidadProducto(1);
    setProductoSeleccionado(null);
  };

  const handleEliminarProducto = (productoId: number) => {
    setItems((prev) => prev.filter((item) => item.productoId !== productoId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombreCliente.trim()) {
      alert('Por favor ingresa el nombre del cliente');
      return;
    }

    if (items.length === 0) {
      alert('Por favor agrega al menos un producto');
      return;
    }

    if (!tipoConsumo) {
      alert('Por favor selecciona el tipo de consumo');
      return;
    }

    if (tipoConsumo === TipoConsumo.MESA && !numeroMesa) {
      alert('Por favor ingresa el número de mesa');
      return;
    }

    onSubmit({
      nombreCliente,
      items,
      tipoConsumo,
      numeroMesa,
      observaciones,
    });
  };

  const productoSeleccionadoData = productoSeleccionado
    ? menuProductos.find((p) => p.id === productoSeleccionado)
    : null;

  const totalPedido = items.reduce((total, item) => {
    const producto = menuProductos.find((p) => p.id === item.productoId);
    return total + (producto?.precio || 0) * item.cantidad;
  }, 0);

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg"
    >
      <h2 className="text-2xl font-bold mb-6">✍️ Crear Pedido Manual</h2>

      {/* Nombre del cliente */}
      <Input
        label="Nombre del Cliente"
        placeholder="Ej: Juan García"
        value={nombreCliente}
        onChange={(e) => setNombreCliente(e.target.value)}
        required
      />

      {/* Tipo de Consumo */}
      <div>
        <label className="text-sm font-medium block mb-2">Tipo de Consumo</label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { valor: TipoConsumo.MESA, label: '🪑 Mesa' },
            { valor: TipoConsumo.PARA_LLEVAR, label: '🛍️ Llevar' },
            { valor: TipoConsumo.PARA_RECOGER, label: '📦 Recoger' },
          ].map((opcion) => (
            <button
              key={opcion.valor}
              type="button"
              onClick={() => setTipoConsumo(opcion.valor)}
              className={`p-3 rounded-lg border-2 transition-all ${
                tipoConsumo === opcion.valor
                  ? 'border-black bg-black text-white'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {opcion.label}
            </button>
          ))}
        </div>
      </div>

      {/* Número de mesa */}
      {tipoConsumo === TipoConsumo.MESA && (
        <Input
          label="Número de Mesa"
          type="number"
          min="1"
          max="30"
          value={numeroMesa || ''}
          onChange={(e) => setNumeroMesa(parseInt(e.target.value) || undefined)}
          required
        />
      )}

      {/* Seleccionar y agregar productos */}
      <div className="border-t pt-6">
        <h3 className="font-bold mb-4">Agregar Productos</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm font-medium block mb-2">Producto</label>
            <select
              value={productoSeleccionado || ''}
              onChange={(e) => setProductoSeleccionado(parseInt(e.target.value) || null)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">-- Selecciona un producto --</option>
              {menuProductos.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre} (${p.precio})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium block mb-2">Cantidad</label>
            <div className="flex gap-2">
              <input
                type="number"
                min="1"
                value={cantidadProducto}
                onChange={(e) => setCantidadProducto(Math.max(1, parseInt(e.target.value) || 1))}
                className="flex-1 border rounded px-3 py-2"
              />
              <Button
                type="button"
                onClick={handleAgregarProducto}
                disabled={!productoSeleccionado || cantidadProducto <= 0}
                tamaño="sm"
              >
                ➕ Agregar
              </Button>
            </div>
          </div>
        </div>

        {/* Lista de productos agregados */}
        {items.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <p className="font-semibold mb-3">Productos del Pedido:</p>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {items.map((item) => {
                const producto = menuProductos.find((p) => p.id === item.productoId);
                return (
                  <div
                    key={item.productoId}
                    className="flex justify-between items-center bg-white p-2 rounded border"
                  >
                    <span>
                      {item.cantidad}x {producto?.nombre} (${producto?.precio})
                    </span>
                    <button
                      type="button"
                      onClick={() => handleEliminarProducto(item.productoId)}
                      className="text-red-600 hover:text-red-800 text-sm font-bold"
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 pt-3 border-t font-bold text-lg">
              Total: ${totalPedido}
            </div>
          </div>
        )}
      </div>

      {/* Observaciones */}
      <div>
        <label className="text-sm font-medium block mb-2">Observaciones (opcional)</label>
        <textarea
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
          placeholder="Ej: Sin picante, sin lactosa..."
          className="w-full border rounded px-3 py-2 h-20 resize-none"
        />
      </div>

      {/* Botones */}
      <div className="flex gap-2 pt-4 border-t">
        <Button
          type="submit"
          isLoading={isLoading}
          className="flex-1"
          tamaño="lg"
        >
          ✅ Confirmar Pedido
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            className="flex-1"
            tamaño="lg"
          >
            ✕ Cancelar
          </Button>
        )}
      </div>
    </form>
  );
}
