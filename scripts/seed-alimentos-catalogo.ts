/**
 * Amplía el catálogo de alimentos con 30 alimentos comunes adicionales.
 * Valores nutricionales por 100g tomados de referencias nutricionales estándar de uso
 * general (no del Sistema Mexicano de Alimentos Equivalentes, que sigue pendiente de
 * licenciar — ver docs/PROPUESTA.md). Idempotente: si un alimento con el mismo nombre
 * ya existe en el consultorio, se omite en vez de duplicarlo.
 *
 * Uso: npm run seed:alimentos
 */
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en el entorno.");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });

interface NuevoAlimento {
  nombre: string;
  categoria: string;
  estado_coccion: "crudo" | "cocido" | "no_aplica";
  porcion_descripcion: string;
  porcion_gramos: number;
  energia_kcal_100g: number;
  proteina_g_100g: number;
  carbohidrato_g_100g: number;
  grasa_g_100g: number;
  fibra_g_100g: number;
  sodio_mg_100g: number;
  alergenos?: string[];
}

const ALIMENTOS: NuevoAlimento[] = [
  { nombre: "Huevo cocido", categoria: "Proteína animal", estado_coccion: "cocido", porcion_descripcion: "1 pieza grande", porcion_gramos: 50, energia_kcal_100g: 155, proteina_g_100g: 13, carbohidrato_g_100g: 1.1, grasa_g_100g: 11, fibra_g_100g: 0, sodio_mg_100g: 124, alergenos: ["huevo"] },
  { nombre: "Atún en agua", categoria: "Proteína animal", estado_coccion: "cocido", porcion_descripcion: "1 lata chica escurrida", porcion_gramos: 85, energia_kcal_100g: 116, proteina_g_100g: 26, carbohidrato_g_100g: 0, grasa_g_100g: 1, fibra_g_100g: 0, sodio_mg_100g: 247 },
  { nombre: "Salmón cocido", categoria: "Proteína animal", estado_coccion: "cocido", porcion_descripcion: "1 filete mediano", porcion_gramos: 120, energia_kcal_100g: 208, proteina_g_100g: 20, carbohidrato_g_100g: 0, grasa_g_100g: 13, fibra_g_100g: 0, sodio_mg_100g: 59 },
  { nombre: "Carne de res magra cocida", categoria: "Proteína animal", estado_coccion: "cocido", porcion_descripcion: "1 bistec mediano", porcion_gramos: 120, energia_kcal_100g: 250, proteina_g_100g: 26, carbohidrato_g_100g: 0, grasa_g_100g: 15, fibra_g_100g: 0, sodio_mg_100g: 55 },
  { nombre: "Pavo pechuga cocida", categoria: "Proteína animal", estado_coccion: "cocido", porcion_descripcion: "1 pieza mediana", porcion_gramos: 100, energia_kcal_100g: 135, proteina_g_100g: 30, carbohidrato_g_100g: 0, grasa_g_100g: 1, fibra_g_100g: 0, sodio_mg_100g: 50 },
  { nombre: "Frijoles negros cocidos", categoria: "Leguminosa", estado_coccion: "cocido", porcion_descripcion: "1/2 taza", porcion_gramos: 90, energia_kcal_100g: 132, proteina_g_100g: 8.9, carbohidrato_g_100g: 24, grasa_g_100g: 0.5, fibra_g_100g: 8.7, sodio_mg_100g: 1 },
  { nombre: "Tofu", categoria: "Proteína vegetal", estado_coccion: "no_aplica", porcion_descripcion: "1/2 taza en cubos", porcion_gramos: 124, energia_kcal_100g: 76, proteina_g_100g: 8, carbohidrato_g_100g: 1.9, grasa_g_100g: 4.8, fibra_g_100g: 0.3, sodio_mg_100g: 7, alergenos: ["soya"] },
  { nombre: "Avena cocida", categoria: "Cereal", estado_coccion: "cocido", porcion_descripcion: "1/2 taza", porcion_gramos: 120, energia_kcal_100g: 71, proteina_g_100g: 2.5, carbohidrato_g_100g: 12, grasa_g_100g: 1.5, fibra_g_100g: 1.7, sodio_mg_100g: 4, alergenos: ["gluten"] },
  { nombre: "Tortilla de maíz", categoria: "Cereal", estado_coccion: "no_aplica", porcion_descripcion: "1 pieza", porcion_gramos: 25, energia_kcal_100g: 218, proteina_g_100g: 5.7, carbohidrato_g_100g: 45, grasa_g_100g: 2.3, fibra_g_100g: 6.3, sodio_mg_100g: 12 },
  { nombre: "Pan integral", categoria: "Cereal", estado_coccion: "no_aplica", porcion_descripcion: "1 rebanada", porcion_gramos: 28, energia_kcal_100g: 247, proteina_g_100g: 13, carbohidrato_g_100g: 41, grasa_g_100g: 3.4, fibra_g_100g: 7, sodio_mg_100g: 400, alergenos: ["gluten"] },
  { nombre: "Papa cocida", categoria: "Tubérculo", estado_coccion: "cocido", porcion_descripcion: "1 pieza mediana", porcion_gramos: 150, energia_kcal_100g: 87, proteina_g_100g: 1.9, carbohidrato_g_100g: 20, grasa_g_100g: 0.1, fibra_g_100g: 1.8, sodio_mg_100g: 6 },
  { nombre: "Camote cocido", categoria: "Tubérculo", estado_coccion: "cocido", porcion_descripcion: "1 pieza mediana", porcion_gramos: 130, energia_kcal_100g: 90, proteina_g_100g: 2, carbohidrato_g_100g: 21, grasa_g_100g: 0.1, fibra_g_100g: 3.3, sodio_mg_100g: 36 },
  { nombre: "Quinoa cocida", categoria: "Cereal", estado_coccion: "cocido", porcion_descripcion: "1/2 taza", porcion_gramos: 92, energia_kcal_100g: 120, proteina_g_100g: 4.4, carbohidrato_g_100g: 21, grasa_g_100g: 1.9, fibra_g_100g: 2.8, sodio_mg_100g: 7 },
  { nombre: "Manzana", categoria: "Fruta", estado_coccion: "crudo", porcion_descripcion: "1 pieza mediana", porcion_gramos: 150, energia_kcal_100g: 52, proteina_g_100g: 0.3, carbohidrato_g_100g: 14, grasa_g_100g: 0.2, fibra_g_100g: 2.4, sodio_mg_100g: 1 },
  { nombre: "Plátano", categoria: "Fruta", estado_coccion: "crudo", porcion_descripcion: "1 pieza mediana", porcion_gramos: 120, energia_kcal_100g: 89, proteina_g_100g: 1.1, carbohidrato_g_100g: 23, grasa_g_100g: 0.3, fibra_g_100g: 2.6, sodio_mg_100g: 1 },
  { nombre: "Fresas", categoria: "Fruta", estado_coccion: "crudo", porcion_descripcion: "1 taza", porcion_gramos: 150, energia_kcal_100g: 32, proteina_g_100g: 0.7, carbohidrato_g_100g: 7.7, grasa_g_100g: 0.3, fibra_g_100g: 2, sodio_mg_100g: 1 },
  { nombre: "Papaya", categoria: "Fruta", estado_coccion: "crudo", porcion_descripcion: "1 taza en cubos", porcion_gramos: 145, energia_kcal_100g: 43, proteina_g_100g: 0.5, carbohidrato_g_100g: 11, grasa_g_100g: 0.3, fibra_g_100g: 1.7, sodio_mg_100g: 8 },
  { nombre: "Mango", categoria: "Fruta", estado_coccion: "crudo", porcion_descripcion: "1 taza en cubos", porcion_gramos: 165, energia_kcal_100g: 60, proteina_g_100g: 0.8, carbohidrato_g_100g: 15, grasa_g_100g: 0.4, fibra_g_100g: 1.6, sodio_mg_100g: 1 },
  { nombre: "Naranja", categoria: "Fruta", estado_coccion: "crudo", porcion_descripcion: "1 pieza mediana", porcion_gramos: 130, energia_kcal_100g: 47, proteina_g_100g: 0.9, carbohidrato_g_100g: 12, grasa_g_100g: 0.1, fibra_g_100g: 2.4, sodio_mg_100g: 0 },
  { nombre: "Espinaca cocida", categoria: "Verdura", estado_coccion: "cocido", porcion_descripcion: "1/2 taza", porcion_gramos: 90, energia_kcal_100g: 23, proteina_g_100g: 2.9, carbohidrato_g_100g: 3.6, grasa_g_100g: 0.4, fibra_g_100g: 2.2, sodio_mg_100g: 70 },
  { nombre: "Zanahoria", categoria: "Verdura", estado_coccion: "crudo", porcion_descripcion: "1 pieza mediana", porcion_gramos: 60, energia_kcal_100g: 41, proteina_g_100g: 0.9, carbohidrato_g_100g: 10, grasa_g_100g: 0.2, fibra_g_100g: 2.8, sodio_mg_100g: 69 },
  { nombre: "Jitomate", categoria: "Verdura", estado_coccion: "crudo", porcion_descripcion: "1 pieza mediana", porcion_gramos: 120, energia_kcal_100g: 18, proteina_g_100g: 0.9, carbohidrato_g_100g: 3.9, grasa_g_100g: 0.2, fibra_g_100g: 1.2, sodio_mg_100g: 5 },
  { nombre: "Calabacita cocida", categoria: "Verdura", estado_coccion: "cocido", porcion_descripcion: "1/2 taza", porcion_gramos: 90, energia_kcal_100g: 17, proteina_g_100g: 1.2, carbohidrato_g_100g: 3.1, grasa_g_100g: 0.3, fibra_g_100g: 1, sodio_mg_100g: 2 },
  { nombre: "Pepino", categoria: "Verdura", estado_coccion: "crudo", porcion_descripcion: "1/2 taza rebanado", porcion_gramos: 60, energia_kcal_100g: 15, proteina_g_100g: 0.7, carbohidrato_g_100g: 3.6, grasa_g_100g: 0.1, fibra_g_100g: 0.5, sodio_mg_100g: 2 },
  { nombre: "Champiñones cocidos", categoria: "Verdura", estado_coccion: "cocido", porcion_descripcion: "1/2 taza", porcion_gramos: 78, energia_kcal_100g: 28, proteina_g_100g: 3.1, carbohidrato_g_100g: 5.3, grasa_g_100g: 0.5, fibra_g_100g: 2, sodio_mg_100g: 5 },
  { nombre: "Yogur griego natural", categoria: "Lácteo", estado_coccion: "no_aplica", porcion_descripcion: "1 taza", porcion_gramos: 245, energia_kcal_100g: 59, proteina_g_100g: 10, carbohidrato_g_100g: 3.6, grasa_g_100g: 0.4, fibra_g_100g: 0, sodio_mg_100g: 36, alergenos: ["lácteos"] },
  { nombre: "Leche descremada", categoria: "Lácteo", estado_coccion: "no_aplica", porcion_descripcion: "1 taza", porcion_gramos: 240, energia_kcal_100g: 34, proteina_g_100g: 3.4, carbohidrato_g_100g: 5, grasa_g_100g: 0.1, fibra_g_100g: 0, sodio_mg_100g: 42, alergenos: ["lácteos"] },
  { nombre: "Almendras", categoria: "Fruto seco", estado_coccion: "crudo", porcion_descripcion: "1/4 de taza", porcion_gramos: 35, energia_kcal_100g: 579, proteina_g_100g: 21, carbohidrato_g_100g: 22, grasa_g_100g: 50, fibra_g_100g: 12.5, sodio_mg_100g: 1, alergenos: ["frutos secos"] },
  { nombre: "Aguacate", categoria: "Fruta", estado_coccion: "crudo", porcion_descripcion: "1/2 pieza mediana", porcion_gramos: 100, energia_kcal_100g: 160, proteina_g_100g: 2, carbohidrato_g_100g: 8.5, grasa_g_100g: 15, fibra_g_100g: 6.7, sodio_mg_100g: 7 },
  { nombre: "Aceite de oliva", categoria: "Grasa", estado_coccion: "no_aplica", porcion_descripcion: "1 cucharada", porcion_gramos: 14, energia_kcal_100g: 884, proteina_g_100g: 0, carbohidrato_g_100g: 0, grasa_g_100g: 100, fibra_g_100g: 0, sodio_mg_100g: 2 },
];

async function main() {
  const { data: consultorio, error: errConsultorio } = await supabase
    .from("consultorios")
    .select("id")
    .limit(1)
    .single();
  if (errConsultorio) throw errConsultorio;
  const consultorioId = consultorio.id as string;

  const { data: existentes, error: errExistentes } = await supabase
    .from("alimentos")
    .select("nombre")
    .eq("consultorio_id", consultorioId);
  if (errExistentes) throw errExistentes;
  const nombresExistentes = new Set((existentes ?? []).map((a) => a.nombre));

  const nuevos = ALIMENTOS.filter((a) => !nombresExistentes.has(a.nombre));
  if (nuevos.length === 0) {
    console.log("Los 30 alimentos ya existen en el catálogo. Nada que insertar.");
    return;
  }

  const { error: errInsert } = await supabase.from("alimentos").insert(
    nuevos.map((a) => ({
      ...a,
      alergenos: a.alergenos ?? [],
      consultorio_id: consultorioId,
      fecha_fuente: new Date().toISOString().slice(0, 10),
    }))
  );
  if (errInsert) throw errInsert;

  console.log(`Insertados ${nuevos.length} alimentos nuevos (${ALIMENTOS.length - nuevos.length} ya existían).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
