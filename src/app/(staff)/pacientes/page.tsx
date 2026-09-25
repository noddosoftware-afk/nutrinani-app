import Link from "next/link";
import { Plus, Search, Users, ChevronRight } from "lucide-react";
import { listarPacientes } from "@/data/pacientes";
import { Avatar, Badge, EstadoVacio, Boton } from "@/components/campo";

export default async function PacientesPage({ searchParams }: PageProps<"/pacientes">) {
  const params = await searchParams;
  const busqueda = typeof params.q === "string" ? params.q : undefined;
  const estado = params.estado === "archivado" ? "archivado" : undefined;

  const pacientes = await listarPacientes({ busqueda, estado });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-brand-900">Pacientes</h1>
          <p className="mt-1 text-sm text-ink-soft">{pacientes.length} en tu consultorio.</p>
        </div>
        <Link
          href="/pacientes/nuevo"
          className="inline-flex items-center gap-2 rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-medium text-white shadow-soft hover:bg-brand-800"
        >
          <Plus size={16} /> Nuevo paciente
        </Link>
      </div>

      <form className="flex flex-wrap gap-2">
        <div className="relative w-full max-w-sm">
          <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft" />
          <input
            type="search"
            name="q"
            defaultValue={busqueda}
            placeholder="Buscar por nombre…"
            className="w-full rounded-xl border border-cream-200 bg-white py-2.5 pl-10 pr-3 text-sm focus:border-brand-600 focus:outline-none focus:ring-4 focus:ring-brand-100/60"
          />
        </div>
        <select
          name="estado"
          defaultValue={estado ?? "activo"}
          className="rounded-xl border border-cream-200 bg-white px-3.5 py-2.5 text-sm text-ink"
        >
          <option value="activo">Activos</option>
          <option value="archivado">Archivados</option>
        </select>
        <Boton type="submit" variante="secundario">
          Buscar
        </Boton>
      </form>

      {pacientes.length === 0 ? (
        <EstadoVacio
          icon={Users}
          titulo="No hay pacientes registrados todavía."
          descripcion="Agrega tu primer paciente para comenzar a gestionar su seguimiento."
          accion={
            <Link
              href="/pacientes/nuevo"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-medium text-white shadow-soft hover:bg-brand-800"
            >
              <Plus size={16} /> Agregar paciente
            </Link>
          }
        />
      ) : (
        <ul className="divide-y divide-cream-200 overflow-hidden rounded-2xl border border-cream-200 bg-white">
          {pacientes.map((p) => (
            <li key={p.id}>
              <Link
                href={`/pacientes/${p.id}`}
                className="group flex items-center gap-3.5 px-4 py-3.5 transition-colors hover:bg-cream-100/70"
              >
                <Avatar nombre={p.nombre_completo} size={38} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">{p.nombre_completo}</p>
                  <p className="truncate text-xs text-ink-soft">{p.telefono ?? p.email ?? "Sin contacto"}</p>
                </div>
                {p.estado === "archivado" && <Badge tono="neutro">Archivado</Badge>}
                <ChevronRight size={16} className="text-ink-soft/50 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
