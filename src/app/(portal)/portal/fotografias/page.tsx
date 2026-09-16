import { redirect } from "next/navigation";
import { getSesionActual } from "@/data/auth";
import { listarFotografias, urlFirmadaFoto } from "@/data/fotografias";
import { subirFotoPropiaAction } from "./actions";

export default async function PortalFotografiasPage() {
  const sesion = await getSesionActual();
  if (!sesion?.pacienteId) redirect("/login");

  const fotos = await listarFotografias(sesion.pacienteId);
  const fotosConUrl = await Promise.all(fotos.map(async (f) => ({ ...f, url: await urlFirmadaFoto(f.storage_path) })));

  return (
    <div className="space-y-6">
      <form action={subirFotoPropiaAction} className="space-y-3 rounded-lg border border-stone-200 bg-white p-4">
        <p className="text-sm font-semibold text-stone-700">Subir foto de progreso</p>
        <input type="file" name="archivo" accept="image/*" capture="environment" required className="w-full text-sm" />
        <select name="vista" className="w-full rounded-md border border-stone-300 px-2 py-1.5 text-sm">
          <option value="frente">Frente</option>
          <option value="perfil">Perfil</option>
          <option value="espalda">Espalda</option>
        </select>
        <button className="w-full rounded-md bg-emerald-700 px-3 py-2 text-sm text-white hover:bg-emerald-800">Subir</button>
        <p className="text-xs text-stone-500">
          Tu nutrióloga revisará esta foto de forma privada antes de compartirla contigo en las comparativas.
        </p>
      </form>

      <div>
        <p className="mb-2 text-sm font-semibold text-stone-700">Fotos compartidas contigo</p>
        {fotosConUrl.length === 0 ? (
          <p className="text-sm text-stone-500">Aún no hay fotos compartidas por tu nutrióloga.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {fotosConUrl.map((f) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={f.id} src={f.url} alt={f.vista} className="aspect-[3/4] w-full rounded-lg object-cover" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
