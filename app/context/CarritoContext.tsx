'use client';

import React, { createContext, useState, useCallback, useEffect } from 'react';
import { ItemCarrito, CarritoState, TipoConsumo } from '@/app/types';
import { obtenerProductoPorId } from '@/app/data/menu';
import { storageService } from '@/app/utils/storageService';

interface CarritoContextType extends CarritoState {
  agregarProducto: (productoId: number, cantidad: number, observaciones?: string) => void;
  agregarAlCarrito: (item: ItemCarrito) => void;
  eliminarProducto: (itemId: string) => void;
  actualizarCantidad: (itemId: string, cantidad: number) => void;
  actualizarObservaciones: (itemId: string, observaciones: string) => void;
  setTipoConsumo: (tipo: TipoConsumo) => void;
  setNumeroMesa: (numero: number) => void;
  setObservacionesGenerales: (obs: string) => void;
  limpiarCarrito: () => void;
  obtenerTotal: () => number;
  obtenerSubtotal: () => number;
}

const CarritoContext = createContext<CarritoContextType | undefined>(undefined);

export function CarritoProvider({ children }: { children: React.ReactNode }) {
  const [carrito, setCarrito] = useState<CarritoState>(() => {
    if (typeof window === 'undefined') {
      return {
        items: [],
        tipoConsumo: null,
        numeroMesa: undefined,
        observacionesGenerales: undefined,
      };
    }
    const carritoGuardado = storageService.obtenerCarrito();
    if (carritoGuardado) {
      return carritoGuardado;
    }
    return {
      items: [],
      tipoConsumo: null,
      numeroMesa: undefined,
      observacionesGenerales: undefined,
    };
  });
  
  const [isHydrated, setIsHydrated] = useState(false);

  // Marcar como hidratado después del montaje
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    if (isHydrated) {
      storageService.guardarCarrito(carrito);
    }
  }, [carrito, isHydrated]);

  const agregarProducto = useCallback(
    (productoId: number, cantidad: number, observaciones?: string) => {
      const producto = obtenerProductoPorId(productoId);
      if (!producto) return;

      setCarrito((prev) => {
        const existente = prev.items.find((item) => item.productoId === productoId);

        if (existente) {
          return {
            ...prev,
            items: prev.items.map((item) =>
              item.productoId === productoId
                ? { ...item, cantidad: item.cantidad + cantidad, observaciones }
                : item
            ),
          };
        }

        const nuevoItem: ItemCarrito = {
          id: `${productoId}-${Date.now()}`,
          productoId,
          producto,
          cantidad,
          observaciones,
        };

        return { ...prev, items: [...prev.items, nuevoItem] };
      });
    },
    []
  );

  const agregarAlCarrito = useCallback((item: ItemCarrito) => {
    setCarrito((prev) => ({
      ...prev,
      items: [...prev.items, item],
    }));
  }, []);

  const eliminarProducto = useCallback((itemId: string) => {
    setCarrito((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== itemId),
    }));
  }, []);

  const actualizarCantidad = useCallback((itemId: string, cantidad: number) => {
    if (cantidad <= 0) {
      eliminarProducto(itemId);
      return;
    }

    setCarrito((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === itemId ? { ...item, cantidad } : item
      ),
    }));
  }, [eliminarProducto]);

  const actualizarObservaciones = useCallback((itemId: string, observaciones: string) => {
    setCarrito((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === itemId ? { ...item, observaciones } : item
      ),
    }));
  }, []);

  const setTipoConsumoHandler = useCallback((tipo: TipoConsumo) => {
    setCarrito((prev) => ({ ...prev, tipoConsumo: tipo }));
  }, []);

  const setNumeroMesaHandler = useCallback((numero: number) => {
    setCarrito((prev) => ({ ...prev, numeroMesa: numero }));
  }, []);

  const setObservacionesGeneralesHandler = useCallback((obs: string) => {
    setCarrito((prev) => ({ ...prev, observacionesGenerales: obs }));
  }, []);

  const limpiarCarrito = useCallback(() => {
    setCarrito({
      items: [],
      tipoConsumo: null,
      numeroMesa: undefined,
      observacionesGenerales: undefined,
    });
  }, []);

  const obtenerSubtotal = useCallback(() => {
    return carrito.items.reduce((total, item) => {
      const precioProducto = item.producto.precio * item.cantidad;
      const precioIngredientes = (item.ingredientesExtra || []).reduce((sum, ingredId) => {
        const ingrediente = item.producto.ingredientes?.find((i) => i.id === ingredId);
        return sum + ((ingrediente?.precio || 0) * item.cantidad);
      }, 0);
      return total + precioProducto + precioIngredientes;
    }, 0);
  }, [carrito.items]);

  const obtenerTotal = useCallback(() => {
    return obtenerSubtotal();
  }, [obtenerSubtotal]);

  const value: CarritoContextType = {
    ...carrito,
    agregarProducto,
    agregarAlCarrito,
    eliminarProducto,
    actualizarCantidad,
    actualizarObservaciones,
    setTipoConsumo: setTipoConsumoHandler,
    setNumeroMesa: setNumeroMesaHandler,
    setObservacionesGenerales: setObservacionesGeneralesHandler,
    limpiarCarrito,
    obtenerTotal,
    obtenerSubtotal,
  };

  return <CarritoContext.Provider value={value}>{children}</CarritoContext.Provider>;
}

export function useCarrito(): CarritoContextType {
  const context = React.useContext(CarritoContext);
  if (!context) {
    throw new Error('useCarrito debe usarse dentro de CarritoProvider');
  }
  return context;
}
