-- NutriNani — Fase 2: operación del consultorio
-- Agenda (citas), mensajería privada, y administración de pagos (registro manual,
-- sin pasarela — ver docs/PROPUESTA.md sección "pendiente explícito").

-- ============================================================================
-- 1. Configuración de agenda en el consultorio
-- ============================================================================

alter table consultorios
  add column horario_atencion jsonb not null default '{
    "lunes": {"inicio": "09:00", "fin": "18:00"},
    "martes": {"inicio": "09:00", "fin": "18:00"},
    "miercoles": {"inicio": "09:00", "fin": "18:00"},
    "jueves": {"inicio": "09:00", "fin": "18:00"},
    "viernes": {"inicio": "09:00", "fin": "18:00"},
    "sabado": null,
    "domingo": null
  }'::jsonb,
  add column duracion_cita_minutos int not null default 30;

-- ============================================================================
-- 2. Citas
-- ============================================================================

create type estado_cita as enum ('pendiente', 'confirmada', 'cancelada', 'completada');

create table citas (
  id uuid primary key default gen_random_uuid(),
  consultorio_id uuid not null references consultorios (id),
  paciente_id uuid not null references pacientes (id) on delete cascade,
  inicio timestamptz not null,
  fin timestamptz not null,
  estado estado_cita not null default 'pendiente',
  motivo text,
  notas_internas text,
  creado_por uuid references profiles (id),
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),
  constraint fin_despues_de_inicio check (fin > inicio)
);

create index citas_paciente_idx on citas (paciente_id, inicio desc);
create index citas_rango_idx on citas (consultorio_id, inicio, fin) where estado <> 'cancelada';

-- ============================================================================
-- 3. Mensajería privada (un hilo por paciente, entre ese paciente y el staff)
-- ============================================================================

create table mensajes (
  id uuid primary key default gen_random_uuid(),
  paciente_id uuid not null references pacientes (id) on delete cascade,
  autor_id uuid not null references profiles (id),
  autor_rol rol_usuario not null,
  cuerpo text not null check (char_length(trim(cuerpo)) > 0),
  leido_en timestamptz,
  creado_en timestamptz not null default now()
);

create index mensajes_paciente_idx on mensajes (paciente_id, creado_en);

-- ============================================================================
-- 4. Servicios y pagos (registro manual — nunca se anuncia como pasarela real)
-- ============================================================================

create table servicios (
  id uuid primary key default gen_random_uuid(),
  consultorio_id uuid not null references consultorios (id),
  nombre text not null,
  descripcion text,
  precio numeric not null check (precio >= 0),
  activo boolean not null default true,
  creado_en timestamptz not null default now()
);

create table pagos (
  id uuid primary key default gen_random_uuid(),
  paciente_id uuid not null references pacientes (id) on delete cascade,
  servicio_id uuid references servicios (id),
  concepto text not null,
  monto numeric not null check (monto > 0),
  metodo text not null check (metodo in ('efectivo', 'transferencia', 'tarjeta', 'otro')),
  fecha date not null default current_date,
  registrado_por uuid references profiles (id),
  creado_en timestamptz not null default now()
);

create index pagos_paciente_idx on pagos (paciente_id, fecha desc);

-- ============================================================================
-- 5. RLS
-- ============================================================================

alter table citas enable row level security;
create policy citas_staff_all on citas for all
  using (es_staff()) with check (es_staff());
create policy citas_propio_select on citas for select
  using (es_dueno_paciente(paciente_id));

alter table mensajes enable row level security;
create policy mensajes_staff_all on mensajes for all
  using (es_staff()) with check (es_staff());
create policy mensajes_propio_select on mensajes for select
  using (es_dueno_paciente(paciente_id));
create policy mensajes_propio_insert on mensajes for insert
  with check (es_dueno_paciente(paciente_id) and autor_id = auth.uid() and autor_rol = 'paciente');

alter table servicios enable row level security;
create policy servicios_staff_all on servicios for all
  using (es_staff()) with check (es_staff());

alter table pagos enable row level security;
create policy pagos_staff_all on pagos for all
  using (es_staff()) with check (es_staff());

grant select, insert, update, delete on citas, mensajes, servicios, pagos to authenticated;
