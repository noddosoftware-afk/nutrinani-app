"use client";

import { useActionState, useState } from "react";
import { format } from "date-fns";
import { Check, X, CalendarClock, CircleCheckBig } from "lucide-react";
import { cambiarEstadoCitaAction, reprogramarCitaAction } from "./actions";
import { Input, Boton } from "@/components/campo";
import type { Cita } from "@/data/citas";

const ESTADO_ESTILO: Record<string, string> = {
  pendiente: "bg-amber-50 text-amber-800",
  confirmada: "bg-brand-50 text-brand-800",
  cancelada: "bg-red-50 text-red-700 line-through",
  completada: "bg-cream-200 text-ink-soft",
};

const ESTADO_LABEL: Record<string, string> = {
  pendiente: "Pendiente",
  confirmada: "Confirmada",
  cancelada: "Cancelada",
  completada: "Completada",
};

export function CitaCard({ cita, duracionDefault }: { cita: Cita; duracionDefault: number }) {
  const [reprogramando, setReprogramando] = useState(false);
  const [state, formAction, pending] = useActionState(
    async (_prev: { error: string | null }, formData: FormData) => reprogramarCitaAction(cita.id, formData),
    { error: null }
  );

  const inicio = new Date(cita.inicio);
  const fin = new Date(cita.fin);

  return (
    <div className="rounded-xl border border-cream-200 bg-white p-3">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-sm font-medium text-ink">
            {format(inicio, "HH:mm")}–{format(fin, "HH:mm")} · {cita.paciente?.nombre_completo ?? "Paciente"}
          </p>
          {cita.motivo && <p className="text-xs text-ink-soft">{cita.motivo}</p>}
        </div>
        <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${ESTADO_ESTILO[cita.estado]}`}>
          {ESTADO_LABEL[cita.estado]}
        </span>
      </div>

      {cita.estado !== "cancelada" && cita.estado !== "completada" && (
        <div className="mt-2 flex flex-wrap gap-2 text-xs">
          {cita.estado === "pendiente" && (
            <button
              onClick={() => cambiarEstadoCitaAction(cita.id, "confirmada")}
              className="flex items-center gap-1 rounded-md bg-brand-50 px-2 py-1 text-brand-800 hover:bg-brand-100"
            >
              <Check size={12} /> Confirmar
            </button>
          )}
          <button
            onClick={() => cambiarEstadoCitaAction(cita.id, "completada")}
            className="flex items-center gap-1 rounded-md bg-cream-100 px-2 py-1 text-ink-soft hover:bg-cream-200"
          >
            <CircleCheckBig size={12} /> Completada
          </button>
          <button
            onClick={() => setReprogramando((v) => !v)}
            className="flex items-center gap-1 rounded-md bg-cream-100 px-2 py-1 text-ink-soft hover:bg-cream-200"
          >
            <CalendarClock size={12} /> Reprogramar
          </button>
          <button
            onClick={() => {
              if (confirm("¿Cancelar esta cita?")) cambiarEstadoCitaAction(cita.id, "cancelada");
            }}
            className="flex items-center gap-1 rounded-md bg-red-50 px-2 py-1 text-red-700 hover:bg-red-100"
          >
            <X size={12} /> Cancelar
          </button>
        </div>
      )}

      {reprogramando && (
        <form action={formAction} className="mt-3 flex flex-wrap items-end gap-2 border-t border-cream-100 pt-3">
          <Input name="fecha" type="date" defaultValue={format(inicio, "yyyy-MM-dd")} required className="w-36" />
          <Input name="hora" type="time" defaultValue={format(inicio, "HH:mm")} required className="w-28" />
          <Input
            name="duracion_minutos"
            type="number"
            defaultValue={Math.round((fin.getTime() - inicio.getTime()) / 60000) || duracionDefault}
            className="w-20"
          />
          <Boton type="submit" disabled={pending} className="text-xs">
            {pending ? "Guardando…" : "Guardar"}
          </Boton>
          {state.error && <p className="w-full text-xs text-red-600">{state.error}</p>}
        </form>
      )}
    </div>
  );
}
