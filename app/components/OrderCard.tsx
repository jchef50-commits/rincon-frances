'use client';

import { Pedido } from '@/app/types';
import { StatusBadge } from './StatusBadge';
import { TipoConsumo } from '@/app/types';

interface OrderCardProps {
  pedido: Pedido;
  onClick?: () => void;
  showItems?: boolean;
}

const tipoConsumoEmoji = {
  [TipoConsumo.MESA]: '🪑',
  [TipoConsumo.PARA_LLEVAR]: '🛍️',
  [TipoConsumo.PARA_RECOGER]: '📦',
};

export function OrderCard({ pedido, onClick, showItems = false }: OrderCardProps) {
  return (
    <div
      onClick={onClick}
      className={`p-4 border rounded-lg bg-white ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold text-lg">{pedido.id}</h3>
          <p className="text-sm text-gray-500">
            {new Date(pedido.createdAt).toLocaleTimeString('es-MX', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
        <StatusBadge estado={pedido.estado} tamaño="md" />
      </div>

      <div className="flex gap-2 mb-2 text-sm text-gray-600">
        <span>{tipoConsumoEmoji[pedido.tipoConsumo]}</span>
        {pedido.numeroMesa && <span>Mesa {pedido.numeroMesa}</span>}
      </div>

      {showItems && pedido.items.length > 0 && (
        <div className="mb-3 py-2 border-t border-b text-sm">
          {pedido.items.slice(0, 3).map((item) => (
            <p key={item.id} className="text-gray-700">
              • {item.cantidad}x {item.producto.nombre}
            </p>
          ))}
          {pedido.items.length > 3 && (
            <p className="text-gray-500 italic">+{pedido.items.length - 3} más</p>
          )}
        </div>
      )}

      <div className="text-right">
        <p className="font-bold text-lg">${pedido.total}</p>
      </div>
    </div>
  );
}
