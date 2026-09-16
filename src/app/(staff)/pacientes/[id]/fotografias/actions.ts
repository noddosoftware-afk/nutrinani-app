"use server";

import { revalidatePath } from "next/cache";
import { subirFotografia } from "@/data/fotografias";

export async function subirFotografiaAction(pacienteId: string, formData: FormData) {
  const archivo = formData.get("archivo") as File;
  if (!archivo || archivo.size === 0) return;

  await subirFotografia({
    paciente_id: pacienteId,
    archivo,
    vista: (formData.get("vista") as "frente" | "perfil" | "espalda" | "otra") || "otra",
    fecha_captura: (formData.get("fecha_captura") as string) || new Date().toISOString().slice(0, 10),
    observaciones: (formData.get("observaciones") as string) || undefined,
    visibilidad: formData.get("compartir") === "on" ? "compartida_paciente" : "privada_staff",
  });

  revalidatePath(`/pacientes/${pacienteId}/fotografias`);
}
