import { Pedido, EstadoPedido, ItemCarrito } from '@/app/types';
import { db } from '@/app/lib/firebase';
import { calculateItemPricing } from '@/app/lib/orderPricing';
import {
  Timestamp,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from 'firebase/firestore';

interface FirestoreProductoSnapshot {
  id: number;
  nombre: string;
  precio: number;
  categoria: ItemCarrito['producto']['categoria'];
}

interface FirestoreItemDoc extends Omit<ItemCarrito, 'producto'> {
  producto: FirestoreProductoSnapshot;
}

interface FirestorePedidoDoc extends Omit<Pedido, 'createdAt' | 'updatedAt' | 'items'> {
  items: FirestoreItemDoc[];
  createdAt: Timestamp | string;
  updatedAt: Timestamp | string;
}

const PEDIDOS_COLLECTION = 'pedidos';
const FIRESTORE_REQUEST_TIMEOUT_MS = 15000;

async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  errorMessage: string
): Promise<T> {
  let timeoutHandle: ReturnType<typeof setTimeout> | undefined;

  const timeoutPromise = new Promise<T>((_, reject) => {
    timeoutHandle = setTimeout(() => {
      reject(new Error(errorMessage));
    }, timeoutMs);
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    if (timeoutHandle) {
      clearTimeout(timeoutHandle);
    }
  }
}

function removeUndefinedDeep<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => removeUndefinedDeep(item)) as T;
  }

  if (value && typeof value === 'object') {
    if (value instanceof Date || value instanceof Timestamp) {
      return value;
    }

    if (Object.getPrototypeOf(value) !== Object.prototype) {
      return value;
    }

    const cleanedEntries = Object.entries(value as Record<string, unknown>)
      .filter(([, fieldValue]) => fieldValue !== undefined)
      .map(([fieldKey, fieldValue]) => [fieldKey, removeUndefinedDeep(fieldValue)]);

    return Object.fromEntries(cleanedEntries) as T;
  }

  return value;
}

function compactItemForFirestore(item: ItemCarrito): FirestoreItemDoc {
  return {
    ...item,
    pricing: item.pricing ?? calculateItemPricing(item),
    producto: {
      id: item.producto.id,
      nombre: item.producto.nombre,
      precio: item.producto.precio,
      categoria: item.producto.categoria,
    },
  };
}

function serializePedido(pedido: Pedido): FirestorePedidoDoc {
  return removeUndefinedDeep({
    ...pedido,
    items: pedido.items.map(compactItemForFirestore),
    createdAt: Timestamp.fromDate(pedido.createdAt),
    updatedAt: Timestamp.fromDate(pedido.updatedAt),
  });
}

function parseFirestoreDate(value: Timestamp | string): Date {
  if (value instanceof Timestamp) {
    return value.toDate();
  }

  return new Date(value);
}

function deserializePedido(pedido: FirestorePedidoDoc): Pedido {
  return {
    ...pedido,
    items: pedido.items.map((item) => ({
      ...item,
      producto: {
        ...item.producto,
        descripcion: '',
        disponible: true,
      },
    })),
    createdAt: parseFirestoreDate(pedido.createdAt),
    updatedAt: parseFirestoreDate(pedido.updatedAt),
  };
}

export function subscribeToPedidos(
  onChange: (pedidos: Pedido[]) => void,
  onError: (error: Error) => void
) {
  if (!db) {
    throw new Error('Firebase no está configurado. Revisa tus variables de entorno.');
  }

  const pedidosQuery = query(
    collection(db, PEDIDOS_COLLECTION),
    orderBy('createdAt', 'asc')
  );

  return onSnapshot(
    pedidosQuery,
    (snapshot) => {
      const pedidos = snapshot.docs.map((snapshotDoc) =>
        deserializePedido(snapshotDoc.data() as FirestorePedidoDoc)
      );
      onChange(pedidos);
    },
    (error) => {
      onError(error);
    }
  );
}

export async function guardarPedidoFirestore(pedido: Pedido) {
  if (!db) {
    throw new Error('Firebase no está configurado. Revisa tus variables de entorno.');
  }

  await withTimeout(
    setDoc(doc(db, PEDIDOS_COLLECTION, pedido.id), serializePedido(pedido)),
    FIRESTORE_REQUEST_TIMEOUT_MS,
    'Tiempo de espera agotado al guardar pedido en Firestore.'
  );
}

export async function actualizarEstadoPedidoFirestore(
  pedidoId: string,
  nuevoEstado: EstadoPedido
) {
  if (!db) {
    throw new Error('Firebase no está configurado. Revisa tus variables de entorno.');
  }

  await withTimeout(
    updateDoc(doc(db, PEDIDOS_COLLECTION, pedidoId), {
      estado: nuevoEstado,
      updatedAt: Timestamp.now(),
    }),
    FIRESTORE_REQUEST_TIMEOUT_MS,
    'Tiempo de espera agotado al actualizar estado del pedido en Firestore.'
  );
}
