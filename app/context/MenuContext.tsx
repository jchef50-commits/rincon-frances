'use client';

import React, { createContext, useState, useCallback, useEffect } from 'react';
import { Producto, Ingrediente, Categoria } from '@/app/types';
import { menuProductos as productosIniciales } from '@/app/data/menu';
import { storageService } from '@/app/utils/storageService';

interface MenuContextType {
  productos: Producto[];
  agregarProducto: (producto: Producto) => void;
  editarProducto: (id: number, producto: Partial<Producto>) => void;
  eliminarProducto: (id: number) => void;
  actualizarPrecio: (id: number, nuevoPrecio: number) => void;
  agregarIngrediente: (productoId: number, ingrediente: Ingrediente) => void;
  eliminarIngrediente: (productoId: number, ingredienteId: string) => void;
  obtenerProductoPorId: (id: number) => Producto | undefined;
  resetearMenu: () => void;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export function MenuProvider({ children }: { children: React.ReactNode }) {
  const [productos, setProductos] = useState<Producto[]>(() => {
    if (typeof window === 'undefined') {
      return productosIniciales;
    }
    const guardados = storageService.getItem('menu_productos');
    if (guardados) {
      try {
        return JSON.parse(guardados);
      } catch {
        return productosIniciales;
      }
    }
    return productosIniciales;
  });

  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      storageService.setItem('menu_productos', JSON.stringify(productos));
    }
  }, [productos, isHydrated]);

  const agregarProducto = useCallback((producto: Producto) => {
    const nuevoId =
      Math.max(...productos.map((p) => p.id), 0) + 1;
    const nuevoProducto = { ...producto, id: nuevoId };
    setProductos((prev) => [...prev, nuevoProducto]);
  }, [productos]);

  const editarProducto = useCallback(
    (id: number, actualizaciones: Partial<Producto>) => {
      setProductos((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, ...actualizaciones } : p
        )
      );
    },
    []
  );

  const eliminarProducto = useCallback((id: number) => {
    setProductos((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const actualizarPrecio = useCallback((id: number, nuevoPrecio: number) => {
    setProductos((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, precio: nuevoPrecio } : p
      )
    );
  }, []);

  const agregarIngrediente = useCallback(
    (productoId: number, ingrediente: Ingrediente) => {
      setProductos((prev) =>
        prev.map((p) =>
          p.id === productoId
            ? {
                ...p,
                ingredientes: [
                  ...(p.ingredientes || []),
                  { ...ingrediente, id: `${productoId}-${Date.now()}` },
                ],
              }
            : p
        )
      );
    },
    []
  );

  const eliminarIngrediente = useCallback(
    (productoId: number, ingredienteId: string) => {
      setProductos((prev) =>
        prev.map((p) =>
          p.id === productoId
            ? {
                ...p,
                ingredientes: (p.ingredientes || []).filter(
                  (i) => i.id !== ingredienteId
                ),
              }
            : p
        )
      );
    },
    []
  );

  const obtenerProductoPorId = useCallback(
    (id: number) => {
      return productos.find((p) => p.id === id);
    },
    [productos]
  );

  const resetearMenu = useCallback(() => {
    setProductos(productosIniciales);
  }, []);

  const value: MenuContextType = {
    productos,
    agregarProducto,
    editarProducto,
    eliminarProducto,
    actualizarPrecio,
    agregarIngrediente,
    eliminarIngrediente,
    obtenerProductoPorId,
    resetearMenu,
  };

  return (
    <MenuContext.Provider value={value}>{children}</MenuContext.Provider>
  );
}

export function useMenu(): MenuContextType {
  const context = React.useContext(MenuContext);
  if (!context) {
    throw new Error('useMenu debe usarse dentro de MenuProvider');
  }
  return context;
}
