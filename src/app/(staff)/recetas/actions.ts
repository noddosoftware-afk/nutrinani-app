"use server";

import { redirect } from "next/navigation";
import { crearReceta } from "@/data/alimentos";

export async function crearRecetaAction(formData: FormData) {
  const nombre = String(formData.get("nombre") ?? "");
  const preparacion = String(formData.get("preparacion") ?? "");
  const rendimiento = Number(formData.get("rendimiento_porciones")) || 1;
  const ingredientesJson = String(formData.get("ingredientes") ?? "[]");
  const ingredientes = JSON.parse(ingredientesJson) as { alimento_id: string; gramos: number }[];

  const receta = await crearReceta({
    nombre,
    preparacion,
    rendimiento_porciones: rendimiento,
    ingredientes: ingredientes.filter((i) => i.alimento_id && i.gramos > 0),
  });

  redirect(`/recetas/${receta.id}`);
}
