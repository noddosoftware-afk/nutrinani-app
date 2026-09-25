"use server";

import { redirect } from "next/navigation";
import { crearRutina, type NuevaRutina } from "@/data/rutinas";

export async function crearRutinaAction(pacienteId: string, formData: FormData) {
  const nombre = String(formData.get("nombre") ?? "Rutina de entrenamiento");
  const recomendaciones = String(formData.get("recomendaciones") ?? "").trim();
  const estructuraJson = String(formData.get("estructura") ?? "[]");
  const dias = JSON.parse(estructuraJson) as NuevaRutina["dias"];

  const rutina = await crearRutina({
    paciente_id: pacienteId,
    nombre,
    recomendaciones: recomendaciones || undefined,
    dias,
  });

  redirect(`/rutinas/${rutina.id}`);
}
