import "server-only";
import { createClient } from "@/lib/supabase/server";
import { requireStaff, getSesionActual } from "./auth";

const BUCKET = "documentos";

export interface Documento {
  id: string;
  paciente_id: string;
  categoria: "laboratorio" | "estudio" | "consentimiento" | "plan" | "material_educativo" | "otro";
  nombre: string;
  visibilidad: "privada_staff" | "compartida_paciente";
  creado_en: string;
  documento_versiones: { id: string; storage_path: string; numero_version: number; creado_en: string }[];
}

export async function listarDocumentos(pacienteId: string) {
  const sesion = await getSesionActual();
  if (!sesion) throw new Error("No autorizado");
  const supabase = await createClient();

  let query = supabase
    .from("documentos")
    .select("*, documento_versiones(*)")
    .eq("paciente_id", pacienteId)
    .order("creado_en", { ascending: false });

  if (sesion.rol === "paciente") {
    query = query.eq("visibilidad", "compartida_paciente");
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as Documento[];
}

export async function urlFirmadaDocumento(storagePath: string, segundos = 300) {
  const supabase = await createClient();
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(storagePath, segundos);
  if (error) throw error;
  return data.signedUrl;
}

export interface NuevoDocumento {
  paciente_id: string;
  archivo: File;
  categoria: Documento["categoria"];
  nombre: string;
  visibilidad?: "privada_staff" | "compartida_paciente";
}

export async function subirDocumento(datos: NuevoDocumento) {
  const sesion = await requireStaff();
  const supabase = await createClient();

  const { data: doc, error } = await supabase
    .from("documentos")
    .insert({
      paciente_id: datos.paciente_id,
      categoria: datos.categoria,
      nombre: datos.nombre,
      visibilidad: datos.visibilidad ?? "privada_staff",
      creado_por: sesion.userId,
    })
    .select()
    .single();
  if (error) throw error;

  const path = `${datos.paciente_id}/${doc.id}/v1-${datos.archivo.name}`;
  const { error: errUpload } = await supabase.storage.from(BUCKET).upload(path, datos.archivo, {
    contentType: datos.archivo.type,
  });
  if (errUpload) throw errUpload;

  const { error: errVersion } = await supabase.from("documento_versiones").insert({
    documento_id: doc.id,
    storage_path: path,
    numero_version: 1,
    subido_por: sesion.userId,
  });
  if (errVersion) throw errVersion;

  return doc as unknown as Documento;
}

/** Sube una nueva versión SIN tocar ni reemplazar el archivo original. */
export async function subirNuevaVersion(documentoId: string, pacienteId: string, archivo: File) {
  const sesion = await requireStaff();
  const supabase = await createClient();

  const { data: versiones, error: errCount } = await supabase
    .from("documento_versiones")
    .select("numero_version")
    .eq("documento_id", documentoId)
    .order("numero_version", { ascending: false })
    .limit(1);
  if (errCount) throw errCount;

  const siguiente = (versiones?.[0]?.numero_version ?? 0) + 1;
  const path = `${pacienteId}/${documentoId}/v${siguiente}-${archivo.name}`;

  const { error: errUpload } = await supabase.storage.from(BUCKET).upload(path, archivo, {
    contentType: archivo.type,
  });
  if (errUpload) throw errUpload;

  const { error } = await supabase.from("documento_versiones").insert({
    documento_id: documentoId,
    storage_path: path,
    numero_version: siguiente,
    subido_por: sesion.userId,
  });
  if (error) throw error;
}
