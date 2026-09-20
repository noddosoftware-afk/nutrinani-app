import { redirect } from "next/navigation";
import { getSesionActual } from "@/data/auth";
import { listarFotografias, urlFirmadaFoto } from "@/data/fotografias";
import { SubirFotoForm } from "./subir-foto-form";

export default async function PortalFotografiasPage() {
  const sesion = await getSesionActual();
  if (!sesion?.pacienteId) redirect("/login");

  const fotos = await listarFotografias(sesion.pacienteId);
  const fotosConUrl = await Promise.all(fotos.map(async (f) => ({ ...f, url: await urlFirmadaFoto(f.storage_path) })));

  return (
    <div className="space-y-6">
      <SubirFotoForm />

      <div>
        <p className="mb-2 text-sm font-semibold text-ink">Fotos compartidas contigo</p>
        {fotosConUrl.length === 0 ? (
          <p className="text-sm text-ink-soft">Aún no hay fotos compartidas por tu nutrióloga.</p>
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
