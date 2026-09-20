-- NutriNani — permite editar configuración del consultorio (horario, duración de cita).
-- Antes solo existía consultorios_select: nadie podía hacer UPDATE aunque el DAL lo intentara.
-- Restringido a nutrióloga (no asistente) por ser una decisión de negocio, mismo criterio
-- que auditoria_select en 0002_rls.sql.

create policy consultorios_update_nutriologa on consultorios for update
  using (es_nutriologa())
  with check (es_nutriologa());
