import { Producto, Categoria, Ingrediente } from '@/app/types';

export type { Categoria };

// Ingredientes por categoría
const ingredientesCrepas: Ingrediente[] = [
  { id: 'crepa-extra-queso', nombre: 'Queso Extra', precio: 15 },
  { id: 'crepa-extra-jamon', nombre: 'Jamón Adicional', precio: 20 },
  { id: 'crepa-extra-fresas', nombre: 'Fresas Adicionales', precio: 10 },
  { id: 'crepa-extra-chocolate', nombre: 'Chocolate Derretido', precio: 12 },
  { id: 'crepa-extra-champi', nombre: 'Champiñones Extra', precio: 15 },
];

const ingredientesPizzas: Ingrediente[] = [
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
  // CREPAS SALADAS
  {
    id: 1,
    nombre: 'Rincón Francés',
    descripcion: 'Philadelphia, manchego, jamón, piña y champiñones',
    precio: 74,
    categoria: Categoria.CREPAS,
    disponible: true,
    ingredientes: ingredientesCrepas,
  },
  {
    id: 2,
    nombre: 'Crepizza',
    descripcion: 'Philadelphia, manchego, peperoni, salsa italiana, champiñoes y parmesano',
    precio: 80,
    categoria: Categoria.CREPAS,
    disponible: true,
    ingredientes: ingredientesCrepas,
  },
  {
    id: 3,
    nombre: 'Michelle Viet',
    descripcion: 'Philadelphia, manchego, chorizo argentino y champiñones',
    precio: 72,
    categoria: Categoria.CREPAS,
    disponible: true,
    ingredientes: ingredientesCrepas,
  },
  {
    id: 4,
    nombre: 'Shakira',
    descripcion: 'Philadelphia, manchego, chorizo español y champiñones',
    precio: 72,
    categoria: Categoria.CREPAS,
    disponible: true,
    ingredientes: ingredientesCrepas,
  },
  {
    id: 5,
    nombre: 'Scarlett Johanson',
    descripcion: 'Philadelphia, manchego, pastor, piña, cilantro y cebolla',
    precio: 85,
    categoria: Categoria.CREPAS,
    disponible: true,
    ingredientes: ingredientesCrepas,
  },
  {
    id: 6,
    nombre: 'Messi',
    descripcion: 'Philadelphia, manchego, sirloin y piña',
    precio: 85,
    categoria: Categoria.CREPAS,
    disponible: true,
    ingredientes: ingredientesCrepas,
  },

  // CREPAS DULCES
  {
    id: 7,
    nombre: 'Kardashian',
    descripcion: 'Nutella, fresa, plátano y lechera',
    precio: 70,
    categoria: Categoria.CREPAS,
    disponible: true,
    ingredientes: ingredientesCrepas,
  },
  {
    id: 8,
    nombre: 'Paris Hilton',
    descripcion: 'Philadelphia, fresas y lechera',
    precio: 63,
    categoria: Categoria.CREPAS,
    disponible: true,
    ingredientes: ingredientesCrepas,
  },
  {
    id: 9,
    nombre: 'Michael Jackson',
    descripcion: 'Philadelphia, nutella, nuez, lechera y hershey',
    precio: 70,
    categoria: Categoria.CREPAS,
    disponible: true,
    ingredientes: ingredientesCrepas,
  },
  {
    id: 10,
    nombre: 'José José',
    descripcion: 'Philadelphia, cajeta y tequila',
    precio: 62,
    categoria: Categoria.CREPAS,
    disponible: true,
    ingredientes: ingredientesCrepas,
  },
  {
    id: 11,
    nombre: 'Fatima Bosch',
    descripcion: 'Philadelphia, cajeta, lechera, licor de naranja, nuez y 1 bola de helado',
    precio: 90,
    categoria: Categoria.CREPAS,
    disponible: true,
    ingredientes: ingredientesCrepas,
  },
  {
    id: 12,
    nombre: 'Barbara Mori',
    descripcion: 'Philadelphia, coctel de frutas y lechera',
    precio: 65,
    categoria: Categoria.CREPAS,
    disponible: true,
    ingredientes: ingredientesCrepas,
  },
  {
    id: 13,
    nombre: 'BTS',
    descripcion: 'Philadelphia, fresas, kiwi, mango y lechera',
    precio: 75,
    categoria: Categoria.CREPAS,
    disponible: true,
    ingredientes: ingredientesCrepas,
  },
  {
    id: 14,
    nombre: 'Neymar',
    descripcion: 'Crema de cacahuate, mermelada de fresa y nuez',
    precio: 62,
    categoria: Categoria.CREPAS,
    disponible: true,
    ingredientes: ingredientesCrepas,
  },

  // PASTAS
  {
    id: 15,
    nombre: 'Pasta Alfredo',
    descripcion: 'Espagueti, crema de leche, tocino y parmesano',
    precio: 100,
    categoria: Categoria.PASTAS,
    disponible: true,
    ingredientes: ingredientesPastas,
  },
  {
    id: 16,
    nombre: 'Pasta Alfredo con Camarón',
    descripcion: 'Espagueti, crema de leche, camarón, tocino y parmesano',
    precio: 140,
    categoria: Categoria.PASTAS,
    disponible: true,
    ingredientes: ingredientesPastas,
  },
  {
    id: 17,
    nombre: 'Pasta Toscana',
    descripcion: 'Espagueti, crema de leche, tomate cherry, espinaca y parmesano',
    precio: 100,
    categoria: Categoria.PASTAS,
    disponible: true,
    ingredientes: ingredientesPastas,
  },
  {
    id: 18,
    nombre: 'Pasta Toscana con Camarón',
    descripcion: 'Espagueti, crema de leche, tomate cherry, espinaca, parmesano y camarón',
    precio: 140,
    categoria: Categoria.PASTAS,
    disponible: true,
    ingredientes: ingredientesPastas,
  },
  {
    id: 19,
    nombre: 'Pasta a la Bolognesa',
    descripcion: 'Espagueti, salsa italiana, carne molida y parmesano',
    precio: 100,
    categoria: Categoria.PASTAS,
    disponible: true,
    ingredientes: ingredientesPastas,
  },

  // PANINIS
  {
    id: 20,
    nombre: 'Panino Rincón Francés',
    descripcion: 'Pan de caja artesanal, jamón de pavo, jamón serrano, espinaca, tomate cherry, cebolla morada, aceitunas negras, crema de leche y queso gouda',
    precio: 105,
    categoria: Categoria.PANINIS,
    disponible: true,
    ingredientes: ingredientesPaninis,
  },
  {
    id: 21,
    nombre: 'Panino Toxico',
    descripcion: 'Pan de caja artesanal, jamón de pavo, jamón serrano, chorizo español, tocino, peperoni, crema de leche, espinaca y queso gouda',
    precio: 105,
    categoria: Categoria.PANINIS,
    disponible: true,
    ingredientes: ingredientesPaninis,
  },
  {
    id: 22,
    nombre: 'Orden de Pan de Ajo con Queso',
    descripcion: 'Pan de caja artesanal, crema de ajo y queso gouda',
    precio: 60,
    categoria: Categoria.PANINIS,
    disponible: true,
    ingredientes: ingredientesPaninis,
  },

  // PIZZAS
  {
    id: 23,
    nombre: 'Pizza Peperoni',
    descripcion: 'Mezcla de quesos, salsa italiana y peperoni',
    precio: 135,
    categoria: Categoria.PIZZAS,
    disponible: true,
    ingredientes: ingredientesPizzas,
  },
  {
    id: 24,
    nombre: 'Pizza Hawaiana',
    descripcion: 'Mezcla de quesos, salsa italiana, jamón y piña',
    precio: 135,
    categoria: Categoria.PIZZAS,
    disponible: true,
    ingredientes: ingredientesPizzas,
  },
  {
    id: 25,
    nombre: 'Pizza Mexicana',
    descripcion: 'Mezcla de quesos, salsa italiana, cebolla, pimientos, chorizo y chile jalapeño',
    precio: 158,
    categoria: Categoria.PIZZAS,
    disponible: true,
    ingredientes: ingredientesPizzas,
  },
  {
    id: 26,
    nombre: 'Pizza Mediterranea',
    descripcion: 'Mezcla de quesos, salsa italiana, espinaca, champiñones, cebolla morada, jamón serrano y aceitunas negras',
    precio: 195,
    categoria: Categoria.PIZZAS,
    disponible: true,
    ingredientes: ingredientesPizzas,
  },
  {
    id: 27,
    nombre: 'Pizza Suprema',
    descripcion: 'Mezcla de quesos, salsa italiana, champiñones, cebolla, pimientos, chorizo y aceitunas negras',
    precio: 195,
    categoria: Categoria.PIZZAS,
    disponible: true,
    ingredientes: ingredientesPizzas,
  },
  {
    id: 28,
    nombre: 'Pizza Pastor',
    descripcion: 'Mezcla de quesos, salsa italiana, pastor, cebolla, cilantro y piña',
    precio: 195,
    categoria: Categoria.PIZZAS,
    disponible: true,
    ingredientes: ingredientesPizzas,
  },
  {
    id: 29,
    nombre: 'Pizza Tomica',
    descripcion: 'Mezcla de quesos, salsa italiana, jamón de pavo, peperoni, chorizo y tocino',
    precio: 215,
    categoria: Categoria.PIZZAS,
    disponible: true,
    ingredientes: ingredientesPizzas,
  },
  {
    id: 30,
    nombre: 'Pizza Regia',
    descripcion: 'Mezcla de quesos, salsa italiana, sirloin, tocino, cebolla y pimientos',
    precio: 215,
    categoria: Categoria.PIZZAS,
    disponible: true,
    ingredientes: ingredientesPizzas,
  },
  {
    id: 31,
    nombre: 'Pizza Marinera',
    descripcion: 'Mezcla de quesos, salsa italiana, cebolla, pimientos y camarones salteados',
    precio: 250,
    categoria: Categoria.PIZZAS,
    disponible: true,
    ingredientes: ingredientesPizzas,
  },

  // BEBIDAS (Placeholder - puede ajustarse)
  {
    id: 32,
    nombre: 'Bebida Refrescante',
    descripcion: 'Bebida fría',
    precio: 30,
    categoria: Categoria.BEBIDAS,
    disponible: true,
  },

  // POSTRES (Placeholder - puede ajustarse)
  {
    id: 33,
    nombre: 'Postre Variado',
    descripcion: 'Postres frescos',
    precio: 50,
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
