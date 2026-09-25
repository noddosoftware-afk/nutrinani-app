"use server";

import { revalidatePath } from "next/cache";
import { crearEjercicio, type NivelEntrenamiento } from "@/data/ejercicios";

export async function crearEjercicioAction(formData: FormData) {
  const nombre = String(formData.get("nombre") ?? "").trim();
  const grupo_muscular = String(formData.get("grupo_muscular") ?? "").trim();
  const nivel = String(formData.get("nivel") ?? "principiante") as NivelEntrenamiento;
  const descripcion = String(formData.get("descripcion") ?? "").trim();
  const series = Number(formData.get("series_sugeridas")) || undefined;
  const repeticiones = String(formData.get("repeticiones_sugeridas") ?? "").trim();

  if (!nombre || !grupo_muscular) return;

  await crearEjercicio({
    nombre,
    grupo_muscular,
    nivel,
    descripcion: descripcion || undefined,
    series_sugeridas: series,
    repeticiones_sugeridas: repeticiones || undefined,
  });

  revalidatePath("/entrenamientos");
}
