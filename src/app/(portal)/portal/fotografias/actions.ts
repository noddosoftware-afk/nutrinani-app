"use server";

import { revalidatePath } from "next/cache";
import { getSesionActual } from "@/data/auth";
import { subirFotografiaPropia } from "@/data/fotografias";

export interface EstadoSubirFoto {
  error: string | null;
  ok?: boolean;
}

export async function subirFotoPropiaAction(_prev: EstadoSubirFoto, formData: FormData): Promise<EstadoSubirFoto> {
  const sesion = await getSesionActual();
  if (!sesion?.pacienteId) return { error: "No autorizado" };

  const archivo = formData.get("archivo") as File;
  if (!archivo || archivo.size === 0) return { error: "Selecciona una foto antes de subir." };

  try {
    await subirFotografiaPropia({
      paciente_id: sesion.pacienteId,
      archivo,
      vista: (formData.get("vista") as "frente" | "perfil" | "espalda" | "otra") || "otra",
      fecha_captura: new Date().toISOString().slice(0, 10),
    });
  } catch {
    return { error: "No se pudo subir la foto. Intenta de nuevo." };
  }

  revalidatePath("/portal/fotografias");
  return { error: null, ok: true };
}
