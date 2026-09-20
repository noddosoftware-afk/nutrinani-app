import Link from "next/link";
import { MessageCircle, UserRound } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { listarConversaciones } from "@/data/mensajes";

export default async function MensajesPage() {
  const conversaciones = await listarConversaciones();

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-semibold text-ink">Mensajes</h1>

      {conversaciones.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-cream-200 bg-white py-12 text-center">
          <MessageCircle size={28} className="text-ink-soft" />
          <p className="text-sm text-ink-soft">No hay pacientes activos todavía.</p>
        </div>
      ) : (
        <ul className="divide-y divide-cream-200 rounded-xl border border-cream-200 bg-white">
          {conversaciones.map((c) => (
            <li key={c.id}>
              <Link href={`/mensajes/${c.id}`} className="flex items-center gap-3 px-4 py-3 hover:bg-cream-100">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700">
                  <UserRound size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-ink">{c.nombre_completo}</p>
                  <p className="truncate text-xs text-ink-soft">
                    {c.ultimoMensaje ? `${c.ultimoMensaje.autor_rol === "paciente" ? "Paciente: " : "Tú: "}${c.ultimoMensaje.cuerpo}` : "Sin mensajes todavía"}
                  </p>
                </div>
                {c.ultimoMensaje && (
                  <span className="shrink-0 text-xs text-ink-soft">
                    {formatDistanceToNow(new Date(c.ultimoMensaje.creado_en), { locale: es, addSuffix: true })}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
