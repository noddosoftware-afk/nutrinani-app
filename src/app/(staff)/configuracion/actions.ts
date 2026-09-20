"use server";

import { revalidatePath } from "next/cache";
import { actualizarHorarioConsultorio, type HorarioAtencion } from "@/data/citas";
import { crearServicio, actualizarServicio, cambiarActivoServicio } from "@/data/pagos";
import { DIAS_SEMANA } from "@/lib/agenda-fechas";

export interface EstadoConfig {
  error: string | null;
  ok?: boolean;
}

export async function actualizarHorarioAction(_prev: EstadoConfig, formData: FormData): Promise<EstadoConfig> {
  const duracion = Number(formData.get("duracion_cita_minutos"));
  if (!duracion || duracion < 10) {
    return { error: "La duración de cita debe ser de al menos 10 minutos." };
  }

  const horario_atencion: HorarioAtencion["horario_atencion"] = {};
  for (const dia of DIAS_SEMANA) {
    const abierto = formData.get(`${dia}_abierto`) === "on";
    if (!abierto) {
      horario_atencion[dia] = null;
      continue;
    }
    const inicio = String(formData.get(`${dia}_inicio`) ?? "");
    const fin = String(formData.get(`${dia}_fin`) ?? "");
    if (!inicio || !fin || inicio >= fin) {
      return { error: `Revisa el horario del ${dia}: la hora de inicio debe ser antes que la de fin.` };
    }
    horario_atencion[dia] = { inicio, fin };
  }

  try {
    await actualizarHorarioConsultorio({ horario_atencion, duracion_cita_minutos: duracion });
  } catch {
    return { error: "No se pudo guardar el horario. Intenta de nuevo." };
  }

  revalidatePath("/configuracion");
  return { error: null, ok: true };
}

export async function crearServicioAction(_prev: EstadoConfig, formData: FormData): Promise<EstadoConfig> {
  const nombre = String(formData.get("nombre") ?? "").trim();
  const precio = Number(formData.get("precio"));
  const descripcion = String(formData.get("descripcion") ?? "").trim();

  if (!nombre) return { error: "Ingresa un nombre para el servicio." };
  if (!Number.isFinite(precio) || precio < 0) return { error: "Ingresa un precio válido." };

  try {
    await crearServicio(nombre, precio, descripcion || undefined);
  } catch {
    return { error: "No se pudo crear el servicio. Intenta de nuevo." };
  }

  revalidatePath("/configuracion");
  return { error: null, ok: true };
}

export async function actualizarServicioAction(id: string, formData: FormData) {
  const nombre = String(formData.get("nombre") ?? "").trim();
  const precio = Number(formData.get("precio"));
  if (!nombre || !Number.isFinite(precio) || precio < 0) return;

  await actualizarServicio(id, { nombre, precio });
  revalidatePath("/configuracion");
}

export async function cambiarActivoServicioAction(id: string, activo: boolean) {
  await cambiarActivoServicio(id, activo);
  revalidatePath("/configuracion");
}
