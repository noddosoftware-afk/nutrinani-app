"use client";

import { useActionState } from "react";
import { LogIn } from "lucide-react";
import { iniciarSesion } from "./actions";
import { Campo, Input, Boton } from "@/components/campo";

export function LoginForm({ next }: { next: string }) {
  const [state, formAction, pending] = useActionState<{ error: string | null }, FormData>(iniciarSesion, {
    error: null,
  });

  return (
    <form action={formAction} className="space-y-4 rounded-2xl border border-cream-200 bg-white p-6 shadow-sm">
      <input type="hidden" name="next" value={next} />
      <Campo label="Correo" name="email">
        <Input id="email" name="email" type="email" required autoComplete="email" />
      </Campo>
      <Campo label="Contraseña" name="password">
        <Input id="password" name="password" type="password" required autoComplete="current-password" />
      </Campo>
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <Boton type="submit" disabled={pending} className="w-full justify-center">
        <LogIn size={16} />
        {pending ? "Entrando…" : "Entrar"}
      </Boton>
    </form>
  );
}
