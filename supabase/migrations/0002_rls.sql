-- NutriNani — Row Level Security
-- Regla de oro: TODO acceso pasa por aquí, sin importar lo que la UI intente ocultar.
-- staff = nutrióloga + asistente (con restricciones adicionales para asistente en la app).
-- paciente = solo su propio registro, vía profiles.paciente_id.

create or replace function auth_rol() returns rol_usuario
language sql stable security definer set search_path = public as $$
  select rol from profiles where id = auth.uid();
$$;

create or replace function auth_paciente_id() returns uuid
language sql stable security definer set search_path = public as $$
  select paciente_id from profiles where id = auth.uid();
$$;

create or replace function es_staff() returns boolean
language sql stable security definer set search_path = public as $$
  select auth_rol() in ('nutriologa', 'asistente');
$$;

create or replace function es_nutriologa() returns boolean
language sql stable security definer set search_path = public as $$
  select auth_rol() = 'nutriologa';
$$;

create or replace function es_dueno_paciente(p_paciente_id uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select auth_rol() = 'paciente' and auth_paciente_id() = p_paciente_id;
$$;

-- ---------------------------------------------------------------------------
alter table consultorios enable row level security;
create policy consultorios_select on consultorios for select
  using (es_staff());

-- ---------------------------------------------------------------------------
alter table profiles enable row level security;
create policy profiles_select_propio on profiles for select
  using (id = auth.uid() or es_staff());
create policy profiles_update_propio on profiles for update
  using (id = auth.uid());

-- ---------------------------------------------------------------------------
alter table pacientes enable row level security;
create policy pacientes_staff_all on pacientes for all
  using (es_staff()) with check (es_staff());
create policy pacientes_propio_select on pacientes for select
  using (es_dueno_paciente(id));

-- ---------------------------------------------------------------------------
alter table consentimientos enable row level security;
create policy consentimientos_staff_all on consentimientos for all
  using (es_staff()) with check (es_staff());
create policy consentimientos_propio_select on consentimientos for select
  using (es_dueno_paciente(paciente_id));

-- ---------------------------------------------------------------------------
-- Consultas: SOLO staff. Las notas internas y evaluación clínica nunca llegan
-- directamente al paciente por esta tabla (el portal usa una vista filtrada, más abajo).
alter table consultas enable row level security;
create policy consultas_staff_all on consultas for all
  using (es_staff()) with check (es_staff());

-- ---------------------------------------------------------------------------
alter table mediciones enable row level security;
create policy mediciones_staff_all on mediciones for all
  using (es_staff()) with check (es_staff());
create policy mediciones_propio_select on mediciones for select
  using (es_dueno_paciente(paciente_id));
-- El paciente puede registrar sus propias mediciones reportadas (ej. peso en casa),
-- nunca marcarlas como revisadas por la nutrióloga.
create policy mediciones_propio_insert on mediciones for insert
  with check (es_dueno_paciente(paciente_id) and reportado_por_paciente = true and revisado_por_nutriologa = false);

-- ---------------------------------------------------------------------------
alter table resultados_laboratorio enable row level security;
create policy resultados_lab_staff_all on resultados_laboratorio for all
  using (es_staff()) with check (es_staff());
create policy resultados_lab_propio_select on resultados_laboratorio for select
  using (es_dueno_paciente(paciente_id));

-- ---------------------------------------------------------------------------
-- Cálculos: solo staff (contienen criterio clínico); el paciente ve sus resultados
-- ya incorporados en el plan publicado, no la ficha de cálculo cruda.
alter table calculos enable row level security;
create policy calculos_staff_all on calculos for all
  using (es_staff()) with check (es_staff());

-- ---------------------------------------------------------------------------
alter table fuentes_nutricionales enable row level security;
create policy fuentes_staff_all on fuentes_nutricionales for all
  using (es_staff()) with check (es_staff());

alter table alimentos enable row level security;
create policy alimentos_staff_all on alimentos for all
  using (es_staff()) with check (es_staff());
-- Los pacientes pueden ver el catálogo (para leer recetas/planes publicados) pero no editarlo.
create policy alimentos_lectura_paciente on alimentos for select
  using (auth_rol() = 'paciente');

alter table recetas enable row level security;
create policy recetas_staff_all on recetas for all
  using (es_staff()) with check (es_staff());
create policy recetas_lectura_paciente on recetas for select
  using (auth_rol() = 'paciente');

alter table receta_ingredientes enable row level security;
create policy receta_ingredientes_staff_all on receta_ingredientes for all
  using (es_staff()) with check (es_staff());
create policy receta_ingredientes_lectura_paciente on receta_ingredientes for select
  using (auth_rol() = 'paciente');

-- ---------------------------------------------------------------------------
-- Planes: el paciente SOLO ve planes ya publicados (nunca borradores).
alter table planes enable row level security;
create policy planes_staff_all on planes for all
  using (es_staff()) with check (es_staff());
create policy planes_propio_select on planes for select
  using (es_dueno_paciente(paciente_id) and estado = 'publicado');

alter table plan_dias enable row level security;
create policy plan_dias_staff_all on plan_dias for all
  using (es_staff()) with check (es_staff());
create policy plan_dias_propio_select on plan_dias for select
  using (exists (select 1 from planes p where p.id = plan_id and es_dueno_paciente(p.paciente_id) and p.estado = 'publicado'));

alter table plan_tiempos enable row level security;
create policy plan_tiempos_staff_all on plan_tiempos for all
  using (es_staff()) with check (es_staff());
create policy plan_tiempos_propio_select on plan_tiempos for select
  using (exists (
    select 1 from plan_dias d join planes p on p.id = d.plan_id
    where d.id = plan_dia_id and es_dueno_paciente(p.paciente_id) and p.estado = 'publicado'
  ));

alter table plan_items enable row level security;
create policy plan_items_staff_all on plan_items for all
  using (es_staff()) with check (es_staff());
create policy plan_items_propio_select on plan_items for select
  using (exists (
    select 1 from plan_tiempos t join plan_dias d on d.id = t.plan_dia_id join planes p on p.id = d.plan_id
    where t.id = plan_tiempo_id and es_dueno_paciente(p.paciente_id) and p.estado = 'publicado'
  ));

-- ---------------------------------------------------------------------------
-- Fotografías: el paciente solo ve las marcadas como 'compartida_paciente'
-- (las tomadas/subidas por la nutrióloga para su propio análisis clínico quedan privadas).
alter table fotografias enable row level security;
create policy fotografias_staff_all on fotografias for all
  using (es_staff()) with check (es_staff());
create policy fotografias_propio_select on fotografias for select
  using (es_dueno_paciente(paciente_id) and visibilidad = 'compartida_paciente');
create policy fotografias_propio_insert on fotografias for insert
  with check (es_dueno_paciente(paciente_id));

-- ---------------------------------------------------------------------------
alter table documentos enable row level security;
create policy documentos_staff_all on documentos for all
  using (es_staff()) with check (es_staff());
create policy documentos_propio_select on documentos for select
  using (es_dueno_paciente(paciente_id) and visibilidad = 'compartida_paciente');

alter table documento_versiones enable row level security;
create policy documento_versiones_staff_all on documento_versiones for all
  using (es_staff()) with check (es_staff());
create policy documento_versiones_propio_select on documento_versiones for select
  using (exists (
    select 1 from documentos doc where doc.id = documento_id
    and es_dueno_paciente(doc.paciente_id) and doc.visibilidad = 'compartida_paciente'
  ));

-- ---------------------------------------------------------------------------
-- Auditoría: nadie edita ni borra; solo lectura para la nutrióloga.
alter table auditoria enable row level security;
create policy auditoria_insert on auditoria for insert
  with check (es_staff());
create policy auditoria_select on auditoria for select
  using (es_nutriologa());

-- ---------------------------------------------------------------------------
-- Storage: buckets privados 'fotos-progreso' y 'documentos'.
-- Convención de path: {paciente_id}/{archivo}. Se valida contra profiles.paciente_id
-- exactamente igual que en las tablas — así una URL directa no filtra el archivo
-- de otro paciente aunque alguien adivine o comparta el path.
insert into storage.buckets (id, name, public)
values ('fotos-progreso', 'fotos-progreso', false)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('documentos', 'documentos', false)
on conflict (id) do nothing;

create policy storage_fotos_staff on storage.objects for all
  using (bucket_id = 'fotos-progreso' and es_staff())
  with check (bucket_id = 'fotos-progreso' and es_staff());

-- No basta con validar la carpeta: una foto puede estar en la carpeta correcta del
-- paciente pero seguir siendo privada del staff (ej. tomada para análisis clínico,
-- no compartida todavía). Se valida contra la fila real en `fotografias`.
create or replace function foto_visible_para_paciente(p_storage_path text) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from fotografias f
    where f.storage_path = p_storage_path
      and f.paciente_id = auth_paciente_id()
      and f.visibilidad = 'compartida_paciente'
  );
$$;

create or replace function documento_visible_para_paciente(p_storage_path text) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from documento_versiones dv
    join documentos doc on doc.id = dv.documento_id
    where dv.storage_path = p_storage_path
      and doc.paciente_id = auth_paciente_id()
      and doc.visibilidad = 'compartida_paciente'
  );
$$;

create policy storage_fotos_paciente_select on storage.objects for select
  using (
    bucket_id = 'fotos-progreso'
    and auth_rol() = 'paciente'
    and (storage.foldername(name))[1] = auth_paciente_id()::text
    and foto_visible_para_paciente(name)
  );

create policy storage_fotos_paciente_insert on storage.objects for insert
  with check (
    bucket_id = 'fotos-progreso'
    and auth_rol() = 'paciente'
    and (storage.foldername(name))[1] = auth_paciente_id()::text
  );

create policy storage_documentos_staff on storage.objects for all
  using (bucket_id = 'documentos' and es_staff())
  with check (bucket_id = 'documentos' and es_staff());

create policy storage_documentos_paciente_select on storage.objects for select
  using (
    bucket_id = 'documentos'
    and auth_rol() = 'paciente'
    and (storage.foldername(name))[1] = auth_paciente_id()::text
    and documento_visible_para_paciente(name)
  );
