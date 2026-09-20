import { requireStaff } from "@/data/auth";
import { createClient } from "@/lib/supabase/server";
import { obtenerHorarioConsultorio } from "@/data/citas";
import { listarTodosLosServicios } from "@/data/pagos";
import { HorarioForm } from "./horario-form";
import { ServiciosManager } from "./servicios-manager";

export default async function ConfiguracionPage() {
  const sesion = await requireStaff();
  const supabase = await createClient();
  const [{ data: consultorio }, horario, servicios] = await Promise.all([
    supabase.from("consultorios").select("*").eq("id", sesion.consultorioId).single(),
    obtenerHorarioConsultorio(),
    listarTodosLosServicios(),
  ]);

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-xl font-semibold text-ink">Configuración del consultorio</h1>
        <div className="mt-4 rounded-lg border border-cream-200 bg-white p-4 text-sm">
          <dl className="space-y-2">
            <div className="flex justify-between"><dt className="text-ink-soft">Nombre</dt><dd>{consultorio?.nombre}</dd></div>
            <div className="flex justify-between"><dt className="text-ink-soft">Zona horaria</dt><dd>{consultorio?.zona_horaria}</dd></div>
            <div className="flex justify-between"><dt className="text-ink-soft">Moneda</dt><dd>{consultorio?.moneda}</dd></div>
          </dl>
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold text-ink">Horario de agenda</h2>
        <HorarioForm horarioInicial={horario.horario_atencion} duracionInicial={horario.duracion_cita_minutos} />
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold text-ink">Servicios y precios</h2>
        <ServiciosManager servicios={servicios} />
      </div>

      <p className="text-sm text-ink-soft">
        Personalización de logo, colores y plantillas queda para una siguiente iteración una vez validado el flujo
        clínico principal.
      </p>
    </div>
  );
}
