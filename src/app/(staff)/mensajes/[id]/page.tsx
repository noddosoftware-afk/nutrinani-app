import Link from "next/link";
import { ArrowLeft, Send } from "lucide-react";
import { listarMensajes } from "@/data/mensajes";
import { obtenerPaciente } from "@/data/pacientes";
import { HiloMensajes } from "@/components/hilo-mensajes";
import { enviarMensajeStaffAction } from "../actions";

export default async function ConversacionPage({ params }: PageProps<"/mensajes/[id]">) {
  const { id } = await params;
  const [paciente, mensajes] = await Promise.all([obtenerPaciente(id), listarMensajes(id)]);
  const enviar = enviarMensajeStaffAction.bind(null, id);

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4">
      <div className="flex items-center gap-2">
        <Link href="/mensajes" className="text-ink-soft hover:text-ink">
          <ArrowLeft size={18} />
        </Link>
        <h1 className="font-display text-xl font-semibold text-ink">{paciente.nombre_completo}</h1>
      </div>

      <div className="min-h-[300px] rounded-xl border border-cream-200 bg-white p-4">
        <HiloMensajes mensajes={mensajes} rolPropio="staff" />
      </div>

      <form action={enviar} className="flex gap-2">
        <input
          name="cuerpo"
          required
          placeholder="Escribe un mensaje…"
          className="flex-1 rounded-lg border border-cream-200 bg-white px-3 py-2 text-sm focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-100"
        />
        <button className="flex items-center gap-1.5 rounded-lg bg-brand-700 px-4 py-2 text-sm font-medium text-white hover:bg-brand-800">
          <Send size={16} /> Enviar
        </button>
      </form>
    </div>
  );
}
