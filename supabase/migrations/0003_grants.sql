-- Al crear el proyecto se desactivó "Automatically expose new tables" (recomendación de
-- seguridad de Supabase), lo que también desactiva el otorgamiento automático de privilegios
-- de Postgres a los roles anon/authenticated/service_role en tablas nuevas. RLS sigue siendo
-- la barrera real de seguridad (ver 0002_rls.sql); estos GRANT solo permiten que los roles
-- lleguen a evaluar las políticas en primer lugar.

grant usage on schema public to anon, authenticated, service_role;

grant all on all tables in schema public to service_role;
grant select, insert, update, delete on all tables in schema public to authenticated;

grant all on all sequences in schema public to service_role;
grant usage on all sequences in schema public to authenticated;

alter default privileges in schema public grant all on tables to service_role;
alter default privileges in schema public grant select, insert, update, delete on tables to authenticated;
alter default privileges in schema public grant all on sequences to service_role;
alter default privileges in schema public grant usage on sequences to authenticated;
