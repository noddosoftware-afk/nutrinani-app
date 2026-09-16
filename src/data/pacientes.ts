import "server-only";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "./auth";

export interface Paciente {
  id: string;
  nombre_completo: string;
  fecha_nacimiento: string | null;
  sexo: "masculino" | "femenino" | null;
  telefono: string | null;
  email: string | null;
  contacto_emergencia_nombre: string | null;
  contacto_emergencia_telefono: string | null;
  objetivos: string | null;
  antecedentes: Record<string, unknown>;
  alergias_intolerancias: unknown[];
  preferencias_alimentarias: Record<string, unknown>;
  medicamentos_suplementos: unknown[];
  habitos: Record<string, unknown>;
  estado: "activo" | "archivado";
  creado_en: string;
}

export interface DatosPaciente {
  nombre_completo: string;
  fecha_nacimiento?: string | null;
  sexo?: "masculino" | "femenino" | null;
  telefono?: string | null;
  email?: string | null;
  contacto_emergencia_nombre?: string | null;
  contacto_emergencia_telefono?: string | null;
  objetivos?: string | null;
  antecedentes?: Record<string, unknown>;
  alergias_intolerancias?: unknown[];
  preferencias_alimentarias?: Record<string, unknown>;
  medicamentos_suplementos?: unknown[];
  habitos?: Record<string, unknown>;
}

export async function listarPacientes(opts: { busqueda?: string; estado?: "activo" | "archivado" } = {}) {
  const sesion = await requireStaff();
  const supabase = await createClient();

  let query = supabase
    .from("pacientes")
    .select("*")
    .eq("consultorio_id", sesion.consultorioId)
    .order("nombre_completo");

  if (opts.estado) query = query.eq("estado", opts.estado);
  else query = query.eq("estado", "activo");

  if (opts.busqueda) {
    query = query.ilike("nombre_completo", `%${opts.busqueda}%`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as Paciente[];
}

export async function obtenerPaciente(id: string) {
  await requireStaff();
  const supabase = await createClient();
  const { data, error } = await supabase.from("pacientes").select("*").eq("id", id).single();
  if (error) throw error;
  return data as Paciente;
}

export async function crearPaciente(datos: DatosPaciente) {
  const sesion = await requireStaff();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("pacientes")
    .insert({
      ...datos,
      consultorio_id: sesion.consultorioId,
      creado_por: sesion.userId,
    } as never)
    .select()
    .single();
  if (error) throw error;

  await supabase.from("auditoria").insert({
    actor_id: sesion.userId,
    accion: "crear",
    entidad: "paciente",
    entidad_id: data.id,
  });

  return data as Paciente;
}

export async function actualizarPaciente(id: string, datos: Partial<DatosPaciente>) {
  const sesion = await requireStaff();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("pacientes")
    .update({ ...datos, actualizado_en: new Date().toISOString() } as never)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;

  await supabase.from("auditoria").insert({
    actor_id: sesion.userId,
    accion: "actualizar",
    entidad: "paciente",
    entidad_id: id,
  });

  return data as Paciente;
}

export async function cambiarEstadoPaciente(id: string, estado: "activo" | "archivado") {
  const sesion = await requireStaff();
  const supabase = await createClient();
  const { error } = await supabase.from("pacientes").update({ estado }).eq("id", id);
  if (error) throw error;

  await supabase.from("auditoria").insert({
    actor_id: sesion.userId,
    accion: estado === "archivado" ? "archivar" : "reactivar",
    entidad: "paciente",
    entidad_id: id,
  });
}
