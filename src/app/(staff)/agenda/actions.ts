"use server";

import { revalidatePath } from "next/cache";
import { crearCita, reprogramarCita, cambiarEstadoCita, ConflictoHorarioError, type EstadoCita } from "@/data/citas";

export interface EstadoFormCita {
  error: string | null;
  ok?: boolean;
}

function combinarFechaHora(fecha: string, hora: string): string {
  return new Date(`${fecha}T${hora}:00`).toISOString();
}

export async function crearCitaAction(_prev: EstadoFormCita, formData: FormData): Promise<EstadoFormCita> {
  const pacienteId = String(formData.get("paciente_id") ?? "");
  const fecha = String(formData.get("fecha") ?? "");
  const hora = String(formData.get("hora") ?? "");
  const duracion = Number(formData.get("duracion_minutos")) || 30;
  const motivo = String(formData.get("motivo") ?? "");

  if (!pacienteId || !fecha || !hora) {
    return { error: "Selecciona paciente, fecha y hora." };
  }

  const inicio = combinarFechaHora(fecha, hora);
  const fin = new Date(new Date(inicio).getTime() + duracion * 60000).toISOString();

  try {
    await crearCita({ paciente_id: pacienteId, inicio, fin, motivo: motivo || undefined });
  } catch (err) {
    if (err instanceof ConflictoHorarioError) return { error: err.message };
    throw err;
  }

  revalidatePath("/agenda");
  return { error: null, ok: true };
}

export async function reprogramarCitaAction(citaId: string, formData: FormData) {
  const fecha = String(formData.get("fecha") ?? "");
  const hora = String(formData.get("hora") ?? "");
  const duracion = Number(formData.get("duracion_minutos")) || 30;
  if (!fecha || !hora) return { error: "Falta fecha u hora." };

  const inicio = combinarFechaHora(fecha, hora);
  const fin = new Date(new Date(inicio).getTime() + duracion * 60000).toISOString();

  try {
    await reprogramarCita(citaId, inicio, fin);
  } catch (err) {
    if (err instanceof ConflictoHorarioError) return { error: err.message };
    throw err;
  }
  revalidatePath("/agenda");
  return { error: null };
}

export async function cambiarEstadoCitaAction(citaId: string, estado: EstadoCita) {
  await cambiarEstadoCita(citaId, estado);
  revalidatePath("/agenda");
}
