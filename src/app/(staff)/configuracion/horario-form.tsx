"use client";

import { useActionState, useState } from "react";
import { Check } from "lucide-react";
import { actualizarHorarioAction, type EstadoConfig } from "./actions";
import { Campo, Input, Boton } from "@/components/campo";
import { DIAS_SEMANA } from "@/lib/agenda-fechas";

const ETIQUETA_DIA: Record<string, string> = {
  lunes: "Lunes",
  martes: "Martes",
  miercoles: "Miércoles",
  jueves: "Jueves",
  viernes: "Viernes",
  sabado: "Sábado",
  domingo: "Domingo",
};

interface Props {
  horarioInicial: Record<string, { inicio: string; fin: string } | null>;
  duracionInicial: number;
}

export function HorarioForm(props: Props) {
  const [instancia, setInstancia] = useState(0);
  return <Formulario key={instancia} {...props} onGuardado={() => setInstancia((n) => n + 1)} />;
}

function Formulario({ horarioInicial, duracionInicial, onGuardado }: Props & { onGuardado: () => void }) {
  const [state, formAction, pending] = useActionState<EstadoConfig, FormData>(actualizarHorarioAction, {
    error: null,
  });
  const [abierto, setAbierto] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(DIAS_SEMANA.map((d) => [d, horarioInicial[d] != null]))
  );

  if (state.ok) {
    return (
      <div className="flex items-center justify-between gap-2 rounded-lg border border-brand-100 bg-brand-50 p-4 text-sm text-brand-800">
        <span className="flex items-center gap-2">
          <Check size={16} /> Horario actualizado.
        </span>
        <button type="button" onClick={onGuardado} className="underline">
          Editar de nuevo
        </button>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4 rounded-lg border border-cream-200 bg-white p-4">
      <Campo label="Duración de cita por defecto (minutos)" name="duracion_cita_minutos" className="max-w-xs">
        <Input
          name="duracion_cita_minutos"
          type="number"
          min={10}
          step={5}
          defaultValue={duracionInicial}
          required
        />
      </Campo>

      <div className="space-y-2">
        <p className="text-sm font-medium text-ink-soft">Horario de atención</p>
        {DIAS_SEMANA.map((dia) => (
          <div key={dia} className="flex flex-wrap items-center gap-3 border-t border-cream-100 py-2 first:border-0">
            <label className="flex w-32 items-center gap-2 text-sm text-ink">
              <input
                type="checkbox"
                name={`${dia}_abierto`}
                defaultChecked={abierto[dia]}
                onChange={(e) => setAbierto((prev) => ({ ...prev, [dia]: e.target.checked }))}
              />
              {ETIQUETA_DIA[dia]}
            </label>
            {abierto[dia] ? (
              <div className="flex items-center gap-2">
                <input
                  type="time"
                  name={`${dia}_inicio`}
                  defaultValue={horarioInicial[dia]?.inicio ?? "09:00"}
                  className="rounded-md border border-cream-200 px-2 py-1 text-sm"
                />
                <span className="text-ink-soft">a</span>
                <input
                  type="time"
                  name={`${dia}_fin`}
                  defaultValue={horarioInicial[dia]?.fin ?? "18:00"}
                  className="rounded-md border border-cream-200 px-2 py-1 text-sm"
                />
              </div>
            ) : (
              <span className="text-sm text-ink-soft">Cerrado</span>
            )}
          </div>
        ))}
      </div>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <Boton type="submit" disabled={pending}>
        {pending ? "Guardando…" : "Guardar horario"}
      </Boton>
    </form>
  );
}
