import "server-only";
import { createClient } from "@/lib/supabase/server";
import { requireStaff, getSesionActual } from "./auth";

export type NivelEntrenamiento = "principiante" | "intermedio" | "avanzado";

export interface Ejercicio {
  id: string;
  nombre: string;
  grupo_muscular: string;
  nivel: NivelEntrenamiento;
  descripcion: string | null;
  video_url: string | null;
  series_sugeridas: number | null;
  repeticiones_sugeridas: string | null;
}

/** Igual que alimentos: el catálogo lo puede leer cualquier autenticado (staff o paciente). */
export async function listarEjercicios() {
  const sesion = await getSesionActual();
  if (!sesion) throw new Error("No autorizado");
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("ejercicios")
    .select("*")
    .order("grupo_muscular")
    .order("nivel");
  if (error) throw error;
  return data as Ejercicio[];
}

export interface NuevoEjercicio {
  nombre: string;
  grupo_muscular: string;
  nivel: NivelEntrenamiento;
  descripcion?: string;
  video_url?: string;
  series_sugeridas?: number;
  repeticiones_sugeridas?: string;
}

export async function crearEjercicio(datos: NuevoEjercicio) {
  const sesion = await requireStaff();
  const supabase = await createClient();
  const { error } = await supabase
    .from("ejercicios")
    .insert({ ...datos, consultorio_id: sesion.consultorioId, creado_por: sesion.userId } as never);
  if (error) throw error;
}
