'use client';

import { useState } from 'react';
import { Producto, ItemCarrito } from '@/app/types';
import { useCarrito } from '@/app/context/CarritoContext';
import { calculateItemPricing } from '@/app/lib/orderPricing';

interface ProductDetailModalProps {
  producto: Producto;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductDetailModal({
  producto,
  isOpen,
  onClose,
}: ProductDetailModalProps) {
  const [cantidad, setCantidad] = useState(1);
  const [observaciones, setObservaciones] = useState('');
  const [ingredientesExtra, setIngredientesExtra] = useState<string[]>([]);
  const { agregarAlCarrito } = useCarrito();

  const draftItem: ItemCarrito = {
    id: 'draft',
    productoId: producto.id,
    producto,
    cantidad,
    observaciones: observaciones || undefined,
    ingredientesExtra: ingredientesExtra.length > 0 ? ingredientesExtra : undefined,
  };
  const pricing = calculateItemPricing(draftItem);

  const handleToggleIngrediente = (ingredId: string) => {
    setIngredientesExtra((prev) =>
      prev.includes(ingredId)
        ? prev.filter((id) => id !== ingredId)
        : [...prev, ingredId]
    );
  };

  const handleAgregarAlCarrito = () => {
    const item: ItemCarrito = {
      id: `${producto.id}-${Date.now()}`,
      productoId: producto.id,
      producto,
      cantidad,
      observaciones: observaciones || undefined,
      ingredientesExtra: ingredientesExtra.length > 0 ? ingredientesExtra : undefined,
    };

    agregarAlCarrito(item);
    onClose();
    setCantidad(1);
    setObservaciones('');
    setIngredientesExtra([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-lg md:p-8">
        <div className="mb-6">
          <button
            onClick={onClose}
            className="float-right text-2xl text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
          {producto.imagen && (
            <img
              src={producto.imagen}
              alt={producto.nombre}
              className="mb-4 h-52 w-full rounded object-cover"
            />
          )}
          <h2 className="text-3xl font-bold text-gray-800">{producto.nombre}</h2>
          <p className="mt-2 text-gray-600">{producto.descripcion}</p>
          <p className="mt-2 text-xl font-semibold text-blue-600">
            ${producto.precio.toFixed(0)}
          </p>
        </div>

        {/* Ingredientes Extra */}
        {producto.ingredientes && producto.ingredientes.length > 0 && (
          <div className="mb-6">
            <h3 className="mb-4 text-lg font-bold text-gray-800">
              Ingredientes Extra 🧀
            </h3>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {producto.ingredientes.map((ingrediente) => (
                <label
                  key={ingrediente.id}
                  className="flex cursor-pointer items-center rounded border border-gray-300 p-3 hover:bg-blue-50"
                >
                  <input
                    type="checkbox"
                    checked={ingredientesExtra.includes(ingrediente.id)}
                    onChange={() => handleToggleIngrediente(ingrediente.id)}
                    className="h-5 w-5 text-blue-600"
                  />
                  <span className="ml-3 flex-1 text-gray-700">
                    {ingrediente.nombre}
                  </span>
                  {ingrediente.precio && (
                    <span className="text-sm font-semibold text-green-600">
                      +${ingrediente.precio}
                    </span>
                  )}
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Observaciones */}
        <div className="mb-6">
          <label className="block text-lg font-bold text-gray-800">
            Observaciones 📝
          </label>
          <textarea
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            placeholder="Ej: Sin cebolla, picante, cocción especial..."
            className="mt-3 w-full rounded border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
            rows={3}
          />
        </div>

        {/* Cantidad */}
        <div className="mb-6 flex items-center gap-4">
          <label className="text-lg font-bold text-gray-800">Cantidad:</label>
          <div className="flex items-center rounded border border-gray-300">
            <button
              onClick={() => setCantidad(Math.max(1, cantidad - 1))}
              className="px-3 py-2 text-xl font-bold text-gray-600 hover:bg-gray-100"
            >
              −
            </button>
            <input
              type="number"
              value={cantidad}
              onChange={(e) => setCantidad(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-16 border-l border-r border-gray-300 py-2 text-center text-lg font-bold"
              min="1"
            />
            <button
              onClick={() => setCantidad(cantidad + 1)}
              className="px-3 py-2 text-xl font-bold text-gray-600 hover:bg-gray-100"
            >
              +
            </button>
          </div>
        </div>

        {/* Resumen de precio */}
        <div className="mb-6 rounded-lg bg-gray-100 p-4">
          <div className="flex justify-between text-gray-700">
            <span>Producto:</span>
            <span>${pricing.lineSubtotal.toFixed(0)}</span>
          </div>
          {pricing.extrasUnitPrice > 0 && (
            <div className="flex justify-between text-gray-700">
              <span>Ingredientes Extra:</span>
            <span>${(pricing.extrasUnitPrice * cantidad).toFixed(0)}</span>
            </div>
          )}
          <div className="mt-2 border-t border-gray-300 pt-2">
            <div className="flex justify-between text-xl font-bold text-gray-800">
              <span>Total:</span>
            <span className="text-green-600">${pricing.lineTotal.toFixed(0)}</span>
            </div>
          </div>
        </div>

        {/* Botones */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded bg-gray-300 px-4 py-3 font-bold text-gray-800 hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            onClick={handleAgregarAlCarrito}
            className="flex-1 rounded bg-green-600 px-4 py-3 font-bold text-white hover:bg-green-700"
          >
            Agregar al Carrito
          </button>
        </div>
      </div>
    </div>
  );
}
