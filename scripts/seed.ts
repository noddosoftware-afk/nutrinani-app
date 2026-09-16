/**
 * Seed de datos FICTICIOS para desarrollo y demostración.
 * Requiere las migraciones ya aplicadas y las variables de entorno reales
 * (NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY) — usa la service role key,
 * así que NUNCA se ejecuta contra producción con datos reales de pacientes.
 *
 * Uso: npm run seed
 */
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en el entorno.");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });

async function main() {
  console.log("Sembrando datos ficticios…");

  const { data: consultorio, error: errConsultorio } = await supabase
    .from("consultorios")
    .select("id")
    .limit(1)
    .single();
  if (errConsultorio) throw errConsultorio;
  const consultorioId = consultorio.id as string;

  // --- Nutrióloga (Daniela) -------------------------------------------------
  const { data: authDaniela, error: errDaniela } = await supabase.auth.admin.createUser({
    email: "daniela@nutrinani.demo",
    password: "DemoNutriNani123!",
    email_confirm: true,
  });
  if (errDaniela) throw errDaniela;

  await supabase.from("profiles").insert({
    id: authDaniela.user.id,
    consultorio_id: consultorioId,
    rol: "nutriologa",
    nombre_completo: "Daniela",
  });

  // --- Asistente ficticia ----------------------------------------------------
  const { data: authAsistente, error: errAsistente } = await supabase.auth.admin.createUser({
    email: "asistente@nutrinani.demo",
    password: "DemoNutriNani123!",
    email_confirm: true,
  });
  if (errAsistente) throw errAsistente;

  await supabase.from("profiles").insert({
    id: authAsistente.user.id,
    consultorio_id: consultorioId,
    rol: "asistente",
    nombre_completo: "Asistente de consultorio (demo)",
  });

  // --- Paciente ficticio con acceso al portal --------------------------------
  const { data: paciente, error: errPaciente } = await supabase
    .from("pacientes")
    .insert({
      consultorio_id: consultorioId,
      nombre_completo: "Paciente Ficticio Uno",
      fecha_nacimiento: "1992-04-12",
      sexo: "femenino",
      telefono: "5555555555",
      email: "paciente1@nutrinani.demo",
      objetivos: "Mejorar hábitos alimenticios y composición corporal (dato de demostración).",
      creado_por: authDaniela.user.id,
    })
    .select()
    .single();
  if (errPaciente) throw errPaciente;

  const { data: authPaciente, error: errAuthPaciente } = await supabase.auth.admin.createUser({
    email: "paciente1@nutrinani.demo",
    password: "DemoNutriNani123!",
    email_confirm: true,
  });
  if (errAuthPaciente) throw errAuthPaciente;

  await supabase.from("profiles").insert({
    id: authPaciente.user.id,
    consultorio_id: consultorioId,
    rol: "paciente",
    nombre_completo: paciente.nombre_completo,
    paciente_id: paciente.id,
  });

  // --- Segundo paciente, sin cuenta de portal (solo gestionado por staff) ---
  const { error: errPaciente2 } = await supabase.from("pacientes").insert({
    consultorio_id: consultorioId,
    nombre_completo: "Paciente Ficticio Dos",
    fecha_nacimiento: "1985-11-03",
    sexo: "masculino",
    telefono: "5555555556",
    objetivos: "Control de peso (dato de demostración).",
    creado_por: authDaniela.user.id,
  });
  if (errPaciente2) throw errPaciente2;

  // --- Mediciones históricas para el paciente 1 (demo de comparativas) ------
  const fechasBase = [90, 60, 30, 0]; // días atrás
  const pesos = [78.5, 76.8, 75.2, 74.0];
  for (let i = 0; i < fechasBase.length; i++) {
    const fecha = new Date(Date.now() - fechasBase[i] * 24 * 60 * 60 * 1000);
    await supabase.from("mediciones").insert({
      paciente_id: paciente.id,
      fecha: fecha.toISOString(),
      peso_kg: pesos[i],
      talla_cm: 165,
      cintura_cm: 90 - i * 1.5,
      revisado_por_nutriologa: true,
      fuente: "consultorio",
    });
  }

  // --- Catálogo de alimentos mínimo (datos de ejemplo, no oficiales) --------
  const { data: alimentos, error: errAlimentos } = await supabase
    .from("alimentos")
    .insert([
      {
        consultorio_id: consultorioId,
        nombre: "Pechuga de pollo cocida",
        categoria: "Proteína animal",
        estado_coccion: "cocido",
        energia_kcal_100g: 165,
        proteina_g_100g: 31,
        carbohidrato_g_100g: 0,
        grasa_g_100g: 3.6,
        fibra_g_100g: 0,
        sodio_mg_100g: 74,
      },
      {
        consultorio_id: consultorioId,
        nombre: "Arroz blanco cocido",
        categoria: "Cereal",
        estado_coccion: "cocido",
        energia_kcal_100g: 130,
        proteina_g_100g: 2.7,
        carbohidrato_g_100g: 28,
        grasa_g_100g: 0.3,
        fibra_g_100g: 0.4,
        sodio_mg_100g: 1,
      },
      {
        consultorio_id: consultorioId,
        nombre: "Brócoli cocido",
        categoria: "Verdura",
        estado_coccion: "cocido",
        energia_kcal_100g: 35,
        proteina_g_100g: 2.4,
        carbohidrato_g_100g: 7,
        grasa_g_100g: 0.4,
        fibra_g_100g: 3.3,
        sodio_mg_100g: 33,
      },
    ])
    .select();
  if (errAlimentos) throw errAlimentos;

  const { data: receta, error: errReceta } = await supabase
    .from("recetas")
    .insert({
      consultorio_id: consultorioId,
      nombre: "Pollo con arroz y brócoli",
      preparacion: "Cocer el pollo a la plancha, el arroz al vapor y el brócoli al vapor. Servir junto.",
      rendimiento_porciones: 1,
      creado_por: authDaniela.user.id,
    })
    .select()
    .single();
  if (errReceta) throw errReceta;

  const [pollo, arroz, brocoli] = alimentos;
  await supabase.from("receta_ingredientes").insert([
    { receta_id: receta.id, alimento_id: pollo.id, gramos: 150, orden: 0 },
    { receta_id: receta.id, alimento_id: arroz.id, gramos: 150, orden: 1 },
    { receta_id: receta.id, alimento_id: brocoli.id, gramos: 100, orden: 2 },
  ]);

  console.log("Listo. Cuentas de demostración (contraseña: DemoNutriNani123!):");
  console.log("  Nutrióloga: daniela@nutrinani.demo");
  console.log("  Asistente:  asistente@nutrinani.demo");
  console.log("  Paciente:   paciente1@nutrinani.demo");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
