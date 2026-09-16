import { Poblacion, ResultadoCalculo, redondear } from "./types";

export interface EntradaIMC {
  pesoKg: number;
  tallaCm: number;
  edadAnios: number;
  poblacion: Poblacion;
}

export type CategoriaIMC =
  | "bajo_peso"
  | "normal"
  | "sobrepeso"
  | "obesidad_i"
  | "obesidad_ii"
  | "obesidad_iii";

export interface ValorIMC {
  imc: number;
  categoria: CategoriaIMC;
}

/**
 * Índice de Masa Corporal (IMC) — OMS, adultos ≥18 años, no embarazo/lactancia.
 * Fórmula: IMC = peso(kg) / talla(m)²
 * Las categorías OMS para adultos NO aplican a menores (usan percentiles por edad/sexo,
 * fuera de alcance de este módulo) ni son el criterio primario en embarazo.
 */
export function calcularIMC(entrada: EntradaIMC): ResultadoCalculo<ValorIMC> {
  const advertencias: string[] = [];
  const base: Omit<ResultadoCalculo<ValorIMC>, "valor" | "bloqueado"> = {
    formula: "IMC = peso(kg) / talla(m)²",
    version: "OMS 1995 (adultos)",
    fuente: "Organización Mundial de la Salud, categorías de IMC para adultos",
    unidades: "kg/m²",
    poblacionAplicable: ["adulto"],
    entradas: { ...entrada },
    advertencias,
  };

  if (entrada.poblacion !== "adulto") {
    advertencias.push(
      "Las categorías de IMC para adultos no aplican a menores, embarazo o lactancia. Se requiere un módulo específico."
    );
    return { ...base, valor: null, bloqueado: true, advertencias };
  }

  if (entrada.edadAnios < 18) {
    advertencias.push("Edad menor a 18 años: usar percentiles pediátricos, no categorías de adulto.");
    return { ...base, valor: null, bloqueado: true, advertencias };
  }

  if (!(entrada.pesoKg > 0) || !(entrada.tallaCm > 0)) {
    advertencias.push("Peso y talla deben ser mayores a cero.");
    return { ...base, valor: null, bloqueado: true, advertencias };
  }

  const tallaM = entrada.tallaCm / 100;
  const imc = entrada.pesoKg / (tallaM * tallaM);

  let categoria: CategoriaIMC;
  if (imc < 18.5) categoria = "bajo_peso";
  else if (imc < 25) categoria = "normal";
  else if (imc < 30) categoria = "sobrepeso";
  else if (imc < 35) categoria = "obesidad_i";
  else if (imc < 40) categoria = "obesidad_ii";
  else categoria = "obesidad_iii";

  return {
    ...base,
    valor: { imc: redondear(imc, 1), categoria },
    bloqueado: false,
  };
}
