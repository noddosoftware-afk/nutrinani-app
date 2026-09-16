import { Poblacion, ResultadoCalculo, redondear } from "./types";

export type NivelActividad =
  | "sedentario"
  | "ligero"
  | "moderado"
  | "activo"
  | "muy_activo";

/**
 * Factores de actividad física (PAL) configurables por la nutrióloga.
 * Valores iniciales según clasificación clásica usada junto a Harris-Benedict/Mifflin.
 */
export const FACTORES_ACTIVIDAD_DEFAULT: Record<NivelActividad, number> = {
  sedentario: 1.2,
  ligero: 1.375,
  moderado: 1.55,
  activo: 1.725,
  muy_activo: 1.9,
};

export interface EntradaTDEE {
  bmrKcal: number;
  nivelActividad: NivelActividad;
  /** Permite a la nutrióloga sobreescribir el factor default */
  factorPersonalizado?: number;
}

export function calcularTDEE(entrada: EntradaTDEE): ResultadoCalculo<number> {
  const advertencias: string[] = [];
  const factor =
    entrada.factorPersonalizado ?? FACTORES_ACTIVIDAD_DEFAULT[entrada.nivelActividad];

  if (entrada.factorPersonalizado) {
    advertencias.push(
      `Factor de actividad personalizado (${entrada.factorPersonalizado}) en lugar del valor por defecto (${FACTORES_ACTIVIDAD_DEFAULT[entrada.nivelActividad]}).`
    );
  }

  const base = {
    formula: "GET = GEB × factor de actividad",
    version: "Factores PAL clásicos (Harris-Benedict/Mifflin)",
    fuente: "Clasificación estándar de niveles de actividad física, configurable por la profesional.",
    unidades: "kcal/día",
    poblacionAplicable: ["adulto"] as Poblacion[],
    entradas: { ...entrada, factorAplicado: factor },
    advertencias,
  };

  if (!(entrada.bmrKcal > 0)) {
    advertencias.push("Se requiere un metabolismo basal válido (>0) para calcular el gasto energético total.");
    return { ...base, valor: null, bloqueado: true };
  }

  return {
    ...base,
    valor: redondear(entrada.bmrKcal * factor, 0),
    bloqueado: false,
    poblacionAplicable: ["adulto"],
  };
}
