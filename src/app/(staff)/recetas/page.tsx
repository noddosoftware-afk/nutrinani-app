import Link from "next/link";
import { listarAlimentos } from "@/data/alimentos";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/data/auth";
import { NuevaRecetaForm } from "./nueva-form";

export default async function RecetasPage() {
  await requireStaff();
  const supabase = await createClient();
  const [alimentos, { data: recetas, error }] = await Promise.all([
    listarAlimentos(),
    supabase.from("recetas").select("id, nombre, rendimiento_porciones").order("nombre"),
  ]);
  if (error) throw error;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-stone-900">Recetas</h1>
        <Link href="/alimentos" className="text-sm text-emerald-800 hover:underline">
          Ver catálogo de alimentos
        </Link>
      </div>

      <details className="rounded-lg" open={(recetas ?? []).length === 0}>
        <summary className="cursor-pointer text-sm font-semibold text-stone-700">+ Nueva receta</summary>
        <div className="mt-3">
          <NuevaRecetaForm alimentos={alimentos} />
        </div>
      </details>

      {(recetas ?? []).length === 0 ? (
        <p className="text-sm text-stone-500">Sin recetas todavía.</p>
      ) : (
        <ul className="divide-y divide-stone-200 rounded-lg border border-stone-200 bg-white">
          {(recetas ?? []).map((r) => (
            <li key={r.id}>
              <Link href={`/recetas/${r.id}`} className="flex items-center justify-between px-4 py-3 hover:bg-stone-50">
                <span className="text-sm font-medium">{r.nombre}</span>
                <span className="text-xs text-stone-500">{r.rendimiento_porciones} porciones</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
