'use client';

import { ItemCarrito } from '@/app/types';
import { calculateItemPricing } from '@/app/lib/orderPricing';

interface CartItemProps {
  item: ItemCarrito;
  onActualizarCantidad: (cantidad: number) => void;
  onEliminar: () => void;
}

export function CartItem({ item, onActualizarCantidad, onEliminar }: CartItemProps) {
  const pricing = calculateItemPricing(item);

  return (
    <div className="flex gap-4 border-b pb-4 last:border-b-0">
      <div className="flex-1">
        <h4 className="font-semibold">{item.producto.nombre}</h4>
        {item.observaciones && (
          <p className="text-sm text-gray-600 italic">Nota: {item.observaciones}</p>
        )}
        <p className="text-sm text-gray-500">
          ${pricing.unitPrice} x {item.cantidad} = ${pricing.lineTotal}
        </p>
      </div>

      <div className="flex gap-2 items-center">
        <div className="flex border rounded-md">
          <button
            onClick={() => onActualizarCantidad(Math.max(1, item.cantidad - 1))}
            className="px-2 py-1 text-gray-600 hover:bg-gray-100"
          >
            −
          </button>
          <span className="px-3 py-1 text-sm">{item.cantidad}</span>
          <button
            onClick={() => onActualizarCantidad(item.cantidad + 1)}
            className="px-2 py-1 text-gray-600 hover:bg-gray-100"
          >
            +
          </button>
        </div>

        <button
          onClick={onEliminar}
          className="text-red-600 hover:text-red-800 text-sm font-medium px-2"
        >
          Quitar
        </button>
      </div>
    </div>
  );
}
