"use client";

import { useState } from "react";
import { crearRecetaAction } from "./actions";
import { Campo, Input, Textarea, Boton } from "@/components/campo";
import type { Alimento } from "@/data/alimentos";

export function NuevaRecetaForm({ alimentos }: { alimentos: Alimento[] }) {
  const [ingredientes, setIngredientes] = useState<{ alimento_id: string; gramos: number }[]>([]);

  return (
    <form action={crearRecetaAction} className="space-y-4 rounded-lg border border-cream-200 bg-white p-4">
      <input type="hidden" name="ingredientes" value={JSON.stringify(ingredientes)} />
      <div className="grid grid-cols-2 gap-4">
        <Campo label="Nombre de la receta" name="nombre">
          <Input name="nombre" required />
        </Campo>
        <Campo label="Rendimiento (porciones)" name="rendimiento_porciones">
          <Input name="rendimiento_porciones" type="number" defaultValue={1} min={1} />
        </Campo>
      </div>
      <Campo label="Preparación" name="preparacion">
        <Textarea name="preparacion" rows={3} />
      </Campo>

      <div className="space-y-2">
        <p className="text-sm font-medium text-ink">Ingredientes</p>
        {ingredientes.map((ing, idx) => (
          <div key={idx} className="flex gap-2">
            <select
              value={ing.alimento_id}
              onChange={(e) =>
                setIngredientes((prev) => prev.map((p, i) => (i === idx ? { ...p, alimento_id: e.target.value } : p)))
              }
              className="flex-1 rounded-md border border-cream-200 px-2 py-1.5 text-sm"
            >
              <option value="">Selecciona…</option>
              {alimentos.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.nombre}
                </option>
              ))}
            </select>
            <input
              type="number"
              value={ing.gramos}
              onChange={(e) =>
                setIngredientes((prev) => prev.map((p, i) => (i === idx ? { ...p, gramos: Number(e.target.value) || 0 } : p)))
              }
              placeholder="gramos"
              className="w-28 rounded-md border border-cream-200 px-2 py-1.5 text-sm"
            />
            <button
              type="button"
              onClick={() => setIngredientes((prev) => prev.filter((_, i) => i !== idx))}
              className="text-xs text-red-600 hover:underline"
            >
              Quitar
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setIngredientes((prev) => [...prev, { alimento_id: "", gramos: 100 }])}
          className="text-xs text-brand-700 hover:underline"
        >
          + Agregar ingrediente
        </button>
      </div>

      <Boton type="submit">Guardar receta</Boton>
    </form>
  );
}
