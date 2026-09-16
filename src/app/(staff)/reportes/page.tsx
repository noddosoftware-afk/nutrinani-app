import { requireStaff } from "@/data/auth";
import { createClient } from "@/lib/supabase/server";

export default async function ReportesPage() {
  await requireStaff();
  const supabase = await createClient();
  const [{ count: totalPacientes }, { count: totalConsultas }, { count: totalPlanesPublicados }] = await Promise.all([
    supabase.from("pacientes").select("id", { count: "exact", head: true }).eq("estado", "activo"),
    supabase.from("consultas").select("id", { count: "exact", head: true }),
    supabase.from("planes").select("id", { count: "exact", head: true }).eq("estado", "publicado"),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-ink">Reportes</h1>
      <p className="text-sm text-ink-soft">
        Reportes avanzados (adherencia, resultados por periodo, exportación consolidada) están planeados para la Fase
        3. Estos son los conteos básicos disponibles hoy.
      </p>
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-lg border border-cream-200 bg-white p-4">
          <p className="text-sm text-ink-soft">Pacientes activos</p>
          <p className="text-2xl font-semibold">{totalPacientes ?? 0}</p>
        </div>
        <div className="rounded-lg border border-cream-200 bg-white p-4">
          <p className="text-sm text-ink-soft">Consultas registradas</p>
          <p className="text-2xl font-semibold">{totalConsultas ?? 0}</p>
        </div>
        <div className="rounded-lg border border-cream-200 bg-white p-4">
          <p className="text-sm text-ink-soft">Planes publicados</p>
          <p className="text-2xl font-semibold">{totalPlanesPublicados ?? 0}</p>
        </div>
      </div>
    </div>
  );
}
