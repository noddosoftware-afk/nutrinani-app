import { obtenerPaciente } from "@/data/pacientes";
import { NuevaConsultaForm } from "./form";

function calcularEdad(fechaNacimiento: string | null): number {
  if (!fechaNacimiento) return 0;
  const nacimiento = new Date(fechaNacimiento);
  const hoy = new Date();
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const m = hoy.getMonth() - nacimiento.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) edad--;
  return edad;
}

export default async function NuevaConsultaPage({ params }: PageProps<"/pacientes/[id]/consultas/nueva">) {
  const { id } = await params;
  const paciente = await obtenerPaciente(id);
  const edad = calcularEdad(paciente.fecha_nacimiento);

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold text-ink">Nueva consulta — {paciente.nombre_completo}</h2>
      {!paciente.fecha_nacimiento && (
        <p className="rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800">
          Este paciente no tiene fecha de nacimiento registrada; los cálculos de edad-dependientes quedarán
          bloqueados hasta que se capture en el expediente.
        </p>
      )}
      <NuevaConsultaForm pacienteId={id} edadAnios={edad} sexoDefault={paciente.sexo ?? "femenino"} />
    </div>
  );
}
