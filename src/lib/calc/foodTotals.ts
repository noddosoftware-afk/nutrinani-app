import { redondear } from "./types";

/**
 * Un nutriente puede ser un número (valor conocido) o null (desconocido/no reportado por la fuente).
 * NUNCA se debe confundir "desconocido" con "cero" — null se propaga y marca el total como incompleto.
 */
export interface PerfilNutrientes {
  energiaKcal: number | null;
  proteinaG: number | null;
  carbohidratoG: number | null;
  grasaG: number | null;
  fibraG: number | null;
  sodioMg: number | null;
}

export interface ItemCantidad {
  perfilPor100g: PerfilNutrientes;
  gramos: number;
}

export interface TotalNutrientes extends PerfilNutrientes {
  /** nombres de nutrientes que no pudieron sumarse por tener al menos un valor desconocido */
  nutrientesIncompletos: (keyof PerfilNutrientes)[];
}

function sumarCampo(
  items: ItemCantidad[],
  campo: keyof PerfilNutrientes
): { valor: number | null; incompleto: boolean } {
  let suma = 0;
  for (const item of items) {
    const valorPor100g = item.perfilPor100g[campo];
    if (valorPor100g === null) {
      return { valor: null, incompleto: true };
    }
    suma += (valorPor100g * item.gramos) / 100;
  }
  return { valor: redondear(suma, 1), incompleto: false };
}

/**
 * Suma los nutrientes de una lista de alimentos/ingredientes ya pesados en gramos.
 * Sirve tanto para un alimento único, una receta, una comida o el total del día
 * (basta con concatenar los items del nivel correspondiente).
 */
export function calcularTotalNutrientes(items: ItemCantidad[]): TotalNutrientes {
  const campos: (keyof PerfilNutrientes)[] = [
    "energiaKcal",
    "proteinaG",
    "carbohidratoG",
    "grasaG",
    "fibraG",
    "sodioMg",
  ];

  const resultado: Partial<TotalNutrientes> = { nutrientesIncompletos: [] };

  for (const campo of campos) {
    const { valor, incompleto } = sumarCampo(items, campo);
    resultado[campo] = valor as never;
    if (incompleto) resultado.nutrientesIncompletos!.push(campo);
  }

  return resultado as TotalNutrientes;
}
