import { obtenerPlanCompleto } from "@/data/planes";
import { requireNutriologa } from "@/data/auth";
import { aprobarPlanAction, publicarPlanAction } from "./actions";

const ESTADO_LABEL: Record<string, string> = {
  borrador: "Borrador",
  aprobado: "Aprobado",
  publicado: "Publicado",
  sustituido: "Sustituido",
};

export default async function PlanDetallePage({ params }: PageProps<"/planes/[id]">) {
  const { id } = await params;
  const [plan] = await Promise.all([obtenerPlanCompleto(id)]);
  let esNutriologa = false;
  try {
    await requireNutriologa();
    esNutriologa = true;
  } catch {
    esNutriologa = false;
  }

  const aprobar = aprobarPlanAction.bind(null, id);
  const publicar = publicarPlanAction.bind(null, id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-ink">{plan.nombre}</h1>
          <p className="text-sm text-ink-soft">
            {ESTADO_LABEL[plan.estado]} · versión {plan.version}
            {plan.objetivo_kcal ? ` · objetivo ${plan.objetivo_kcal} kcal/día` : ""}
          </p>
        </div>
        <div className="flex gap-2">
          <a href={`/planes/${id}/pdf`} target="_blank" rel="noreferrer" className="rounded-md border border-cream-200 px-3 py-1.5 text-sm hover:bg-cream-100">
            Exportar PDF
          </a>
          {esNutriologa && plan.estado === "borrador" && (
            <form action={aprobar}>
              <button className="rounded-md border border-brand-600 px-3 py-1.5 text-sm text-brand-800 hover:bg-brand-50">
                Aprobar
              </button>
            </form>
          )}
          {esNutriologa && plan.estado === "aprobado" && (
            <form action={publicar}>
              <button className="rounded-md bg-brand-700 px-3 py-1.5 text-sm text-white hover:bg-brand-800">
                Publicar al paciente
              </button>
            </form>
          )}
        </div>
      </div>

      {plan.estado === "borrador" && (
        <p className="rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800">
          Este plan está en borrador — el paciente no puede verlo todavía. Debe aprobarse y publicarse.
        </p>
      )}

      {(plan.plan_dias ?? []).map((dia) => (
        <div key={dia.id} className="space-y-3 rounded-lg border border-cream-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-ink">{dia.etiqueta ?? `Día ${dia.numero_dia}`}</h2>
          {dia.plan_tiempos.map((tiempo) => (
            <div key={tiempo.id} className="rounded-md border border-cream-100 p-3">
              <p className="mb-2 text-sm font-medium text-ink">{tiempo.nombre}</p>
              <ul className="space-y-1 text-sm text-ink-soft">
                {tiempo.plan_items.map((item) => (
                  <li key={item.id} className="flex justify-between">
                    <span>{item.alimento?.nombre ?? item.receta?.nombre ?? "—"}</span>
                    <span>{item.cantidad_gramos} g</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
