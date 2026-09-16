import { obtenerPaciente } from "@/data/pacientes";
import { actualizarExpedienteAction } from "./actions";
import { Campo, Input, Textarea, Boton } from "@/components/campo";

export default async function ExpedientePage({ params }: PageProps<"/pacientes/[id]/expediente">) {
  const { id } = await params;
  const p = await obtenerPaciente(id);
  const antecedentes = p.antecedentes as { personales?: string; familiares?: string };
  const preferencias = p.preferencias_alimentarias as { culturales?: string; alimentos_rechazados?: string[] };
  const habitos = p.habitos as Record<string, string>;

  const accion = actualizarExpedienteAction.bind(null, id);

  return (
    <form action={accion} className="max-w-3xl space-y-6">
      <fieldset className="rounded-lg border border-stone-200 bg-white p-4">
        <legend className="px-1 text-sm font-semibold text-stone-700">Objetivos y antecedentes</legend>
        <div className="space-y-4">
          <Campo label="Objetivos" name="objetivos">
            <Textarea name="objetivos" defaultValue={p.objetivos ?? ""} rows={2} />
          </Campo>
          <Campo label="Antecedentes personales" name="antecedentes_personales">
            <Textarea name="antecedentes_personales" defaultValue={antecedentes.personales ?? ""} rows={2} />
          </Campo>
          <Campo label="Antecedentes familiares" name="antecedentes_familiares">
            <Textarea name="antecedentes_familiares" defaultValue={antecedentes.familiares ?? ""} rows={2} />
          </Campo>
        </div>
      </fieldset>

      <fieldset className="rounded-lg border border-stone-200 bg-white p-4">
        <legend className="px-1 text-sm font-semibold text-stone-700">Alergias, medicamentos y preferencias</legend>
        <div className="space-y-4">
          <Campo label="Alergias e intolerancias (separadas por coma)" name="alergias">
            <Input name="alergias" defaultValue={(p.alergias_intolerancias as string[]).join(", ")} />
          </Campo>
          <Campo label="Medicamentos y suplementos (separados por coma)" name="medicamentos">
            <Input name="medicamentos" defaultValue={(p.medicamentos_suplementos as string[]).join(", ")} />
          </Campo>
          <Campo label="Preferencias culturales" name="preferencias_culturales">
            <Input name="preferencias_culturales" defaultValue={preferencias.culturales ?? ""} />
          </Campo>
          <Campo label="Alimentos rechazados (separados por coma)" name="alimentos_rechazados">
            <Input name="alimentos_rechazados" defaultValue={(preferencias.alimentos_rechazados ?? []).join(", ")} />
          </Campo>
        </div>
      </fieldset>

      <fieldset className="rounded-lg border border-stone-200 bg-white p-4">
        <legend className="px-1 text-sm font-semibold text-stone-700">Hábitos</legend>
        <div className="space-y-4">
          <Campo label="Actividad física" name="actividad_fisica">
            <Input name="actividad_fisica" defaultValue={habitos.actividad_fisica ?? ""} />
          </Campo>
          <Campo label="Sueño" name="sueno">
            <Input name="sueno" defaultValue={habitos.sueno ?? ""} />
          </Campo>
          <Campo label="Hidratación" name="hidratacion">
            <Input name="hidratacion" defaultValue={habitos.hidratacion ?? ""} />
          </Campo>
          <Campo label="Recordatorio de 24 horas" name="recordatorio_24h">
            <Textarea name="recordatorio_24h" defaultValue={habitos.recordatorio_24h ?? ""} rows={3} />
          </Campo>
        </div>
      </fieldset>

      <Boton type="submit">Guardar expediente</Boton>
    </form>
  );
}
