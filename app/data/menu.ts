import { Producto, Categoria, Ingrediente } from '@/app/types';

export { Categoria };

// Ingredientes por categoría
const ingredientesCrepas: Ingrediente[] = [
  { id: 'crepa-extra-queso', nombre: 'Queso Extra', precio: 15 },
  { id: 'crepa-extra-jamon', nombre: 'Jamón Adicional', precio: 20 },
  { id: 'crepa-extra-fresas', nombre: 'Fresas Adicionales', precio: 10 },
  { id: 'crepa-extra-chocolate', nombre: 'Chocolate Derretido', precio: 12 },
  { id: 'crepa-extra-champi', nombre: 'Champiñones Extra', precio: 15 },
];

const ingredientesPixas: Ingrediente[] = [
  { id: 'pizza-extra-queso', nombre: 'Queso Extra', precio: 15 },
  { id: 'pizza-extra-pepperoni', nombre: 'Pepperoni Extra', precio: 20 },
  { id: 'pizza-extra-verduras', nombre: 'Verduras Variadas', precio: 15 },
  { id: 'pizza-extra-champi', nombre: 'Champiñones', precio: 12 },
  { id: 'pizza-extra-cebolla', nombre: 'Cebolla Caramelizada', precio: 10 },
];

const ingredientesPastas: Ingrediente[] = [
  { id: 'pasta-extra-queso', nombre: 'Queso Parmesano Extra', precio: 10 },
  { id: 'pasta-extra-jamon', nombre: 'Jamón Prosciutto', precio: 20 },
  { id: 'pasta-extra-camarones', nombre: 'Camarones Adicionales', precio: 25 },
  { id: 'pasta-extra-verduras', nombre: 'Verduras Salteadas', precio: 12 },
  { id: 'pasta-extra-salmon', nombre: 'Salmón Ahumado', precio: 30 },
];

const ingredientesPaninis: Ingrediente[] = [
  { id: 'panini-extra-queso', nombre: 'Queso Extra', precio: 10 },
  { id: 'panini-extra-jamon', nombre: 'Jamón Prosciutto', precio: 15 },
  { id: 'panini-extra-tomate', nombre: 'Tomate Fresco', precio: 5 },
  { id: 'panini-extra-pesto', nombre: 'Pesto Extra', precio: 8 },
  { id: 'panini-extra-cebolla', nombre: 'Cebolla Caramelizada', precio: 7 },
];

export const menuProductos: Producto[] = [
  // Crepas
  {
    id: 1,
    nombre: 'Crepa Nutella',
    descripcion: 'Crepa dulce rellena de Nutella y fresas',
    precio: 100,
    categoria: Categoria.CREPAS,
    disponible: true,
    ingredientes: ingredientesCrepas,
  },
  {
    id: 2,
    nombre: 'Crepa Jamón y Queso',
    descripcion: 'Crepa salada con jamón de pavo y queso mozzarella',
    precio: 120,
    categoria: Categoria.CREPAS,
    disponible: true,
    ingredientes: ingredientesCrepas,
  },
  {
    id: 3,
    nombre: 'Crepa Champiñones',
    descripcion: 'Crepa salada con champiñones, cebolla caramelizada y queso',
    precio: 110,
    categoria: Categoria.CREPAS,
    disponible: true,
    ingredientes: ingredientesCrepas,
  },
  {
    id: 4,
    nombre: 'Crepa Espinaca y Ricotta',
    descripcion: 'Crepa vegetariana con espinaca fresca y queso ricotta',
    precio: 125,
    categoria: Categoria.CREPAS,
    disponible: true,
    ingredientes: ingredientesCrepas,
  },

  // Pizzas
  {
    id: 5,
    nombre: 'Pizza Pepperoni',
    descripcion: 'Pizza clásica con pepperoni y mozzarella',
    precio: 200,
    categoria: Categoria.PIZZAS,
    disponible: true,
    ingredientes: ingredientesPixas,
  },
  {
    id: 6,
    nombre: 'Pizza Margherita',
    descripcion: 'Pizza con tomate, mozzarella fresca y albahaca',
    precio: 185,
    categoria: Categoria.PIZZAS,
    disponible: true,
    ingredientes: ingredientesPixas,
  },
  {
    id: 7,
    nombre: 'Pizza Cuatro Quesos',
    descripcion: 'Mezcla de mozzarella, parmesano, gorgonzola y ricotta',
    precio: 220,
    categoria: Categoria.PIZZAS,
    disponible: true,
    ingredientes: ingredientesPixas,
  },
  {
    id: 8,
    nombre: 'Pizza Vegetariana',
    descripcion: 'Pimiento, champiñón, cebolla, tomate y aceitunas',
    precio: 190,
    categoria: Categoria.PIZZAS,
    disponible: true,
    ingredientes: ingredientesPixas,
  },

  // Pastas
  {
    id: 9,
    nombre: 'Pasta Alfredo',
    descripcion: 'Fettuccine con salsa Alfredo cremosa y parmesano',
    precio: 175,
    categoria: Categoria.PASTAS,
    disponible: true,
    ingredientes: ingredientesPastas,
  },
  {
    id: 10,
    nombre: 'Pasta Bolognesa',
    descripcion: 'Tallarín con salsa de carne y tomate',
    precio: 170,
    categoria: Categoria.PASTAS,
    disponible: true,
    ingredientes: ingredientesPastas,
  },
  {
    id: 11,
    nombre: 'Pasta Primavera',
    descripcion: 'Combinación de verduras frescas con aceite de oliva',
    precio: 160,
    categoria: Categoria.PASTAS,
    disponible: true,
    ingredientes: ingredientesPastas,
  },
  {
    id: 12,
    nombre: 'Pasta Camarones',
    descripcion: 'Tallarín con camarones, ajo y vino blanco',
    precio: 200,
    categoria: Categoria.PASTAS,
    disponible: true,
    ingredientes: ingredientesPastas,
  },

  // Paninis
  {
    id: 13,
    nombre: 'Panini Italiano',
    descripcion: 'Pan tostado con jamón prosciutto, queso y tomate',
    precio: 150,
    categoria: Categoria.PANINIS,
    disponible: true,
    ingredientes: ingredientesPaninis,
  },
  {
    id: 14,
    nombre: 'Panini Pollo Pesto',
    descripcion: 'Pan tostado con pechuga de pollo, pesto y queso',
    precio: 145,
    categoria: Categoria.PANINIS,
    disponible: true,
    ingredientes: ingredientesPaninis,
  },
  {
    id: 15,
    nombre: 'Panini Caprese',
    descripcion: 'Mozzarella fresca, tomate y albahaca',
    precio: 140,
    categoria: Categoria.PANINIS,
    disponible: true,
    ingredientes: ingredientesPaninis,
  },
  {
    id: 16,
    nombre: 'Panini Vegetariano',
    descripcion: 'Berenjena, zucchini, pimiento y cebolla caramelizada',
    precio: 135,
    categoria: Categoria.PANINIS,
    disponible: true,
    ingredientes: ingredientesPaninis,
  },

  // Bebidas
  {
    id: 17,
    nombre: 'Café Espresso',
    descripcion: 'Café espresso simple',
    precio: 40,
    categoria: Categoria.BEBIDAS,
    disponible: true,
  },
  {
    id: 18,
    nombre: 'Cappuccino',
    descripcion: 'Espresso con leche vaporizada y espuma',
    precio: 50,
    categoria: Categoria.BEBIDAS,
    disponible: true,
  },
  {
    id: 19,
    nombre: 'Chocolate Caliente',
    descripcion: 'Chocolate derretido con leche vaporizada',
    precio: 60,
    categoria: Categoria.BEBIDAS,
    disponible: true,
  },
  {
    id: 20,
    nombre: 'Jugo Natural',
    descripcion: 'Jugo de naranja, limón o zanahoria',
    precio: 55,
    categoria: Categoria.BEBIDAS,
    disponible: true,
  },
  {
    id: 21,
    nombre: 'Refresco',
    descripcion: 'Coca Cola, Sprite, Fanta o Agua mineral',
    precio: 45,
    categoria: Categoria.BEBIDAS,
    disponible: true,
  },

  // Postres
  {
    id: 22,
    nombre: 'Tiramisú',
    descripcion: 'Postre italiano con mascarpone y café',
    precio: 90,
    categoria: Categoria.POSTRES,
    disponible: true,
  },
  {
    id: 23,
    nombre: 'Brownie Chocolate',
    descripcion: 'Brownie casero de chocolate con helado de vainilla',
    precio: 80,
    categoria: Categoria.POSTRES,
    disponible: true,
  },
  {
    id: 24,
    nombre: 'Cheesecake Fresas',
    descripcion: 'Cheesecake con cobertura de fresas frescas',
    precio: 95,
    categoria: Categoria.POSTRES,
    disponible: true,
  },
  {
    id: 25,
    nombre: 'Tarta Limón',
    descripcion: 'Tarta casera de limón con merengue',
    precio: 85,
    categoria: Categoria.POSTRES,
    disponible: true,
  },
  {
    id: 26,
    nombre: 'Helado Artesanal',
    descripcion: 'Helado de chocolate, vainilla, fresa o pistacho',
    precio: 65,
    categoria: Categoria.POSTRES,
    disponible: true,
  },
];

export const productosPorCategoria = (categoria: Categoria): Producto[] => {
  return menuProductos.filter((p) => p.categoria === categoria);
};

export const obtenerProductoPorId = (id: number): Producto | undefined => {
  return menuProductos.find((p) => p.id === id);
};
