/**
 * Catálogo inicial de "Entrenamientos personalizados": 12 grupos musculares × 3 niveles
 * (principiante/intermedio/avanzado) = 36 ejercicios. Progresión estándar (compuestos +
 * sobrecarga progresiva para principiantes → movimientos unilaterales/de mayor habilidad
 * para avanzados), ver fuentes en la conversación con el equipo.
 * video_url se completa después de generar los GIFs con Higgsfield (ver scripts/actualizar-videos-ejercicios.ts).
 * Idempotente: si un ejercicio con el mismo nombre ya existe en el consultorio, se omite.
 *
 * Uso: npm run seed:ejercicios
 */
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en el entorno.");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });

type Nivel = "principiante" | "intermedio" | "avanzado";

interface NuevoEjercicio {
  nombre: string;
  grupo_muscular: string;
  nivel: Nivel;
  series_sugeridas: number;
  repeticiones_sugeridas: string;
  slug: string; // usado para el nombre de archivo del video, ej. /ejercicios/{slug}.mp4
}

const EJERCICIOS: NuevoEjercicio[] = [
  { nombre: "Flexiones de rodillas", grupo_muscular: "Pecho", nivel: "principiante", series_sugeridas: 3, repeticiones_sugeridas: "10-12", slug: "pecho-principiante" },
  { nombre: "Flexiones estándar", grupo_muscular: "Pecho", nivel: "intermedio", series_sugeridas: 3, repeticiones_sugeridas: "10-15", slug: "pecho-intermedio" },
  { nombre: "Press con mancuernas", grupo_muscular: "Pecho", nivel: "avanzado", series_sugeridas: 4, repeticiones_sugeridas: "8-10", slug: "pecho-avanzado" },

  { nombre: "Remo con banda elástica", grupo_muscular: "Espalda", nivel: "principiante", series_sugeridas: 3, repeticiones_sugeridas: "12-15", slug: "espalda-principiante" },
  { nombre: "Remo con mancuerna a una mano", grupo_muscular: "Espalda", nivel: "intermedio", series_sugeridas: 3, repeticiones_sugeridas: "10-12", slug: "espalda-intermedio" },
  { nombre: "Dominadas", grupo_muscular: "Espalda", nivel: "avanzado", series_sugeridas: 4, repeticiones_sugeridas: "6-8", slug: "espalda-avanzado" },

  { nombre: "Elevaciones laterales ligeras", grupo_muscular: "Hombros", nivel: "principiante", series_sugeridas: 3, repeticiones_sugeridas: "12-15", slug: "hombros-principiante" },
  { nombre: "Press militar con mancuernas", grupo_muscular: "Hombros", nivel: "intermedio", series_sugeridas: 3, repeticiones_sugeridas: "10-12", slug: "hombros-intermedio" },
  { nombre: "Press militar de pie con barra", grupo_muscular: "Hombros", nivel: "avanzado", series_sugeridas: 4, repeticiones_sugeridas: "6-8", slug: "hombros-avanzado" },

  { nombre: "Curl de bíceps con banda", grupo_muscular: "Bíceps", nivel: "principiante", series_sugeridas: 3, repeticiones_sugeridas: "12-15", slug: "biceps-principiante" },
  { nombre: "Curl con mancuernas", grupo_muscular: "Bíceps", nivel: "intermedio", series_sugeridas: 3, repeticiones_sugeridas: "10-12", slug: "biceps-intermedio" },
  { nombre: "Curl con barra Z", grupo_muscular: "Bíceps", nivel: "avanzado", series_sugeridas: 4, repeticiones_sugeridas: "8-10", slug: "biceps-avanzado" },

  { nombre: "Fondos en banco (rodillas flexionadas)", grupo_muscular: "Tríceps", nivel: "principiante", series_sugeridas: 3, repeticiones_sugeridas: "10-12", slug: "triceps-principiante" },
  { nombre: "Extensión de tríceps con mancuerna", grupo_muscular: "Tríceps", nivel: "intermedio", series_sugeridas: 3, repeticiones_sugeridas: "10-12", slug: "triceps-intermedio" },
  { nombre: "Fondos en paralelas", grupo_muscular: "Tríceps", nivel: "avanzado", series_sugeridas: 4, repeticiones_sugeridas: "8-10", slug: "triceps-avanzado" },

  { nombre: "Curl de muñeca ligero", grupo_muscular: "Antebrazos", nivel: "principiante", series_sugeridas: 2, repeticiones_sugeridas: "15-20", slug: "antebrazos-principiante" },
  { nombre: "Curl de muñeca invertido", grupo_muscular: "Antebrazos", nivel: "intermedio", series_sugeridas: 3, repeticiones_sugeridas: "12-15", slug: "antebrazos-intermedio" },
  { nombre: "Farmer's walk", grupo_muscular: "Antebrazos", nivel: "avanzado", series_sugeridas: 3, repeticiones_sugeridas: "30-40 m", slug: "antebrazos-avanzado" },

  { nombre: "Plancha", grupo_muscular: "Abdomen/Core", nivel: "principiante", series_sugeridas: 3, repeticiones_sugeridas: "20-30 s", slug: "core-principiante" },
  { nombre: "Crunch con giro", grupo_muscular: "Abdomen/Core", nivel: "intermedio", series_sugeridas: 3, repeticiones_sugeridas: "15-20", slug: "core-intermedio" },
  { nombre: "Elevación de piernas colgado", grupo_muscular: "Abdomen/Core", nivel: "avanzado", series_sugeridas: 3, repeticiones_sugeridas: "10-12", slug: "core-avanzado" },

  { nombre: "Sentadilla con peso corporal", grupo_muscular: "Cuádriceps", nivel: "principiante", series_sugeridas: 3, repeticiones_sugeridas: "12-15", slug: "cuadriceps-principiante" },
  { nombre: "Zancadas", grupo_muscular: "Cuádriceps", nivel: "intermedio", series_sugeridas: 3, repeticiones_sugeridas: "10-12 por pierna", slug: "cuadriceps-intermedio" },
  { nombre: "Sentadilla búlgara", grupo_muscular: "Cuádriceps", nivel: "avanzado", series_sugeridas: 4, repeticiones_sugeridas: "8-10 por pierna", slug: "cuadriceps-avanzado" },

  { nombre: "Puente de glúteo", grupo_muscular: "Isquiotibiales", nivel: "principiante", series_sugeridas: 3, repeticiones_sugeridas: "12-15", slug: "isquios-principiante" },
  { nombre: "Peso muerto rumano con mancuernas", grupo_muscular: "Isquiotibiales", nivel: "intermedio", series_sugeridas: 3, repeticiones_sugeridas: "10-12", slug: "isquios-intermedio" },
  { nombre: "Peso muerto rumano a una pierna", grupo_muscular: "Isquiotibiales", nivel: "avanzado", series_sugeridas: 3, repeticiones_sugeridas: "8-10 por pierna", slug: "isquios-avanzado" },

  { nombre: "Puente de glúteo a una pierna", grupo_muscular: "Glúteos", nivel: "principiante", series_sugeridas: 3, repeticiones_sugeridas: "12-15 por pierna", slug: "gluteos-principiante" },
  { nombre: "Patada de glúteo con banda", grupo_muscular: "Glúteos", nivel: "intermedio", series_sugeridas: 3, repeticiones_sugeridas: "15-20 por pierna", slug: "gluteos-intermedio" },
  { nombre: "Hip thrust con barra", grupo_muscular: "Glúteos", nivel: "avanzado", series_sugeridas: 4, repeticiones_sugeridas: "8-10", slug: "gluteos-avanzado" },

  { nombre: "Elevación de talones de pie", grupo_muscular: "Pantorrillas", nivel: "principiante", series_sugeridas: 3, repeticiones_sugeridas: "15-20", slug: "pantorrillas-principiante" },
  { nombre: "Elevación de talones a una pierna", grupo_muscular: "Pantorrillas", nivel: "intermedio", series_sugeridas: 3, repeticiones_sugeridas: "12-15 por pierna", slug: "pantorrillas-intermedio" },
  { nombre: "Elevación de talones con salto", grupo_muscular: "Pantorrillas", nivel: "avanzado", series_sugeridas: 3, repeticiones_sugeridas: "10-12", slug: "pantorrillas-avanzado" },

  { nombre: "Encogimiento con mancuernas ligeras", grupo_muscular: "Trapecio", nivel: "principiante", series_sugeridas: 3, repeticiones_sugeridas: "12-15", slug: "trapecio-principiante" },
  { nombre: "Encogimiento con mancuernas", grupo_muscular: "Trapecio", nivel: "intermedio", series_sugeridas: 3, repeticiones_sugeridas: "10-12", slug: "trapecio-intermedio" },
  { nombre: "Encogimiento con barra", grupo_muscular: "Trapecio", nivel: "avanzado", series_sugeridas: 4, repeticiones_sugeridas: "8-10", slug: "trapecio-avanzado" },
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
    .from("ejercicios")
    .select("nombre")
    .eq("consultorio_id", consultorioId);
  if (errExistentes) throw errExistentes;
  const nombresExistentes = new Set((existentes ?? []).map((e) => e.nombre));

  const nuevos = EJERCICIOS.filter((e) => !nombresExistentes.has(e.nombre));
  if (nuevos.length === 0) {
    console.log("Los 36 ejercicios ya existen en el catálogo. Nada que insertar.");
    return;
  }

  const { error: errInsert } = await supabase.from("ejercicios").insert(
    nuevos.map(({ slug: _slug, ...e }) => ({
      ...e,
      video_url: `/ejercicios/${_slug}.mp4`,
      consultorio_id: consultorioId,
    }))
  );
  if (errInsert) throw errInsert;

  console.log(`Insertados ${nuevos.length} ejercicios nuevos (${EJERCICIOS.length - nuevos.length} ya existían).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
