import Image from "next/image";
import { ChefHat } from "lucide-react";
import { obtenerReceta, calcularTotalesReceta } from "@/data/alimentos";
import { fotoDeReceta } from "@/lib/foto-alimento";

export default async function RecetaDetallePage({ params }: PageProps<"/recetas/[id]">) {
  const { id } = await params;
  const receta = await obtenerReceta(id);
  const { totalReceta, porPorcion } = calcularTotalesReceta(receta);
  const foto = fotoDeReceta(receta.nombre);

  return (
    <div className="max-w-2xl space-y-6">
      <div className="overflow-hidden rounded-2xl border border-cream-200 bg-white">
        <div className="relative aspect-[16/9] w-full bg-cream-100">
          {foto ? (
            <Image src={foto} alt={receta.nombre} fill className="object-cover" sizes="672px" priority />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-ink-soft/50">
              <ChefHat size={40} />
            </div>
          )}
        </div>
        <div className="p-4">
          <h1 className="font-display text-2xl font-semibold text-ink">{receta.nombre}</h1>
          <p className="text-sm text-ink-soft">{receta.rendimiento_porciones} porciones</p>
        </div>
      </div>

      {receta.preparacion && (
        <section className="rounded-lg border border-cream-200 bg-white p-4">
          <h2 className="mb-2 text-sm font-semibold text-ink">Preparación</h2>
          <p className="text-sm whitespace-pre-line">{receta.preparacion}</p>
        </section>
      )}

      <section className="rounded-lg border border-cream-200 bg-white p-4">
        <h2 className="mb-2 text-sm font-semibold text-ink">Ingredientes</h2>
        <ul className="divide-y divide-cream-100 text-sm">
          {receta.ingredientes.map((ing) => (
            <li key={ing.id} className="flex justify-between py-1.5">
              <span>{ing.alimento.nombre}</span>
              <span>{ing.gramos} g</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-lg border border-brand-100 bg-brand-50 p-4">
        <h2 className="mb-2 text-sm font-semibold text-brand-900">Valor nutricional (recalculado)</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium text-brand-900">Receta completa</p>
            <p>Energía: {totalReceta.energiaKcal ?? "desconocido"} kcal</p>
            <p>Proteína: {totalReceta.proteinaG ?? "desconocido"} g</p>
            <p>Carbohidrato: {totalReceta.carbohidratoG ?? "desconocido"} g</p>
            <p>Grasa: {totalReceta.grasaG ?? "desconocido"} g</p>
          </div>
          <div>
            <p className="font-medium text-brand-900">Por porción</p>
            <p>Energía: {porPorcion.energiaKcal ?? "desconocido"} kcal</p>
            <p>Proteína: {porPorcion.proteinaG ?? "desconocido"} g</p>
            <p>Carbohidrato: {porPorcion.carbohidratoG ?? "desconocido"} g</p>
            <p>Grasa: {porPorcion.grasaG ?? "desconocido"} g</p>
          </div>
        </div>
        {totalReceta.nutrientesIncompletos.length > 0 && (
          <p className="mt-2 text-xs text-amber-700">
            Algunos ingredientes no tienen todos los nutrientes capturados en el catálogo; los totales afectados se
            muestran como desconocidos en vez de asumir cero.
          </p>
        )}
      </section>
    </div>
  );
}
