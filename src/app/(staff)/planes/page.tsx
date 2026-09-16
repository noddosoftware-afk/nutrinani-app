import Link from "next/link";
import { requireStaff } from "@/data/auth";
import { createClient } from "@/lib/supabase/server";

export default async function PlanesGlobalPage() {
  await requireStaff();
  const supabase = await createClient();
  const { data: planes, error } = await supabase
    .from("planes")
    .select("id, nombre, estado, version, creado_en, paciente:pacientes(nombre_completo)")
    .order("creado_en", { ascending: false })
    .limit(50);
  if (error) throw error;

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-ink">Planes</h1>
      {!planes || planes.length === 0 ? (
        <p className="text-sm text-ink-soft">Aún no hay planes creados. Empieza desde el expediente de un paciente.</p>
      ) : (
        <ul className="divide-y divide-cream-200 rounded-lg border border-cream-200 bg-white">
          {planes.map((p) => (
            <li key={p.id}>
              <Link href={`/planes/${p.id}`} className="flex items-center justify-between px-4 py-3 hover:bg-cream-100">
                <div>
                  <p className="text-sm font-medium">{p.nombre}</p>
                  <p className="text-xs text-ink-soft">
                    {(p.paciente as unknown as { nombre_completo: string } | null)?.nombre_completo ?? "—"} · v{p.version}
                  </p>
                </div>
                <span className="text-xs font-medium text-brand-800">{p.estado}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
