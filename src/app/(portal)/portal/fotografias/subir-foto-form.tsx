"use client";

import { useActionState, useState } from "react";
import { Check } from "lucide-react";
import { subirFotoPropiaAction, type EstadoSubirFoto } from "./actions";

export function SubirFotoForm() {
  const [instancia, setInstancia] = useState(0);
  return <Formulario key={instancia} onListo={() => setInstancia((n) => n + 1)} />;
}

function Formulario({ onListo }: { onListo: () => void }) {
  const [state, formAction, pending] = useActionState<EstadoSubirFoto, FormData>(subirFotoPropiaAction, { error: null });

  if (state.ok) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-brand-100 bg-brand-50 p-4 text-sm text-brand-800">
        <span className="flex items-center gap-2">
          <Check size={16} /> Foto subida. Tu nutrióloga la revisará antes de compartirla.
        </span>
        <button type="button" onClick={onListo} className="underline">
          Subir otra
        </button>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-3 rounded-lg border border-cream-200 bg-white p-4">
      <p className="text-sm font-semibold text-ink">Subir foto de progreso</p>
      <input type="file" name="archivo" accept="image/*" capture="environment" required className="w-full text-sm" />
      <select name="vista" className="w-full rounded-md border border-cream-200 px-2 py-1.5 text-sm">
        <option value="frente">Frente</option>
        <option value="perfil">Perfil</option>
        <option value="espalda">Espalda</option>
      </select>
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-brand-700 px-3 py-2 text-sm text-white hover:bg-brand-800 disabled:opacity-60"
      >
        {pending ? "Subiendo…" : "Subir"}
      </button>
      <p className="text-xs text-ink-soft">
        Tu nutrióloga revisará esta foto de forma privada antes de compartirla contigo en las comparativas.
      </p>
    </form>
  );
}
