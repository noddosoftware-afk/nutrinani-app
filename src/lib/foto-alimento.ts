/**
 * Mapeo por nombre a fotos de demostración generadas para el catálogo semilla.
 * El esquema de `alimentos`/`recetas` no guarda una imagen todavía (fuera de alcance
 * de la Fase 1) — esto es una capa puramente visual para la demo con Daniela.
 */
const FOTOS_ALIMENTO: Record<string, string> = {
  "pechuga de pollo cocida": "/food/pollo.jpg",
  "arroz blanco cocido": "/food/arroz.jpg",
  "brócoli cocido": "/food/brocoli.jpg",
  "huevo cocido": "/food/huevo.jpg",
  "atún en agua": "/food/atun.jpg",
  "salmón cocido": "/food/salmon.jpg",
  "carne de res magra cocida": "/food/res.jpg",
  "pavo pechuga cocida": "/food/pavo.jpg",
  "frijoles negros cocidos": "/food/frijoles.jpg",
  tofu: "/food/tofu.jpg",
  "avena cocida": "/food/avena.jpg",
  "tortilla de maíz": "/food/tortilla.jpg",
  "pan integral": "/food/pan-integral.jpg",
  "papa cocida": "/food/papa.jpg",
  "camote cocido": "/food/camote.jpg",
  "quinoa cocida": "/food/quinoa.jpg",
  manzana: "/food/manzana.jpg",
  plátano: "/food/platano.jpg",
  fresas: "/food/fresas.jpg",
  papaya: "/food/papaya.jpg",
  mango: "/food/mango.jpg",
  naranja: "/food/naranja.jpg",
  "espinaca cocida": "/food/espinaca.jpg",
  zanahoria: "/food/zanahoria.jpg",
  jitomate: "/food/jitomate.jpg",
  "calabacita cocida": "/food/calabacita.jpg",
  pepino: "/food/pepino.jpg",
  "champiñones cocidos": "/food/champinones.jpg",
  "yogur griego natural": "/food/yogur-griego.jpg",
  "leche descremada": "/food/leche-descremada.jpg",
  almendras: "/food/almendras.jpg",
  aguacate: "/food/aguacate.jpg",
  "aceite de oliva": "/food/aceite-oliva.jpg",
};

const FOTOS_RECETA: Record<string, string> = {
  "pollo con arroz y brócoli": "/food/receta-pollo-arroz-brocoli.jpg",
};

function normalizar(nombre: string) {
  return nombre.trim().toLowerCase();
}

export function fotoDeAlimento(nombre: string): string | null {
  return FOTOS_ALIMENTO[normalizar(nombre)] ?? null;
}

export function fotoDeReceta(nombre: string): string | null {
  return FOTOS_RECETA[normalizar(nombre)] ?? null;
}
