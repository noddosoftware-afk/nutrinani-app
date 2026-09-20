"use server";

import { revalidatePath } from "next/cache";
import { enviarMensajeStaff } from "@/data/mensajes";

export async function enviarMensajeStaffAction(pacienteId: string, formData: FormData) {
  const cuerpo = String(formData.get("cuerpo") ?? "");
  await enviarMensajeStaff(pacienteId, cuerpo);
  revalidatePath(`/mensajes`);
  revalidatePath(`/mensajes/${pacienteId}`);
}
