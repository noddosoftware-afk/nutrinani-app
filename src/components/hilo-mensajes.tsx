import type { Mensaje } from "@/data/mensajes";
import { format } from "date-fns";

export function HiloMensajes({ mensajes, rolPropio }: { mensajes: Mensaje[]; rolPropio: "staff" | "paciente" }) {
  if (mensajes.length === 0) {
    return <p className="text-sm text-ink-soft">Sin mensajes todavía. Escribe el primero abajo.</p>;
  }

  return (
    <div className="space-y-3">
      {mensajes.map((m) => {
        const esPropio = rolPropio === "paciente" ? m.autor_rol === "paciente" : m.autor_rol !== "paciente";
        return (
          <div key={m.id} className={`flex ${esPropio ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm ${
                esPropio ? "bg-brand-700 text-white" : "bg-cream-100 text-ink"
              }`}
            >
              <p className="whitespace-pre-line">{m.cuerpo}</p>
              <p className={`mt-1 text-[10px] ${esPropio ? "text-brand-100" : "text-ink-soft"}`}>
                {format(new Date(m.creado_en), "d MMM, HH:mm")}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
