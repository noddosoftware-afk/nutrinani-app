import { redondear } from "./types";

export interface CambioMedicion {
  valorInicial: number | null;
  valorComparado: number | null;
  cambioAbsoluto: number | null;
  /** null cuando no puede calcularse (valor inicial 0, faltante, o valor comparado faltante) */
  cambioPorcentual: number | null;
  /** Explica por qué algo salió null, para mostrarlo en la UI en vez de dejarlo en blanco sin más */
  nota: string | null;
}

/**
 * Calcula cambio absoluto y porcentual entre dos mediciones.
 * Regla explícita del proyecto: si el valor inicial es 0 o no existe, el cambio porcentual
 * NO puede calcularse — se marca como null con una nota, nunca se infiere como 0 o 100%.
 */
export function calcularCambio(
  valorInicial: number | null | undefined,
  valorComparado: number | null | undefined
): CambioMedicion {
  const inicial = valorInicial ?? null;
  const comparado = valorComparado ?? null;

  if (inicial === null || comparado === null) {
    return {
      valorInicial: inicial,
      valorComparado: comparado,
      cambioAbsoluto: null,
      cambioPorcentual: null,
      nota: "Falta al menos uno de los dos valores; no se puede calcular el cambio.",
    };
  }

  const cambioAbsoluto = redondear(comparado - inicial, 1);

  if (inicial === 0) {
    return {
      valorInicial: inicial,
      valorComparado: comparado,
      cambioAbsoluto,
      cambioPorcentual: null,
      nota: "El valor inicial es 0; el cambio porcentual no puede calcularse.",
    };
  }

  const cambioPorcentual = redondear((cambioAbsoluto / inicial) * 100, 1);

  return {
    valorInicial: inicial,
    valorComparado: comparado,
    cambioAbsoluto,
    cambioPorcentual,
    nota: null,
  };
}
