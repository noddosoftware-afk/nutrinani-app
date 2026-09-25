import { listarEjercicios } from "@/data/ejercicios";
import { obtenerPaciente } from "@/data/pacientes";
import { ConstructorRutina } from "./constructor";

export default async function NuevaRutinaPage({ searchParams }: PageProps<"/rutinas/nueva">) {
  const params = await searchParams;
  const pacienteId = typeof params.paciente === "string" ? params.paciente : "";
  const [paciente, ejercicios] = await Promise.all([
    pacienteId ? obtenerPaciente(pacienteId) : null,
    listarEjercicios(),
  ]);

  if (!paciente) {
    return <p className="text-sm text-red-600">Falta indicar el paciente (?paciente=id).</p>;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-ink">Nueva rutina — {paciente.nombre_completo}</h1>
      <ConstructorRutina pacienteId={paciente.id} ejercicios={ejercicios} />
    </div>
  );
}
