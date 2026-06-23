'use client';

import { useState } from 'react';
import { Producto, Categoria, Ingrediente } from '@/app/types';

interface ProductFormProps {
  producto?: Producto;
  onGuardar: (producto: Producto) => void;
  onCancel: () => void;
}

export default function ProductForm({
  producto,
  onGuardar,
  onCancel,
}: ProductFormProps) {
  const [nombre, setNombre] = useState(producto?.nombre || '');
  const [descripcion, setDescripcion] = useState(producto?.descripcion || '');
  const [precio, setPrecio] = useState(producto?.precio?.toString() || '');
  const [imagen, setImagen] = useState(producto?.imagen || '');
  const [categoria, setCategoria] = useState(producto?.categoria || Categoria.CREPAS);
  const [disponible, setDisponible] = useState(producto?.disponible !== false);
  const [ingredientes, setIngredientes] = useState<Ingrediente[]>(
    producto?.ingredientes || []
  );
  const [nuevoIngrediente, setNuevoIngrediente] = useState('');
  const [nuevoIngredientePrecio, setNuevoIngredientePrecio] = useState('');

  const categorias = Object.values(Categoria);

  const handleAgregarIngrediente = () => {
    if (!nuevoIngrediente.trim()) {
      alert('Ingresa el nombre del ingrediente');
      return;
    }

    const ingrediente: Ingrediente = {
      id: `${Date.now()}`,
      nombre: nuevoIngrediente,
      precio: nuevoIngredientePrecio
        ? parseInt(nuevoIngredientePrecio)
        : undefined,
    };

    setIngredientes([...ingredientes, ingrediente]);
    setNuevoIngrediente('');
    setNuevoIngredientePrecio('');
  };

  const handleEliminarIngrediente = (id: string) => {
    setIngredientes(ingredientes.filter((i) => i.id !== id));
  };

  const handleGuardar = () => {
    if (!nombre.trim() || !precio.trim()) {
      alert('Completa al menos nombre y precio');
      return;
    }

    const productoGuardar: Producto = {
      id: producto?.id || 0,
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      precio: parseInt(precio),
      categoria,
      disponible,
      imagen: imagen.trim() || undefined,
      ingredientes:
        ingredientes.length > 0 ? ingredientes : undefined,
    };

    onGuardar(productoGuardar);
  };

  return (
    <div className="space-y-4 text-sm">
      {/* Nombre */}
      <div>
        <label className="block font-semibold mb-1">Nombre del Producto *</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full border rounded px-2 py-1"
          placeholder="Ej: Crepa Nutella"
        />
      </div>

      {/* Descripción */}
      <div>
        <label className="block font-semibold mb-1">Descripción</label>
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className="w-full border rounded px-2 py-1 text-xs"
          rows={2}
          placeholder="Descripción breve del producto"
        />
      </div>

      {/* Precio */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block font-semibold mb-1">Precio ($) *</label>
          <input
            type="number"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            className="w-full border rounded px-2 py-1"
            placeholder="100"
            min="0"
          />
        </div>

        {/* Categoría */}
        <div>
          <label className="block font-semibold mb-1">Categoría</label>
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value as Categoria)}
            className="w-full border rounded px-2 py-1"
          >
            {categorias.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Imagen */}
      <div>
        <label className="block font-semibold mb-1">Foto (URL opcional)</label>
        <input
          type="url"
          value={imagen}
          onChange={(e) => setImagen(e.target.value)}
          className="w-full border rounded px-2 py-1"
          placeholder="https://.../foto.jpg"
        />
      </div>

      {/* Disponible */}
      <div>
        <label className="flex items-center gap-2 font-semibold">
          <input
            type="checkbox"
            checked={disponible}
            onChange={(e) => setDisponible(e.target.checked)}
            className="w-4 h-4"
          />
          Disponible
        </label>
      </div>

      {/* Ingredientes */}
      <div className="border-t pt-3">
        <h3 className="font-semibold mb-2">Ingredientes Extras</h3>

        {/* Lista de ingredientes */}
        {ingredientes.length > 0 ? (
          <div className="space-y-1 mb-3 max-h-32 overflow-y-auto">
            {ingredientes.map((ing) => (
              <div
                key={ing.id}
                className="flex justify-between items-center bg-gray-100 p-1 rounded text-xs"
              >
                <span>
                  {ing.nombre}
                  {ing.precio && <span className="ml-2 font-semibold">+${ing.precio}</span>}
                </span>
                <button
                  onClick={() => handleEliminarIngrediente(ing.id)}
                  className="text-red-600 hover:text-red-800 font-bold"
                  type="button"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-xs mb-2">Sin ingredientes aún</p>
        )}

        {/* Agregar nuevo ingrediente */}
        <div className="space-y-1">
          <input
            type="text"
            value={nuevoIngrediente}
            onChange={(e) => setNuevoIngrediente(e.target.value)}
            placeholder="Nombre del ingrediente"
            className="w-full border rounded px-2 py-1 text-xs"
            onKeyPress={(e) => {
              if (e.key === 'Enter') handleAgregarIngrediente();
            }}
          />
          <div className="flex gap-1">
            <input
              type="number"
              value={nuevoIngredientePrecio}
              onChange={(e) => setNuevoIngredientePrecio(e.target.value)}
              placeholder="Precio extra (opcional)"
              className="flex-1 border rounded px-2 py-1 text-xs"
              min="0"
            />
            <button
              onClick={handleAgregarIngrediente}
              className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs font-semibold"
              type="button"
            >
              ➕ Agregar
            </button>
          </div>
        </div>
      </div>

      {/* Botones */}
      <div className="flex gap-2 pt-3 border-t">
        <button
          onClick={handleGuardar}
          className="flex-1 px-3 py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700"
        >
          💾 Guardar
        </button>
        <button
          onClick={onCancel}
          className="flex-1 px-3 py-2 bg-gray-300 text-gray-800 rounded font-semibold hover:bg-gray-400"
        >
          ❌ Cancelar
        </button>
      </div>
    </div>
  );
}
