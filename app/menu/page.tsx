'use client';

import React, { useState } from 'react';
import { Categoria } from '@/app/types';
import { productosPorCategoria } from '@/app/data/menu';
import { useCarrito } from '@/app/context/CarritoContext';
import { Button, ProductCard, CartSummary, TipoConsumoSelector } from '@/app/components';
import Link from 'next/link';

export default function MenuPage() {
  const [categoriaActiva, setCategoriaActiva] = useState<Categoria>(Categoria.CREPAS);
  const [isConfirmLoading, setIsConfirmLoading] = useState(false);

  const { agregarProducto } = useCarrito();
  const { items, tipoConsumo, setTipoConsumo, numeroMesa, setNumeroMesa, limpiarCarrito } =
    useCarrito();

  const productosEnCategoria = productosPorCategoria(categoriaActiva);

  const handleConfirmarPedido = async () => {
    if (items.length === 0) {
      alert('❌ Tu carrito está vacío');
      return;
    }

    if (!tipoConsumo) {
      alert('❌ Selecciona cómo quieres tu pedido');
      return;
    }

    if (tipoConsumo === 'mesa' && !numeroMesa) {
      alert('❌ Ingresa el número de mesa');
      return;
    }

    setIsConfirmLoading(true);
    await new Promise((res) => setTimeout(res, 800));

    // Calcular total con ingredientes extras
    const total = items.reduce((sum, item) => {
      const precioProducto = item.producto.precio * item.cantidad;
      const precioIngredientes = (item.ingredientesExtra || []).reduce((s, ingredId) => {
        const ingrediente = item.producto.ingredientes?.find((i) => i.id === ingredId);
        return s + ((ingrediente?.precio || 0) * item.cantidad);
      }, 0);
      return sum + precioProducto + precioIngredientes;
    }, 0);

    const detalleItems = items
      .map((i) => {
        let detalle = `- ${i.cantidad}x ${i.producto.nombre}`;
        const precioBase = i.producto.precio * i.cantidad;
        detalle += ` ($${precioBase})`;

        if (i.ingredientesExtra && i.ingredientesExtra.length > 0) {
          const ingredientes = i.ingredientesExtra
            .map((ingredId) => {
              const ingrediente = i.producto.ingredientes?.find((ing) => ing.id === ingredId);
              return ingrediente?.nombre || '';
            })
            .filter(Boolean)
            .join(', ');
          detalle += `\n  ✓ Extras: ${ingredientes}`;
        }

        if (i.observaciones) {
          detalle += `\n  📝 Notas: ${i.observaciones}`;
        }

        return detalle;
      })
      .join('\n');

    const resumen = `
🍽️ PEDIDO CONFIRMADO

📝 Productos:
${detalleItems}

💰 Total: $${total.toFixed(0)}

🏪 Tipo: ${tipoConsumo === 'mesa' ? `Mesa ${numeroMesa}` : tipoConsumo === 'para_llevar' ? 'Para llevar' : 'Para recoger'}

✅ Tu pedido fue confirmado. El equipo de cocina está preparándolo.
    `;

    alert(resumen);
    limpiarCarrito();
    setIsConfirmLoading(false);
  };

  const categorias = Object.values(Categoria);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold">🇫🇷 Rincón Francés</h1>
          <p className="text-gray-600 text-sm">Menú Digital</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Menú */}
          <div className="lg:col-span-2 space-y-6">
            {/* Categorías */}
            <nav className="bg-white rounded-lg shadow p-4">
              <div className="flex flex-wrap gap-2">
                {categorias.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoriaActiva(cat)}
                    className={`px-4 py-2 rounded font-medium transition-all ${
                      categoriaActiva === cat
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                  {cat === Categoria.CREPAS && '🥞'}
                    {cat === Categoria.PIZZAS && '🍕'}
                    {cat === Categoria.PASTAS && '🍝'}
                    {cat === Categoria.PANINIS && '🥪'}
                    {cat === Categoria.BEBIDAS && '🥤'}
                    {cat === Categoria.POSTRES && '🍰'}
                    {' ' + cat}
                  </button>
                ))}
              </div>
            </nav>

            {/* Productos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {productosEnCategoria.map((producto) => (
                <ProductCard key={producto.id} producto={producto} />
              ))}
            </div>
          </div>

          {/* Carrito Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              {/* Selector Tipo Consumo */}
              <TipoConsumoSelector
                tipoConsumo={tipoConsumo}
                numeroMesa={numeroMesa}
                onSeleccionar={setTipoConsumo}
                onMesaChange={setNumeroMesa}
              />

              {/* Carrito */}
              <div className="bg-white rounded-lg shadow p-4">
                <h2 className="text-xl font-bold mb-4">🛒 Tu Carrito</h2>
                {items.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Tu carrito está vacío</p>
                ) : (
                  <div className="space-y-3">
                    {items.map((item) => {
                      const precioBase = item.producto.precio * item.cantidad;
                      const precioIngredientes = (item.ingredientesExtra || []).reduce((s, ingredId) => {
                        const ingrediente = item.producto.ingredientes?.find((i) => i.id === ingredId);
                        return s + ((ingrediente?.precio || 0) * item.cantidad);
                      }, 0);
                      const precioTotal = precioBase + precioIngredientes;

                      return (
                        <div key={`${item.id}-carrito`} className="pb-3 border-b">
                          <div className="flex justify-between items-start mb-1">
                            <div>
                              <p className="font-medium text-sm">{item.producto.nombre}</p>
                              <p className="text-xs text-gray-600">{item.cantidad}x</p>
                            </div>
                            <p className="font-bold text-sm">${precioTotal.toFixed(0)}</p>
                          </div>

                          {item.ingredientesExtra && item.ingredientesExtra.length > 0 && (
                            <div className="text-xs text-green-700 ml-1">
                              {item.ingredientesExtra
                                .map((id) => item.producto.ingredientes?.find((i) => i.id === id)?.nombre)
                                .filter(Boolean)
                                .join(', ')}
                              {' ✓'}
                            </div>
                          )}

                          {item.observaciones && (
                            <p className="text-xs text-gray-600 italic ml-1">
                              📝 {item.observaciones}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Total y Confirmar */}
              <CartSummary
                onConfirmar={handleConfirmarPedido}
                isConfirmLoading={isConfirmLoading}
              />

              {/* Link Admin */}
              <div className="bg-gray-200 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-700 mb-2">¿Trabajas en el restaurante?</p>
                <Link href="/admin">
                  <Button variant="primary" tamaño="sm" className="w-full">
                    Acceso Admin
                  </Button>
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
