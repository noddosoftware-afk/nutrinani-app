"use client";

import { useMemo, useState } from "react";
import { crearRutinaAction } from "./actions";
import { Campo, Input, Textarea, Boton } from "@/components/campo";
import type { Ejercicio } from "@/data/ejercicios";

interface ItemUI {
  ejercicioId: string;
  series: number;
  repeticiones: string;
  descansoSegundos: number;
}
interface DiaUI {
  etiqueta: string;
  ejercicios: ItemUI[];
}

function diaVacio(numero: number): DiaUI {
  return { etiqueta: `Día ${numero}`, ejercicios: [] };
}

export function ConstructorRutina({ pacienteId, ejercicios }: { pacienteId: string; ejercicios: Ejercicio[] }) {
  const [nombre, setNombre] = useState("Rutina de entrenamiento");
  const [recomendaciones, setRecomendaciones] = useState("");
  const [dias, setDias] = useState<DiaUI[]>([diaVacio(1)]);

  const gruposOrdenados = useMemo(() => {
    const grupos = new Map<string, Ejercicio[]>();
    for (const e of ejercicios) {
      const lista = grupos.get(e.grupo_muscular) ?? [];
      lista.push(e);
      grupos.set(e.grupo_muscular, lista);
    }
    return [...grupos.entries()];
  }, [ejercicios]);

  function actualizarDias(actualizar: (dias: DiaUI[]) => DiaUI[]) {
    setDias((prev) => actualizar(structuredClone(prev)));
  }

  const estructura: unknown = dias.map((dia, i) => ({
    numero_dia: i + 1,
    etiqueta: dia.etiqueta,
    ejercicios: dia.ejercicios
      .filter((it) => it.ejercicioId)
      .map((it) => ({
        ejercicio_id: it.ejercicioId,
        series: it.series,
        repeticiones: it.repeticiones,
        descanso_segundos: it.descansoSegundos,
      })),
  }));

  const accion = crearRutinaAction.bind(null, pacienteId);

  return (
    <form action={accion} className="space-y-6">
      <input type="hidden" name="estructura" value={JSON.stringify(estructura)} />

      <div className="grid grid-cols-1 gap-4 rounded-lg border border-cream-200 bg-white p-4 sm:grid-cols-2">
        <Campo label="Nombre de la rutina" name="nombre">
          <Input name="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
        </Campo>
        <Campo label="Recomendaciones (opcional)" name="recomendaciones">
          <Textarea name="recomendaciones" rows={1} value={recomendaciones} onChange={(e) => setRecomendaciones(e.target.value)} />
        </Campo>
      </div>

      {dias.map((dia, dIdx) => (
        <div key={dIdx} className="space-y-3 rounded-lg border border-cream-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <input
              value={dia.etiqueta}
              onChange={(e) =>
                actualizarDias((ds) => {
                  ds[dIdx].etiqueta = e.target.value;
                  return ds;
                })
              }
              className="rounded-md px-1 text-sm font-semibold text-ink hover:bg-cream-100 focus:bg-cream-100 focus:outline-none"
            />
            {dias.length > 1 && (
              <button
                type="button"
                onClick={() => actualizarDias((ds) => ds.filter((_, i) => i !== dIdx))}
                className="text-xs text-red-600 hover:underline"
              >
                Quitar día
              </button>
            )}
          </div>

          <div className="space-y-2">
            {dia.ejercicios.length > 0 && (
              <div className="flex gap-2 px-0.5 text-xs text-ink-soft">
                <span className="flex-1">Ejercicio</span>
                <span className="w-16 text-center">Series</span>
                <span className="w-20 text-center">Reps</span>
                <span className="w-20 text-center">Descanso</span>
                <span className="w-12" />
              </div>
            )}
            {dia.ejercicios.map((item, iIdx) => (
              <div key={iIdx} className="flex items-center gap-2">
                <select
                  value={item.ejercicioId}
                  onChange={(e) =>
                    actualizarDias((ds) => {
                      ds[dIdx].ejercicios[iIdx].ejercicioId = e.target.value;
                      return ds;
                    })
                  }
                  className="flex-1 rounded-md border border-cream-200 px-2 py-1.5 text-sm"
                >
                  <option value="">Selecciona un ejercicio…</option>
                  {gruposOrdenados.map(([grupo, lista]) => (
                    <optgroup key={grupo} label={grupo}>
                      {lista.map((e) => (
                        <option key={e.id} value={e.id}>
                          {e.nombre} ({e.nivel})
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                <input
                  type="number"
                  min={1}
                  value={item.series}
                  onChange={(e) =>
                    actualizarDias((ds) => {
                      ds[dIdx].ejercicios[iIdx].series = Number(e.target.value) || 1;
                      return ds;
                    })
                  }
                  className="w-16 rounded-md border border-cream-200 px-2 py-1.5 text-sm"
                />
                <input
                  value={item.repeticiones}
                  onChange={(e) =>
                    actualizarDias((ds) => {
                      ds[dIdx].ejercicios[iIdx].repeticiones = e.target.value;
                      return ds;
                    })
                  }
                  className="w-20 rounded-md border border-cream-200 px-2 py-1.5 text-sm"
                />
                <input
                  type="number"
                  min={0}
                  value={item.descansoSegundos}
                  onChange={(e) =>
                    actualizarDias((ds) => {
                      ds[dIdx].ejercicios[iIdx].descansoSegundos = Number(e.target.value) || 0;
                      return ds;
                    })
                  }
                  className="w-20 rounded-md border border-cream-200 px-2 py-1.5 text-sm"
                />
                <button
                  type="button"
                  onClick={() =>
                    actualizarDias((ds) => {
                      ds[dIdx].ejercicios.splice(iIdx, 1);
                      return ds;
                    })
                  }
                  className="w-12 text-xs text-red-600 hover:underline"
                >
                  Quitar
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() =>
              actualizarDias((ds) => {
                ds[dIdx].ejercicios.push({ ejercicioId: "", series: 3, repeticiones: "12", descansoSegundos: 60 });
                return ds;
              })
            }
            className="text-xs text-brand-700 hover:underline"
          >
            + Agregar ejercicio
          </button>
        </div>
      ))}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setDias((ds) => [...ds, diaVacio(ds.length + 1)])}
          className="text-sm text-brand-700 hover:underline"
        >
          + Agregar día
        </button>
      </div>

      <Boton type="submit">Guardar rutina como borrador</Boton>
    </form>
  );
}
