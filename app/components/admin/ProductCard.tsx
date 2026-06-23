'use client';

import { Producto } from '@/app/types';

interface ProductCardProps {
  producto: Producto;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

export default function ProductCard({
  producto,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onDuplicate,
}: ProductCardProps) {
  return (
    <div
      onClick={onSelect}
      className={`p-3 rounded-lg border-2 cursor-pointer transition ${
        isSelected
          ? 'border-blue-600 bg-blue-50 shadow-lg'
          : 'border-gray-200 bg-white hover:border-blue-300'
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <h3 className="font-semibold text-sm">{producto.nombre}</h3>
          <p className="text-xs text-gray-600">{producto.descripcion}</p>
        </div>
        {producto.imagen && (
          <img
            src={producto.imagen}
            alt={producto.nombre}
            className="ml-2 h-14 w-14 rounded object-cover border border-gray-200"
          />
        )}
        <span className="text-lg font-bold text-green-600">${producto.precio}</span>
      </div>

      <div className="flex gap-1 flex-wrap mb-2">
        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
          {producto.categoria}
        </span>
        {producto.ingredientes && producto.ingredientes.length > 0 && (
          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
            +{producto.ingredientes.length} extras
          </span>
        )}
      </div>

      {isSelected && (
        <div className="flex gap-1 pt-2 border-t">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="flex-1 text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            ✏️ Editar
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate();
            }}
            className="flex-1 text-xs px-2 py-1 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            📋 Copiar
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="flex-1 text-xs px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
          >
            🗑️ Eliminar
          </button>
        </div>
      )}
    </div>
  );
}
