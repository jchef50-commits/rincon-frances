'use client';

import React, { createContext, useState, useCallback, useEffect } from 'react';
import { Pedido, EstadoPedido, TipoConsumo, ItemCarrito } from '@/app/types';
import { storageService } from '@/app/utils/storageService';
import { hasFirebaseConfig } from '@/app/lib/firebase';
import { attachPricingToItems, calculateOrderTotal } from '@/app/lib/orderPricing';
import { ensureAnonymousClientUid } from '@/app/lib/clientIdentity';
import {
  actualizarEstadoPedidoFirestore,
  guardarPedidoFirestore,
  subscribeToPedidos,
} from '@/app/lib/pedidosFirestore';

interface PedidosContextType {
  pedidos: Pedido[];
  agregarPedido: (
    items: ItemCarrito[],
    tipoConsumo: TipoConsumo,
    numeroMesa?: number,
    observacionesGenerales?: string
  ) => Promise<string>;
  cambiarEstadoPedido: (pedidoId: string, nuevoEstado: EstadoPedido) => Promise<void>;
  obtenerPedidoPorId: (pedidoId: string) => Pedido | undefined;
  obtenerPedidosPorEstado: (estado: EstadoPedido) => Pedido[];
  cancelarPedido: (pedidoId: string) => Promise<void>;
}

const PedidosContext = createContext<PedidosContextType | undefined>(undefined);

const normalizarPedido = (pedido: Pedido): Pedido => ({
  ...pedido,
  createdAt: new Date(pedido.createdAt),
  updatedAt: new Date(pedido.updatedAt),
});

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
    if (hasFirebaseConfig) {
      return [];
    }

    if (typeof window === 'undefined') {
      return generarPedidosMock();
    }
    const pedidosGuardados = storageService.obtenerPedidos();
    if (pedidosGuardados && Array.isArray(pedidosGuardados)) {
      return [...generarPedidosMock(), ...pedidosGuardados.map(normalizarPedido)];
    }
    return generarPedidosMock();
  });

  useEffect(() => {
    if (!hasFirebaseConfig) {
      return;
    }

    return subscribeToPedidos(
      (pedidosFirestore) => {
        setPedidos(pedidosFirestore);
      },
      (error) => {
        console.error('Error sincronizando pedidos con Firebase:', error);
      }
    );
  }, []);

  // Guardar pedidos en localStorage cuando cambien
  useEffect(() => {
    if (!hasFirebaseConfig && typeof window !== 'undefined') {
      // Guardar solo los nuevos pedidos (excluir mock data)
      const nuevosPedidos = pedidos.slice(3);
      storageService.guardarPedidos(nuevosPedidos);
    }
  }, [pedidos]);

  const agregarPedido = useCallback(
    async (
      items: ItemCarrito[],
      tipoConsumo: TipoConsumo,
      numeroMesa?: number,
      observacionesGenerales?: string
    ): Promise<string> => {
      const uidCliente = await ensureAnonymousClientUid();
      const itemsConPrecio = attachPricingToItems(items);
      const { subtotal, total } = calculateOrderTotal(itemsConPrecio);
      const now = new Date();
      const pedidoId = `PED-${now.getTime().toString().slice(-6)}`;

      const nuevoPedido: Pedido = {
        id: pedidoId,
        uidCliente,
        items: itemsConPrecio,
        estado: EstadoPedido.PENDIENTE,
        tipoConsumo,
        numeroMesa,
        observacionesGenerales,
        subtotal,
        total,
        createdAt: now,
        updatedAt: now,
      };

      if (hasFirebaseConfig) {
        await guardarPedidoFirestore(nuevoPedido);
      } else {
        setPedidos((prev) => [...prev, nuevoPedido]);
      }

      return pedidoId;
    },
    []
  );

  const cambiarEstadoPedido = useCallback(async (pedidoId: string, nuevoEstado: EstadoPedido) => {
    if (hasFirebaseConfig) {
      await actualizarEstadoPedidoFirestore(pedidoId, nuevoEstado);
      return;
    }

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

  const cancelarPedido = useCallback(async (pedidoId: string) => {
    await cambiarEstadoPedido(pedidoId, EstadoPedido.CANCELADO);
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
