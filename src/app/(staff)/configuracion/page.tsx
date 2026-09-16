import { requireStaff } from "@/data/auth";
import { createClient } from "@/lib/supabase/server";

export default async function ConfiguracionPage() {
  const sesion = await requireStaff();
  const supabase = await createClient();
  const { data: consultorio } = await supabase
    .from("consultorios")
    .select("*")
    .eq("id", sesion.consultorioId)
    .single();

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-xl font-semibold text-ink">Configuración del consultorio</h1>
      <div className="rounded-lg border border-cream-200 bg-white p-4 text-sm">
        <dl className="space-y-2">
          <div className="flex justify-between"><dt className="text-ink-soft">Nombre</dt><dd>{consultorio?.nombre}</dd></div>
          <div className="flex justify-between"><dt className="text-ink-soft">Zona horaria</dt><dd>{consultorio?.zona_horaria}</dd></div>
          <div className="flex justify-between"><dt className="text-ink-soft">Moneda</dt><dd>{consultorio?.moneda}</dd></div>
        </dl>
      </div>
      <p className="text-sm text-ink-soft">
        Personalización de logo, colores y plantillas queda para una siguiente iteración una vez validado el flujo
        clínico principal.
      </p>
    </div>
  );
}
