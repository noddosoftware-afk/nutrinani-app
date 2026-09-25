import "server-only";
import { createClient } from "@/lib/supabase/server";
import { requireStaff, getSesionActual } from "./auth";
import type { Ejercicio } from "./ejercicios";

export type EstadoRutina = "borrador" | "publicado";

export interface RutinaEjercicio {
  id: string;
  ejercicio_id: string;
  series: number;
  repeticiones: string;
  descanso_segundos: number | null;
  notas: string | null;
  orden: number;
  ejercicio?: Pick<Ejercicio, "nombre" | "grupo_muscular" | "video_url"> | null;
}

export interface RutinaDia {
  id: string;
  numero_dia: number;
  etiqueta: string | null;
  rutina_ejercicios: RutinaEjercicio[];
}

export interface Rutina {
  id: string;
  paciente_id: string;
  nombre: string;
  estado: EstadoRutina;
  recomendaciones: string | null;
  creado_en: string;
  rutina_dias?: RutinaDia[];
}

export async function listarRutinasPaciente(pacienteId: string) {
  await requireStaff();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("rutinas")
    .select("*")
    .eq("paciente_id", pacienteId)
    .order("creado_en", { ascending: false });
  if (error) throw error;
  return data as Rutina[];
}

const SELECT_COMPLETA =
  "*, rutina_dias(*, rutina_ejercicios(*, ejercicio:ejercicios(nombre, grupo_muscular, video_url)))";

export async function obtenerRutinaCompleta(id: string) {
  const sesion = await getSesionActual();
  if (!sesion) throw new Error("No autorizado");
  const supabase = await createClient();
  const { data, error } = await supabase.from("rutinas").select(SELECT_COMPLETA).eq("id", id).single();
  if (error) throw error;
  return data as unknown as Rutina;
}

/** La rutina vigente del paciente logueado — solo ve la publicada más reciente. */
export async function rutinaVigentePaciente(pacienteId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("rutinas")
    .select(SELECT_COMPLETA)
    .eq("paciente_id", pacienteId)
    .eq("estado", "publicado")
    .order("publicado_en", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data as unknown as Rutina | null;
}

export interface NuevaRutina {
  paciente_id: string;
  nombre: string;
  recomendaciones?: string;
  dias: {
    numero_dia: number;
    etiqueta?: string;
    ejercicios: { ejercicio_id: string; series: number; repeticiones: string; descanso_segundos?: number; notas?: string }[];
  }[];
}

export async function crearRutina(datos: NuevaRutina) {
  const sesion = await requireStaff();
  const supabase = await createClient();

  const { data: rutina, error } = await supabase
    .from("rutinas")
    .insert({
      paciente_id: datos.paciente_id,
      nombre: datos.nombre,
      recomendaciones: datos.recomendaciones,
      creado_por: sesion.userId,
    } as never)
    .select()
    .single();
  if (error) throw error;
  const rutinaId = (rutina as { id: string }).id;

  for (const dia of datos.dias) {
    const { data: diaCreado, error: errDia } = await supabase
      .from("rutina_dias")
      .insert({ rutina_id: rutinaId, numero_dia: dia.numero_dia, etiqueta: dia.etiqueta } as never)
      .select()
      .single();
    if (errDia) throw errDia;
    const diaId = (diaCreado as { id: string }).id;

    if (dia.ejercicios.length === 0) continue;
    const { error: errEj } = await supabase.from("rutina_ejercicios").insert(
      dia.ejercicios.map((e, i) => ({
        rutina_dia_id: diaId,
        ejercicio_id: e.ejercicio_id,
        series: e.series,
        repeticiones: e.repeticiones,
        descanso_segundos: e.descanso_segundos,
        notas: e.notas,
        orden: i,
      })) as never
    );
    if (errEj) throw errEj;
  }

  return rutina as { id: string };
}

export async function publicarRutina(id: string) {
  await requireStaff();
  const supabase = await createClient();
  const { error } = await supabase
    .from("rutinas")
    .update({ estado: "publicado", publicado_en: new Date().toISOString() } as never)
    .eq("id", id);
  if (error) throw error;
}
