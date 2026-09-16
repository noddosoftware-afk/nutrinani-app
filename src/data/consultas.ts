import "server-only";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "./auth";
import type { ResultadoCalculo } from "@/lib/calc";

export interface Medicion {
  id: string;
  paciente_id: string;
  consulta_id: string | null;
  fecha: string;
  peso_kg: number | null;
  talla_cm: number | null;
  cintura_cm: number | null;
  cadera_cm: number | null;
  porcentaje_grasa: number | null;
  masa_muscular_kg: number | null;
  reportado_por_paciente: boolean;
  revisado_por_nutriologa: boolean;
  fuente: string | null;
}

export interface Consulta {
  id: string;
  paciente_id: string;
  responsable_id: string;
  fecha: string;
  motivo: string | null;
  evaluacion: string | null;
  acuerdos: string | null;
  proxima_revision: string | null;
  notas_internas: string | null;
  mediciones?: Medicion[];
  calculos?: { id: string; tipo: string; resultado: ResultadoCalculo<unknown> }[];
}

export async function listarConsultas(pacienteId: string) {
  await requireStaff();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("consultas")
    .select("*, mediciones(*), calculos(*)")
    .eq("paciente_id", pacienteId)
    .order("fecha", { ascending: false });
  if (error) throw error;
  return data as unknown as Consulta[];
}

export interface NuevaConsulta {
  paciente_id: string;
  motivo?: string;
  evaluacion?: string;
  acuerdos?: string;
  proxima_revision?: string;
  notas_internas?: string;
  medicion?: Omit<Medicion, "id" | "paciente_id" | "consulta_id" | "reportado_por_paciente" | "revisado_por_nutriologa">;
  calculos?: { tipo: string; resultado: ResultadoCalculo<unknown> }[];
}

/**
 * Crea una consulta nueva SIN tocar el historial existente — cada consulta es un
 * registro independiente e inmutable una vez guardado (solo se permite editar
 * texto de la misma consulta, nunca reescribir consultas anteriores).
 */
export async function crearConsulta(datos: NuevaConsulta) {
  const sesion = await requireStaff();
  const supabase = await createClient();

  const { data: consulta, error } = await supabase
    .from("consultas")
    .insert({
      paciente_id: datos.paciente_id,
      responsable_id: sesion.userId,
      motivo: datos.motivo,
      evaluacion: datos.evaluacion,
      acuerdos: datos.acuerdos,
      proxima_revision: datos.proxima_revision,
      notas_internas: datos.notas_internas,
    })
    .select()
    .single();
  if (error) throw error;

  if (datos.medicion) {
    const { error: errMed } = await supabase.from("mediciones").insert({
      ...datos.medicion,
      paciente_id: datos.paciente_id,
      consulta_id: consulta.id,
      revisado_por_nutriologa: true,
    });
    if (errMed) throw errMed;
  }

  if (datos.calculos?.length) {
    const { error: errCalc } = await supabase.from("calculos").insert(
      datos.calculos.map((c) => ({
        paciente_id: datos.paciente_id,
        consulta_id: consulta.id,
        tipo: c.tipo,
        resultado: c.resultado as unknown as import("@/lib/supabase/types").Json,
      }))
    );
    if (errCalc) throw errCalc;
  }

  await supabase.from("auditoria").insert({
    actor_id: sesion.userId,
    accion: "crear",
    entidad: "consulta",
    entidad_id: consulta.id,
  });

  return consulta as Consulta;
}

export async function listarMedicionesPaciente(pacienteId: string) {
  await requireStaff();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("mediciones")
    .select("*")
    .eq("paciente_id", pacienteId)
    .order("fecha", { ascending: true });
  if (error) throw error;
  return data as Medicion[];
}
