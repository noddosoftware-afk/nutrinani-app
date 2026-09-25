-- NutriNani — Entrenamientos personalizados
-- Mismo patrón que Alimentos+Planes: catálogo de ejercicios (lectura abierta a
-- cualquier autenticado) + rutinas armadas por staff y asignadas a un paciente
-- (el paciente solo ve rutinas ya publicadas, igual que con los planes de comida).

create type nivel_entrenamiento as enum ('principiante', 'intermedio', 'avanzado');

-- ============================================================================
-- 1. Catálogo de ejercicios
-- ============================================================================

create table ejercicios (
  id uuid primary key default gen_random_uuid(),
  consultorio_id uuid not null references consultorios (id),
  nombre text not null,
  grupo_muscular text not null,
  nivel nivel_entrenamiento not null,
  descripcion text,
  video_url text, -- ruta pública del GIF/loop de demostración, ej. /ejercicios/sentadilla-principiante.mp4
  series_sugeridas int,
  repeticiones_sugeridas text, -- ej. "12-15" o "30s"
  creado_por uuid references profiles (id),
  creado_en timestamptz not null default now()
);

create index ejercicios_grupo_nivel_idx on ejercicios (grupo_muscular, nivel);

-- ============================================================================
-- 2. Rutinas asignadas a un paciente
-- ============================================================================

create table rutinas (
  id uuid primary key default gen_random_uuid(),
  paciente_id uuid not null references pacientes (id) on delete cascade,
  nombre text not null,
  estado text not null default 'borrador' check (estado in ('borrador', 'publicado')),
  recomendaciones text,
  creado_por uuid references profiles (id),
  publicado_en timestamptz,
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now()
);

create index rutinas_paciente_idx on rutinas (paciente_id, creado_en desc);

create table rutina_dias (
  id uuid primary key default gen_random_uuid(),
  rutina_id uuid not null references rutinas (id) on delete cascade,
  numero_dia int not null,
  etiqueta text -- ej. "Día 1 — Tren superior"
);

create table rutina_ejercicios (
  id uuid primary key default gen_random_uuid(),
  rutina_dia_id uuid not null references rutina_dias (id) on delete cascade,
  ejercicio_id uuid not null references ejercicios (id),
  series int not null default 3,
  repeticiones text not null default '12',
  descanso_segundos int default 60,
  notas text,
  orden int not null default 0
);

create index rutina_ejercicios_dia_idx on rutina_ejercicios (rutina_dia_id);

-- ============================================================================
-- 3. RLS
-- ============================================================================

alter table ejercicios enable row level security;
create policy ejercicios_staff_all on ejercicios for all
  using (es_staff()) with check (es_staff());
-- Igual que alimentos: cualquier autenticado puede leer el catálogo (para ver su rutina).
create policy ejercicios_lectura_paciente on ejercicios for select
  using (auth_rol() = 'paciente');

alter table rutinas enable row level security;
create policy rutinas_staff_all on rutinas for all
  using (es_staff()) with check (es_staff());
create policy rutinas_propio_select on rutinas for select
  using (es_dueno_paciente(paciente_id) and estado = 'publicado');

alter table rutina_dias enable row level security;
create policy rutina_dias_staff_all on rutina_dias for all
  using (es_staff()) with check (es_staff());
create policy rutina_dias_propio_select on rutina_dias for select
  using (exists (
    select 1 from rutinas r where r.id = rutina_id and es_dueno_paciente(r.paciente_id) and r.estado = 'publicado'
  ));

alter table rutina_ejercicios enable row level security;
create policy rutina_ejercicios_staff_all on rutina_ejercicios for all
  using (es_staff()) with check (es_staff());
create policy rutina_ejercicios_propio_select on rutina_ejercicios for select
  using (exists (
    select 1 from rutina_dias d join rutinas r on r.id = d.rutina_id
    where d.id = rutina_dia_id and es_dueno_paciente(r.paciente_id) and r.estado = 'publicado'
  ));

grant select, insert, update, delete on ejercicios, rutinas, rutina_dias, rutina_ejercicios to authenticated;
