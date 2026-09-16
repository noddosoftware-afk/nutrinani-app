import { Apple, Search } from "lucide-react";
import Image from "next/image";
import { listarAlimentos } from "@/data/alimentos";
import { crearAlimentoAction } from "./actions";
import { Campo, Input, Select, Boton, Tarjeta } from "@/components/campo";
import { fotoDeAlimento } from "@/lib/foto-alimento";

export default async function AlimentosPage({ searchParams }: PageProps<"/alimentos">) {
  const params = await searchParams;
  const busqueda = typeof params.q === "string" ? params.q : undefined;
  const alimentos = await listarAlimentos(busqueda);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-semibold text-ink">Alimentos y recetas</h1>

      <details className="rounded-lg border border-cream-200 bg-white p-4">
        <summary className="cursor-pointer text-sm font-semibold text-ink">+ Agregar alimento al catálogo</summary>
        <form action={crearAlimentoAction} className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Campo label="Nombre" name="nombre" className="col-span-2 sm:col-span-2">
            <Input name="nombre" required />
          </Campo>
          <Campo label="Categoría" name="categoria">
            <Input name="categoria" />
          </Campo>
          <Campo label="Estado" name="estado_coccion">
            <Select name="estado_coccion" defaultValue="no_aplica">
              <option value="no_aplica">No aplica</option>
              <option value="crudo">Crudo</option>
              <option value="cocido">Cocido</option>
            </Select>
          </Campo>
          <Campo label="Porción (descripción)" name="porcion_descripcion">
            <Input name="porcion_descripcion" placeholder='ej. "1 taza"' />
          </Campo>
          <Campo label="Porción (gramos)" name="porcion_gramos">
            <Input name="porcion_gramos" type="number" step="0.1" />
          </Campo>
          <Campo label="Energía (kcal/100g)" name="energia_kcal_100g">
            <Input name="energia_kcal_100g" type="number" step="0.1" />
          </Campo>
          <Campo label="Proteína (g/100g)" name="proteina_g_100g">
            <Input name="proteina_g_100g" type="number" step="0.1" />
          </Campo>
          <Campo label="Carbohidrato (g/100g)" name="carbohidrato_g_100g">
            <Input name="carbohidrato_g_100g" type="number" step="0.1" />
          </Campo>
          <Campo label="Grasa (g/100g)" name="grasa_g_100g">
            <Input name="grasa_g_100g" type="number" step="0.1" />
          </Campo>
          <Campo label="Fibra (g/100g)" name="fibra_g_100g">
            <Input name="fibra_g_100g" type="number" step="0.1" />
          </Campo>
          <Campo label="Sodio (mg/100g)" name="sodio_mg_100g">
            <Input name="sodio_mg_100g" type="number" step="0.1" />
          </Campo>
          <Campo label="Alérgenos (separados por coma)" name="alergenos" className="col-span-2 sm:col-span-2">
            <Input name="alergenos" />
          </Campo>
          <div className="col-span-2 sm:col-span-4">
            <Boton type="submit">Guardar alimento</Boton>
          </div>
        </form>
        <p className="mt-2 text-xs text-ink-soft">
          Deja en blanco cualquier nutriente que no conozcas — se mostrará como &quot;desconocido&quot;, nunca como cero.
        </p>
      </details>

      <form className="relative max-w-sm">
        <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" />
        <input
          type="search"
          name="q"
          defaultValue={busqueda}
          placeholder="Buscar alimento…"
          className="w-full rounded-lg border border-cream-200 bg-white py-2 pl-9 pr-3 text-sm focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-100"
        />
      </form>

      {alimentos.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-cream-200 bg-white py-12 text-center">
          <Apple size={28} className="text-ink-soft" />
          <p className="text-sm text-ink-soft">Sin alimentos en el catálogo todavía.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {alimentos.map((a) => {
            const foto = fotoDeAlimento(a.nombre);
            return (
              <Tarjeta key={a.id} className="overflow-hidden">
                <div className="relative aspect-square w-full bg-cream-100">
                  {foto ? (
                    <Image src={foto} alt={a.nombre} fill className="object-cover" sizes="200px" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-ink-soft/50">
                      <Apple size={32} />
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p className="truncate text-sm font-medium text-ink">{a.nombre}</p>
                  <p className="text-xs text-ink-soft">{a.categoria ?? "Sin categoría"}</p>
                  <p className="mt-2 text-xs text-ink-soft">
                    {a.energia_kcal_100g ?? "—"} kcal · P {a.proteina_g_100g ?? "—"}g · C {a.carbohidrato_g_100g ?? "—"}g
                    · G {a.grasa_g_100g ?? "—"}g
                  </p>
                </div>
              </Tarjeta>
            );
          })}
        </div>
      )}
    </div>
  );
}
