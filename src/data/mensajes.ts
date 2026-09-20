import "server-only";
import { createClient } from "@/lib/supabase/server";
import { requireStaff, requirePacienteDueno, getSesionActual } from "./auth";

export interface Mensaje {
  id: string;
  paciente_id: string;
  autor_id: string;
  autor_rol: "nutriologa" | "asistente" | "paciente";
  cuerpo: string;
  leido_en: string | null;
  creado_en: string;
}

export async function listarMensajes(pacienteId: string) {
  const sesion = await getSesionActual();
  if (!sesion) throw new Error("No autorizado");
  if (sesion.rol === "paciente" && sesion.pacienteId !== pacienteId) {
    throw new Error("No autorizado");
  }
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("mensajes")
    .select("*")
    .eq("paciente_id", pacienteId)
    .order("creado_en", { ascending: true });
  if (error) throw error;
  return data as Mensaje[];
}

export async function enviarMensajeStaff(pacienteId: string, cuerpo: string) {
  const sesion = await requireStaff();
  if (!cuerpo.trim()) return;
  const supabase = await createClient();
  const { error } = await supabase.from("mensajes").insert({
    paciente_id: pacienteId,
    autor_id: sesion.userId,
    autor_rol: sesion.rol,
    cuerpo: cuerpo.trim(),
  });
  if (error) throw error;
}

export async function enviarMensajePaciente(cuerpo: string) {
  const sesion = await getSesionActual();
  if (!sesion?.pacienteId) throw new Error("No autorizado");
  await requirePacienteDueno(sesion.pacienteId);
  if (!cuerpo.trim()) return;
  const supabase = await createClient();
  const { error } = await supabase.from("mensajes").insert({
    paciente_id: sesion.pacienteId,
    autor_id: sesion.userId,
    autor_rol: "paciente",
    cuerpo: cuerpo.trim(),
  });
  if (error) throw error;
}

/** Lista de pacientes con su último mensaje, para la bandeja del staff. */
export async function listarConversaciones() {
  const sesion = await requireStaff();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("pacientes")
    .select("id, nombre_completo, mensajes(cuerpo, creado_en, autor_rol)")
    .eq("consultorio_id", sesion.consultorioId)
    .eq("estado", "activo")
    .order("nombre_completo");
  if (error) throw error;

  return (data ?? [])
    .map((p) => {
      const mensajes = (p as unknown as { mensajes: { cuerpo: string; creado_en: string; autor_rol: string }[] }).mensajes;
      const ultimo = mensajes.sort((a, b) => b.creado_en.localeCompare(a.creado_en))[0] ?? null;
      return { id: p.id, nombre_completo: p.nombre_completo, ultimoMensaje: ultimo };
    })
    .sort((a, b) => {
      if (!a.ultimoMensaje) return 1;
      if (!b.ultimoMensaje) return -1;
      return b.ultimoMensaje.creado_en.localeCompare(a.ultimoMensaje.creado_en);
    });
}
