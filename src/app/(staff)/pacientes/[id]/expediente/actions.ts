"use server";

import { revalidatePath } from "next/cache";
import { actualizarPaciente } from "@/data/pacientes";

function listaDesdeTexto(texto: string): string[] {
  return texto
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function actualizarExpedienteAction(pacienteId: string, formData: FormData) {
  await actualizarPaciente(pacienteId, {
    objetivos: (formData.get("objetivos") as string) || null,
    antecedentes: {
      personales: (formData.get("antecedentes_personales") as string) || "",
      familiares: (formData.get("antecedentes_familiares") as string) || "",
    },
    alergias_intolerancias: listaDesdeTexto((formData.get("alergias") as string) || ""),
    medicamentos_suplementos: listaDesdeTexto((formData.get("medicamentos") as string) || ""),
    preferencias_alimentarias: {
      culturales: (formData.get("preferencias_culturales") as string) || "",
      alimentos_rechazados: listaDesdeTexto((formData.get("alimentos_rechazados") as string) || ""),
    },
    habitos: {
      actividad_fisica: (formData.get("actividad_fisica") as string) || "",
      sueno: (formData.get("sueno") as string) || "",
      hidratacion: (formData.get("hidratacion") as string) || "",
      recordatorio_24h: (formData.get("recordatorio_24h") as string) || "",
    },
  });

  revalidatePath(`/pacientes/${pacienteId}/expediente`);
}
