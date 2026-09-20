import Link from "next/link";
import { ChevronLeft, ChevronRight, CalendarX } from "lucide-react";
import { format, isSameDay, isToday } from "date-fns";
import { es } from "date-fns/locale";
import { listarCitasEnRango, obtenerHorarioConsultorio, type Cita } from "@/data/citas";
import { listarPacientes } from "@/data/pacientes";
import { rangoParaVista, siguientePeriodo, formatoFecha, etiquetaPeriodo, DIAS_SEMANA, type VistaAgenda } from "@/lib/agenda-fechas";
import { NuevaCitaForm } from "./nueva-cita-form";
import { CitaCard } from "./cita-card";

function horarioDelDia(fecha: Date, horario: Record<string, { inicio: string; fin: string } | null>): string {
  const dia = DIAS_SEMANA[(fecha.getDay() + 6) % 7];
  const rango = horario[dia];
  return rango ? `${rango.inicio}–${rango.fin}` : "cerrado";
}

function parsearFecha(valor: string | undefined): Date {
  if (!valor) return new Date();
  const d = new Date(`${valor}T00:00:00`);
  return isNaN(d.getTime()) ? new Date() : d;
}

export default async function AgendaPage({ searchParams }: PageProps<"/agenda">) {
  const params = await searchParams;
  const vista: VistaAgenda = params.vista === "dia" || params.vista === "mes" ? params.vista : "semana";
  const fecha = parsearFecha(typeof params.fecha === "string" ? params.fecha : undefined);

  const { desde, hasta } = rangoParaVista(vista, fecha);
  const [citas, horario, pacientes] = await Promise.all([
    listarCitasEnRango(desde.toISOString(), hasta.toISOString()),
    obtenerHorarioConsultorio(),
    listarPacientes(),
  ]);

  const anterior = formatoFecha(siguientePeriodo(vista, fecha, -1));
  const siguiente = formatoFecha(siguientePeriodo(vista, fecha, 1));
  const hoy = formatoFecha(new Date());

  const citasPorDia = (dia: Date) => citas.filter((c) => isSameDay(new Date(c.inicio), dia));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Agenda</h1>
          <p className="text-sm text-ink-soft">{etiquetaPeriodo(vista, fecha)}</p>
        </div>
        <NuevaCitaForm pacientes={pacientes} fechaSugerida={formatoFecha(fecha)} duracionDefault={horario.duracion_cita_minutos} />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 rounded-lg border border-cream-200 bg-white p-1 text-sm">
          {(["dia", "semana", "mes"] as VistaAgenda[]).map((v) => (
            <Link
              key={v}
              href={`/agenda?vista=${v}&fecha=${formatoFecha(fecha)}`}
              className={`rounded-md px-3 py-1 capitalize ${
                vista === v ? "bg-brand-700 text-white" : "text-ink-soft hover:bg-cream-100"
              }`}
            >
              {v}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Link href={`/agenda?vista=${vista}&fecha=${anterior}`} className="rounded-md border border-cream-200 bg-white p-1.5 hover:bg-cream-100">
            <ChevronLeft size={16} />
          </Link>
          <Link href={`/agenda?vista=${vista}&fecha=${hoy}`} className="rounded-md border border-cream-200 bg-white px-3 py-1.5 hover:bg-cream-100">
            Hoy
          </Link>
          <Link href={`/agenda?vista=${vista}&fecha=${siguiente}`} className="rounded-md border border-cream-200 bg-white p-1.5 hover:bg-cream-100">
            <ChevronRight size={16} />
          </Link>
        </div>
      </div>

      {vista === "mes" ? (
        <VistaMes fecha={fecha} citas={citas} />
      ) : vista === "semana" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
          {Array.from({ length: 7 }, (_, i) => new Date(desde.getFullYear(), desde.getMonth(), desde.getDate() + i)).map(
            (dia) => (
              <div key={dia.toISOString()} className="space-y-2">
                <p className={`text-sm font-medium capitalize ${isToday(dia) ? "text-brand-700" : "text-ink"}`}>
                  {format(dia, "EEE d", { locale: es })}
                </p>
                <div className="space-y-2">
                  {citasPorDia(dia).length === 0 ? (
                    <p className="text-xs text-ink-soft">Sin citas</p>
                  ) : (
                    citasPorDia(dia).map((c) => <CitaCard key={c.id} cita={c} duracionDefault={horario.duracion_cita_minutos} />)
                  )}
                </div>
              </div>
            )
          )}
        </div>
      ) : (
        <div className="max-w-xl space-y-3">
          <p className="text-xs text-ink-soft">Horario de atención: {horarioDelDia(fecha, horario.horario_atencion)}</p>
          {citas.length === 0 ? (
            <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-cream-200 bg-white py-12 text-center">
              <CalendarX size={28} className="text-ink-soft" />
              <p className="text-sm text-ink-soft">Sin citas este día.</p>
            </div>
          ) : (
            citas.map((c) => <CitaCard key={c.id} cita={c} duracionDefault={horario.duracion_cita_minutos} />)
          )}
        </div>
      )}
    </div>
  );
}

function VistaMes({ fecha, citas }: { fecha: Date; citas: Cita[] }) {
  const primerDiaMes = new Date(fecha.getFullYear(), fecha.getMonth(), 1);
  const inicioGrid = new Date(primerDiaMes);
  const offset = (inicioGrid.getDay() + 6) % 7; // lunes = 0
  inicioGrid.setDate(inicioGrid.getDate() - offset);

  const dias = Array.from({ length: 42 }, (_, i) => {
    const d = new Date(inicioGrid);
    d.setDate(inicioGrid.getDate() + i);
    return d;
  });

  const citasPorDia = (dia: Date) => citas.filter((c) => isSameDay(new Date(c.inicio), dia));

  return (
    <div className="grid grid-cols-7 gap-2 text-sm">
      {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((d) => (
        <div key={d} className="text-center text-xs font-medium text-ink-soft">
          {d}
        </div>
      ))}
      {dias.map((dia) => {
        const enMes = dia.getMonth() === fecha.getMonth();
        const numCitas = citasPorDia(dia).length;
        return (
          <Link
            key={dia.toISOString()}
            href={`/agenda?vista=dia&fecha=${formatoFecha(dia)}`}
            className={`flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border ${
              isToday(dia) ? "border-brand-600" : "border-cream-200"
            } ${enMes ? "bg-white" : "bg-cream-100 text-ink-soft/50"} hover:border-brand-400`}
          >
            <span className="text-xs">{dia.getDate()}</span>
            {numCitas > 0 && <span className="rounded-full bg-brand-100 px-1.5 text-[10px] text-brand-800">{numCitas}</span>}
          </Link>
        );
      })}
      <p className="col-span-7 mt-2 text-center text-xs text-ink-soft">Haz clic en un día para ver el detalle.</p>
    </div>
  );
}
