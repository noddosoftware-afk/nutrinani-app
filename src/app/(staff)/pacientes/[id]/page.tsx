import Link from "next/link";
import { obtenerPaciente } from "@/data/pacientes";
import { listarConsultas, listarMedicionesPaciente } from "@/data/consultas";
import { planVigentePaciente } from "@/data/planes";

export default async function ResumenPacientePage({ params }: PageProps<"/pacientes/[id]">) {
  const { id } = await params;
  const [paciente, consultas, mediciones, plan] = await Promise.all([
    obtenerPaciente(id),
    listarConsultas(id),
    listarMedicionesPaciente(id),
    planVigentePaciente(id),
  ]);

  const ultimaMedicion = mediciones[mediciones.length - 1];

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <section className="rounded-lg border border-stone-200 bg-white p-4">
        <h2 className="mb-2 text-sm font-semibold text-stone-700">Datos de contacto</h2>
        <dl className="space-y-1 text-sm">
          <div className="flex justify-between"><dt className="text-stone-500">Teléfono</dt><dd>{paciente.telefono ?? "—"}</dd></div>
          <div className="flex justify-between"><dt className="text-stone-500">Correo</dt><dd>{paciente.email ?? "—"}</dd></div>
          <div className="flex justify-between"><dt className="text-stone-500">Objetivos</dt><dd className="text-right">{paciente.objetivos ?? "—"}</dd></div>
        </dl>
      </section>

      <section className="rounded-lg border border-stone-200 bg-white p-4">
        <h2 className="mb-2 text-sm font-semibold text-stone-700">Última medición</h2>
        {ultimaMedicion ? (
          <dl className="space-y-1 text-sm">
            <div className="flex justify-between"><dt className="text-stone-500">Fecha</dt><dd>{new Date(ultimaMedicion.fecha).toLocaleDateString("es-MX")}</dd></div>
            <div className="flex justify-between"><dt className="text-stone-500">Peso</dt><dd>{ultimaMedicion.peso_kg ?? "—"} kg</dd></div>
            <div className="flex justify-between"><dt className="text-stone-500">Cintura</dt><dd>{ultimaMedicion.cintura_cm ?? "—"} cm</dd></div>
          </dl>
        ) : (
          <p className="text-sm text-stone-500">Sin mediciones registradas.</p>
        )}
      </section>

      <section className="rounded-lg border border-stone-200 bg-white p-4 md:col-span-2">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-stone-700">Consultas recientes</h2>
          <Link href={`/pacientes/${id}/consultas/nueva`} className="text-sm text-emerald-800 hover:underline">
            + Nueva consulta
          </Link>
        </div>
        {consultas.length === 0 ? (
          <p className="text-sm text-stone-500">Sin consultas registradas todavía.</p>
        ) : (
          <ul className="divide-y divide-stone-100 text-sm">
            {consultas.slice(0, 5).map((c) => (
              <li key={c.id} className="flex justify-between py-2">
                <span>{new Date(c.fecha).toLocaleDateString("es-MX")}</span>
                <span className="text-stone-500">{c.motivo ?? "Consulta"}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-lg border border-stone-200 bg-white p-4 md:col-span-2">
        <h2 className="mb-2 text-sm font-semibold text-stone-700">Plan vigente</h2>
        {plan ? (
          <div className="flex items-center justify-between text-sm">
            <span>{plan.nombre}</span>
            <Link href={`/planes/${plan.id}`} className="text-emerald-800 hover:underline">
              Ver plan
            </Link>
          </div>
        ) : (
          <p className="text-sm text-stone-500">No hay un plan publicado actualmente.</p>
        )}
      </section>
    </div>
  );
}
