"use server";

import { redirect } from "next/navigation";
import { crearPaciente } from "@/data/pacientes";

export async function crearPacienteAction(_prevState: { error: string | null }, formData: FormData) {
  const nombre_completo = String(formData.get("nombre_completo") ?? "").trim();
  if (!nombre_completo) {
    return { error: "El nombre completo es obligatorio." };
  }

  const paciente = await crearPaciente({
    nombre_completo,
    fecha_nacimiento: (formData.get("fecha_nacimiento") as string) || null,
    sexo: (formData.get("sexo") as "masculino" | "femenino") || null,
    telefono: (formData.get("telefono") as string) || null,
    email: (formData.get("email") as string) || null,
    contacto_emergencia_nombre: (formData.get("contacto_emergencia_nombre") as string) || null,
    contacto_emergencia_telefono: (formData.get("contacto_emergencia_telefono") as string) || null,
    objetivos: (formData.get("objetivos") as string) || null,
  });

  redirect(`/pacientes/${paciente.id}`);
}
