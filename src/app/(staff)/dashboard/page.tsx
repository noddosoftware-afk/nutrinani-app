import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/data/auth";

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

export default async function DashboardPage() {
  const m = await obtenerMetricas();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold text-stone-900">Panel principal</h1>
        <p className="text-sm text-stone-500">Resumen del consultorio en tiempo real.</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href="/pacientes/nuevo" className="rounded-md bg-emerald-700 px-4 py-2 text-sm text-white hover:bg-emerald-800">
          + Nuevo paciente
        </Link>
        <Link href="/pacientes" className="rounded-md border border-stone-300 px-4 py-2 text-sm hover:bg-stone-100">
          Registrar consulta
        </Link>
        <Link href="/planes" className="rounded-md border border-stone-300 px-4 py-2 text-sm hover:bg-stone-100">
          Preparar plan
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Tarjeta titulo="Pacientes activos" valor={m.pacientesActivos} href="/pacientes" />
        <Tarjeta titulo="Citas hoy" valor={m.consultasHoy.length} href="/agenda" />
        <Tarjeta titulo="Planes pendientes" valor={m.planesPendientes.length} href="/planes" />
        <Tarjeta titulo="Fotos recientes (30d)" valor={m.fotosRecientes.length} href="/pacientes" />
      </div>

      <section>
        <h2 className="mb-2 text-sm font-semibold text-stone-700">
          Pacientes sin seguimiento en los últimos 30 días
        </h2>
        {m.pacientesSinSeguimientoReciente.length === 0 ? (
          <p className="text-sm text-stone-500">Todos los pacientes activos tienen seguimiento reciente.</p>
        ) : (
          <ul className="divide-y divide-stone-200 rounded-md border border-stone-200 bg-white">
            {m.pacientesSinSeguimientoReciente.map((p) => (
              <li key={p.id} className="px-4 py-2 text-sm">
                <Link href={`/pacientes/${p.id}`} className="text-emerald-800 hover:underline">
                  {p.nombre_completo}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="mb-2 text-sm font-semibold text-stone-700">Planes pendientes de revisión</h2>
        {m.planesPendientes.length === 0 ? (
          <p className="text-sm text-stone-500">No hay planes en borrador o pendientes de aprobar.</p>
        ) : (
          <ul className="divide-y divide-stone-200 rounded-md border border-stone-200 bg-white">
            {m.planesPendientes.map((p) => (
              <li key={p.id} className="flex items-center justify-between px-4 py-2 text-sm">
                <span>{p.nombre}</span>
                <Link href={`/planes/${p.id}`} className="text-emerald-800 hover:underline">
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

function Tarjeta({ titulo, valor, href }: { titulo: string; valor: number; href: string }) {
  return (
    <Link href={href} className="rounded-lg border border-stone-200 bg-white p-4 hover:border-emerald-300">
      <p className="text-sm text-stone-500">{titulo}</p>
      <p className="mt-1 text-2xl font-semibold text-stone-900">{valor}</p>
    </Link>
  );
}
