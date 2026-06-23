import { ItemCarrito, ItemPricingSnapshot } from '@/app/types';

interface OrderPricingResult {
  subtotal: number;
  total: number;
  itemPricing: Record<string, ItemPricingSnapshot>;
}

function calculateObservationAdjustment(item: ItemCarrito): number {
  void item;
  // Punto de extension: actualmente las observaciones no alteran precio.
  return 0;
}

function calculateExtrasUnitPrice(item: ItemCarrito): number {
  if (item.producto.ingredientes && item.producto.ingredientes.length > 0) {
    return (item.ingredientesExtra || []).reduce((sum, ingredientId) => {
      const ingrediente = item.producto.ingredientes?.find((candidate) => candidate.id === ingredientId);
      return sum + (ingrediente?.precio || 0);
    }, 0);
  }

  return item.pricing?.extrasUnitPrice || 0;
}

export function calculateItemPricing(item: ItemCarrito): ItemPricingSnapshot {
  if (
    item.pricing &&
    typeof item.pricing.lineTotal === 'number' &&
    typeof item.pricing.unitPrice === 'number'
  ) {
    return item.pricing;
  }

  const baseUnitPrice = item.producto.precio;
  const extrasUnitPrice = calculateExtrasUnitPrice(item);
  const observationAdjustment = calculateObservationAdjustment(item);
  const unitPrice = baseUnitPrice + extrasUnitPrice + observationAdjustment;
  const lineSubtotal = baseUnitPrice * item.cantidad;
  const lineTotal = unitPrice * item.cantidad;

  return {
    baseUnitPrice,
    extrasUnitPrice,
    observationAdjustment,
    unitPrice,
    lineSubtotal,
    lineTotal,
  };
}

export function calculateOrderTotal(items: ItemCarrito[]): OrderPricingResult {
  const itemPricing: Record<string, ItemPricingSnapshot> = {};

  const total = items.reduce((sum, item) => {
    const pricing = calculateItemPricing(item);
    itemPricing[item.id] = pricing;
    return sum + pricing.lineTotal;
  }, 0);

  return {
    subtotal: total,
    total,
    itemPricing,
  };
}

export function attachPricingToItems(items: ItemCarrito[]): ItemCarrito[] {
  const { itemPricing } = calculateOrderTotal(items);

  return items.map((item) => ({
    ...item,
    pricing: itemPricing[item.id] ?? calculateItemPricing(item),
  }));
}
