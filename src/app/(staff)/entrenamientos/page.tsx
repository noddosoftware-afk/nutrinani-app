import { Dumbbell } from "lucide-react";
import { listarEjercicios } from "@/data/ejercicios";
import { crearEjercicioAction } from "./actions";
import { Campo, Input, Select, Textarea, Boton, Tarjeta } from "@/components/campo";
import { EjercicioVideo } from "@/components/ejercicio-video";

const NIVEL_LABEL: Record<string, string> = {
  principiante: "Principiante",
  intermedio: "Intermedio",
  avanzado: "Avanzado",
};

export default async function EntrenamientosPage() {
  const ejercicios = await listarEjercicios();

  const porGrupo = new Map<string, typeof ejercicios>();
  for (const e of ejercicios) {
    const lista = porGrupo.get(e.grupo_muscular) ?? [];
    lista.push(e);
    porGrupo.set(e.grupo_muscular, lista);
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-semibold text-ink">Entrenamientos</h1>

      <details className="rounded-lg border border-cream-200 bg-white p-4">
        <summary className="cursor-pointer text-sm font-semibold text-ink">+ Agregar ejercicio al catálogo</summary>
        <form action={crearEjercicioAction} className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Campo label="Nombre" name="nombre" className="col-span-2">
            <Input name="nombre" required />
          </Campo>
          <Campo label="Grupo muscular" name="grupo_muscular">
            <Input name="grupo_muscular" placeholder="ej. Pecho" required />
          </Campo>
          <Campo label="Nivel" name="nivel">
            <Select name="nivel" defaultValue="principiante">
              <option value="principiante">Principiante</option>
              <option value="intermedio">Intermedio</option>
              <option value="avanzado">Avanzado</option>
            </Select>
          </Campo>
          <Campo label="Series sugeridas" name="series_sugeridas">
            <Input name="series_sugeridas" type="number" min={1} />
          </Campo>
          <Campo label="Repeticiones sugeridas" name="repeticiones_sugeridas">
            <Input name="repeticiones_sugeridas" placeholder='ej. "12-15" o "30s"' />
          </Campo>
          <Campo label="Descripción (opcional)" name="descripcion" className="col-span-2 sm:col-span-4">
            <Textarea name="descripcion" rows={2} />
          </Campo>
          <div className="col-span-2 sm:col-span-4">
            <Boton type="submit">Guardar ejercicio</Boton>
          </div>
        </form>
      </details>

      {ejercicios.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-cream-200 bg-white py-12 text-center">
          <Dumbbell size={28} className="text-ink-soft" />
          <p className="text-sm text-ink-soft">Sin ejercicios en el catálogo todavía.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {[...porGrupo.entries()].map(([grupo, lista]) => (
            <div key={grupo}>
              <h2 className="mb-3 text-lg font-semibold text-ink">{grupo}</h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {lista.map((e) => (
                  <Tarjeta key={e.id} className="overflow-hidden">
                    <EjercicioVideo src={e.video_url} alt={e.nombre} className="aspect-square w-full" />
                    <div className="p-3">
                      <p className="truncate text-sm font-medium text-ink">{e.nombre}</p>
                      <p className="text-xs text-ink-soft">{NIVEL_LABEL[e.nivel]}</p>
                      {e.series_sugeridas && (
                        <p className="mt-1 text-xs text-ink-soft">
                          {e.series_sugeridas} series · {e.repeticiones_sugeridas ?? "—"}
                        </p>
                      )}
                    </div>
                  </Tarjeta>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
