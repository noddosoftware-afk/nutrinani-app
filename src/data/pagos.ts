import "server-only";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "./auth";

export interface Servicio {
  id: string;
  nombre: string;
  descripcion: string | null;
  precio: number;
  activo: boolean;
}

export interface Pago {
  id: string;
  paciente_id: string;
  servicio_id: string | null;
  concepto: string;
  monto: number;
  metodo: "efectivo" | "transferencia" | "tarjeta" | "otro";
  fecha: string;
  creado_en: string;
  servicio?: { nombre: string } | null;
}

export async function listarServicios() {
  await requireStaff();
  const supabase = await createClient();
  const { data, error } = await supabase.from("servicios").select("*").eq("activo", true).order("nombre");
  if (error) throw error;
  return data as Servicio[];
}

/** Incluye inactivos — para la pantalla de administración en Configuración. */
export async function listarTodosLosServicios() {
  await requireStaff();
  const supabase = await createClient();
  const { data, error } = await supabase.from("servicios").select("*").order("nombre");
  if (error) throw error;
  return data as Servicio[];
}

export async function crearServicio(nombre: string, precio: number, descripcion?: string) {
  const sesion = await requireStaff();
  const supabase = await createClient();
  const { error } = await supabase
    .from("servicios")
    .insert({ nombre, precio, descripcion, consultorio_id: sesion.consultorioId } as never);
  if (error) throw error;
}

export async function actualizarServicio(
  id: string,
  datos: { nombre: string; precio: number; descripcion?: string }
) {
  await requireStaff();
  const supabase = await createClient();
  const { error } = await supabase.from("servicios").update(datos as never).eq("id", id);
  if (error) throw error;
}

export async function cambiarActivoServicio(id: string, activo: boolean) {
  await requireStaff();
  const supabase = await createClient();
  const { error } = await supabase.from("servicios").update({ activo } as never).eq("id", id);
  if (error) throw error;
}

export async function listarPagosPaciente(pacienteId: string) {
  await requireStaff();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("pagos")
    .select("*, servicio:servicios(nombre)")
    .eq("paciente_id", pacienteId)
    .order("fecha", { ascending: false });
  if (error) throw error;
  return data as unknown as Pago[];
}

export interface NuevoPago {
  paciente_id: string;
  concepto: string;
  monto: number;
  metodo: "efectivo" | "transferencia" | "tarjeta" | "otro";
  fecha: string;
  servicio_id?: string;
}

export async function registrarPago(datos: NuevoPago) {
  const sesion = await requireStaff();
  const supabase = await createClient();
  const { error } = await supabase.from("pagos").insert({
    ...datos,
    registrado_por: sesion.userId,
  } as never);
  if (error) throw error;
}
