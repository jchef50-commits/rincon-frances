// Servicio de almacenamiento en localStorage

import { CarritoState, Pedido } from '@/app/types';

const STORAGE_KEYS = {
  CARRITO: 'rincon_carrito',
  PEDIDOS: 'rincon_pedidos',
  MENU: 'rincon_menu',
};

export const storageService = {
  // Genérico
  getItem: (key: string) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (_e) {
      console.error(`Error obteniendo ${key}:`, _e);
      return null;
    }
  },

  setItem: (key: string, value: unknown) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (_e) {
      console.error(`Error guardando ${key}:`, _e);
    }
  },

  // Carrito
  guardarCarrito: (carrito: CarritoState) => {
    try {
      localStorage.setItem(STORAGE_KEYS.CARRITO, JSON.stringify(carrito));
    } catch (_e) {
      console.error('Error guardando carrito:', _e);
    }
  },

  obtenerCarrito: () => {
    try {
      const carrito = localStorage.getItem(STORAGE_KEYS.CARRITO);
      return carrito ? JSON.parse(carrito) : null;
    } catch (_e) {
      console.error('Error obteniendo carrito:', _e);
      return null;
    }
  },

  limpiarCarrito: () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.CARRITO);
    } catch (_e) {
      console.error('Error limpiando carrito:', _e);
    }
  },

  // Pedidos
  guardarPedidos: (pedidos: Pedido[]) => {
    try {
      localStorage.setItem(STORAGE_KEYS.PEDIDOS, JSON.stringify(pedidos));
    } catch (_e) {
      console.error('Error guardando pedidos:', _e);
    }
  },

  obtenerPedidos: () => {
    try {
      const pedidos = localStorage.getItem(STORAGE_KEYS.PEDIDOS);
      return pedidos ? JSON.parse(pedidos) : null;
    } catch (_e) {
      console.error('Error obteniendo pedidos:', _e);
      return null;
    }
  },

  limpiarPedidos: () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.PEDIDOS);
    } catch (_e) {
      console.error('Error limpiando pedidos:', _e);
    }
  },
};
