'use client';

import { useCarrito } from '@/app/context/CarritoContext';
import { CartItem } from './CartItem';
import { Input } from './Input';
import { Button } from './Button';

interface CartSummaryProps {
  onConfirmar?: () => void;
  isConfirmLoading?: boolean;
}

export function CartSummary({ onConfirmar, isConfirmLoading = false }: CartSummaryProps) {
  const { items, obtenerSubtotal, obtenerTotal, observacionesGenerales, setObservacionesGenerales, actualizarCantidad, eliminarProducto, actualizarObservaciones } = useCarrito();

  const subtotal = obtenerSubtotal();
  const total = obtenerTotal();

  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 animate-fadeIn">
        <p className="text-lg">🛒 Tu carrito está vacío</p>
        <p className="text-sm mt-1">Agrega productos para comenzar</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-slideInDown">
      <div className="space-y-3 max-h-96 overflow-y-auto border rounded p-4 bg-gray-50">
        {items.map((item, index) => (
          <div key={item.id} style={{ animationDelay: `${index * 50}ms` }} className="animate-slideInDown">
            <CartItem
              item={item}
              onActualizarCantidad={(cantidad) => actualizarCantidad(item.id, cantidad)}
              onEliminar={() => eliminarProducto(item.id)}
            />
          </div>
        ))}
      </div>

      <Input
        label="Observaciones especiales (opcional)"
        placeholder="Ej: Sin picante, sin lactosa, etc."
        value={observacionesGenerales || ''}
        onChange={(e) => setObservacionesGenerales(e.target.value)}
      />

      <div className="border-t-2 pt-4 space-y-2">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal:</span>
          <span className="font-medium">${subtotal}</span>
        </div>
        <div className="flex justify-between text-lg font-bold bg-gradient-to-r from-green-50 to-blue-50 p-3 rounded">
          <span>Total:</span>
          <span className="text-green-600">${total}</span>
        </div>
      </div>

      <Button
        onClick={onConfirmar}
        isLoading={isConfirmLoading}
        className="w-full hover-lift"
        tamaño="lg"
      >
        ✅ Confirmar Pedido
      </Button>
    </div>
  );
}
