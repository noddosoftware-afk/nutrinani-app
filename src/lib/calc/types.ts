// Tipos compartidos del motor de cálculos nutricionales.
// Cada cálculo devuelve un objeto trazable: fórmula, fuente, entradas, y advertencias.
// Nunca se regresa un número "pelón" — siempre va acompañado de su procedencia.

export type Sexo = "masculino" | "femenino";

export type Poblacion = "adulto" | "menor" | "embarazo" | "lactancia";

export interface ResultadoCalculo<T> {
  valor: T | null;
  formula: string;
  version: string;
  fuente: string;
  unidades: string;
  poblacionAplicable: Poblacion[];
  entradas: Record<string, unknown>;
  advertencias: string[];
  /** true si el cálculo no pudo ejecutarse por datos faltantes/incompatibles */
  bloqueado: boolean;
}

export class DatosInsuficientesError extends Error {
  constructor(mensaje: string) {
    super(mensaje);
    this.name = "DatosInsuficientesError";
  }
}

/** Redondeo consistente: no se redondea hasta el resultado final que se muestra. */
export function redondear(valor: number, decimales = 1): number {
  const factor = 10 ** decimales;
  return Math.round((valor + Number.EPSILON) * factor) / factor;
}
