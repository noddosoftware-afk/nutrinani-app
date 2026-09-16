import { redirect } from "next/navigation";
import { getSesionActual } from "@/data/auth";
import { listarDocumentos, urlFirmadaDocumento } from "@/data/documentos";

export default async function PortalDocumentosPage() {
  const sesion = await getSesionActual();
  if (!sesion?.pacienteId) redirect("/login");

  const documentos = await listarDocumentos(sesion.pacienteId);

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold text-ink">Tus documentos</h1>
      {documentos.length === 0 ? (
        <p className="text-sm text-ink-soft">Tu nutrióloga aún no ha compartido documentos contigo.</p>
      ) : (
        <ul className="space-y-2">
          {await Promise.all(
            documentos.map(async (d) => {
              const ultima = d.documento_versiones.sort((a, b) => b.numero_version - a.numero_version)[0];
              const url = ultima ? await urlFirmadaDocumento(ultima.storage_path) : null;
              return (
                <li key={d.id} className="rounded-lg border border-cream-200 bg-white p-3">
                  <p className="text-sm font-medium">{d.nombre}</p>
                  <p className="text-xs text-ink-soft">{d.categoria}</p>
                  {url && (
                    <a href={url} target="_blank" rel="noreferrer" className="text-sm text-brand-800 hover:underline">
                      Descargar
                    </a>
                  )}
                </li>
              );
            })
          )}
        </ul>
      )}
    </div>
  );
}
