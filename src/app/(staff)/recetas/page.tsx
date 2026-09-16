import Link from "next/link";
import Image from "next/image";
import { ChefHat } from "lucide-react";
import { listarAlimentos } from "@/data/alimentos";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/data/auth";
import { NuevaRecetaForm } from "./nueva-form";
import { fotoDeReceta } from "@/lib/foto-alimento";

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
        <h1 className="font-display text-2xl font-semibold text-ink">Recetas</h1>
        <Link href="/alimentos" className="text-sm text-brand-800 hover:underline">
          Ver catálogo de alimentos
        </Link>
      </div>

      <details className="rounded-lg" open={(recetas ?? []).length === 0}>
        <summary className="cursor-pointer text-sm font-semibold text-ink">+ Nueva receta</summary>
        <div className="mt-3">
          <NuevaRecetaForm alimentos={alimentos} />
        </div>
      </details>

      {(recetas ?? []).length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-cream-200 bg-white py-12 text-center">
          <ChefHat size={28} className="text-ink-soft" />
          <p className="text-sm text-ink-soft">Sin recetas todavía.</p>
        </div>
      ) : (
        <ul className="divide-y divide-cream-200 rounded-xl border border-cream-200 bg-white">
          {(recetas ?? []).map((r) => {
            const foto = fotoDeReceta(r.nombre);
            return (
              <li key={r.id}>
                <Link href={`/recetas/${r.id}`} className="flex items-center gap-3 px-4 py-3 hover:bg-cream-100">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-cream-100">
                    {foto ? (
                      <Image src={foto} alt={r.nombre} fill className="object-cover" sizes="48px" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-ink-soft/50">
                        <ChefHat size={20} />
                      </div>
                    )}
                  </div>
                  <span className="flex-1 text-sm font-medium">{r.nombre}</span>
                  <span className="text-xs text-ink-soft">{r.rendimiento_porciones} porciones</span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
