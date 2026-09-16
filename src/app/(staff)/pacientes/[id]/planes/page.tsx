import Link from "next/link";
import { listarPlanesPaciente } from "@/data/planes";

const ESTADO_LABEL: Record<string, string> = {
  borrador: "Borrador",
  aprobado: "Aprobado",
  publicado: "Publicado",
  sustituido: "Sustituido",
};

export default async function PlanesPacientePage({ params }: PageProps<"/pacientes/[id]/planes">) {
  const { id } = await params;
  const planes = await listarPlanesPaciente(id);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-ink">Planes de alimentación</h2>
        <Link href={`/planes/nuevo?paciente=${id}`} className="rounded-md bg-brand-700 px-3 py-1.5 text-sm text-white hover:bg-brand-800">
          + Nuevo plan
        </Link>
      </div>

      {planes.length === 0 ? (
        <p className="text-sm text-ink-soft">Sin planes todavía.</p>
      ) : (
        <ul className="divide-y divide-cream-200 rounded-lg border border-cream-200 bg-white">
          {planes.map((p) => (
            <li key={p.id}>
              <Link href={`/planes/${p.id}`} className="flex items-center justify-between px-4 py-3 hover:bg-cream-100">
                <div>
                  <p className="text-sm font-medium">{p.nombre}</p>
                  <p className="text-xs text-ink-soft">v{p.version} · {new Date(p.creado_en).toLocaleDateString("es-MX")}</p>
                </div>
                <span className="text-xs font-medium text-brand-800">{ESTADO_LABEL[p.estado]}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
