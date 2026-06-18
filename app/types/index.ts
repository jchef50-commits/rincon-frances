// Enums
export enum EstadoPedido {
  PENDIENTE = 'pendiente',
  PREPARANDO = 'preparando',
  LISTO = 'listo',
  ENTREGADO = 'entregado',
  CANCELADO = 'cancelado',
}

export enum TipoConsumo {
  MESA = 'mesa',
  PARA_LLEVAR = 'para_llevar',
  PARA_RECOGER = 'para_recoger',
}

export enum Categoria {
  CREPAS = 'crepas',
  PIZZAS = 'pizzas',
  PASTAS = 'pastas',
  PANINIS = 'paninis',
  BEBIDAS = 'bebidas',
  POSTRES = 'postres',
}

// Types
export interface Ingrediente {
  id: string;
  nombre: string;
  precio?: number; // Costo adicional si es extra
}

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: Categoria;
  imagen?: string;
  disponible: boolean;
  ingredientes?: Ingrediente[]; // Ingredientes disponibles para este producto
}

export interface ItemCarrito {
  id: string;
  productoId: number;
  producto: Producto;
  cantidad: number;
  observaciones?: string;
  ingredientesExtra?: string[]; // IDs de ingredientes extras seleccionados
}

export interface Pedido {
  id: string;
  items: ItemCarrito[];
  estado: EstadoPedido;
  tipoConsumo: TipoConsumo;
  numeroMesa?: number;
  observacionesGenerales?: string;
  subtotal: number;
  total: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CarritoState {
  items: ItemCarrito[];
  tipoConsumo: TipoConsumo | null;
  numeroMesa?: number;
  observacionesGenerales?: string;
}

export interface PedidosState {
  pedidos: Pedido[];
}
