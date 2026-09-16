import { Poblacion, ResultadoCalculo, redondear } from "./types";

/** kcal por gramo, valores Atwater estándar */
export const KCAL_POR_GRAMO = {
  proteina: 4,
  carbohidrato: 4,
  grasa: 9,
} as const;

export interface EntradaMacros {
  objetivoKcal: number;
  pesoKg: number;
  /** Porcentajes que deben sumar 100 */
  porcentajes: { proteina: number; carbohidrato: number; grasa: number };
}

export interface MacroDetalle {
  porcentaje: number;
  gramos: number;
  gramosPorKg: number;
  kcal: number;
}

export interface ValorMacros {
  proteina: MacroDetalle;
  carbohidrato: MacroDetalle;
  grasa: MacroDetalle;
}

/**
 * Distribución de macronutrientes en % / gramos / g por kg de peso.
 * Fórmula: gramos = (kcal_objetivo × %) / kcal_por_gramo
 */
export function calcularMacros(entrada: EntradaMacros): ResultadoCalculo<ValorMacros> {
  const advertencias: string[] = [];
  const base = {
    formula: "gramos = (kcal_objetivo × porcentaje) / kcal_por_gramo (Atwater: 4/4/9)",
    version: "1.0",
    fuente: "Factores de Atwater estándar.",
    unidades: "g y kcal",
    poblacionAplicable: ["adulto"] as Poblacion[],
    entradas: { ...entrada },
    advertencias,
  };

  const sumaPct =
    entrada.porcentajes.proteina + entrada.porcentajes.carbohidrato + entrada.porcentajes.grasa;

  if (!(entrada.objetivoKcal > 0)) {
    advertencias.push("Se requiere un objetivo energético válido.");
    return { ...base, valor: null, bloqueado: true };
  }

  if (!(entrada.pesoKg > 0)) {
    advertencias.push("Se requiere el peso actual para calcular gramos por kilogramo.");
    return { ...base, valor: null, bloqueado: true };
  }

  if (Math.abs(sumaPct - 100) > 0.5) {
    advertencias.push(`Los porcentajes suman ${sumaPct}%, deben sumar 100%.`);
    return { ...base, valor: null, bloqueado: true };
  }

  const detalle = (pct: number, kcalPorG: number): MacroDetalle => {
    const kcal = entrada.objetivoKcal * (pct / 100);
    const gramos = kcal / kcalPorG;
    return {
      porcentaje: pct,
      gramos: redondear(gramos, 0),
      gramosPorKg: redondear(gramos / entrada.pesoKg, 2),
      kcal: redondear(kcal, 0),
    };
  };

  return {
    ...base,
    valor: {
      proteina: detalle(entrada.porcentajes.proteina, KCAL_POR_GRAMO.proteina),
      carbohidrato: detalle(entrada.porcentajes.carbohidrato, KCAL_POR_GRAMO.carbohidrato),
      grasa: detalle(entrada.porcentajes.grasa, KCAL_POR_GRAMO.grasa),
    },
    bloqueado: false,
  };
}
