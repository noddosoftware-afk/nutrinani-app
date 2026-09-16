import { Poblacion, ResultadoCalculo, redondear } from "./types";

export interface EntradaObjetivoEnergetico {
  tdeeKcal: number;
  /** Ajuste absoluto en kcal definido por la nutrióloga. Positivo = superávit, negativo = déficit. */
  ajusteKcal: number;
  /** Motivo clínico del ajuste — obligatorio para trazabilidad. */
  motivo: string;
}

/**
 * Objetivo energético = GET + ajuste profesional.
 * El ajuste SIEMPRE debe llevar un motivo documentado (no es un número libre).
 */
export function calcularObjetivoEnergetico(
  entrada: EntradaObjetivoEnergetico
): ResultadoCalculo<number> {
  const advertencias: string[] = [];
  const base = {
    formula: "Objetivo energético = GET + ajuste profesional",
    version: "1.0",
    fuente: "Definido por criterio clínico de la nutrióloga responsable.",
    unidades: "kcal/día",
    poblacionAplicable: ["adulto"] as Poblacion[],
    entradas: { ...entrada },
    advertencias,
  };

  if (!(entrada.tdeeKcal > 0)) {
    advertencias.push("Se requiere un gasto energético total válido.");
    return { ...base, valor: null, bloqueado: true };
  }

  if (!entrada.motivo || entrada.motivo.trim().length === 0) {
    advertencias.push("Todo ajuste al gasto energético total debe registrar un motivo clínico.");
    return { ...base, valor: null, bloqueado: true };
  }

  const objetivo = entrada.tdeeKcal + entrada.ajusteKcal;

  if (objetivo < 1000) {
    advertencias.push(
      "El objetivo energético resultante es muy bajo (<1000 kcal/día). Revisar antes de usarlo en un plan."
    );
  }

  return { ...base, valor: redondear(objetivo, 0), bloqueado: false };
}
