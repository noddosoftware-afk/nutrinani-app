import { redirect } from "next/navigation";
import { getSesionActual } from "@/data/auth";
import { createClient } from "@/lib/supabase/server";
import { construirComparativa } from "@/data/comparativas";
import type { Medicion } from "@/data/consultas";

export default async function PortalComparativasPage() {
  const sesion = await getSesionActual();
  if (!sesion?.pacienteId) redirect("/login");

  // El paciente solo puede leer SUS PROPIAS mediciones — lo aplica RLS (mediciones_propio_select),
  // no solo este filtro en memoria.
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("mediciones")
    .select("*")
    .eq("paciente_id", sesion.pacienteId)
    .order("fecha", { ascending: true });
  if (error) throw error;

  const mediciones = (data ?? []) as Medicion[];
  const filas = construirComparativa(mediciones[0] ?? null, mediciones[mediciones.length - 1] ?? null);

  if (mediciones.length < 2) {
    return <p className="text-sm text-ink-soft">Necesitas al menos dos mediciones registradas para ver tu progreso.</p>;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold text-ink">Tu progreso</h1>
      <p className="text-sm text-ink-soft">
        Comparando {new Date(mediciones[0].fecha).toLocaleDateString("es-MX")} con{" "}
        {new Date(mediciones[mediciones.length - 1].fecha).toLocaleDateString("es-MX")}
      </p>
      <div className="space-y-3">
        {filas.map((f) => (
          <div key={f.indicador} className="rounded-lg border border-cream-200 bg-white p-3">
            <p className="text-sm font-medium">{f.indicador}</p>
            <p className="text-sm text-ink-soft">
              {f.cambio.valorInicial ?? "—"} → {f.cambio.valorComparado ?? "—"} {f.unidad}
              {f.cambio.cambioPorcentual !== null ? ` (${f.cambio.cambioPorcentual}%)` : " (sin datos suficientes)"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
