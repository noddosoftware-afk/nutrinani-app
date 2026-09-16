import { NuevoPacienteForm } from "./form";

export default function NuevoPacientePage() {
  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-xl font-semibold text-stone-900">Nuevo paciente</h1>
      <NuevoPacienteForm />
    </div>
  );
}
