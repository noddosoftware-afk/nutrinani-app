import { redirect } from "next/navigation";
import { getSesionActual } from "@/data/auth";
import { rutinaVigentePaciente } from "@/data/rutinas";
import { EjercicioVideo } from "@/components/ejercicio-video";

export default async function PortalRutinaPage() {
  const sesion = await getSesionActual();
  if (!sesion?.pacienteId) redirect("/login");

  const rutina = await rutinaVigentePaciente(sesion.pacienteId);

  if (!rutina) {
    return <p className="text-sm text-ink-soft">Tu nutrióloga aún no ha publicado una rutina de entrenamiento para ti.</p>;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold text-ink">{rutina.nombre}</h1>

      {(rutina.rutina_dias ?? [])
        .sort((a, b) => a.numero_dia - b.numero_dia)
        .map((dia) => (
          <div key={dia.id} className="space-y-3 rounded-lg border border-cream-200 bg-white p-4">
            <h2 className="text-sm font-semibold text-ink">{dia.etiqueta ?? `Día ${dia.numero_dia}`}</h2>
            <div className="space-y-3">
              {dia.rutina_ejercicios
                .sort((a, b) => a.orden - b.orden)
                .map((re) => (
                  <div key={re.id} className="flex items-center gap-3">
                    <EjercicioVideo
                      src={re.ejercicio?.video_url ?? null}
                      alt={re.ejercicio?.nombre ?? ""}
                      className="h-20 w-20 shrink-0 rounded-lg"
                    />
                    <div>
                      <p className="text-sm font-medium text-ink">{re.ejercicio?.nombre}</p>
                      <p className="text-xs text-ink-soft">
                        {re.series} series × {re.repeticiones}
                        {re.descanso_segundos ? ` · descanso ${re.descanso_segundos}s` : ""}
                      </p>
                      {re.notas && <p className="text-xs text-ink-soft">{re.notas}</p>}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}

      {rutina.recomendaciones && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
          <h2 className="mb-1 text-sm font-semibold text-amber-900">Recomendaciones de tu nutrióloga</h2>
          <p className="text-sm text-amber-900">{rutina.recomendaciones}</p>
        </div>
      )}
    </div>
  );
}
