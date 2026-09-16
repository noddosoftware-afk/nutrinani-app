"use client";

import { useActionState, useMemo, useState } from "react";
import { crearConsultaAction, type EstadoNuevaConsulta } from "./actions";
import { calcularIMC, calcularBMR, calcularTDEE, calcularObjetivoEnergetico, calcularMacros } from "@/lib/calc";
import { Campo, Input, Select, Textarea, Boton } from "@/components/campo";

export function NuevaConsultaForm({
  pacienteId,
  edadAnios,
  sexoDefault,
}: {
  pacienteId: string;
  edadAnios: number;
  sexoDefault: "masculino" | "femenino";
}) {
  const accion = crearConsultaAction.bind(null, pacienteId, edadAnios, sexoDefault);
  const [state, formAction, pending] = useActionState<EstadoNuevaConsulta, FormData>(accion, { error: null });

  const [pesoKg, setPesoKg] = useState<number | undefined>();
  const [tallaCm, setTallaCm] = useState<number | undefined>();
  const [sexo, setSexo] = useState<"masculino" | "femenino">(sexoDefault);
  const [formulaBMR, setFormulaBMR] = useState<"mifflin_st_jeor" | "harris_benedict_revisada">("mifflin_st_jeor");
  const [nivelActividad, setNivelActividad] = useState<
    "sedentario" | "ligero" | "moderado" | "activo" | "muy_activo"
  >("sedentario");
  const [ajusteKcal, setAjusteKcal] = useState(0);
  const [motivoAjuste, setMotivoAjuste] = useState("");
  const [pctProteina, setPctProteina] = useState(30);
  const [pctCarbohidrato, setPctCarbohidrato] = useState(40);
  const [pctGrasa, setPctGrasa] = useState(30);

  // Vista previa en vivo — el servidor vuelve a calcular todo con las mismas funciones
  // al guardar, así que esto es solo para que la nutrióloga vea el resultado mientras captura.
  const preview = useMemo(() => {
    if (!pesoKg || !tallaCm) return null;
    const imc = calcularIMC({ pesoKg, tallaCm, edadAnios, poblacion: "adulto" });
    const bmr = calcularBMR({ formula: formulaBMR, pesoKg, tallaCm, edadAnios, sexo, poblacion: "adulto" });
    const tdee = bmr.valor ? calcularTDEE({ bmrKcal: bmr.valor, nivelActividad }) : null;
    const objetivo =
      tdee?.valor && motivoAjuste
        ? calcularObjetivoEnergetico({ tdeeKcal: tdee.valor, ajusteKcal, motivo: motivoAjuste })
        : null;
    const macros =
      objetivo?.valor && pctProteina + pctCarbohidrato + pctGrasa === 100
        ? calcularMacros({
            objetivoKcal: objetivo.valor,
            pesoKg,
            porcentajes: { proteina: pctProteina, carbohidrato: pctCarbohidrato, grasa: pctGrasa },
          })
        : null;
    return { imc, bmr, tdee, objetivo, macros };
  }, [pesoKg, tallaCm, edadAnios, sexo, formulaBMR, nivelActividad, ajusteKcal, motivoAjuste, pctProteina, pctCarbohidrato, pctGrasa]);

  return (
    <form action={formAction} className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-6">
        <fieldset className="rounded-lg border border-stone-200 bg-white p-4">
          <legend className="px-1 text-sm font-semibold text-stone-700">Consulta</legend>
          <div className="space-y-4">
            <Campo label="Motivo" name="motivo">
              <Input name="motivo" />
            </Campo>
            <Campo label="Evaluación" name="evaluacion">
              <Textarea name="evaluacion" rows={3} />
            </Campo>
            <Campo label="Acuerdos" name="acuerdos">
              <Textarea name="acuerdos" rows={2} />
            </Campo>
            <Campo label="Próxima revisión" name="proxima_revision">
              <Input name="proxima_revision" type="date" />
            </Campo>
            <Campo label="Notas internas (nunca visibles para el paciente)" name="notas_internas">
              <Textarea name="notas_internas" rows={2} />
            </Campo>
          </div>
        </fieldset>

        <fieldset className="rounded-lg border border-stone-200 bg-white p-4">
          <legend className="px-1 text-sm font-semibold text-stone-700">Mediciones</legend>
          <div className="grid grid-cols-2 gap-4">
            <Campo label="Peso (kg)" name="peso_kg">
              <Input name="peso_kg" type="number" step="0.1" onChange={(e) => setPesoKg(Number(e.target.value) || undefined)} />
            </Campo>
            <Campo label="Talla (cm)" name="talla_cm">
              <Input name="talla_cm" type="number" step="0.1" onChange={(e) => setTallaCm(Number(e.target.value) || undefined)} />
            </Campo>
            <Campo label="Cintura (cm)" name="cintura_cm">
              <Input name="cintura_cm" type="number" step="0.1" />
            </Campo>
            <Campo label="Cadera (cm)" name="cadera_cm">
              <Input name="cadera_cm" type="number" step="0.1" />
            </Campo>
            <Campo label="% Grasa corporal" name="porcentaje_grasa">
              <Input name="porcentaje_grasa" type="number" step="0.1" />
            </Campo>
            <Campo label="Masa muscular (kg)" name="masa_muscular_kg">
              <Input name="masa_muscular_kg" type="number" step="0.1" />
            </Campo>
          </div>
        </fieldset>

        <fieldset className="rounded-lg border border-stone-200 bg-white p-4">
          <legend className="px-1 text-sm font-semibold text-stone-700">Cálculos nutricionales</legend>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Campo label="Sexo" name="sexo">
                <Select name="sexo" value={sexo} onChange={(e) => setSexo(e.target.value as "masculino" | "femenino")}>
                  <option value="femenino">Femenino</option>
                  <option value="masculino">Masculino</option>
                </Select>
              </Campo>
              <Campo label="Población" name="poblacion">
                <Select name="poblacion" defaultValue="adulto">
                  <option value="adulto">Adulto</option>
                  <option value="menor">Menor de edad</option>
                  <option value="embarazo">Embarazo</option>
                  <option value="lactancia">Lactancia</option>
                </Select>
              </Campo>
            </div>
            <p className="text-xs text-stone-500">
              Edad calculada: {edadAnios} años. Los cálculos de esta pantalla solo aplican a población adulta;
              menores, embarazo y lactancia quedan fuera de alcance de la Fase 1 (ver docs/PROPUESTA.md).
            </p>
            <div className="grid grid-cols-2 gap-4">
              <Campo label="Fórmula de metabolismo basal" name="formula_bmr">
                <Select name="formula_bmr" value={formulaBMR} onChange={(e) => setFormulaBMR(e.target.value as never)}>
                  <option value="mifflin_st_jeor">Mifflin-St Jeor (1990)</option>
                  <option value="harris_benedict_revisada">Harris-Benedict revisada (1984)</option>
                </Select>
              </Campo>
              <Campo label="Nivel de actividad" name="nivel_actividad">
                <Select name="nivel_actividad" value={nivelActividad} onChange={(e) => setNivelActividad(e.target.value as never)}>
                  <option value="sedentario">Sedentario (×1.2)</option>
                  <option value="ligero">Ligero (×1.375)</option>
                  <option value="moderado">Moderado (×1.55)</option>
                  <option value="activo">Activo (×1.725)</option>
                  <option value="muy_activo">Muy activo (×1.9)</option>
                </Select>
              </Campo>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Campo label="Ajuste energético (kcal)" name="ajuste_kcal">
                <Input name="ajuste_kcal" type="number" value={ajusteKcal} onChange={(e) => setAjusteKcal(Number(e.target.value) || 0)} />
              </Campo>
              <Campo label="Motivo del ajuste (obligatorio si hay ajuste)" name="motivo_ajuste">
                <Input name="motivo_ajuste" value={motivoAjuste} onChange={(e) => setMotivoAjuste(e.target.value)} />
              </Campo>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <Campo label="% Proteína" name="pct_proteina">
                <Input name="pct_proteina" type="number" value={pctProteina} onChange={(e) => setPctProteina(Number(e.target.value) || 0)} />
              </Campo>
              <Campo label="% Carbohidrato" name="pct_carbohidrato">
                <Input name="pct_carbohidrato" type="number" value={pctCarbohidrato} onChange={(e) => setPctCarbohidrato(Number(e.target.value) || 0)} />
              </Campo>
              <Campo label="% Grasa" name="pct_grasa">
                <Input name="pct_grasa" type="number" value={pctGrasa} onChange={(e) => setPctGrasa(Number(e.target.value) || 0)} />
              </Campo>
            </div>
          </div>
        </fieldset>

        {state.error && <p className="text-sm text-red-600">{state.error}</p>}
        <Boton type="submit" disabled={pending}>
          {pending ? "Guardando…" : "Guardar consulta"}
        </Boton>
      </div>

      <div className="space-y-4">
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
          <h3 className="mb-3 text-sm font-semibold text-emerald-900">Vista previa de cálculos</h3>
          {!preview ? (
            <p className="text-sm text-emerald-800">Captura peso y talla para ver los cálculos.</p>
          ) : (
            <div className="space-y-3 text-sm">
              <ResultadoLinea etiqueta="IMC" resultado={preview.imc} render={(v) => `${v.imc} (${v.categoria.replace("_", " ")})`} />
              <ResultadoLinea etiqueta="Metabolismo basal (GEB)" resultado={preview.bmr} render={(v) => `${v} kcal/día`} />
              {preview.tdee && (
                <ResultadoLinea etiqueta="Gasto energético total (GET)" resultado={preview.tdee} render={(v) => `${v} kcal/día`} />
              )}
              {preview.objetivo && (
                <ResultadoLinea etiqueta="Objetivo energético" resultado={preview.objetivo} render={(v) => `${v} kcal/día`} />
              )}
              {preview.macros?.valor && (
                <div>
                  <p className="font-medium text-emerald-900">Macronutrientes</p>
                  <ul className="ml-4 list-disc">
                    <li>Proteína: {preview.macros.valor.proteina.gramos} g ({preview.macros.valor.proteina.gramosPorKg} g/kg)</li>
                    <li>Carbohidrato: {preview.macros.valor.carbohidrato.gramos} g ({preview.macros.valor.carbohidrato.gramosPorKg} g/kg)</li>
                    <li>Grasa: {preview.macros.valor.grasa.gramos} g ({preview.macros.valor.grasa.gramosPorKg} g/kg)</li>
                  </ul>
                </div>
              )}
              {!motivoAjuste && preview.tdee?.valor && (
                <p className="text-xs text-amber-700">
                  Falta el motivo del ajuste — sin él, el objetivo energético y los macros no se calcularán ni se guardarán.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </form>
  );
}

function ResultadoLinea<T>({
  etiqueta,
  resultado,
  render,
}: {
  etiqueta: string;
  resultado: { valor: T | null; bloqueado: boolean; advertencias: string[]; fuente: string; version: string };
  render: (v: T) => string;
}) {
  return (
    <div>
      <div className="flex justify-between">
        <span className="text-emerald-900">{etiqueta}</span>
        <span className="font-medium text-emerald-900">
          {resultado.bloqueado || resultado.valor === null ? "—" : render(resultado.valor)}
        </span>
      </div>
      <p className="text-xs text-emerald-700">{resultado.fuente} · {resultado.version}</p>
      {resultado.advertencias.map((a, i) => (
        <p key={i} className="text-xs text-amber-700">
          ⚠ {a}
        </p>
      ))}
    </div>
  );
}
