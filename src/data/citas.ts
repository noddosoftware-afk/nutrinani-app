import "server-only";
import { createClient } from "@/lib/supabase/server";
import { requireStaff, getSesionActual } from "./auth";

export type EstadoCita = "pendiente" | "confirmada" | "cancelada" | "completada";

export interface Cita {
  id: string;
  paciente_id: string;
  inicio: string;
  fin: string;
  estado: EstadoCita;
  motivo: string | null;
  notas_internas: string | null;
  creado_en: string;
  paciente?: { nombre_completo: string };
}

export class ConflictoHorarioError extends Error {
  constructor() {
    super("Ya existe una cita en ese horario. Elige otro horario.");
    this.name = "ConflictoHorarioError";
  }
}

async function hayTraslape(
  inicio: string,
  fin: string,
  consultorioId: string,
  excluirCitaId?: string
): Promise<boolean> {
  const supabase = await createClient();
  let query = supabase
    .from("citas")
    .select("id", { count: "exact", head: true })
    .eq("consultorio_id", consultorioId)
    .neq("estado", "cancelada")
    .lt("inicio", fin)
    .gt("fin", inicio);
  if (excluirCitaId) query = query.neq("id", excluirCitaId);
  const { count, error } = await query;
  if (error) throw error;
  return (count ?? 0) > 0;
}

export async function listarCitasEnRango(desde: string, hasta: string) {
  await requireStaff();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("citas")
    .select("*, paciente:pacientes(nombre_completo)")
    .gte("inicio", desde)
    .lt("inicio", hasta)
    .order("inicio", { ascending: true });
  if (error) throw error;
  return data as unknown as Cita[];
}

export async function listarCitasPaciente(pacienteId: string) {
  const sesion = await getSesionActual();
  if (!sesion) throw new Error("No autorizado");
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("citas")
    .select("*")
    .eq("paciente_id", pacienteId)
    .order("inicio", { ascending: false });
  if (error) throw error;
  return data as unknown as Cita[];
}

export interface NuevaCita {
  paciente_id: string;
  inicio: string;
  fin: string;
  motivo?: string;
  notas_internas?: string;
}

export async function crearCita(datos: NuevaCita) {
  const sesion = await requireStaff();
  if (await hayTraslape(datos.inicio, datos.fin, sesion.consultorioId)) {
    throw new ConflictoHorarioError();
  }
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("citas")
    .insert({
      paciente_id: datos.paciente_id,
      inicio: datos.inicio,
      fin: datos.fin,
      motivo: datos.motivo,
      notas_internas: datos.notas_internas,
      consultorio_id: sesion.consultorioId,
      creado_por: sesion.userId,
    } as never)
    .select()
    .single();
  if (error) throw error;

  await supabase.from("auditoria").insert({
    actor_id: sesion.userId,
    accion: "crear",
    entidad: "cita",
    entidad_id: data.id,
  });

  return data as unknown as Cita;
}

export async function reprogramarCita(citaId: string, inicio: string, fin: string) {
  const sesion = await requireStaff();
  if (await hayTraslape(inicio, fin, sesion.consultorioId, citaId)) {
    throw new ConflictoHorarioError();
  }
  const supabase = await createClient();
  const { error } = await supabase
    .from("citas")
    .update({ inicio, fin, actualizado_en: new Date().toISOString() } as never)
    .eq("id", citaId);
  if (error) throw error;
}

export async function cambiarEstadoCita(citaId: string, estado: EstadoCita) {
  await requireStaff();
  const supabase = await createClient();
  const { error } = await supabase
    .from("citas")
    .update({ estado, actualizado_en: new Date().toISOString() } as never)
    .eq("id", citaId);
  if (error) throw error;
}

export async function obtenerHorarioConsultorio() {
  const sesion = await getSesionActual();
  if (!sesion) throw new Error("No autorizado");
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("consultorios")
    .select("horario_atencion, duracion_cita_minutos, zona_horaria")
    .eq("id", sesion.consultorioId)
    .single();
  if (error) throw error;
  return data as unknown as {
    horario_atencion: Record<string, { inicio: string; fin: string } | null>;
    duracion_cita_minutos: number;
    zona_horaria: string;
  };
}
