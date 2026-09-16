import { Poblacion, ResultadoCalculo, Sexo, redondear } from "./types";

export type FormulaBMR = "mifflin_st_jeor" | "harris_benedict_revisada";

export interface EntradaBMR {
  formula: FormulaBMR;
  pesoKg: number;
  tallaCm: number;
  edadAnios: number;
  sexo: Sexo;
  poblacion: Poblacion;
}

const FORMULAS: Record<
  FormulaBMR,
  {
    formula: string;
    version: string;
    fuente: string;
    calcular: (e: EntradaBMR) => number;
  }
> = {
  mifflin_st_jeor: {
    formula:
      "Hombres: (10×peso) + (6.25×talla) − (5×edad) + 5 | Mujeres: (10×peso) + (6.25×talla) − (5×edad) − 161",
    version: "Mifflin-St Jeor 1990",
    fuente:
      "Mifflin MD, St Jeor ST, et al. A new predictive equation for resting energy expenditure in healthy individuals. Am J Clin Nutr. 1990;51(2):241-247.",
    calcular: (e) => {
      const base = 10 * e.pesoKg + 6.25 * e.tallaCm - 5 * e.edadAnios;
      return e.sexo === "masculino" ? base + 5 : base - 161;
    },
  },
  harris_benedict_revisada: {
    formula:
      "Hombres: 88.362 + (13.397×peso) + (4.799×talla) − (5.677×edad) | Mujeres: 447.593 + (9.247×peso) + (3.098×talla) − (4.330×edad)",
    version: "Harris-Benedict revisada (Roza & Shizgal, 1984)",
    fuente:
      "Roza AM, Shizgal HM. The Harris Benedict equation reevaluated: resting energy requirements and the body cell mass. Am J Clin Nutr. 1984;40(1):168-182.",
    calcular: (e) =>
      e.sexo === "masculino"
        ? 88.362 + 13.397 * e.pesoKg + 4.799 * e.tallaCm - 5.677 * e.edadAnios
        : 447.593 + 9.247 * e.pesoKg + 3.098 * e.tallaCm - 4.33 * e.edadAnios,
  },
};

/**
 * Metabolismo basal / gasto energético en reposo.
 * Ambas fórmulas están validadas para adultos no embarazadas/lactantes.
 * Mifflin-St Jeor es la referencia preferida en población general adulta (mayor precisión reportada).
 */
export function calcularBMR(entrada: EntradaBMR): ResultadoCalculo<number> {
  const def = FORMULAS[entrada.formula];
  const advertencias: string[] = [];
  const base = {
    formula: def.formula,
    version: def.version,
    fuente: def.fuente,
    unidades: "kcal/día",
    poblacionAplicable: ["adulto"] as Poblacion[],
    entradas: { ...entrada },
    advertencias,
  };

  if (entrada.poblacion !== "adulto") {
    advertencias.push(
      "Esta fórmula es para adultos. No usar como valor predeterminado en menores, embarazo o lactancia."
    );
    return { ...base, valor: null, bloqueado: true };
  }

  if (!(entrada.pesoKg > 0) || !(entrada.tallaCm > 0) || !(entrada.edadAnios > 0)) {
    advertencias.push("Peso, talla y edad son indispensables y deben ser mayores a cero.");
    return { ...base, valor: null, bloqueado: true };
  }

  if (entrada.edadAnios < 18 || entrada.edadAnios > 80) {
    advertencias.push(
      "Edad fuera del rango típicamente validado (18-80 años) para esta fórmula. Interpretar con cautela."
    );
  }

  const valor = def.calcular(entrada);
  return { ...base, valor: redondear(valor, 0), bloqueado: false };
}
