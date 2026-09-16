import "server-only";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

export type Rol = "nutriologa" | "asistente" | "paciente";

export interface SesionActual {
  userId: string;
  rol: Rol;
  nombreCompleto: string;
  pacienteId: string | null;
  consultorioId: string;
}

/**
 * Obtiene la sesión + perfil del usuario actual, cacheado por request.
 * Devuelve null si no hay sesión — cada llamador decide qué hacer (redirect, 403, etc.).
 * Esta función (y su verificación de rol) se re-ejecuta en CADA Server Action y Server
 * Component que toque datos sensibles: una redirección en la página no basta,
 * ver docs/PROPUESTA.md § seguridad.
 */
export const getSesionActual = cache(async (): Promise<SesionActual | null> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("rol, nombre_completo, paciente_id, consultorio_id")
    .eq("id", user.id)
    .single();

  if (!profile) return null;

  return {
    userId: user.id,
    rol: profile.rol,
    nombreCompleto: profile.nombre_completo,
    pacienteId: profile.paciente_id,
    consultorioId: profile.consultorio_id,
  };
});

export class NoAutorizadoError extends Error {
  constructor(mensaje = "No autorizado") {
    super(mensaje);
    this.name = "NoAutorizadoError";
  }
}

export async function requireStaff(): Promise<SesionActual> {
  const sesion = await getSesionActual();
  if (!sesion || (sesion.rol !== "nutriologa" && sesion.rol !== "asistente")) {
    throw new NoAutorizadoError();
  }
  return sesion;
}

export async function requireNutriologa(): Promise<SesionActual> {
  const sesion = await getSesionActual();
  if (!sesion || sesion.rol !== "nutriologa") {
    throw new NoAutorizadoError();
  }
  return sesion;
}

export async function requirePacienteDueno(pacienteId: string): Promise<SesionActual> {
  const sesion = await getSesionActual();
  if (!sesion || sesion.rol !== "paciente" || sesion.pacienteId !== pacienteId) {
    throw new NoAutorizadoError();
  }
  return sesion;
}
