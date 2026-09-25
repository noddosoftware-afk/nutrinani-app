import { Check } from "lucide-react";
import { obtenerRutinaCompleta } from "@/data/rutinas";
import { EjercicioVideo } from "@/components/ejercicio-video";
import { publicarRutinaAction } from "./actions";

const ESTADO_LABEL: Record<string, string> = {
  borrador: "Borrador",
  publicado: "Publicado",
};

export default async function RutinaDetallePage({ params }: PageProps<"/rutinas/[id]">) {
  const { id } = await params;
  const rutina = await obtenerRutinaCompleta(id);
  const publicar = publicarRutinaAction.bind(null, id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-ink">{rutina.nombre}</h1>
          <p className="text-sm text-ink-soft">{ESTADO_LABEL[rutina.estado]}</p>
        </div>
        {rutina.estado === "borrador" && (
          <form action={publicar}>
            <button className="flex items-center gap-1.5 rounded-md bg-brand-700 px-3 py-1.5 text-sm text-white hover:bg-brand-800">
              <Check size={16} />
              Publicar al paciente
            </button>
          </form>
        )}
      </div>

      {rutina.estado === "borrador" && (
        <p className="rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800">
          Esta rutina está en borrador — el paciente no puede verla todavía.
        </p>
      )}

      {(rutina.rutina_dias ?? [])
        .sort((a, b) => a.numero_dia - b.numero_dia)
        .map((dia) => (
          <div key={dia.id} className="space-y-3 rounded-lg border border-cream-200 bg-white p-4">
            <h2 className="text-sm font-semibold text-ink">{dia.etiqueta ?? `Día ${dia.numero_dia}`}</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {dia.rutina_ejercicios
                .sort((a, b) => a.orden - b.orden)
                .map((re) => (
                  <div key={re.id} className="flex gap-3 rounded-md border border-cream-100 p-2">
                    <EjercicioVideo
                      src={re.ejercicio?.video_url ?? null}
                      alt={re.ejercicio?.nombre ?? ""}
                      className="h-16 w-16 shrink-0 rounded-md"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-ink">{re.ejercicio?.nombre}</p>
                      <p className="text-xs text-ink-soft">
                        {re.series} series × {re.repeticiones}
                        {re.descanso_segundos ? ` · descanso ${re.descanso_segundos}s` : ""}
                      </p>
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
