'use client';

import React from 'react';
import { Producto } from '@/app/types';
import ProductDetailModal from './ProductDetailModal';

interface ProductCardProps {
  producto: Producto;
}

export function ProductCard({ producto }: ProductCardProps) {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
    <>
      <div
        onClick={() => setIsModalOpen(true)}
        className="cursor-pointer rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
      >
        {producto.imagen && (
          <img
            src={producto.imagen}
            alt={producto.nombre}
            className="mb-3 h-40 w-full rounded object-cover"
          />
        )}

        <div className="mb-2 flex items-start justify-between">
          <h3 className="text-lg font-semibold">{producto.nombre}</h3>
          <span className="rounded bg-gradient-to-r from-blue-100 to-blue-50 px-2 py-1 text-sm font-bold text-blue-900">
            ${producto.precio}
          </span>
        </div>

        <p className="mb-4 text-sm text-gray-600">{producto.descripcion}</p>

        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {producto.ingredientes && producto.ingredientes.length > 0 && (
              <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
                +{producto.ingredientes.length} extras
              </span>
            )}
          </div>
          <button className="rounded bg-black px-4 py-2 font-semibold text-white transition-all hover:bg-gray-800 hover:shadow-md">
            Ver Detalles
          </button>
        </div>
      </div>

      <ProductDetailModal
        producto={producto}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
