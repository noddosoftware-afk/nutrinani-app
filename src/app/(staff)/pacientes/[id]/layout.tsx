import { obtenerPaciente, cambiarEstadoPaciente } from "@/data/pacientes";
import { PacienteTabs } from "./paciente-tabs";

function iniciales(nombre: string) {
  return nombre
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

export default async function PacienteLayout({ children, params }: LayoutProps<"/pacientes/[id]">) {
  const { id } = await params;
  const paciente = await obtenerPaciente(id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-100 font-display text-lg font-semibold text-brand-800">
            {iniciales(paciente.nombre_completo)}
          </div>
          <div>
            <h1 className="font-display text-xl font-semibold text-ink">{paciente.nombre_completo}</h1>
            {paciente.estado === "archivado" && (
              <span className="text-xs font-medium text-amber-700">Paciente archivado</span>
            )}
          </div>
        </div>
        <form
          action={async () => {
            "use server";
            await cambiarEstadoPaciente(id, paciente.estado === "activo" ? "archivado" : "activo");
          }}
        >
          <button className="rounded-lg border border-cream-200 bg-white px-3 py-1.5 text-sm hover:bg-cream-100">
            {paciente.estado === "activo" ? "Archivar" : "Reactivar"}
          </button>
        </form>
      </div>

      <PacienteTabs id={id} />

      {children}
    </div>
  );
}
