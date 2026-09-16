"use server";

import { revalidatePath } from "next/cache";
import { getSesionActual } from "@/data/auth";
import { subirFotografiaPropia } from "@/data/fotografias";

export async function subirFotoPropiaAction(formData: FormData) {
  const sesion = await getSesionActual();
  if (!sesion?.pacienteId) throw new Error("No autorizado");

  const archivo = formData.get("archivo") as File;
  if (!archivo || archivo.size === 0) return;

  await subirFotografiaPropia({
    paciente_id: sesion.pacienteId,
    archivo,
    vista: (formData.get("vista") as "frente" | "perfil" | "espalda" | "otra") || "otra",
    fecha_captura: new Date().toISOString().slice(0, 10),
  });

  revalidatePath("/portal/fotografias");
}
