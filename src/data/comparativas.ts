import "server-only";
import { calcularCambio, type CambioMedicion } from "@/lib/calc";
import type { Medicion } from "./consultas";

export interface FilaComparativa {
  indicador: string;
  unidad: string;
  fechaInicial: string | null;
  fechaComparada: string | null;
  cambio: CambioMedicion;
  meta: number | null;
  observaciones: string | null;
}

const INDICADORES: { campo: keyof Medicion; etiqueta: string; unidad: string }[] = [
  { campo: "peso_kg", etiqueta: "Peso", unidad: "kg" },
  { campo: "cintura_cm", etiqueta: "Cintura", unidad: "cm" },
  { campo: "cadera_cm", etiqueta: "Cadera", unidad: "cm" },
  { campo: "porcentaje_grasa", etiqueta: "% Grasa corporal", unidad: "%" },
  { campo: "masa_muscular_kg", etiqueta: "Masa muscular", unidad: "kg" },
];

/**
 * Construye la tabla comparativa entre dos mediciones elegidas libremente.
 * No asume que "inicial" es cronológicamente la más antigua — respeta el orden que
 * elige quien compara, pero conserva las fechas reales de cada una para mostrarlas.
 */
export function construirComparativa(
  inicial: Medicion | null,
  comparada: Medicion | null,
  metas: Partial<Record<string, number>> = {}
): FilaComparativa[] {
  return INDICADORES.map(({ campo, etiqueta, unidad }) => {
    const valorInicial = inicial ? (inicial[campo] as number | null) : null;
    const valorComparado = comparada ? (comparada[campo] as number | null) : null;
    return {
      indicador: etiqueta,
      unidad,
      fechaInicial: inicial?.fecha ?? null,
      fechaComparada: comparada?.fecha ?? null,
      cambio: calcularCambio(valorInicial, valorComparado),
      meta: metas[campo] ?? null,
      observaciones: null,
    };
  });
}
