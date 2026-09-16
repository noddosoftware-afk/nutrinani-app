import Link from "next/link";
import { listarPacientes } from "@/data/pacientes";

export default async function PacientesPage({ searchParams }: PageProps<"/pacientes">) {
  const params = await searchParams;
  const busqueda = typeof params.q === "string" ? params.q : undefined;
  const estado = params.estado === "archivado" ? "archivado" : undefined;

  const pacientes = await listarPacientes({ busqueda, estado });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-stone-900">Pacientes</h1>
        <Link href="/pacientes/nuevo" className="rounded-md bg-emerald-700 px-4 py-2 text-sm text-white hover:bg-emerald-800">
          + Nuevo paciente
        </Link>
      </div>

      <form className="flex gap-2">
        <input
          type="search"
          name="q"
          defaultValue={busqueda}
          placeholder="Buscar por nombre…"
          className="w-full max-w-sm rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
        />
        <select name="estado" defaultValue={estado ?? "activo"} className="rounded-md border border-stone-300 px-3 py-2 text-sm">
          <option value="activo">Activos</option>
          <option value="archivado">Archivados</option>
        </select>
        <button className="rounded-md border border-stone-300 px-4 py-2 text-sm hover:bg-stone-100">Buscar</button>
      </form>

      {pacientes.length === 0 ? (
        <p className="text-sm text-stone-500">No hay pacientes que coincidan con la búsqueda.</p>
      ) : (
        <ul className="divide-y divide-stone-200 rounded-md border border-stone-200 bg-white">
          {pacientes.map((p) => (
            <li key={p.id}>
              <Link href={`/pacientes/${p.id}`} className="flex items-center justify-between px-4 py-3 hover:bg-stone-50">
                <span className="text-sm font-medium text-stone-900">{p.nombre_completo}</span>
                <span className="text-xs text-stone-500">{p.telefono ?? p.email ?? ""}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
