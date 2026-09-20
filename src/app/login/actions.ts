"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getSesionActual } from "@/data/auth";

/**
 * Solo permite redirigir a una ruta relativa propia de la app. Sin esto, un enlace
 * como /login?next=https://sitio-malicioso.com mandaría a cualquiera que inicie
 * sesión legítimamente a un sitio externo (open redirect).
 */
function rutaInternaSegura(next: string): string | null {
  if (!next.startsWith("/") || next.startsWith("//")) return null;
  return next;
}

export async function iniciarSesion(_prevState: { error: string | null }, formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = rutaInternaSegura(String(formData.get("next") ?? ""));

  if (!email || !password) {
    return { error: "Ingresa tu correo y contraseña." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "Correo o contraseña incorrectos." };
  }

  const sesion = await getSesionActual();
  if (sesion?.rol === "paciente") {
    redirect("/portal");
  }
  redirect(next && next !== "/" ? next : "/dashboard");
}

export async function cerrarSesion() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
