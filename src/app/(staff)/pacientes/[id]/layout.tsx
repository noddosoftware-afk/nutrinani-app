import Link from "next/link";
import { obtenerPaciente, cambiarEstadoPaciente } from "@/data/pacientes";

const TABS = [
  { seg: "", label: "Resumen" },
  { seg: "expediente", label: "Expediente" },
  { seg: "consultas", label: "Consultas" },
  { seg: "mediciones", label: "Mediciones" },
  { seg: "planes", label: "Planes" },
  { seg: "fotografias", label: "Fotografías" },
  { seg: "comparativas", label: "Comparativas" },
  { seg: "documentos", label: "Archivos" },
];

export default async function PacienteLayout({ children, params }: LayoutProps<"/pacientes/[id]">) {
  const { id } = await params;
  const paciente = await obtenerPaciente(id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-stone-900">{paciente.nombre_completo}</h1>
          {paciente.estado === "archivado" && (
            <span className="text-xs font-medium text-amber-700">Paciente archivado</span>
          )}
        </div>
        <form
          action={async () => {
            "use server";
            await cambiarEstadoPaciente(id, paciente.estado === "activo" ? "archivado" : "activo");
          }}
        >
          <button className="rounded-md border border-stone-300 px-3 py-1.5 text-sm hover:bg-stone-100">
            {paciente.estado === "activo" ? "Archivar" : "Reactivar"}
          </button>
        </form>
      </div>

      <nav className="flex gap-4 overflow-x-auto border-b border-stone-200 text-sm">
        {TABS.map((tab) => (
          <Link
            key={tab.seg}
            href={`/pacientes/${id}${tab.seg ? `/${tab.seg}` : ""}`}
            className="whitespace-nowrap px-1 pb-2 text-stone-600 hover:text-emerald-800"
          >
            {tab.label}
          </Link>
        ))}
      </nav>

      {children}
    </div>
  );
}
