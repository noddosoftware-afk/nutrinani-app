import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, addDays, addWeeks, addMonths, format } from "date-fns";
import { es } from "date-fns/locale";

export type VistaAgenda = "dia" | "semana" | "mes";

export function rangoParaVista(vista: VistaAgenda, fecha: Date): { desde: Date; hasta: Date } {
  if (vista === "dia") {
    const desde = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
    return { desde, hasta: addDays(desde, 1) };
  }
  if (vista === "semana") {
    const desde = startOfWeek(fecha, { weekStartsOn: 1 });
    return { desde, hasta: addDays(endOfWeek(fecha, { weekStartsOn: 1 }), 1) };
  }
  const desde = startOfMonth(fecha);
  return { desde, hasta: addDays(endOfMonth(fecha), 1) };
}

export function siguientePeriodo(vista: VistaAgenda, fecha: Date, direccion: 1 | -1): Date {
  if (vista === "dia") return addDays(fecha, direccion);
  if (vista === "semana") return addWeeks(fecha, direccion);
  return addMonths(fecha, direccion);
}

export function formatoFecha(fecha: Date): string {
  return format(fecha, "yyyy-MM-dd");
}

export function etiquetaPeriodo(vista: VistaAgenda, fecha: Date): string {
  if (vista === "dia") return format(fecha, "EEEE d 'de' MMMM, yyyy", { locale: es });
  if (vista === "semana") {
    const { desde, hasta } = rangoParaVista("semana", fecha);
    const fin = addDays(hasta, -1);
    return `${format(desde, "d 'de' MMM", { locale: es })} – ${format(fin, "d 'de' MMM yyyy", { locale: es })}`;
  }
  return format(fecha, "MMMM yyyy", { locale: es });
}

export const DIAS_SEMANA = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"] as const;
