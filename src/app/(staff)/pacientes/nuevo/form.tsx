"use client";

import { useActionState } from "react";
import { crearPacienteAction } from "./actions";
import { Campo, Input, Select, Textarea, Boton } from "@/components/campo";

export function NuevoPacienteForm() {
  const [state, formAction, pending] = useActionState<{ error: string | null }, FormData>(crearPacienteAction, {
    error: null,
  });

  return (
    <form action={formAction} className="space-y-4 rounded-lg border border-cream-200 bg-white p-6">
      <Campo label="Nombre completo" name="nombre_completo">
        <Input id="nombre_completo" name="nombre_completo" required />
      </Campo>
      <div className="grid grid-cols-2 gap-4">
        <Campo label="Fecha de nacimiento" name="fecha_nacimiento">
          <Input id="fecha_nacimiento" name="fecha_nacimiento" type="date" />
        </Campo>
        <Campo label="Sexo" name="sexo">
          <Select id="sexo" name="sexo" defaultValue="">
            <option value="" disabled>
              Selecciona…
            </option>
            <option value="femenino">Femenino</option>
            <option value="masculino">Masculino</option>
          </Select>
        </Campo>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Campo label="Teléfono" name="telefono">
          <Input id="telefono" name="telefono" type="tel" />
        </Campo>
        <Campo label="Correo" name="email">
          <Input id="email" name="email" type="email" />
        </Campo>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Campo label="Contacto de emergencia" name="contacto_emergencia_nombre">
          <Input id="contacto_emergencia_nombre" name="contacto_emergencia_nombre" />
        </Campo>
        <Campo label="Teléfono de emergencia" name="contacto_emergencia_telefono">
          <Input id="contacto_emergencia_telefono" name="contacto_emergencia_telefono" type="tel" />
        </Campo>
      </div>
      <Campo label="Objetivos del paciente" name="objetivos">
        <Textarea id="objetivos" name="objetivos" rows={3} />
      </Campo>
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <Boton type="submit" disabled={pending}>
        {pending ? "Guardando…" : "Crear paciente"}
      </Boton>
    </form>
  );
}
