import Link from "next/link";
import { Plus, Search, UserRound, Users } from "lucide-react";
import { listarPacientes } from "@/data/pacientes";

export default async function PacientesPage({ searchParams }: PageProps<"/pacientes">) {
  const params = await searchParams;
  const busqueda = typeof params.q === "string" ? params.q : undefined;
  const estado = params.estado === "archivado" ? "archivado" : undefined;

  const pacientes = await listarPacientes({ busqueda, estado });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-ink">Pacientes</h1>
        <Link
          href="/pacientes/nuevo"
          className="inline-flex items-center gap-2 rounded-lg bg-brand-700 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-brand-800"
        >
          <Plus size={16} /> Nuevo paciente
        </Link>
      </div>

      <form className="flex gap-2">
        <div className="relative w-full max-w-sm">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" />
          <input
            type="search"
            name="q"
            defaultValue={busqueda}
            placeholder="Buscar por nombre…"
            className="w-full rounded-lg border border-cream-200 bg-white py-2 pl-9 pr-3 text-sm focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
        </div>
        <select
          name="estado"
          defaultValue={estado ?? "activo"}
          className="rounded-lg border border-cream-200 bg-white px-3 py-2 text-sm"
        >
          <option value="activo">Activos</option>
          <option value="archivado">Archivados</option>
        </select>
        <button className="rounded-lg border border-cream-200 bg-white px-4 py-2 text-sm hover:bg-cream-100">Buscar</button>
      </form>

      {pacientes.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-cream-200 bg-white py-12 text-center">
          <Users size={28} className="text-ink-soft" />
          <p className="text-sm text-ink-soft">No hay pacientes que coincidan con la búsqueda.</p>
        </div>
      ) : (
        <ul className="divide-y divide-cream-200 rounded-xl border border-cream-200 bg-white">
          {pacientes.map((p) => (
            <li key={p.id}>
              <Link href={`/pacientes/${p.id}`} className="flex items-center gap-3 px-4 py-3 hover:bg-cream-100">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700">
                  <UserRound size={18} />
                </div>
                <span className="flex-1 text-sm font-medium text-ink">{p.nombre_completo}</span>
                <span className="text-xs text-ink-soft">{p.telefono ?? p.email ?? ""}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
