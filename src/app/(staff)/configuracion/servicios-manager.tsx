"use client";

import { useActionState, useState, useTransition } from "react";
import { Plus, Check } from "lucide-react";
import {
  crearServicioAction,
  cambiarActivoServicioAction,
  actualizarServicioAction,
  type EstadoConfig,
} from "./actions";
import { Campo, Input, Textarea, Boton } from "@/components/campo";
import type { Servicio } from "@/data/pagos";

export function ServiciosManager({ servicios }: { servicios: Servicio[] }) {
  return (
    <div className="space-y-4">
      {servicios.length === 0 ? (
        <p className="text-sm text-ink-soft">Aún no hay servicios registrados.</p>
      ) : (
        <div className="divide-y divide-cream-100 rounded-lg border border-cream-200 bg-white">
          {servicios.map((s) => (
            <FilaServicio key={s.id} servicio={s} />
          ))}
        </div>
      )}
      <NuevoServicioForm />
    </div>
  );
}

function FilaServicio({ servicio }: { servicio: Servicio }) {
  const [editando, setEditando] = useState(false);
  const [pending, startTransition] = useTransition();

  if (editando) {
    return (
      <form
        action={(fd) => {
          startTransition(async () => {
            await actualizarServicioAction(servicio.id, fd);
            setEditando(false);
          });
        }}
        className="flex flex-wrap items-center gap-2 p-3"
      >
        <Input name="nombre" defaultValue={servicio.nombre} className="max-w-[200px]" required />
        <Input name="precio" type="number" min={0} step={0.01} defaultValue={servicio.precio} className="max-w-[120px]" required />
        <Boton type="submit" disabled={pending} className="text-xs">
          Guardar
        </Boton>
        <Boton type="button" variante="secundario" className="text-xs" onClick={() => setEditando(false)}>
          Cancelar
        </Boton>
      </form>
    );
  }

  return (
    <div className="flex items-center justify-between gap-3 p-3 text-sm">
      <div>
        <p className={servicio.activo ? "text-ink" : "text-ink-soft line-through"}>{servicio.nombre}</p>
        {servicio.descripcion && <p className="text-xs text-ink-soft">{servicio.descripcion}</p>}
      </div>
      <div className="flex items-center gap-3">
        <span className="font-medium text-ink">${servicio.precio.toLocaleString("es-MX")}</span>
        <button type="button" onClick={() => setEditando(true)} className="text-xs text-brand-700 hover:underline">
          Editar
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() => startTransition(() => cambiarActivoServicioAction(servicio.id, !servicio.activo))}
          className="text-xs text-ink-soft hover:underline"
        >
          {servicio.activo ? "Desactivar" : "Reactivar"}
        </button>
      </div>
    </div>
  );
}

function NuevoServicioForm() {
  const [instancia, setInstancia] = useState(0);
  return <Formulario key={instancia} onListo={() => setInstancia((n) => n + 1)} />;
}

function Formulario({ onListo }: { onListo: () => void }) {
  const [state, formAction, pending] = useActionState<EstadoConfig, FormData>(crearServicioAction, { error: null });

  if (state.ok) {
    return (
      <div className="flex items-center justify-between gap-2 rounded-lg border border-brand-100 bg-brand-50 p-4 text-sm text-brand-800">
        <span className="flex items-center gap-2">
          <Check size={16} /> Servicio creado.
        </span>
        <button type="button" onClick={onListo} className="underline">
          Agregar otro
        </button>
      </div>
    );
  }

  return (
    <form action={formAction} className="grid grid-cols-2 gap-3 rounded-lg border border-cream-200 bg-white p-4 sm:grid-cols-4">
      <Campo label="Nombre" name="nombre" className="col-span-2">
        <Input name="nombre" placeholder="Consulta de seguimiento" required />
      </Campo>
      <Campo label="Precio (MXN)" name="precio">
        <Input name="precio" type="number" min={0} step={0.01} required />
      </Campo>
      <Campo label="Descripción (opcional)" name="descripcion" className="col-span-2 sm:col-span-4">
        <Textarea name="descripcion" rows={2} />
      </Campo>
      {state.error && <p className="col-span-full text-sm text-red-600">{state.error}</p>}
      <div className="col-span-full">
        <Boton type="submit" disabled={pending}>
          <Plus size={16} />
          {pending ? "Guardando…" : "Agregar servicio"}
        </Boton>
      </div>
    </form>
  );
}
