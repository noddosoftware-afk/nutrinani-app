"use client";

import { useActionState, useState } from "react";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { iniciarSesion } from "./actions";
import { Campo, Input, Boton } from "@/components/campo";

export function LoginForm({ next }: { next: string }) {
  const [state, formAction, pending] = useActionState<{ error: string | null }, FormData>(iniciarSesion, {
    error: null,
  });
  const [verContrasena, setVerContrasena] = useState(false);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="next" value={next} />
      <Campo label="Correo" name="email">
        <Input id="email" name="email" type="email" required autoComplete="email" placeholder="tu@correo.com" />
      </Campo>
      <Campo label="Contraseña" name="password">
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={verContrasena ? "text" : "password"}
            required
            autoComplete="current-password"
            className="pr-11"
          />
          <button
            type="button"
            onClick={() => setVerContrasena((v) => !v)}
            aria-label={verContrasena ? "Ocultar contraseña" : "Mostrar contraseña"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft/70 hover:text-ink-soft"
          >
            {verContrasena ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        </div>
      </Campo>
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <Boton type="submit" disabled={pending} className="w-full justify-center py-3">
        {pending ? "Entrando…" : "Iniciar sesión"}
        {!pending && <ArrowRight size={16} />}
      </Boton>
    </form>
  );
}
