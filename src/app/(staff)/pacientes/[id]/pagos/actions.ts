"use server";

import { revalidatePath } from "next/cache";
import { registrarPago } from "@/data/pagos";

export async function registrarPagoAction(pacienteId: string, formData: FormData) {
  const concepto = String(formData.get("concepto") ?? "");
  const monto = Number(formData.get("monto"));
  const metodo = String(formData.get("metodo") ?? "efectivo") as "efectivo" | "transferencia" | "tarjeta" | "otro";
  const fecha = String(formData.get("fecha") ?? new Date().toISOString().slice(0, 10));

  if (!concepto || !(monto > 0)) return;

  await registrarPago({ paciente_id: pacienteId, concepto, monto, metodo, fecha });
  revalidatePath(`/pacientes/${pacienteId}/pagos`);
}
