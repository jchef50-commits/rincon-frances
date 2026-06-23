'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useSyncExternalStore } from 'react';
import { Categoria } from '@/app/types';
import { productosPorCategoria } from '@/app/data/menu';
import { useCarrito } from '@/app/context/CarritoContext';
import { usePedidos } from '@/app/context/PedidosContext';
import { Button, ProductCard, CartSummary, TipoConsumoSelector } from '@/app/components';
import Link from 'next/link';
import { calculateItemPricing, calculateOrderTotal } from '@/app/lib/orderPricing';
import { ensureAnonymousClientUid } from '@/app/lib/clientIdentity';

export default function MenuPage() {
  const [categoriaActiva, setCategoriaActiva] = useState<Categoria>(Categoria.CREPAS);
  const [isConfirmLoading, setIsConfirmLoading] = useState(false);
  const isHydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const { items, tipoConsumo, setTipoConsumo, numeroMesa, setNumeroMesa, limpiarCarrito } =
    useCarrito();
  const { agregarPedido } = usePedidos();

  const productosEnCategoria = productosPorCategoria(categoriaActiva);

  React.useEffect(() => {
    void ensureAnonymousClientUid();
  }, []);

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

    const { total } = calculateOrderTotal(items);

    const detalleItems = items
      .map((i) => {
        let detalle = `- ${i.cantidad}x ${i.producto.nombre}`;
        const itemPricing = calculateItemPricing(i);
        detalle += ` ($${itemPricing.lineTotal.toFixed(0)})`;

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

    try {
      const pedidoId = await agregarPedido(items, tipoConsumo, numeroMesa);

      const resumen = `
🍽️ PEDIDO CONFIRMADO

🧾 Folio: ${pedidoId}

📝 Productos:
${detalleItems}

💰 Total: $${total.toFixed(0)}

🏪 Tipo: ${tipoConsumo === 'mesa' ? `Mesa ${numeroMesa}` : 'Para llevar o pasar a recoger'}

✅ Tu pedido fue confirmado. El equipo de cocina está preparándolo.
    `;

      alert(resumen);
      limpiarCarrito();
    } catch (error) {
      console.error('Error al guardar pedido:', error);
      const message = error instanceof Error ? error.message : 'Error desconocido';
      alert(`❌ No se pudo guardar el pedido.\n${message}`);
    } finally {
      setIsConfirmLoading(false);
    }
  };

  const categorias = Object.values(Categoria);
  const galeriaMarca = [
    { src: '/brand/menu-crepas-saladas.jpg', alt: 'Menú de crepas saladas de Rincón Francés' },
    { src: '/brand/menu-crepas-dulces.jpg', alt: 'Menú de crepas dulces de Rincón Francés' },
    { src: '/brand/menu-pizzas.jpg', alt: 'Menú de pizzas de Rincón Francés' },
    { src: '/brand/menu-pastas.jpg', alt: 'Menú de pastas y paninis de Rincón Francés' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-800">
      {/* Header */}
      <header className="bg-black/90 text-white shadow-sm sticky top-0 z-10 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-4xl md:text-5xl brand-title">Rincón Francés</h1>
          <p className="text-amber-300 text-sm font-semibold uppercase tracking-wide">Menú Digital</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <section className="mb-6 rounded-2xl border border-amber-400/30 bg-black/40 p-4 md:p-6">
          <div className="mb-4 flex justify-end">
            <span className="brand-title text-2xl text-amber-200">Rincón Francés</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {galeriaMarca.map((foto) => (
              <div key={foto.src} className="relative overflow-hidden rounded-xl border border-white/10 bg-black">
                <Image
                  src={foto.src}
                  alt={foto.alt}
                  width={420}
                  height={560}
                  className="h-40 w-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
            ))}
          </div>
        </section>

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
            <div className="space-y-4 lg:sticky lg:top-24">
              {/* Selector Tipo Consumo */}
              {isHydrated && (
                <TipoConsumoSelector
                  tipoConsumo={tipoConsumo}
                  numeroMesa={numeroMesa}
                  onSeleccionar={setTipoConsumo}
                  onMesaChange={setNumeroMesa}
                />
              )}

              {/* Carrito */}
              <div className="bg-white rounded-lg shadow p-4">
                <h2 className="text-xl font-bold mb-4">🛒 Tu Carrito</h2>
                {!isHydrated ? (
                  <p className="text-gray-500 text-center py-8">Cargando carrito...</p>
                ) : items.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Tu carrito está vacío</p>
                ) : (
                  <div className="space-y-3">
                    {items.map((item) => {
                      const precioTotal = calculateItemPricing(item).lineTotal;

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
              {isHydrated && (
                <CartSummary
                  onConfirmar={handleConfirmarPedido}
                  isConfirmLoading={isConfirmLoading}
                />
              )}

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
