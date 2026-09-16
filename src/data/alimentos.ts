import "server-only";
import { createClient } from "@/lib/supabase/server";
import { requireStaff, getSesionActual } from "./auth";
import { calcularTotalNutrientes, type ItemCantidad } from "@/lib/calc";

export interface Alimento {
  id: string;
  nombre: string;
  marca: string | null;
  categoria: string | null;
  porcion_descripcion: string | null;
  porcion_gramos: number | null;
  estado_coccion: "crudo" | "cocido" | "no_aplica";
  energia_kcal_100g: number | null;
  proteina_g_100g: number | null;
  carbohidrato_g_100g: number | null;
  grasa_g_100g: number | null;
  fibra_g_100g: number | null;
  sodio_mg_100g: number | null;
  alergenos: string[];
  fecha_fuente: string | null;
}

export interface DatosAlimento {
  nombre: string;
  marca?: string | null;
  categoria?: string | null;
  porcion_descripcion?: string | null;
  porcion_gramos?: number | null;
  estado_coccion?: "crudo" | "cocido" | "no_aplica";
  energia_kcal_100g?: number | null;
  proteina_g_100g?: number | null;
  carbohidrato_g_100g?: number | null;
  grasa_g_100g?: number | null;
  fibra_g_100g?: number | null;
  sodio_mg_100g?: number | null;
  alergenos?: string[];
  fecha_fuente?: string | null;
}

/** Alimentos y recetas los puede LEER cualquier usuario autenticado (staff o paciente). */
export async function listarAlimentos(busqueda?: string) {
  const sesion = await getSesionActual();
  if (!sesion) throw new Error("No autorizado");
  const supabase = await createClient();
  let query = supabase.from("alimentos").select("*").order("nombre");
  if (busqueda) query = query.ilike("nombre", `%${busqueda}%`);
  const { data, error } = await query;
  if (error) throw error;
  return data as Alimento[];
}

export async function crearAlimento(datos: DatosAlimento) {
  const sesion = await requireStaff();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("alimentos")
    .insert({ ...datos, consultorio_id: sesion.consultorioId, creado_por: sesion.userId })
    .select()
    .single();
  if (error) throw error;
  return data as Alimento;
}

export async function actualizarAlimento(id: string, datos: Partial<DatosAlimento>) {
  await requireStaff();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("alimentos")
    .update({ ...datos, actualizado_en: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as Alimento;
}

function aItemCantidad(alimento: Alimento, gramos: number): ItemCantidad {
  return {
    gramos,
    perfilPor100g: {
      energiaKcal: alimento.energia_kcal_100g,
      proteinaG: alimento.proteina_g_100g,
      carbohidratoG: alimento.carbohidrato_g_100g,
      grasaG: alimento.grasa_g_100g,
      fibraG: alimento.fibra_g_100g,
      sodioMg: alimento.sodio_mg_100g,
    },
  };
}

export interface Receta {
  id: string;
  nombre: string;
  preparacion: string | null;
  rendimiento_porciones: number;
  fotografia_url: string | null;
  ingredientes: { id: string; gramos: number; alimento: Alimento }[];
}

export async function obtenerReceta(id: string) {
  const sesion = await getSesionActual();
  if (!sesion) throw new Error("No autorizado");
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("recetas")
    .select("*, receta_ingredientes(id, gramos, alimento:alimentos(*))")
    .eq("id", id)
    .single();
  if (error) throw error;
  return {
    ...data,
    ingredientes: data.receta_ingredientes.map((ri) => ({
      id: ri.id,
      gramos: ri.gramos,
      alimento: ri.alimento as unknown as Alimento,
    })),
  } as unknown as Receta;
}

/** Recalcula los totales de una receta a partir de sus ingredientes y rendimiento actuales. */
export function calcularTotalesReceta(receta: Receta) {
  const items = receta.ingredientes.map((i) => aItemCantidad(i.alimento, i.gramos));
  const totalReceta = calcularTotalNutrientes(items);
  const porPorcion = Object.fromEntries(
    Object.entries(totalReceta).map(([k, v]) => [
      k,
      typeof v === "number" ? Math.round((v / receta.rendimiento_porciones) * 10) / 10 : v,
    ])
  );
  return { totalReceta, porPorcion };
}

export interface DatosReceta {
  nombre: string;
  preparacion?: string;
  rendimiento_porciones: number;
  ingredientes: { alimento_id: string; gramos: number }[];
}

export async function crearReceta(datos: DatosReceta) {
  const sesion = await requireStaff();
  const supabase = await createClient();
  const { data: receta, error } = await supabase
    .from("recetas")
    .insert({
      nombre: datos.nombre,
      preparacion: datos.preparacion,
      rendimiento_porciones: datos.rendimiento_porciones,
      consultorio_id: sesion.consultorioId,
      creado_por: sesion.userId,
    })
    .select()
    .single();
  if (error) throw error;

  if (datos.ingredientes.length) {
    const { error: errIng } = await supabase.from("receta_ingredientes").insert(
      datos.ingredientes.map((ing, idx) => ({
        receta_id: receta.id,
        alimento_id: ing.alimento_id,
        gramos: ing.gramos,
        orden: idx,
      }))
    );
    if (errIng) throw errIng;
  }

  return receta;
}
