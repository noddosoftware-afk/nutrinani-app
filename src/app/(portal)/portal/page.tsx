import Link from "next/link";
import { Camera, ClipboardList, TrendingUp, CalendarDays, MessageCircle } from "lucide-react";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { getSesionActual } from "@/data/auth";
import { planVigentePaciente } from "@/data/planes";
import { listarCitasPaciente } from "@/data/citas";
import { ahoraMs } from "@/lib/ahora";

export default async function PortalResumenPage() {
  const sesion = await getSesionActual();
  if (!sesion?.pacienteId) redirect("/login");

  const [plan, citas] = await Promise.all([
    planVigentePaciente(sesion.pacienteId),
    listarCitasPaciente(sesion.pacienteId),
  ]);
  const proximaCita = citas
    .filter((c) => c.estado !== "cancelada" && new Date(c.inicio).getTime() >= ahoraMs())
    .sort((a, b) => a.inicio.localeCompare(b.inicio))[0];

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-brand-100 bg-brand-50 p-4">
        <div className="flex items-center gap-2 text-brand-900">
          <ClipboardList size={18} />
          <h2 className="text-sm font-semibold">Tu plan actual</h2>
        </div>
        {plan ? (
          <div className="mt-2 flex items-center justify-between">
            <span className="text-sm text-brand-900">{plan.nombre}</span>
            <Link href="/portal/plan" className="text-sm font-medium text-brand-800 hover:underline">
              Ver plan
            </Link>
          </div>
        ) : (
          <p className="mt-1 text-sm text-brand-800">Tu nutrióloga aún no ha publicado un plan.</p>
        )}
      </div>

      <Link
        href="/portal/citas"
        className="flex items-center gap-2 rounded-2xl border border-cream-200 bg-white p-4 text-sm hover:border-brand-400"
      >
        <CalendarDays size={18} className="text-brand-700" />
        {proximaCita ? (
          <span className="capitalize">
            Próxima cita: {format(new Date(proximaCita.inicio), "EEEE d 'de' MMMM, HH:mm", { locale: es })}
          </span>
        ) : (
          <span className="text-ink-soft">Sin citas próximas</span>
        )}
      </Link>

      <div className="grid grid-cols-2 gap-3">
        <Link
          href="/portal/fotografias"
          className="flex flex-col items-center gap-2 rounded-2xl border border-cream-200 bg-white p-4 text-center text-sm hover:border-brand-400"
        >
          <Camera size={22} className="text-brand-700" />
          Subir foto de progreso
        </Link>
        <Link
          href="/portal/comparativas"
          className="flex flex-col items-center gap-2 rounded-2xl border border-cream-200 bg-white p-4 text-center text-sm hover:border-brand-400"
        >
          <TrendingUp size={22} className="text-brand-700" />
          Ver mi progreso
        </Link>
        <Link
          href="/portal/mensajes"
          className="flex flex-col items-center gap-2 rounded-2xl border border-cream-200 bg-white p-4 text-center text-sm hover:border-brand-400"
        >
          <MessageCircle size={22} className="text-brand-700" />
          Enviar mensaje
        </Link>
        <Link
          href="/portal/citas"
          className="flex flex-col items-center gap-2 rounded-2xl border border-cream-200 bg-white p-4 text-center text-sm hover:border-brand-400"
        >
          <CalendarDays size={22} className="text-brand-700" />
          Ver mis citas
        </Link>
      </div>
    </div>
  );
}
