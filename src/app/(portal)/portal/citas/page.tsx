import Link from "next/link";
import { redirect } from "next/navigation";
import { CalendarDays, MessageCircle } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { getSesionActual } from "@/data/auth";
import { listarCitasPaciente } from "@/data/citas";
import { ahoraMs } from "@/lib/ahora";

const ESTADO_LABEL: Record<string, string> = {
  pendiente: "Pendiente de confirmar",
  confirmada: "Confirmada",
  cancelada: "Cancelada",
  completada: "Completada",
};

export default async function PortalCitasPage() {
  const sesion = await getSesionActual();
  if (!sesion?.pacienteId) redirect("/login");

  const citas = await listarCitasPaciente(sesion.pacienteId);
  const ahora = ahoraMs();
  const proximas = citas.filter((c) => new Date(c.inicio).getTime() >= ahora && c.estado !== "cancelada");
  const pasadas = citas.filter((c) => new Date(c.inicio).getTime() < ahora || c.estado === "cancelada");

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold text-ink">Tus citas</h1>

      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-ink-soft">Próximas</h2>
        {proximas.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-cream-200 bg-white py-8 text-center">
            <CalendarDays size={24} className="text-ink-soft" />
            <p className="text-sm text-ink-soft">No tienes citas próximas.</p>
          </div>
        ) : (
          proximas.map((c) => (
            <div key={c.id} className="rounded-xl border border-cream-200 bg-white p-3">
              <p className="text-sm font-medium text-ink capitalize">
                {format(new Date(c.inicio), "EEEE d 'de' MMMM, HH:mm 'hrs'", { locale: es })}
              </p>
              <p className="text-xs text-ink-soft">{ESTADO_LABEL[c.estado]}</p>
              <Link
                href={`/portal/mensajes?prefill=${encodeURIComponent(
                  `Hola, quisiera solicitar un cambio en mi cita del ${format(new Date(c.inicio), "d 'de' MMMM, HH:mm", { locale: es })}.`
                )}`}
                className="mt-2 inline-flex items-center gap-1 text-xs text-brand-700 hover:underline"
              >
                <MessageCircle size={12} /> Solicitar cambio
              </Link>
            </div>
          ))
        )}
      </section>

      {pasadas.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-sm font-semibold text-ink-soft">Historial</h2>
          {pasadas.map((c) => (
            <div key={c.id} className="rounded-xl border border-cream-200 bg-white p-3 opacity-75">
              <p className="text-sm text-ink capitalize">
                {format(new Date(c.inicio), "d 'de' MMMM yyyy, HH:mm", { locale: es })}
              </p>
              <p className="text-xs text-ink-soft">{ESTADO_LABEL[c.estado]}</p>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
