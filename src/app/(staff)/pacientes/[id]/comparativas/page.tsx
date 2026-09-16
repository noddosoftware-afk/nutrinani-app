import { listarMedicionesPaciente } from "@/data/consultas";
import { construirComparativa } from "@/data/comparativas";

export default async function ComparativasPage({ params, searchParams }: PageProps<"/pacientes/[id]/comparativas">) {
  const { id } = await params;
  const sp = await searchParams;
  const mediciones = await listarMedicionesPaciente(id);

  const idsDisponibles = mediciones.map((m) => m.id);
  const inicialId = typeof sp.inicial === "string" ? sp.inicial : idsDisponibles[0];
  const comparadaId = typeof sp.comparada === "string" ? sp.comparada : idsDisponibles[idsDisponibles.length - 1];

  const inicial = mediciones.find((m) => m.id === inicialId) ?? null;
  const comparada = mediciones.find((m) => m.id === comparadaId) ?? null;
  const filas = construirComparativa(inicial, comparada);

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold text-stone-700">Comparativa de evolución</h2>

      {mediciones.length < 2 ? (
        <p className="text-sm text-stone-500">Se necesitan al menos dos mediciones para comparar.</p>
      ) : (
        <>
          <form className="flex flex-wrap items-end gap-3">
            <SelectorFecha label="Fecha inicial" name="inicial" mediciones={mediciones} valor={inicialId} />
            <SelectorFecha label="Fecha comparada" name="comparada" mediciones={mediciones} valor={comparadaId} />
            <button className="rounded-md border border-stone-300 px-4 py-2 text-sm hover:bg-stone-100">Comparar</button>
          </form>

          <div className="overflow-x-auto rounded-lg border border-stone-200 bg-white">
            <table className="w-full text-sm">
              <thead className="border-b border-stone-200 text-left text-stone-500">
                <tr>
                  <th className="px-3 py-2">Indicador</th>
                  <th className="px-3 py-2">Inicial</th>
                  <th className="px-3 py-2">Comparado</th>
                  <th className="px-3 py-2">Cambio absoluto</th>
                  <th className="px-3 py-2">Cambio %</th>
                  <th className="px-3 py-2">Meta</th>
                </tr>
              </thead>
              <tbody>
                {filas.map((f) => (
                  <tr key={f.indicador} className="border-b border-stone-100 last:border-0">
                    <td className="px-3 py-2 font-medium">{f.indicador}</td>
                    <td className="px-3 py-2">
                      {f.cambio.valorInicial ?? "—"} {f.cambio.valorInicial !== null ? f.unidad : ""}
                    </td>
                    <td className="px-3 py-2">
                      {f.cambio.valorComparado ?? "—"} {f.cambio.valorComparado !== null ? f.unidad : ""}
                    </td>
                    <td className="px-3 py-2">
                      {f.cambio.cambioAbsoluto ?? "sin datos suficientes"}
                      {f.cambio.cambioAbsoluto !== null ? ` ${f.unidad}` : ""}
                    </td>
                    <td className="px-3 py-2">
                      {f.cambio.cambioPorcentual !== null ? `${f.cambio.cambioPorcentual}%` : (
                        <span className="text-stone-400" title={f.cambio.nota ?? ""}>
                          no calculable
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-stone-400">{f.meta ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-stone-500">
            Un cambio no implica automáticamente un resultado positivo o negativo — la interpretación depende del
            objetivo definido por la nutrióloga para cada paciente.
          </p>
        </>
      )}
    </div>
  );
}

function SelectorFecha({
  label,
  name,
  mediciones,
  valor,
}: {
  label: string;
  name: string;
  mediciones: { id: string; fecha: string }[];
  valor?: string;
}) {
  return (
    <label className="text-sm">
      <span className="block text-stone-700">{label}</span>
      <select name={name} defaultValue={valor} className="mt-1 rounded-md border border-stone-300 px-3 py-2 text-sm">
        {mediciones.map((m) => (
          <option key={m.id} value={m.id}>
            {new Date(m.fecha).toLocaleDateString("es-MX")}
          </option>
        ))}
      </select>
    </label>
  );
}
