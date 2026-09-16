"use client";

import { useMemo, useState } from "react";
import { crearPlanAction } from "./actions";
import { calcularTotalNutrientes, type ItemCantidad } from "@/lib/calc";
import { Campo, Input, Boton } from "@/components/campo";
import type { Alimento } from "@/data/alimentos";

interface ItemUI {
  alimentoId: string;
  gramos: number;
}
interface TiempoUI {
  nombre: string;
  items: ItemUI[];
}
interface DiaUI {
  etiqueta: string;
  tiempos: TiempoUI[];
}

function diaVacio(numero: number): DiaUI {
  return {
    etiqueta: `Día ${numero}`,
    tiempos: [
      { nombre: "Desayuno", items: [] },
      { nombre: "Comida", items: [] },
      { nombre: "Cena", items: [] },
    ],
  };
}

export function ConstructorPlan({ pacienteId, alimentos }: { pacienteId: string; alimentos: Alimento[] }) {
  const [nombre, setNombre] = useState("Plan de alimentación");
  const [dias, setDias] = useState<DiaUI[]>([diaVacio(1)]);

  const alimentoPorId = useMemo(() => new Map(alimentos.map((a) => [a.id, a])), [alimentos]);

  function actualizarDias(actualizar: (dias: DiaUI[]) => DiaUI[]) {
    setDias((prev) => actualizar(structuredClone(prev)));
  }

  function totalesTiempo(items: ItemUI[]) {
    const cantidades: ItemCantidad[] = items
      .map((it) => {
        const alimento = alimentoPorId.get(it.alimentoId);
        if (!alimento) return null;
        return {
          gramos: it.gramos,
          perfilPor100g: {
            energiaKcal: alimento.energia_kcal_100g,
            proteinaG: alimento.proteina_g_100g,
            carbohidratoG: alimento.carbohidrato_g_100g,
            grasaG: alimento.grasa_g_100g,
            fibraG: alimento.fibra_g_100g,
            sodioMg: alimento.sodio_mg_100g,
          },
        };
      })
      .filter((x): x is ItemCantidad => x !== null);
    return calcularTotalNutrientes(cantidades);
  }

  const estructura: unknown = dias.map((dia, i) => ({
    numero_dia: i + 1,
    etiqueta: dia.etiqueta,
    tiempos: dia.tiempos.map((t) => ({
      nombre: t.nombre,
      items: t.items.filter((it) => it.alimentoId).map((it) => ({ alimento_id: it.alimentoId, cantidad_gramos: it.gramos })),
    })),
  }));

  const accion = crearPlanAction.bind(null, pacienteId);

  return (
    <form action={accion} className="space-y-6">
      <input type="hidden" name="estructura" value={JSON.stringify(estructura)} />
      <div className="grid grid-cols-2 gap-4 rounded-lg border border-cream-200 bg-white p-4">
        <Campo label="Nombre del plan" name="nombre">
          <Input name="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
        </Campo>
        <Campo label="Objetivo energético (kcal/día, opcional)" name="objetivo_kcal">
          <Input name="objetivo_kcal" type="number" />
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
              className="text-sm font-semibold text-ink"
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

          {dia.tiempos.map((tiempo, tIdx) => {
            const totales = totalesTiempo(tiempo.items);
            return (
              <div key={tIdx} className="rounded-md border border-cream-100 p-3">
                <p className="mb-2 text-sm font-medium text-ink">{tiempo.nombre}</p>
                <div className="space-y-2">
                  {tiempo.items.map((item, iIdx) => (
                    <div key={iIdx} className="flex items-center gap-2">
                      <select
                        value={item.alimentoId}
                        onChange={(e) =>
                          actualizarDias((ds) => {
                            ds[dIdx].tiempos[tIdx].items[iIdx].alimentoId = e.target.value;
                            return ds;
                          })
                        }
                        className="flex-1 rounded-md border border-cream-200 px-2 py-1.5 text-sm"
                      >
                        <option value="">Selecciona un alimento…</option>
                        {alimentos.map((a) => (
                          <option key={a.id} value={a.id}>
                            {a.nombre}
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        value={item.gramos}
                        onChange={(e) =>
                          actualizarDias((ds) => {
                            ds[dIdx].tiempos[tIdx].items[iIdx].gramos = Number(e.target.value) || 0;
                            return ds;
                          })
                        }
                        className="w-24 rounded-md border border-cream-200 px-2 py-1.5 text-sm"
                        placeholder="gramos"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          actualizarDias((ds) => {
                            ds[dIdx].tiempos[tIdx].items.splice(iIdx, 1);
                            return ds;
                          })
                        }
                        className="text-xs text-red-600 hover:underline"
                      >
                        Quitar
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      actualizarDias((ds) => {
                        ds[dIdx].tiempos[tIdx].items.push({ alimentoId: "", gramos: 100 });
                        return ds;
                      })
                    }
                    className="text-xs text-brand-700 hover:underline"
                  >
                    + Agregar alimento
                  </button>
                </div>
                <p className="mt-2 text-xs text-ink-soft">
                  Total: {totales.energiaKcal ?? "—"} kcal · P {totales.proteinaG ?? "—"}g · C {totales.carbohidratoG ?? "—"}g · G{" "}
                  {totales.grasaG ?? "—"}g
                  {totales.nutrientesIncompletos.length > 0 && " (algunos alimentos no tienen todos los nutrientes capturados)"}
                </p>
              </div>
            );
          })}
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

      <Boton type="submit">Guardar plan como borrador</Boton>
    </form>
  );
}
