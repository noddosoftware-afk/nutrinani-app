import { Poblacion, ResultadoCalculo, redondear } from "./types";
import { ValorMacros } from "./macros";

export interface TiempoComida {
  nombre: string;
  /** Porcentaje del total diario asignado a este tiempo de comida */
  porcentaje: number;
}

export interface EntradaDistribucionComidas {
  totales: ValorMacros;
  objetivoKcal: number;
  tiempos: TiempoComida[];
}

export interface DistribucionTiempo {
  nombre: string;
  porcentaje: number;
  kcal: number;
  proteinaG: number;
  carbohidratoG: number;
  grasaG: number;
}

export function calcularDistribucionPorTiempos(
  entrada: EntradaDistribucionComidas
): ResultadoCalculo<DistribucionTiempo[]> {
  const advertencias: string[] = [];
  const base = {
    formula: "valor_por_tiempo = total_diario × (porcentaje_tiempo / 100)",
    version: "1.0",
    fuente: "Distribución configurada por la nutrióloga.",
    unidades: "kcal y g",
    poblacionAplicable: ["adulto"] as Poblacion[],
    entradas: { ...entrada },
    advertencias,
  };

  if (entrada.tiempos.length === 0) {
    advertencias.push("Debe configurarse al menos un tiempo de comida.");
    return { ...base, valor: null, bloqueado: true };
  }

  const sumaPct = entrada.tiempos.reduce((acc, t) => acc + t.porcentaje, 0);
  if (Math.abs(sumaPct - 100) > 0.5) {
    advertencias.push(`Los porcentajes de los tiempos de comida suman ${sumaPct}%, deben sumar 100%.`);
    return { ...base, valor: null, bloqueado: true };
  }

  const valor = entrada.tiempos.map((t) => ({
    nombre: t.nombre,
    porcentaje: t.porcentaje,
    kcal: redondear(entrada.objetivoKcal * (t.porcentaje / 100), 0),
    proteinaG: redondear(entrada.totales.proteina.gramos * (t.porcentaje / 100), 0),
    carbohidratoG: redondear(entrada.totales.carbohidrato.gramos * (t.porcentaje / 100), 0),
    grasaG: redondear(entrada.totales.grasa.gramos * (t.porcentaje / 100), 0),
  }));

  return { ...base, valor, bloqueado: false };
}
