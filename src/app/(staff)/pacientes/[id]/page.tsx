import Link from "next/link";
import { obtenerPaciente } from "@/data/pacientes";
import { listarConsultas, listarMedicionesPaciente } from "@/data/consultas";
import { planVigentePaciente } from "@/data/planes";
import { Tarjeta } from "@/components/campo";

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
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-3">
        <MiniMetrica label="Peso" valor={ultimaMedicion?.peso_kg ? `${ultimaMedicion.peso_kg} kg` : "—"} />
        <MiniMetrica label="Talla" valor={ultimaMedicion?.talla_cm ? `${(ultimaMedicion.talla_cm / 100).toFixed(2)} m` : "—"} />
        <MiniMetrica label="Cintura" valor={ultimaMedicion?.cintura_cm ? `${ultimaMedicion.cintura_cm} cm` : "—"} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Tarjeta className="p-5">
          <h2 className="mb-3 text-sm font-semibold text-ink">Datos de contacto</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-ink-soft">Teléfono</dt><dd>{paciente.telefono ?? "—"}</dd></div>
            <div className="flex justify-between"><dt className="text-ink-soft">Correo</dt><dd>{paciente.email ?? "—"}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-ink-soft">Objetivos</dt><dd className="text-right">{paciente.objetivos ?? "—"}</dd></div>
          </dl>
        </Tarjeta>

        <Tarjeta className="p-5">
          <h2 className="mb-3 text-sm font-semibold text-ink">Última medición</h2>
          {ultimaMedicion ? (
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-ink-soft">Fecha</dt><dd>{new Date(ultimaMedicion.fecha).toLocaleDateString("es-MX")}</dd></div>
              <div className="flex justify-between"><dt className="text-ink-soft">Peso</dt><dd>{ultimaMedicion.peso_kg ?? "—"} kg</dd></div>
              <div className="flex justify-between"><dt className="text-ink-soft">Cintura</dt><dd>{ultimaMedicion.cintura_cm ?? "—"} cm</dd></div>
            </dl>
          ) : (
            <p className="text-sm text-ink-soft">Sin mediciones registradas.</p>
          )}
        </Tarjeta>

        <Tarjeta className="p-5 md:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-ink">Consultas recientes</h2>
            <Link href={`/pacientes/${id}/consultas/nueva`} className="text-sm text-brand-700 hover:underline">
              + Nueva consulta
            </Link>
          </div>
          {consultas.length === 0 ? (
            <p className="text-sm text-ink-soft">Sin consultas registradas todavía.</p>
          ) : (
            <ul className="divide-y divide-cream-100 text-sm">
              {consultas.slice(0, 5).map((c) => (
                <li key={c.id} className="flex justify-between py-2">
                  <span>{new Date(c.fecha).toLocaleDateString("es-MX")}</span>
                  <span className="text-ink-soft">{c.motivo ?? "Consulta"}</span>
                </li>
              ))}
            </ul>
          )}
        </Tarjeta>

        <Tarjeta className="p-5 md:col-span-2">
          <h2 className="mb-3 text-sm font-semibold text-ink">Plan vigente</h2>
          {plan ? (
            <div className="flex items-center justify-between text-sm">
              <span>{plan.nombre}</span>
              <Link href={`/planes/${plan.id}`} className="text-brand-700 hover:underline">
                Ver plan
              </Link>
            </div>
          ) : (
            <p className="text-sm text-ink-soft">No hay un plan publicado actualmente.</p>
          )}
        </Tarjeta>
      </div>
    </div>
  );
}

function MiniMetrica({ label, valor }: { label: string; valor: string }) {
  return (
    <Tarjeta className="p-4">
      <p className="text-xs text-ink-soft">{label}</p>
      <p className="mt-1 font-display text-2xl text-brand-900">{valor}</p>
    </Tarjeta>
  );
}
