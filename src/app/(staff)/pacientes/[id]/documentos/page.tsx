import { listarDocumentos, urlFirmadaDocumento } from "@/data/documentos";
import { subirDocumentoAction, subirVersionAction } from "./actions";

const CATEGORIAS = [
  ["laboratorio", "Laboratorio"],
  ["estudio", "Estudio"],
  ["consentimiento", "Consentimiento"],
  ["plan", "Plan"],
  ["material_educativo", "Material educativo"],
  ["otro", "Otro"],
] as const;

export default async function DocumentosPage({ params }: PageProps<"/pacientes/[id]/documentos">) {
  const { id } = await params;
  const documentos = await listarDocumentos(id);
  const subir = subirDocumentoAction.bind(null, id);

  return (
    <div className="space-y-6">
      <form action={subir} className="grid grid-cols-2 gap-3 rounded-lg border border-stone-200 bg-white p-4 sm:grid-cols-5">
        <input type="file" name="archivo" required className="col-span-2 text-sm sm:col-span-1" />
        <input type="text" name="nombre" placeholder="Nombre del documento" className="rounded-md border border-stone-300 px-2 py-1.5 text-sm" />
        <select name="categoria" className="rounded-md border border-stone-300 px-2 py-1.5 text-sm">
          {CATEGORIAS.map(([v, l]) => (
            <option key={v} value={v}>
              {l}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-2 text-xs text-stone-600">
          <input type="checkbox" name="compartir" /> Compartir con el paciente
        </label>
        <button className="col-span-2 rounded-md bg-emerald-700 px-3 py-1.5 text-sm text-white hover:bg-emerald-800 sm:col-span-5">
          Subir documento
        </button>
      </form>

      {documentos.length === 0 ? (
        <p className="text-sm text-stone-500">Sin documentos todavía.</p>
      ) : (
        <ul className="divide-y divide-stone-200 rounded-lg border border-stone-200 bg-white">
          {await Promise.all(
            documentos.map(async (d) => {
              const ultima = d.documento_versiones.sort((a, b) => b.numero_version - a.numero_version)[0];
              const url = ultima ? await urlFirmadaDocumento(ultima.storage_path) : null;
              const subirVersion = subirVersionAction.bind(null, id, d.id);
              return (
                <li key={d.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium">{d.nombre}</p>
                    <p className="text-xs text-stone-500">
                      {d.categoria} · v{ultima?.numero_version ?? 1} ·{" "}
                      {d.visibilidad === "compartida_paciente" ? "compartido" : "privado"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {url && (
                      <a href={url} target="_blank" rel="noreferrer" className="text-sm text-emerald-800 hover:underline">
                        Descargar
                      </a>
                    )}
                    <form action={subirVersion} className="flex items-center gap-2">
                      <input type="file" name="archivo" className="text-xs" />
                      <button className="text-xs text-stone-600 hover:underline">Nueva versión</button>
                    </form>
                  </div>
                </li>
              );
            })
          )}
        </ul>
      )}
    </div>
  );
}
