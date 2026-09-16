"use server";

import { revalidatePath } from "next/cache";
import { crearAlimento } from "@/data/alimentos";

function numOrNull(formData: FormData, campo: string): number | null {
  const v = formData.get(campo);
  if (v === null || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export async function crearAlimentoAction(formData: FormData) {
  await crearAlimento({
    nombre: String(formData.get("nombre") ?? ""),
    categoria: (formData.get("categoria") as string) || null,
    porcion_descripcion: (formData.get("porcion_descripcion") as string) || null,
    porcion_gramos: numOrNull(formData, "porcion_gramos"),
    estado_coccion: (formData.get("estado_coccion") as "crudo" | "cocido" | "no_aplica") || "no_aplica",
    energia_kcal_100g: numOrNull(formData, "energia_kcal_100g"),
    proteina_g_100g: numOrNull(formData, "proteina_g_100g"),
    carbohidrato_g_100g: numOrNull(formData, "carbohidrato_g_100g"),
    grasa_g_100g: numOrNull(formData, "grasa_g_100g"),
    fibra_g_100g: numOrNull(formData, "fibra_g_100g"),
    sodio_mg_100g: numOrNull(formData, "sodio_mg_100g"),
    alergenos: String(formData.get("alergenos") ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
  });

  revalidatePath("/alimentos");
}
