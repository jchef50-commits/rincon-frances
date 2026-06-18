'use client';

import { EstadoPedido } from '@/app/types';

interface StatusBadgeProps {
  estado: EstadoPedido;
  tamaño?: 'sm' | 'md' | 'lg';
}

const colorMap: Record<EstadoPedido, { bg: string; text: string }> = {
  [EstadoPedido.PENDIENTE]: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  [EstadoPedido.PREPARANDO]: { bg: 'bg-blue-100', text: 'text-blue-800' },
  [EstadoPedido.LISTO]: { bg: 'bg-green-100', text: 'text-green-800' },
  [EstadoPedido.ENTREGADO]: { bg: 'bg-gray-100', text: 'text-gray-800' },
  [EstadoPedido.CANCELADO]: { bg: 'bg-red-100', text: 'text-red-800' },
};

const etiquetas: Record<EstadoPedido, string> = {
  [EstadoPedido.PENDIENTE]: 'Pendiente',
  [EstadoPedido.PREPARANDO]: 'Preparando',
  [EstadoPedido.LISTO]: 'Listo',
  [EstadoPedido.ENTREGADO]: 'Entregado',
  [EstadoPedido.CANCELADO]: 'Cancelado',
};

const tamaños = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
  lg: 'px-4 py-2 text-base',
};

export function StatusBadge({ estado, tamaño = 'md' }: StatusBadgeProps) {
  const { bg, text } = colorMap[estado];

  return (
    <span className={`${bg} ${text} ${tamaños[tamaño]} rounded-full font-medium inline-block`}>
      {etiquetas[estado]}
    </span>
  );
}
