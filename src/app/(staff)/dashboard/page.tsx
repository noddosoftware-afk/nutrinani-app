import Link from "next/link";
import { Users, CalendarCheck, ClipboardList, Camera, Plus, Stethoscope, UtensilsCrossed } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/data/auth";
import { Tarjeta } from "@/components/campo";
import { ahoraMs } from "@/lib/ahora";

async function obtenerMetricas() {
  await requireStaff();
  const supabase = await createClient();

  const hoy = new Date();
  const inicioDia = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()).toISOString();
  const finDia = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + 1).toISOString();
  const hace30 = new Date(hoy.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const [pacientesActivos, planesPendientes, fotosRecientes, consultasHoy, sinSeguimiento] = await Promise.all([
    supabase.from("pacientes").select("id", { count: "exact", head: true }).eq("estado", "activo"),
    supabase.from("planes").select("id, nombre, paciente_id, estado").in("estado", ["borrador", "aprobado"]),
    supabase
      .from("fotografias")
      .select("id, paciente_id, fecha_carga")
      .gte("fecha_carga", hace30)
      .order("fecha_carga", { ascending: false })
      .limit(5),
    supabase.from("consultas").select("id, paciente_id, fecha").gte("fecha", inicioDia).lt("fecha", finDia),
    supabase
      .from("pacientes")
      .select("id, nombre_completo, consultas(fecha)")
      .eq("estado", "activo"),
  ]);

  const pacientesSinSeguimientoReciente = (sinSeguimiento.data ?? []).filter((p) => {
    const fechas = (p as unknown as { consultas: { fecha: string }[] }).consultas ?? [];
    if (fechas.length === 0) return true;
    const ultima = fechas.map((c) => new Date(c.fecha).getTime()).sort((a, b) => b - a)[0];
    return ultima < new Date(hace30).getTime();
  });

  return {
    pacientesActivos: pacientesActivos.count ?? 0,
    planesPendientes: planesPendientes.data ?? [],
    fotosRecientes: fotosRecientes.data ?? [],
    consultasHoy: consultasHoy.data ?? [],
    pacientesSinSeguimientoReciente,
  };
}

function saludo(hora: number) {
  if (hora < 12) return "Buenos días";
  if (hora < 19) return "Buenas tardes";
  return "Buenas noches";
}

export default async function DashboardPage() {
  const m = await obtenerMetricas();
  const hora = new Date(ahoraMs()).getHours();

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-3xl italic text-brand-900">{saludo(hora)}, Daniela</h1>
        <p className="mt-1 text-sm text-ink-soft">Este es el resumen de tu consultorio.</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/pacientes/nuevo"
          className="inline-flex items-center gap-2 rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-medium text-white shadow-soft hover:bg-brand-800"
        >
          <Plus size={16} /> Nuevo paciente
        </Link>
        <Link
          href="/pacientes"
          className="inline-flex items-center gap-2 rounded-xl border border-brand-400/60 bg-white px-4 py-2.5 text-sm text-ink hover:bg-brand-50"
        >
          <Stethoscope size={16} /> Registrar consulta
        </Link>
        <Link
          href="/planes"
          className="inline-flex items-center gap-2 rounded-xl border border-brand-400/60 bg-white px-4 py-2.5 text-sm text-ink hover:bg-brand-50"
        >
          <UtensilsCrossed size={16} /> Preparar plan
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users} titulo="Pacientes activos" valor={m.pacientesActivos} href="/pacientes" />
        <StatCard icon={CalendarCheck} titulo="Citas hoy" valor={m.consultasHoy.length} href="/agenda" />
        <StatCard icon={ClipboardList} titulo="Planes pendientes" valor={m.planesPendientes.length} href="/planes" />
        <StatCard icon={Camera} titulo="Fotos recientes (30d)" valor={m.fotosRecientes.length} href="/pacientes" />
      </div>

      <section>
        <h2 className="mb-2 text-sm font-semibold text-ink">
          Pacientes sin seguimiento en los últimos 30 días
        </h2>
        {m.pacientesSinSeguimientoReciente.length === 0 ? (
          <p className="text-sm text-ink-soft">Todos los pacientes activos tienen seguimiento reciente.</p>
        ) : (
          <ul className="divide-y divide-cream-200 rounded-xl border border-cream-200 bg-white">
            {m.pacientesSinSeguimientoReciente.map((p) => (
              <li key={p.id} className="px-4 py-2 text-sm">
                <Link href={`/pacientes/${p.id}`} className="text-brand-800 hover:underline">
                  {p.nombre_completo}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="mb-2 text-sm font-semibold text-ink">Planes pendientes de revisión</h2>
        {m.planesPendientes.length === 0 ? (
          <p className="text-sm text-ink-soft">No hay planes en borrador o pendientes de aprobar.</p>
        ) : (
          <ul className="divide-y divide-cream-200 rounded-xl border border-cream-200 bg-white">
            {m.planesPendientes.map((p) => (
              <li key={p.id} className="flex items-center justify-between px-4 py-2 text-sm">
                <span>{p.nombre}</span>
                <Link href={`/planes/${p.id}`} className="text-brand-800 hover:underline">
                  Revisar
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function StatCard({
  icon: Icon,
  titulo,
  valor,
  href,
}: {
  icon: typeof Users;
  titulo: string;
  valor: number;
  href: string;
}) {
  return (
    <Link href={href} className="group block">
      <Tarjeta className="p-4 transition-colors group-hover:border-brand-400">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
            <Icon size={20} />
          </div>
          <div>
            <p className="text-sm text-ink-soft">{titulo}</p>
            <p className="text-2xl font-semibold text-ink">{valor}</p>
          </div>
        </div>
      </Tarjeta>
    </Link>
  );
}
