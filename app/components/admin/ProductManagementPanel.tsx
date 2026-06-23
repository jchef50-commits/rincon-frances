'use client';

import { useState } from 'react';
import { Producto, Categoria } from '@/app/types';
import { menuProductos } from '@/app/data/menu';
import ProductForm from './ProductForm';
import ProductCard from './ProductCard';

export default function ProductManagementPanel() {
  const [productos, setProductos] = useState<Producto[]>(menuProductos);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [filterCategoria, setFilterCategoria] = useState<Categoria | null>(null);

  const selectedProduct = selectedProductId
    ? productos.find((p) => p.id === selectedProductId)
    : null;

  const productosFiltrados = filterCategoria
    ? productos.filter((p) => p.categoria === filterCategoria)
    : productos;

  const handleGuardarProducto = (producto: Producto) => {
    if (selectedProductId) {
      setProductos((prev) =>
        prev.map((p) => (p.id === selectedProductId ? producto : p))
      );
      setSelectedProductId(null);
    } else {
      const nuevoId = Math.max(...productos.map((p) => p.id), 0) + 1;
      setProductos((prev) => [...prev, { ...producto, id: nuevoId }]);
    }
    setShowForm(false);
  };

  const handleEliminar = (id: number) => {
    if (confirm('¿Eliminar este producto?')) {
      setProductos((prev) => prev.filter((p) => p.id !== id));
      if (selectedProductId === id) {
        setSelectedProductId(null);
      }
    }
  };

  const handleDuplicar = (id: number) => {
    const producto = productos.find((p) => p.id === id);
    if (producto) {
      const nuevoId = Math.max(...productos.map((p) => p.id), 0) + 1;
      const nuevoProducto = {
        ...producto,
        id: nuevoId,
        nombre: `${producto.nombre} (copia)`,
      };
      setProductos((prev) => [...prev, nuevoProducto]);
    }
  };

  const categorias = Object.values(Categoria);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Panel Izquierdo: Lista de Productos */}
      <div className="lg:col-span-2 space-y-4">
        <div className="flex gap-3 flex-wrap items-center">
          <button
            onClick={() => {
              setShowForm(true);
              setSelectedProductId(null);
            }}
            className="px-4 py-2 bg-green-600 text-white rounded font-semibold hover:bg-green-700"
          >
            ➕ Nuevo Producto
          </button>

          <select
            value={filterCategoria || ''}
            onChange={(e) =>
              setFilterCategoria((e.target.value as Categoria) || null)
            }
            className="px-3 py-2 border rounded"
          >
            <option value="">Todas las categorías</option>
            {categorias.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <span className="text-sm text-gray-600 ml-auto">
            {productosFiltrados.length} productos
          </span>
        </div>

        {/* Grid de Productos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {productosFiltrados.map((producto) => (
            <ProductCard
              key={producto.id}
              producto={producto}
              isSelected={selectedProductId === producto.id}
              onSelect={() => setSelectedProductId(producto.id)}
              onEdit={() => {
                setSelectedProductId(producto.id);
                setShowForm(true);
              }}
              onDelete={() => handleEliminar(producto.id)}
              onDuplicate={() => handleDuplicar(producto.id)}
            />
          ))}
        </div>
      </div>

      {/* Panel Derecho: Detalles y Edición */}
      <aside className="space-y-4">
        {showForm ? (
          <div className="bg-white rounded-lg shadow-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {selectedProductId ? 'Editar Producto' : 'Nuevo Producto'}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-2xl text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <ProductForm
              producto={selectedProduct || undefined}
              onGuardar={handleGuardarProducto}
              onCancel={() => setShowForm(false)}
            />
          </div>
        ) : selectedProduct ? (
          <div className="bg-white rounded-lg shadow-lg p-4">
            <h2 className="text-xl font-bold mb-4">Detalles del Producto</h2>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-600 font-semibold">Nombre</p>
                <p className="font-bold">{selectedProduct.nombre}</p>
              </div>
              <div>
                <p className="text-gray-600 font-semibold">Descripción</p>
                <p>{selectedProduct.descripcion}</p>
              </div>
              {selectedProduct.imagen && (
                <div>
                  <p className="text-gray-600 font-semibold mb-2">Foto</p>
                  <img
                    src={selectedProduct.imagen}
                    alt={selectedProduct.nombre}
                    className="w-full max-h-44 object-cover rounded border border-gray-200"
                  />
                </div>
              )}
              <div>
                <p className="text-gray-600 font-semibold">Precio</p>
                <p className="text-xl font-bold text-green-600">
                  ${selectedProduct.precio}
                </p>
              </div>
              <div>
                <p className="text-gray-600 font-semibold">Categoría</p>
                <p className="bg-blue-100 text-blue-900 rounded px-2 py-1 inline-block">
                  {selectedProduct.categoria}
                </p>
              </div>
              <div>
                <p className="text-gray-600 font-semibold mb-2">
                  Ingredientes ({selectedProduct.ingredientes?.length || 0})
                </p>
                {selectedProduct.ingredientes && selectedProduct.ingredientes.length > 0 ? (
                  <ul className="space-y-1 text-xs">
                    {selectedProduct.ingredientes.map((ing) => (
                      <li key={ing.id} className="flex justify-between bg-gray-100 p-1 rounded">
                        <span>{ing.nombre}</span>
                        {ing.precio && <span className="font-semibold">+${ing.precio}</span>}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-xs">Sin ingredientes extras</p>
                )}
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  onClick={() => setShowForm(true)}
                  className="flex-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-semibold"
                >
                  ✏️ Editar
                </button>
                <button
                  onClick={() => handleDuplicar(selectedProduct.id)}
                  className="flex-1 px-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm font-semibold"
                >
                  📋 Copiar
                </button>
                <button
                  onClick={() => handleEliminar(selectedProduct.id)}
                  className="flex-1 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm font-semibold"
                >
                  🗑️ Eliminar
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-4 text-center text-gray-500">
            <p>Selecciona un producto para ver detalles</p>
          </div>
        )}
      </aside>
    </div>
  );
}
