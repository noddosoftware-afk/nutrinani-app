import { listarAlimentos } from "@/data/alimentos";
import { obtenerPaciente } from "@/data/pacientes";
import { ConstructorPlan } from "./constructor";

export default async function NuevoPlanPage({ searchParams }: PageProps<"/planes/nuevo">) {
  const params = await searchParams;
  const pacienteId = typeof params.paciente === "string" ? params.paciente : "";
  const [paciente, alimentos] = await Promise.all([
    pacienteId ? obtenerPaciente(pacienteId) : null,
    listarAlimentos(),
  ]);

  if (!paciente) {
    return <p className="text-sm text-red-600">Falta indicar el paciente (?paciente=id).</p>;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-ink">Nuevo plan — {paciente.nombre_completo}</h1>
      <ConstructorPlan pacienteId={paciente.id} alimentos={alimentos} />
    </div>
  );
}
