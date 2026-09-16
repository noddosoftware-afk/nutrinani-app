"use server";

import { redirect } from "next/navigation";
import { crearConsulta } from "@/data/consultas";
import {
  calcularIMC,
  calcularBMR,
  calcularTDEE,
  calcularObjetivoEnergetico,
  calcularMacros,
  type FormulaBMR,
  type NivelActividad,
  type Poblacion,
} from "@/lib/calc";

function num(formData: FormData, campo: string): number | undefined {
  const v = formData.get(campo);
  if (v === null || v === "") return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

export interface EstadoNuevaConsulta {
  error: string | null;
}

/**
 * Recalcula TODO en el servidor a partir de los datos crudos del formulario — nunca
 * se confía en los números que el cliente haya mostrado como vista previa. El motor
 * de cálculos (src/lib/calc) es la única fuente de verdad para lo que se guarda.
 */
export async function crearConsultaAction(
  pacienteId: string,
  edadAnios: number,
  sexoDefault: "masculino" | "femenino",
  _prevState: EstadoNuevaConsulta,
  formData: FormData
): Promise<EstadoNuevaConsulta> {
  const pesoKg = num(formData, "peso_kg");
  const tallaCm = num(formData, "talla_cm");
  const sexo = (formData.get("sexo") as "masculino" | "femenino") || sexoDefault;
  const poblacion = (formData.get("poblacion") as Poblacion) || "adulto";
  const formulaBMR = (formData.get("formula_bmr") as FormulaBMR) || "mifflin_st_jeor";
  const nivelActividad = (formData.get("nivel_actividad") as NivelActividad) || "sedentario";
  const ajusteKcal = num(formData, "ajuste_kcal") ?? 0;
  const motivoAjuste = String(formData.get("motivo_ajuste") ?? "");
  const pctProteina = num(formData, "pct_proteina") ?? 0;
  const pctCarbohidrato = num(formData, "pct_carbohidrato") ?? 0;
  const pctGrasa = num(formData, "pct_grasa") ?? 0;

  const calculos: { tipo: string; resultado: unknown }[] = [];

  if (pesoKg && tallaCm) {
    calculos.push({ tipo: "imc", resultado: calcularIMC({ pesoKg, tallaCm, edadAnios, poblacion }) });
  }

  let objetivoKcal: number | null = null;
  if (pesoKg && tallaCm) {
    const bmr = calcularBMR({ formula: formulaBMR, pesoKg, tallaCm, edadAnios, sexo, poblacion });
    calculos.push({ tipo: "bmr", resultado: bmr });

    if (bmr.valor) {
      const tdee = calcularTDEE({ bmrKcal: bmr.valor, nivelActividad });
      calculos.push({ tipo: "tdee", resultado: tdee });

      if (tdee.valor && motivoAjuste) {
        const objetivo = calcularObjetivoEnergetico({ tdeeKcal: tdee.valor, ajusteKcal, motivo: motivoAjuste });
        calculos.push({ tipo: "objetivo_energetico", resultado: objetivo });
        objetivoKcal = objetivo.valor;

        if (objetivoKcal && pesoKg && pctProteina + pctCarbohidrato + pctGrasa > 0) {
          const macros = calcularMacros({
            objetivoKcal,
            pesoKg,
            porcentajes: { proteina: pctProteina, carbohidrato: pctCarbohidrato, grasa: pctGrasa },
          });
          calculos.push({ tipo: "macros", resultado: macros });
        }
      }
    }
  }

  await crearConsulta({
    paciente_id: pacienteId,
    motivo: (formData.get("motivo") as string) || undefined,
    evaluacion: (formData.get("evaluacion") as string) || undefined,
    acuerdos: (formData.get("acuerdos") as string) || undefined,
    proxima_revision: (formData.get("proxima_revision") as string) || undefined,
    notas_internas: (formData.get("notas_internas") as string) || undefined,
    medicion:
      pesoKg || tallaCm
        ? {
            fecha: new Date().toISOString(),
            peso_kg: pesoKg ?? null,
            talla_cm: tallaCm ?? null,
            cintura_cm: num(formData, "cintura_cm") ?? null,
            cadera_cm: num(formData, "cadera_cm") ?? null,
            porcentaje_grasa: num(formData, "porcentaje_grasa") ?? null,
            masa_muscular_kg: num(formData, "masa_muscular_kg") ?? null,
            fuente: "consultorio",
          }
        : undefined,
    calculos: calculos as { tipo: string; resultado: import("@/lib/calc").ResultadoCalculo<unknown> }[],
  });

  redirect(`/pacientes/${pacienteId}/consultas`);
}
