import Link from "next/link";
import { redirect } from "next/navigation";
import { getSesionActual } from "@/data/auth";
import { planVigentePaciente } from "@/data/planes";

export default async function PortalResumenPage() {
  const sesion = await getSesionActual();
  if (!sesion?.pacienteId) redirect("/login");

  const plan = await planVigentePaciente(sesion.pacienteId);

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
        <h2 className="text-sm font-semibold text-emerald-900">Tu plan actual</h2>
        {plan ? (
          <div className="mt-2 flex items-center justify-between">
            <span className="text-sm text-emerald-900">{plan.nombre}</span>
            <Link href="/portal/plan" className="text-sm text-emerald-800 hover:underline">
              Ver plan
            </Link>
          </div>
        ) : (
          <p className="mt-1 text-sm text-emerald-800">Tu nutrióloga aún no ha publicado un plan.</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Link href="/portal/fotografias" className="rounded-lg border border-stone-200 bg-white p-4 text-sm hover:border-emerald-300">
          Subir foto de progreso
        </Link>
        <Link href="/portal/comparativas" className="rounded-lg border border-stone-200 bg-white p-4 text-sm hover:border-emerald-300">
          Ver mi progreso
        </Link>
      </div>
    </div>
  );
}
