"use client";

import { useActionState, useState } from "react";
import { Plus, Check } from "lucide-react";
import { crearCitaAction, type EstadoFormCita } from "./actions";
import { Campo, Input, Select, Boton } from "@/components/campo";

interface Props {
  pacientes: { id: string; nombre_completo: string }[];
  fechaSugerida: string;
  duracionDefault: number;
}

export function NuevaCitaForm(props: Props) {
  const [abierto, setAbierto] = useState(false);
  const [instancia, setInstancia] = useState(0);

  if (!abierto) {
    return (
      <Boton onClick={() => setAbierto(true)} type="button">
        <Plus size={16} /> Nueva cita
      </Boton>
    );
  }

  return (
    <FormularioCita
      key={instancia}
      {...props}
      onCancelar={() => {
        // Cada cierre fuerza una instancia nueva del hook de estado, para que la
        // próxima vez que se abra el formulario no queden pegados un error o un
        // aviso de éxito de un intento anterior.
        setInstancia((n) => n + 1);
        setAbierto(false);
      }}
    />
  );
}

function FormularioCita({
  pacientes,
  fechaSugerida,
  duracionDefault,
  onCancelar,
}: Props & { onCancelar: () => void }) {
  const [state, formAction, pending] = useActionState<EstadoFormCita, FormData>(crearCitaAction, { error: null });

  if (state.ok) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-brand-100 bg-brand-50 p-4 text-sm text-brand-800">
        <Check size={16} />
        Cita agendada.
        <button type="button" onClick={onCancelar} className="ml-2 underline">
          Cerrar
        </button>
      </div>
    );
  }

  return (
    <form action={formAction} className="grid grid-cols-2 gap-3 rounded-xl border border-cream-200 bg-white p-4 sm:grid-cols-5">
      <Campo label="Paciente" name="paciente_id" className="col-span-2">
        <Select name="paciente_id" required defaultValue="">
          <option value="" disabled>
            Selecciona…
          </option>
          {pacientes.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nombre_completo}
            </option>
          ))}
        </Select>
      </Campo>
      <Campo label="Fecha" name="fecha">
        <Input name="fecha" type="date" defaultValue={fechaSugerida} required />
      </Campo>
      <Campo label="Hora" name="hora">
        <Input name="hora" type="time" required />
      </Campo>
      <Campo label="Duración (min)" name="duracion_minutos">
        <Input name="duracion_minutos" type="number" defaultValue={duracionDefault} min={10} step={5} />
      </Campo>
      <Campo label="Motivo (opcional)" name="motivo" className="col-span-2 sm:col-span-5">
        <Input name="motivo" placeholder="Consulta de seguimiento" />
      </Campo>
      {state.error && <p className="col-span-full text-sm text-red-600">{state.error}</p>}
      <div className="col-span-full flex gap-2">
        <Boton type="submit" disabled={pending}>
          {pending ? "Guardando…" : "Agendar"}
        </Boton>
        <Boton type="button" variante="secundario" onClick={onCancelar}>
          Cancelar
        </Boton>
      </div>
    </form>
  );
}
