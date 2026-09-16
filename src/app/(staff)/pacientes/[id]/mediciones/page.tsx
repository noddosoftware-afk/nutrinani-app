import { listarMedicionesPaciente } from "@/data/consultas";

export default async function MedicionesPage({ params }: PageProps<"/pacientes/[id]/mediciones">) {
  const { id } = await params;
  const mediciones = await listarMedicionesPaciente(id);

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold text-ink">Historial de mediciones</h2>
      {mediciones.length === 0 ? (
        <p className="text-sm text-ink-soft">Sin mediciones registradas todavía.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-cream-200 bg-white">
          <table className="w-full text-sm">
            <thead className="border-b border-cream-200 text-left text-ink-soft">
              <tr>
                <th className="px-3 py-2">Fecha</th>
                <th className="px-3 py-2">Peso (kg)</th>
                <th className="px-3 py-2">Cintura (cm)</th>
                <th className="px-3 py-2">Cadera (cm)</th>
                <th className="px-3 py-2">% Grasa</th>
                <th className="px-3 py-2">Masa muscular (kg)</th>
                <th className="px-3 py-2">Origen</th>
              </tr>
            </thead>
            <tbody>
              {mediciones
                .slice()
                .reverse()
                .map((m) => (
                  <tr key={m.id} className="border-b border-cream-100 last:border-0">
                    <td className="px-3 py-2">{new Date(m.fecha).toLocaleDateString("es-MX")}</td>
                    <td className="px-3 py-2">{m.peso_kg ?? "—"}</td>
                    <td className="px-3 py-2">{m.cintura_cm ?? "—"}</td>
                    <td className="px-3 py-2">{m.cadera_cm ?? "—"}</td>
                    <td className="px-3 py-2">{m.porcentaje_grasa ?? "—"}</td>
                    <td className="px-3 py-2">{m.masa_muscular_kg ?? "—"}</td>
                    <td className="px-3 py-2 text-ink-soft">
                      {m.reportado_por_paciente ? "Reportado por paciente" : "Registrado en consultorio"}
                      {m.revisado_por_nutriologa ? " · revisado" : ""}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
