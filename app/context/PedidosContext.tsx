'use client';

import React, { createContext, useState, useCallback, useEffect } from 'react';
import { Pedido, EstadoPedido, TipoConsumo, ItemCarrito } from '@/app/types';
import { storageService } from '@/app/utils/storageService';

interface PedidosContextType {
  pedidos: Pedido[];
  agregarPedido: (
    items: ItemCarrito[],
    tipoConsumo: TipoConsumo,
    numeroMesa?: number,
    observacionesGenerales?: string
  ) => string;
  cambiarEstadoPedido: (pedidoId: string, nuevoEstado: EstadoPedido) => void;
  obtenerPedidoPorId: (pedidoId: string) => Pedido | undefined;
  obtenerPedidosPorEstado: (estado: EstadoPedido) => Pedido[];
  cancelarPedido: (pedidoId: string) => void;
}

const PedidosContext = createContext<PedidosContextType | undefined>(undefined);

// Mock data para demo
const generarPedidosMock = (): Pedido[] => {
  const ahora = new Date();
  return [
    {
      id: 'PED-001',
      items: [],
      estado: EstadoPedido.PENDIENTE,
      tipoConsumo: TipoConsumo.MESA,
      numeroMesa: 1,
      subtotal: 0,
      total: 0,
      createdAt: new Date(ahora.getTime() - 30 * 60000),
      updatedAt: new Date(ahora.getTime() - 30 * 60000),
    },
    {
      id: 'PED-002',
      items: [],
      estado: EstadoPedido.PREPARANDO,
      tipoConsumo: TipoConsumo.MESA,
      numeroMesa: 3,
      subtotal: 0,
      total: 0,
      createdAt: new Date(ahora.getTime() - 20 * 60000),
      updatedAt: new Date(ahora.getTime() - 20 * 60000),
    },
    {
      id: 'PED-003',
      items: [],
      estado: EstadoPedido.LISTO,
      tipoConsumo: TipoConsumo.PARA_LLEVAR,
      subtotal: 0,
      total: 0,
      createdAt: new Date(ahora.getTime() - 10 * 60000),
      updatedAt: new Date(ahora.getTime() - 10 * 60000),
    },
  ];
};

export function PedidosProvider({ children }: { children: React.ReactNode }) {
  const [pedidos, setPedidos] = useState<Pedido[]>(() => {
    if (typeof window === 'undefined') {
      return generarPedidosMock();
    }
    const pedidosGuardados = storageService.obtenerPedidos();
    if (pedidosGuardados && Array.isArray(pedidosGuardados)) {
      return [...generarPedidosMock(), ...pedidosGuardados];
    }
    return generarPedidosMock();
  });
  const [isHydrated, setIsHydrated] = useState(false);

  // Marcar como hidratado después del montaje
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Guardar pedidos en localStorage cuando cambien
  useEffect(() => {
    if (isHydrated) {
      // Guardar solo los nuevos pedidos (excluir mock data)
      const nuevosPedidos = pedidos.slice(3);
      storageService.guardarPedidos(nuevosPedidos);
    }
  }, [pedidos, isHydrated]);

  const agregarPedido = useCallback(
    (
      items: ItemCarrito[],
      tipoConsumo: TipoConsumo,
      numeroMesa?: number,
      observacionesGenerales?: string
    ): string => {
      const subtotal = items.reduce((total, item) => total + item.producto.precio * item.cantidad, 0);

      const nuevoPedido: Pedido = {
        id: `PED-${String(pedidos.length + 1).padStart(3, '0')}`,
        items,
        estado: EstadoPedido.PENDIENTE,
        tipoConsumo,
        numeroMesa,
        observacionesGenerales,
        subtotal,
        total: subtotal,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setPedidos((prev) => [...prev, nuevoPedido]);
      return nuevoPedido.id;
    },
    [pedidos.length]
  );

  const cambiarEstadoPedido = useCallback((pedidoId: string, nuevoEstado: EstadoPedido) => {
    setPedidos((prev) =>
      prev.map((pedido) =>
        pedido.id === pedidoId
          ? { ...pedido, estado: nuevoEstado, updatedAt: new Date() }
          : pedido
      )
    );
  }, []);

  const obtenerPedidoPorId = useCallback(
    (pedidoId: string): Pedido | undefined => {
      return pedidos.find((p) => p.id === pedidoId);
    },
    [pedidos]
  );

  const obtenerPedidosPorEstado = useCallback(
    (estado: EstadoPedido): Pedido[] => {
      return pedidos.filter((p) => p.estado === estado);
    },
    [pedidos]
  );

  const cancelarPedido = useCallback((pedidoId: string) => {
    cambiarEstadoPedido(pedidoId, EstadoPedido.CANCELADO);
  }, [cambiarEstadoPedido]);

  const value: PedidosContextType = {
    pedidos,
    agregarPedido,
    cambiarEstadoPedido,
    obtenerPedidoPorId,
    obtenerPedidosPorEstado,
    cancelarPedido,
  };

  return <PedidosContext.Provider value={value}>{children}</PedidosContext.Provider>;
}

export function usePedidos(): PedidosContextType {
  const context = React.useContext(PedidosContext);
  if (!context) {
    throw new Error('usePedidos debe usarse dentro de PedidosProvider');
  }
  return context;
}
