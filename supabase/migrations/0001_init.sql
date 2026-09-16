-- NutriNani — Esquema inicial (Fase 1: núcleo clínico funcional)
-- Convenciones:
--   * Toda tabla clínica queda protegida con Row Level Security (RLS).
--   * Los catálogos (alimentos, recetas, plantillas) son editables solo por staff;
--     su edición NUNCA modifica registros históricos ya guardados (consultas, planes publicados
--     guardan una copia congelada de los datos que usaron, no una referencia viva).
--   * "desconocido" y "cero" se distinguen: los campos numéricos de nutrientes son NULLABLE.

create extension if not exists "pgcrypto";

-- ============================================================================
-- 1. Roles y perfiles
-- ============================================================================

create type rol_usuario as enum ('nutriologa', 'asistente', 'paciente');

create table consultorios (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  zona_horaria text not null default 'America/Mexico_City',
  moneda text not null default 'MXN',
  creado_en timestamptz not null default now()
);

-- Un solo consultorio por defecto para la Fase 1 (multi-consultorio queda documentado
-- como pendiente de Fase 2/3 en docs/PROPUESTA.md).
insert into consultorios (nombre) values ('NutriNani') on conflict do nothing;

create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  consultorio_id uuid not null references consultorios (id),
  rol rol_usuario not null,
  nombre_completo text not null,
  -- Solo aplica cuando rol = 'paciente': liga la cuenta de login a su expediente.
  paciente_id uuid,
  activo boolean not null default true,
  creado_en timestamptz not null default now()
);

create index profiles_paciente_id_idx on profiles (paciente_id);

-- ============================================================================
-- 2. Pacientes y expediente
-- ============================================================================

create table pacientes (
  id uuid primary key default gen_random_uuid(),
  consultorio_id uuid not null references consultorios (id),
  nombre_completo text not null,
  fecha_nacimiento date,
  sexo text check (sexo in ('masculino', 'femenino')),
  telefono text,
  email text,
  contacto_emergencia_nombre text,
  contacto_emergencia_telefono text,
  objetivos text,
  -- Campos estructurados de baja cardinalidad como JSONB para no explotar el esquema
  -- en decenas de columnas; se muestran y editan como formulario en la UI.
  antecedentes jsonb not null default '{}'::jsonb,
  alergias_intolerancias jsonb not null default '[]'::jsonb,
  preferencias_alimentarias jsonb not null default '{}'::jsonb,
  medicamentos_suplementos jsonb not null default '[]'::jsonb,
  habitos jsonb not null default '{}'::jsonb,
  estado text not null default 'activo' check (estado in ('activo', 'archivado')),
  creado_por uuid references profiles (id),
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now()
);

create index pacientes_estado_idx on pacientes (estado);
create index pacientes_nombre_idx on pacientes using gin (to_tsvector('spanish', nombre_completo));

alter table profiles
  add constraint profiles_paciente_id_fkey foreign key (paciente_id) references pacientes (id);

create table consentimientos (
  id uuid primary key default gen_random_uuid(),
  paciente_id uuid not null references pacientes (id) on delete cascade,
  tipo text not null check (tipo in ('seguimiento_clinico', 'fotografias_seguimiento', 'difusion_publicitaria')),
  otorgado boolean not null,
  fecha timestamptz not null default now(),
  registrado_por uuid references profiles (id),
  notas text
);

create index consentimientos_paciente_idx on consentimientos (paciente_id);

-- ============================================================================
-- 3. Consultas (cada una conserva su propio historial — nunca se sobrescribe)
-- ============================================================================

create table consultas (
  id uuid primary key default gen_random_uuid(),
  paciente_id uuid not null references pacientes (id) on delete cascade,
  responsable_id uuid not null references profiles (id),
  fecha timestamptz not null default now(),
  motivo text,
  evaluacion text,
  acuerdos text,
  proxima_revision date,
  notas_internas text, -- nunca se expone al portal del paciente
  creado_en timestamptz not null default now()
);

create index consultas_paciente_idx on consultas (paciente_id, fecha desc);

create table mediciones (
  id uuid primary key default gen_random_uuid(),
  paciente_id uuid not null references pacientes (id) on delete cascade,
  consulta_id uuid references consultas (id) on delete set null,
  fecha timestamptz not null default now(),
  -- Nulls = "no medido", nunca se asume 0.
  peso_kg numeric,
  talla_cm numeric,
  cintura_cm numeric,
  cadera_cm numeric,
  porcentaje_grasa numeric,
  masa_muscular_kg numeric,
  reportado_por_paciente boolean not null default false,
  revisado_por_nutriologa boolean not null default false,
  fuente text, -- ej. "consultorio", "báscula del paciente", "laboratorio"
  creado_en timestamptz not null default now()
);

create index mediciones_paciente_idx on mediciones (paciente_id, fecha desc);

create table resultados_laboratorio (
  id uuid primary key default gen_random_uuid(),
  paciente_id uuid not null references pacientes (id) on delete cascade,
  consulta_id uuid references consultas (id) on delete set null,
  fecha date not null,
  indicador text not null,
  valor numeric,
  unidad text,
  rango_referencia text, -- tal cual el documento original, no se normaliza
  documento_id uuid, -- referencia opcional al documento fuente (ver sección documentos)
  creado_en timestamptz not null default now()
);

create index resultados_lab_paciente_idx on resultados_laboratorio (paciente_id, fecha desc);

-- Copia congelada de cada cálculo ejecutado por el motor (src/lib/calc).
-- Guarda entradas + resultado + fórmula/versión/fuente, tal como los devuelve el motor.
create table calculos (
  id uuid primary key default gen_random_uuid(),
  paciente_id uuid not null references pacientes (id) on delete cascade,
  consulta_id uuid references consultas (id) on delete set null,
  tipo text not null, -- 'imc' | 'bmr' | 'tdee' | 'objetivo_energetico' | 'macros' | 'distribucion_comidas'
  resultado jsonb not null, -- objeto ResultadoCalculo<T> completo
  ajuste_manual jsonb, -- { valorOriginal, valorAjustado, motivo, ajustadoPor, fecha } si aplica
  creado_en timestamptz not null default now()
);

create index calculos_paciente_idx on calculos (paciente_id, creado_en desc);

-- ============================================================================
-- 4. Alimentos y recetas
-- ============================================================================

create table fuentes_nutricionales (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  version text,
  url text,
  licencia_resuelta boolean not null default false,
  notas text
);

create table alimentos (
  id uuid primary key default gen_random_uuid(),
  consultorio_id uuid not null references consultorios (id),
  nombre text not null,
  marca text,
  categoria text,
  porcion_descripcion text, -- ej. "1 taza", "1 pieza mediana"
  porcion_gramos numeric,
  estado_coccion text check (estado_coccion in ('crudo', 'cocido', 'no_aplica')) default 'no_aplica',
  -- Todos por 100g. NULL = desconocido (no confundir con 0).
  energia_kcal_100g numeric,
  proteina_g_100g numeric,
  carbohidrato_g_100g numeric,
  grasa_g_100g numeric,
  fibra_g_100g numeric,
  sodio_mg_100g numeric,
  alergenos text[] not null default '{}',
  fuente_id uuid references fuentes_nutricionales (id),
  fecha_fuente date,
  creado_por uuid references profiles (id),
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now()
);

create index alimentos_nombre_idx on alimentos using gin (to_tsvector('spanish', nombre));

create table recetas (
  id uuid primary key default gen_random_uuid(),
  consultorio_id uuid not null references consultorios (id),
  nombre text not null,
  preparacion text,
  rendimiento_porciones numeric not null default 1,
  fotografia_url text,
  creado_por uuid references profiles (id),
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now()
);

create table receta_ingredientes (
  id uuid primary key default gen_random_uuid(),
  receta_id uuid not null references recetas (id) on delete cascade,
  alimento_id uuid not null references alimentos (id),
  gramos numeric not null check (gramos > 0),
  orden int not null default 0
);

create index receta_ingredientes_receta_idx on receta_ingredientes (receta_id);

-- ============================================================================
-- 5. Planes de alimentación
-- ============================================================================

create table planes (
  id uuid primary key default gen_random_uuid(),
  paciente_id uuid not null references pacientes (id) on delete cascade,
  nombre text not null,
  estado text not null default 'borrador' check (estado in ('borrador', 'aprobado', 'publicado', 'sustituido')),
  objetivo_kcal numeric,
  objetivo_macros jsonb, -- ValorMacros congelado al momento de crear el plan
  vigente_desde date,
  vigente_hasta date,
  version int not null default 1,
  plan_anterior_id uuid references planes (id), -- para versionado: el nuevo sustituye al anterior
  recomendaciones text,
  creado_por uuid references profiles (id),
  aprobado_por uuid references profiles (id),
  aprobado_en timestamptz,
  publicado_en timestamptz,
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now()
);

create index planes_paciente_idx on planes (paciente_id, creado_en desc);

create table plan_dias (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references planes (id) on delete cascade,
  numero_dia int not null,
  etiqueta text -- ej. "Lunes", "Día 1"
);

create table plan_tiempos (
  id uuid primary key default gen_random_uuid(),
  plan_dia_id uuid not null references plan_dias (id) on delete cascade,
  nombre text not null, -- ej. "Desayuno"
  orden int not null default 0,
  porcentaje_asignado numeric
);

create table plan_items (
  id uuid primary key default gen_random_uuid(),
  plan_tiempo_id uuid not null references plan_tiempos (id) on delete cascade,
  -- Un item referencia un alimento O una receta, nunca ambos.
  alimento_id uuid references alimentos (id),
  receta_id uuid references recetas (id),
  cantidad_gramos numeric not null check (cantidad_gramos > 0),
  notas text,
  orden int not null default 0,
  check (
    (alimento_id is not null and receta_id is null) or
    (alimento_id is null and receta_id is not null)
  )
);

create index plan_items_tiempo_idx on plan_items (plan_tiempo_id);

-- ============================================================================
-- 6. Fotografías de progreso
-- ============================================================================

create table fotografias (
  id uuid primary key default gen_random_uuid(),
  paciente_id uuid not null references pacientes (id) on delete cascade,
  consulta_id uuid references consultas (id) on delete set null,
  storage_path text not null, -- bucket privado 'fotos-progreso'
  vista text not null check (vista in ('frente', 'perfil', 'espalda', 'otra')),
  fecha_captura date not null,
  fecha_carga timestamptz not null default now(),
  observaciones text,
  visibilidad text not null default 'privada_staff' check (visibilidad in ('privada_staff', 'compartida_paciente')),
  subido_por uuid references profiles (id),
  consentimiento_id uuid references consentimientos (id),
  creado_en timestamptz not null default now()
);

create index fotografias_paciente_idx on fotografias (paciente_id, fecha_captura desc);

-- ============================================================================
-- 7. Documentos (con versionado; el original nunca se sobreescribe)
-- ============================================================================

create table documentos (
  id uuid primary key default gen_random_uuid(),
  paciente_id uuid not null references pacientes (id) on delete cascade,
  categoria text not null check (categoria in ('laboratorio', 'estudio', 'consentimiento', 'plan', 'material_educativo', 'otro')),
  nombre text not null,
  visibilidad text not null default 'privada_staff' check (visibilidad in ('privada_staff', 'compartida_paciente')),
  creado_por uuid references profiles (id),
  creado_en timestamptz not null default now()
);

create table documento_versiones (
  id uuid primary key default gen_random_uuid(),
  documento_id uuid not null references documentos (id) on delete cascade,
  storage_path text not null, -- bucket privado 'documentos'
  numero_version int not null,
  subido_por uuid references profiles (id),
  creado_en timestamptz not null default now()
);

create index documento_versiones_doc_idx on documento_versiones (documento_id, numero_version desc);

-- ============================================================================
-- 8. Auditoría
-- ============================================================================

create table auditoria (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references profiles (id),
  accion text not null,
  entidad text not null,
  entidad_id uuid,
  detalle jsonb,
  creado_en timestamptz not null default now()
);

create index auditoria_entidad_idx on auditoria (entidad, entidad_id);
