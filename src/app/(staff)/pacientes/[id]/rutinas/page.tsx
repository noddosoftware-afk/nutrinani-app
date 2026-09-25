import Link from "next/link";
import { listarRutinasPaciente } from "@/data/rutinas";

const ESTADO_LABEL: Record<string, string> = {
  borrador: "Borrador",
  publicado: "Publicado",
};

export default async function RutinasPacientePage({ params }: PageProps<"/pacientes/[id]/rutinas">) {
  const { id } = await params;
  const rutinas = await listarRutinasPaciente(id);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-ink">Rutinas de entrenamiento</h2>
        <Link href={`/rutinas/nueva?paciente=${id}`} className="rounded-md bg-brand-700 px-3 py-1.5 text-sm text-white hover:bg-brand-800">
          + Nueva rutina
        </Link>
      </div>

      {rutinas.length === 0 ? (
        <p className="text-sm text-ink-soft">Sin rutinas todavía.</p>
      ) : (
        <ul className="divide-y divide-cream-200 rounded-lg border border-cream-200 bg-white">
          {rutinas.map((r) => (
            <li key={r.id}>
              <Link href={`/rutinas/${r.id}`} className="flex items-center justify-between px-4 py-3 hover:bg-cream-100">
                <div>
                  <p className="text-sm font-medium">{r.nombre}</p>
                  <p className="text-xs text-ink-soft">{new Date(r.creado_en).toLocaleDateString("es-MX")}</p>
                </div>
                <span className="text-xs font-medium text-brand-800">{ESTADO_LABEL[r.estado]}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
