import { obtenerPaciente, cambiarEstadoPaciente } from "@/data/pacientes";
import { PacienteTabs } from "./paciente-tabs";
import { Avatar, Badge, Boton } from "@/components/campo";

export default async function PacienteLayout({ children, params }: LayoutProps<"/pacientes/[id]">) {
  const { id } = await params;
  const paciente = await obtenerPaciente(id);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3.5">
          <Avatar nombre={paciente.nombre_completo} size={48} />
          <div>
            <h1 className="font-display text-2xl text-brand-900">{paciente.nombre_completo}</h1>
            {paciente.estado === "archivado" && (
              <Badge tono="alerta" className="mt-1">
                Archivado
              </Badge>
            )}
          </div>
        </div>
        <form
          action={async () => {
            "use server";
            await cambiarEstadoPaciente(id, paciente.estado === "activo" ? "archivado" : "activo");
          }}
        >
          <Boton type="submit" variante="secundario">
            {paciente.estado === "activo" ? "Archivar" : "Reactivar"}
          </Boton>
        </form>
      </div>

      <PacienteTabs id={id} />

      {children}
    </div>
  );
}
