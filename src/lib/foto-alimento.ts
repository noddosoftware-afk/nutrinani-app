/**
 * Mapeo por nombre a fotos de demostración generadas para el catálogo semilla.
 * El esquema de `alimentos`/`recetas` no guarda una imagen todavía (fuera de alcance
 * de la Fase 1) — esto es una capa puramente visual para la demo con Daniela.
 */
const FOTOS_ALIMENTO: Record<string, string> = {
  "pechuga de pollo cocida": "/food/pollo.png",
  "arroz blanco cocido": "/food/arroz.png",
  "brócoli cocido": "/food/brocoli.png",
};

const FOTOS_RECETA: Record<string, string> = {
  "pollo con arroz y brócoli": "/food/receta-pollo-arroz-brocoli.png",
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
