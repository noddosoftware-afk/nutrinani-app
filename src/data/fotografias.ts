import "server-only";
import { createClient } from "@/lib/supabase/server";
import { requireStaff, requirePacienteDueno, getSesionActual } from "./auth";

export interface Fotografia {
  id: string;
  paciente_id: string;
  storage_path: string;
  vista: "frente" | "perfil" | "espalda" | "otra";
  fecha_captura: string;
  fecha_carga: string;
  observaciones: string | null;
  visibilidad: "privada_staff" | "compartida_paciente";
}

const BUCKET = "fotos-progreso";

export async function listarFotografias(pacienteId: string) {
  const sesion = await getSesionActual();
  if (!sesion) throw new Error("No autorizado");
  const supabase = await createClient();

  let query = supabase
    .from("fotografias")
    .select("*")
    .eq("paciente_id", pacienteId)
    .order("fecha_captura", { ascending: false });

  // Defensa en profundidad: aunque RLS ya filtra esto, no confiamos únicamente en la DB
  // para decidir qué mostrar en la UI del paciente.
  if (sesion.rol === "paciente") {
    query = query.eq("visibilidad", "compartida_paciente");
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as Fotografia[];
}

/** Devuelve una URL firmada de corta duración — nunca una ruta pública permanente. */
export async function urlFirmadaFoto(storagePath: string, segundos = 300) {
  const supabase = await createClient();
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(storagePath, segundos);
  if (error) throw error;
  return data.signedUrl;
}

export interface NuevaFotografia {
  paciente_id: string;
  archivo: File;
  vista: "frente" | "perfil" | "espalda" | "otra";
  fecha_captura: string;
  observaciones?: string;
  visibilidad?: "privada_staff" | "compartida_paciente";
  consulta_id?: string;
}

export async function subirFotografia(datos: NuevaFotografia) {
  const sesion = await requireStaff();
  const supabase = await createClient();

  const nombreArchivo = `${crypto.randomUUID()}-${datos.archivo.name}`;
  const path = `${datos.paciente_id}/${nombreArchivo}`;

  const { error: errUpload } = await supabase.storage.from(BUCKET).upload(path, datos.archivo, {
    contentType: datos.archivo.type,
  });
  if (errUpload) throw errUpload;

  const { data, error } = await supabase
    .from("fotografias")
    .insert({
      paciente_id: datos.paciente_id,
      storage_path: path,
      vista: datos.vista,
      fecha_captura: datos.fecha_captura,
      observaciones: datos.observaciones,
      visibilidad: datos.visibilidad ?? "privada_staff",
      consulta_id: datos.consulta_id,
      subido_por: sesion.userId,
    })
    .select()
    .single();
  if (error) throw error;
  return data as Fotografia;
}

/**
 * El paciente sube su propia foto de progreso. Queda 'privada_staff' por defecto: la
 * nutrióloga decide cuándo compartirla de vuelta en el comparador (ver requireStaff arriba).
 */
export async function subirFotografiaPropia(datos: Omit<NuevaFotografia, "visibilidad">) {
  const sesion = await requirePacienteDueno(datos.paciente_id);
  const supabase = await createClient();

  const nombreArchivo = `${crypto.randomUUID()}-${datos.archivo.name}`;
  const path = `${datos.paciente_id}/${nombreArchivo}`;

  const { error: errUpload } = await supabase.storage.from(BUCKET).upload(path, datos.archivo, {
    contentType: datos.archivo.type,
  });
  if (errUpload) throw errUpload;

  const { error } = await supabase.from("fotografias").insert({
    paciente_id: datos.paciente_id,
    storage_path: path,
    vista: datos.vista,
    fecha_captura: datos.fecha_captura,
    observaciones: datos.observaciones,
    visibilidad: "privada_staff",
    subido_por: sesion.userId,
  });
  if (error) throw error;
}
