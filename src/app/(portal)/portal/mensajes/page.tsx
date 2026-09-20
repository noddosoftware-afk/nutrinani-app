import { redirect } from "next/navigation";
import { Send } from "lucide-react";
import { getSesionActual } from "@/data/auth";
import { listarMensajes } from "@/data/mensajes";
import { HiloMensajes } from "@/components/hilo-mensajes";
import { enviarMensajePacienteAction } from "./actions";

export default async function PortalMensajesPage({ searchParams }: PageProps<"/portal/mensajes">) {
  const sesion = await getSesionActual();
  if (!sesion?.pacienteId) redirect("/login");

  const params = await searchParams;
  const prefill = typeof params.prefill === "string" ? params.prefill : "";
  const mensajes = await listarMensajes(sesion.pacienteId);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-lg font-semibold text-ink">Mensajes con tu nutrióloga</h1>

      <div className="min-h-[300px] rounded-xl border border-cream-200 bg-white p-4">
        <HiloMensajes mensajes={mensajes} rolPropio="paciente" />
      </div>

      <form action={enviarMensajePacienteAction} className="flex gap-2">
        <input
          name="cuerpo"
          required
          defaultValue={prefill}
          placeholder="Escribe un mensaje…"
          className="flex-1 rounded-lg border border-cream-200 bg-white px-3 py-2 text-sm focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-100"
        />
        <button className="flex items-center gap-1.5 rounded-lg bg-brand-700 px-4 py-2 text-sm font-medium text-white hover:bg-brand-800">
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
