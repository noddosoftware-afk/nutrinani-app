import { listarFotografias, urlFirmadaFoto } from "@/data/fotografias";
import { subirFotografiaAction } from "./actions";
import { ComparadorFotos } from "./comparador";

export default async function FotografiasPage({ params }: PageProps<"/pacientes/[id]/fotografias">) {
  const { id } = await params;
  const fotos = await listarFotografias(id);
  const fotosConUrl = await Promise.all(
    fotos.map(async (f) => ({ ...f, url: await urlFirmadaFoto(f.storage_path) }))
  );

  const accion = subirFotografiaAction.bind(null, id);

  return (
    <div className="space-y-6">
      <form action={accion} className="grid grid-cols-2 gap-3 rounded-lg border border-cream-200 bg-white p-4 sm:grid-cols-5">
        <input type="file" name="archivo" accept="image/*" required className="col-span-2 text-sm sm:col-span-1" />
        <select name="vista" className="rounded-md border border-cream-200 px-2 py-1.5 text-sm">
          <option value="frente">Frente</option>
          <option value="perfil">Perfil</option>
          <option value="espalda">Espalda</option>
          <option value="otra">Otra</option>
        </select>
        <input type="date" name="fecha_captura" required className="rounded-md border border-cream-200 px-2 py-1.5 text-sm" />
        <input type="text" name="observaciones" placeholder="Observaciones" className="rounded-md border border-cream-200 px-2 py-1.5 text-sm" />
        <label className="flex items-center gap-2 text-xs text-ink-soft">
          <input type="checkbox" name="compartir" /> Compartir con el paciente
        </label>
        <button className="col-span-2 rounded-md bg-brand-700 px-3 py-1.5 text-sm text-white hover:bg-brand-800 sm:col-span-5">
          Subir fotografía
        </button>
      </form>

      {fotosConUrl.length === 0 ? (
        <p className="text-sm text-ink-soft">Sin fotografías de progreso todavía.</p>
      ) : (
        <ComparadorFotos fotos={fotosConUrl} />
      )}
    </div>
  );
}
