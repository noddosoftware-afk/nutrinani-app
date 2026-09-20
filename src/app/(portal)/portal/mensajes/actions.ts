"use server";

import { revalidatePath } from "next/cache";
import { enviarMensajePaciente } from "@/data/mensajes";

export async function enviarMensajePacienteAction(formData: FormData) {
  const cuerpo = String(formData.get("cuerpo") ?? "");
  await enviarMensajePaciente(cuerpo);
  revalidatePath("/portal/mensajes");
}
