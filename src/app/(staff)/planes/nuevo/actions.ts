"use server";

import { redirect } from "next/navigation";
import { crearPlan, type NuevoPlan } from "@/data/planes";

export async function crearPlanAction(pacienteId: string, formData: FormData) {
  const nombre = String(formData.get("nombre") ?? "Plan de alimentación");
  const objetivoKcal = Number(formData.get("objetivo_kcal")) || undefined;
  const estructuraJson = String(formData.get("estructura") ?? "[]");
  const dias = JSON.parse(estructuraJson) as NuevoPlan["dias"];

  const plan = await crearPlan({
    paciente_id: pacienteId,
    nombre,
    objetivo_kcal: objetivoKcal,
    dias,
  });

  redirect(`/planes/${plan.id}`);
}
