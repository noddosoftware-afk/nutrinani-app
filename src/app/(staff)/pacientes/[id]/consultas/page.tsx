import Link from "next/link";
import { listarConsultas } from "@/data/consultas";

export default async function ConsultasPage({ params }: PageProps<"/pacientes/[id]/consultas">) {
  const { id } = await params;
  const consultas = await listarConsultas(id);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-stone-700">Historial de consultas</h2>
        <Link href={`/pacientes/${id}/consultas/nueva`} className="rounded-md bg-emerald-700 px-3 py-1.5 text-sm text-white hover:bg-emerald-800">
          + Nueva consulta
        </Link>
      </div>

      {consultas.length === 0 ? (
        <p className="text-sm text-stone-500">Sin consultas registradas todavía.</p>
      ) : (
        <div className="space-y-3">
          {consultas.map((c) => {
            const medicion = c.mediciones?.[0];
            const imc = c.calculos?.find((k) => k.tipo === "imc")?.resultado as
              | { valor: { imc: number; categoria: string } | null }
              | undefined;
            return (
              <div key={c.id} className="rounded-lg border border-stone-200 bg-white p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{new Date(c.fecha).toLocaleDateString("es-MX", { dateStyle: "long" })}</span>
                  <span className="text-xs text-stone-500">{c.motivo ?? ""}</span>
                </div>
                <div className="mt-2 grid grid-cols-3 gap-2 text-sm text-stone-600">
                  <span>Peso: {medicion?.peso_kg ?? "—"} kg</span>
                  <span>IMC: {imc?.valor?.imc ?? "—"}</span>
                  <span>Próx. revisión: {c.proxima_revision ? new Date(c.proxima_revision).toLocaleDateString("es-MX") : "—"}</span>
                </div>
                {c.evaluacion && <p className="mt-2 text-sm text-stone-700">{c.evaluacion}</p>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
