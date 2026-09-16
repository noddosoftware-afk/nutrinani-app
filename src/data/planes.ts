import "server-only";
import { createClient } from "@/lib/supabase/server";
import { requireStaff, requireNutriologa, getSesionActual } from "./auth";
import type { ValorMacros } from "@/lib/calc";

export type EstadoPlan = "borrador" | "aprobado" | "publicado" | "sustituido";

export interface PlanItem {
  id: string;
  alimento_id: string | null;
  receta_id: string | null;
  cantidad_gramos: number;
  notas: string | null;
  alimento?: { nombre: string; energia_kcal_100g: number | null; proteina_g_100g: number | null; carbohidrato_g_100g: number | null; grasa_g_100g: number | null } | null;
  receta?: { nombre: string } | null;
}

export interface PlanTiempo {
  id: string;
  nombre: string;
  orden: number;
  porcentaje_asignado: number | null;
  plan_items: PlanItem[];
}

export interface PlanDia {
  id: string;
  numero_dia: number;
  etiqueta: string | null;
  plan_tiempos: PlanTiempo[];
}

export interface Plan {
  id: string;
  paciente_id: string;
  nombre: string;
  estado: EstadoPlan;
  objetivo_kcal: number | null;
  objetivo_macros: ValorMacros | null;
  vigente_desde: string | null;
  vigente_hasta: string | null;
  version: number;
  plan_anterior_id: string | null;
  recomendaciones: string | null;
  creado_en: string;
  plan_dias?: PlanDia[];
}

export async function listarPlanesPaciente(pacienteId: string) {
  await requireStaff();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("planes")
    .select("*")
    .eq("paciente_id", pacienteId)
    .order("creado_en", { ascending: false });
  if (error) throw error;
  return data as Plan[];
}

export async function obtenerPlanCompleto(id: string) {
  const sesion = await getSesionActual();
  if (!sesion) throw new Error("No autorizado");
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("planes")
    .select(
      "*, plan_dias(*, plan_tiempos(*, plan_items(*, alimento:alimentos(nombre, energia_kcal_100g, proteina_g_100g, carbohidrato_g_100g, grasa_g_100g), receta:recetas(nombre))))"
    )
    .eq("id", id)
    .single();
  if (error) throw error;
  return data as Plan;
}

export interface NuevoPlan {
  paciente_id: string;
  nombre: string;
  objetivo_kcal?: number;
  objetivo_macros?: ValorMacros;
  dias: {
    numero_dia: number;
    etiqueta?: string;
    tiempos: {
      nombre: string;
      porcentaje_asignado?: number;
      items: { alimento_id?: string; receta_id?: string; cantidad_gramos: number; notas?: string }[];
    }[];
  }[];
}

export async function crearPlan(datos: NuevoPlan) {
  const sesion = await requireStaff();
  const supabase = await createClient();

  const { data: plan, error } = await supabase
    .from("planes")
    .insert({
      paciente_id: datos.paciente_id,
      nombre: datos.nombre,
      objetivo_kcal: datos.objetivo_kcal,
      objetivo_macros: datos.objetivo_macros,
      estado: "borrador",
      creado_por: sesion.userId,
    } as never)
    .select()
    .single();
  if (error) throw error;

  for (const dia of datos.dias) {
    const { data: diaRow, error: errDia } = await supabase
      .from("plan_dias")
      .insert({ plan_id: plan.id, numero_dia: dia.numero_dia, etiqueta: dia.etiqueta })
      .select()
      .single();
    if (errDia) throw errDia;

    for (const [tIdx, tiempo] of dia.tiempos.entries()) {
      const { data: tiempoRow, error: errTiempo } = await supabase
        .from("plan_tiempos")
        .insert({
          plan_dia_id: diaRow.id,
          nombre: tiempo.nombre,
          orden: tIdx,
          porcentaje_asignado: tiempo.porcentaje_asignado,
        })
        .select()
        .single();
      if (errTiempo) throw errTiempo;

      if (tiempo.items.length) {
        const { error: errItems } = await supabase.from("plan_items").insert(
          tiempo.items.map((item, idx) => ({
            plan_tiempo_id: tiempoRow.id,
            alimento_id: item.alimento_id ?? null,
            receta_id: item.receta_id ?? null,
            cantidad_gramos: item.cantidad_gramos,
            notas: item.notas,
            orden: idx,
          }))
        );
        if (errItems) throw errItems;
      }
    }
  }

  return plan as Plan;
}

/** Solo la nutrióloga aprueba planes — incluidos los que en el futuro genere la IA (Fase 3). */
export async function aprobarPlan(id: string) {
  const sesion = await requireNutriologa();
  const supabase = await createClient();
  const { error } = await supabase
    .from("planes")
    .update({ estado: "aprobado", aprobado_por: sesion.userId, aprobado_en: new Date().toISOString() })
    .eq("id", id)
    .eq("estado", "borrador");
  if (error) throw error;
}

/**
 * Publicar un plan lo hace visible en el portal del paciente y marca cualquier plan
 * publicado anterior como 'sustituido' — nunca se edita un plan ya entregado.
 */
export async function publicarPlan(id: string) {
  const sesion = await requireNutriologa();
  const supabase = await createClient();

  const { data: plan, error } = await supabase
    .from("planes")
    .select("paciente_id, estado")
    .eq("id", id)
    .single();
  if (error) throw error;
  if (plan.estado !== "aprobado") {
    throw new Error("Solo se puede publicar un plan ya aprobado.");
  }

  await supabase
    .from("planes")
    .update({ estado: "sustituido" })
    .eq("paciente_id", plan.paciente_id)
    .eq("estado", "publicado");

  const { error: errPub } = await supabase
    .from("planes")
    .update({ estado: "publicado", publicado_en: new Date().toISOString() })
    .eq("id", id);
  if (errPub) throw errPub;

  await supabase.from("auditoria").insert({
    actor_id: sesion.userId,
    accion: "publicar",
    entidad: "plan",
    entidad_id: id,
  });
}

export async function planVigentePaciente(pacienteId: string) {
  const sesion = await getSesionActual();
  if (!sesion) throw new Error("No autorizado");
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("planes")
    .select(
      "*, plan_dias(*, plan_tiempos(*, plan_items(*, alimento:alimentos(nombre, energia_kcal_100g, proteina_g_100g, carbohidrato_g_100g, grasa_g_100g), receta:recetas(nombre))))"
    )
    .eq("paciente_id", pacienteId)
    .eq("estado", "publicado")
    .order("publicado_en", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data as Plan | null;
}
