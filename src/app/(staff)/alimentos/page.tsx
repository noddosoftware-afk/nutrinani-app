import { listarAlimentos } from "@/data/alimentos";
import { crearAlimentoAction } from "./actions";
import { Campo, Input, Select, Boton } from "@/components/campo";

export default async function AlimentosPage({ searchParams }: PageProps<"/alimentos">) {
  const params = await searchParams;
  const busqueda = typeof params.q === "string" ? params.q : undefined;
  const alimentos = await listarAlimentos(busqueda);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-stone-900">Alimentos y recetas</h1>

      <details className="rounded-lg border border-stone-200 bg-white p-4">
        <summary className="cursor-pointer text-sm font-semibold text-stone-700">+ Agregar alimento al catálogo</summary>
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
        <p className="mt-2 text-xs text-stone-500">
          Deja en blanco cualquier nutriente que no conozcas — se mostrará como &quot;desconocido&quot;, nunca como cero.
        </p>
      </details>

      <form>
        <input
          type="search"
          name="q"
          defaultValue={busqueda}
          placeholder="Buscar alimento…"
          className="w-full max-w-sm rounded-md border border-stone-300 px-3 py-2 text-sm"
        />
      </form>

      <div className="overflow-x-auto rounded-lg border border-stone-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-stone-200 text-left text-stone-500">
            <tr>
              <th className="px-3 py-2">Nombre</th>
              <th className="px-3 py-2">Categoría</th>
              <th className="px-3 py-2">kcal/100g</th>
              <th className="px-3 py-2">Prot.</th>
              <th className="px-3 py-2">Carb.</th>
              <th className="px-3 py-2">Grasa</th>
            </tr>
          </thead>
          <tbody>
            {alimentos.map((a) => (
              <tr key={a.id} className="border-b border-stone-100 last:border-0">
                <td className="px-3 py-2 font-medium">{a.nombre}</td>
                <td className="px-3 py-2 text-stone-500">{a.categoria ?? "—"}</td>
                <td className="px-3 py-2">{a.energia_kcal_100g ?? "desconocido"}</td>
                <td className="px-3 py-2">{a.proteina_g_100g ?? "desconocido"}</td>
                <td className="px-3 py-2">{a.carbohidrato_g_100g ?? "desconocido"}</td>
                <td className="px-3 py-2">{a.grasa_g_100g ?? "desconocido"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
