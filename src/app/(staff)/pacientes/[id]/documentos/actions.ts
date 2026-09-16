"use server";

import { revalidatePath } from "next/cache";
import { subirDocumento, subirNuevaVersion } from "@/data/documentos";

export async function subirDocumentoAction(pacienteId: string, formData: FormData) {
  const archivo = formData.get("archivo") as File;
  if (!archivo || archivo.size === 0) return;

  await subirDocumento({
    paciente_id: pacienteId,
    archivo,
    categoria: formData.get("categoria") as never,
    nombre: (formData.get("nombre") as string) || archivo.name,
    visibilidad: formData.get("compartir") === "on" ? "compartida_paciente" : "privada_staff",
  });

  revalidatePath(`/pacientes/${pacienteId}/documentos`);
}

export async function subirVersionAction(pacienteId: string, documentoId: string, formData: FormData) {
  const archivo = formData.get("archivo") as File;
  if (!archivo || archivo.size === 0) return;
  await subirNuevaVersion(documentoId, pacienteId, archivo);
  revalidatePath(`/pacientes/${pacienteId}/documentos`);
}
