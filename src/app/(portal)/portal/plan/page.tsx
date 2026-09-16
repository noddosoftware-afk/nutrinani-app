import { redirect } from "next/navigation";
import { getSesionActual } from "@/data/auth";
import { planVigentePaciente } from "@/data/planes";

export default async function PortalPlanPage() {
  const sesion = await getSesionActual();
  if (!sesion?.pacienteId) redirect("/login");

  const plan = await planVigentePaciente(sesion.pacienteId);

  if (!plan) {
    return <p className="text-sm text-ink-soft">Tu nutrióloga aún no ha publicado un plan para ti.</p>;
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-semibold text-ink">{plan.nombre}</h1>
        {plan.objetivo_kcal && <p className="text-sm text-ink-soft">Objetivo: {plan.objetivo_kcal} kcal/día</p>}
      </div>

      {(plan.plan_dias ?? []).map((dia) => (
        <div key={dia.id} className="space-y-2 rounded-lg border border-cream-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-ink">{dia.etiqueta ?? `Día ${dia.numero_dia}`}</h2>
          {dia.plan_tiempos.map((tiempo) => (
            <div key={tiempo.id}>
              <p className="text-sm font-medium text-brand-800">{tiempo.nombre}</p>
              <ul className="ml-4 list-disc text-sm text-ink-soft">
                {tiempo.plan_items.map((item) => (
                  <li key={item.id}>
                    {item.alimento?.nombre ?? item.receta?.nombre} — {item.cantidad_gramos} g
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ))}

      {plan.recomendaciones && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
          <h2 className="mb-1 text-sm font-semibold text-amber-900">Recomendaciones de tu nutrióloga</h2>
          <p className="text-sm text-amber-900">{plan.recomendaciones}</p>
        </div>
      )}
    </div>
  );
}
