import { obtenerReceta, calcularTotalesReceta } from "@/data/alimentos";

export default async function RecetaDetallePage({ params }: PageProps<"/recetas/[id]">) {
  const { id } = await params;
  const receta = await obtenerReceta(id);
  const { totalReceta, porPorcion } = calcularTotalesReceta(receta);

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-stone-900">{receta.nombre}</h1>
        <p className="text-sm text-stone-500">{receta.rendimiento_porciones} porciones</p>
      </div>

      {receta.preparacion && (
        <section className="rounded-lg border border-stone-200 bg-white p-4">
          <h2 className="mb-2 text-sm font-semibold text-stone-700">Preparación</h2>
          <p className="text-sm whitespace-pre-line">{receta.preparacion}</p>
        </section>
      )}

      <section className="rounded-lg border border-stone-200 bg-white p-4">
        <h2 className="mb-2 text-sm font-semibold text-stone-700">Ingredientes</h2>
        <ul className="divide-y divide-stone-100 text-sm">
          {receta.ingredientes.map((ing) => (
            <li key={ing.id} className="flex justify-between py-1.5">
              <span>{ing.alimento.nombre}</span>
              <span>{ing.gramos} g</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
        <h2 className="mb-2 text-sm font-semibold text-emerald-900">Valor nutricional (recalculado)</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium text-emerald-900">Receta completa</p>
            <p>Energía: {totalReceta.energiaKcal ?? "desconocido"} kcal</p>
            <p>Proteína: {totalReceta.proteinaG ?? "desconocido"} g</p>
            <p>Carbohidrato: {totalReceta.carbohidratoG ?? "desconocido"} g</p>
            <p>Grasa: {totalReceta.grasaG ?? "desconocido"} g</p>
          </div>
          <div>
            <p className="font-medium text-emerald-900">Por porción</p>
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
