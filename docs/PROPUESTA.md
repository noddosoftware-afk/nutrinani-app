# NutriNani — Propuesta y estado del proyecto

Plataforma clínica para el consultorio de nutrición de **Daniela**. Nombre del proyecto: **NutriNani**
(Nani = apodo de Daniela + Nutrición).

## 1. Resumen de la solución

Aplicación web (Next.js + Supabase) con base de datos real, autenticación, almacenamiento privado y
permisos por rol aplicados tanto en la interfaz como en el servidor y en el storage (RLS de
Postgres). Sustituye a Avena dándole a Daniela control total sobre sus datos, cálculos verificables y
un portal privado para sus pacientes.

Este documento cubre la **Fase 1 (núcleo clínico funcional)**, ya implementada y probada localmente
(ver `README.md` para cómo correrla). Fases 2 y 3 quedan documentadas en la sección 8 como trabajo
pendiente, no como funcionalidad ya construida.

## 2. Supuestos iniciales

- Un solo consultorio (Daniela) en la Fase 1. El esquema ya incluye `consultorio_id` en las tablas
  principales para poder habilitar multi-consultorio en el futuro sin migrar datos.
- Idioma: español de México. Unidades: sistema métrico. Zona horaria y moneda configurables, con
  valor inicial `America/Mexico_City` / `MXN` (ver tabla `consultorios`).
- Los cálculos nutricionales (sección 5) solo cubren **población adulta, no embarazada, no
  lactante**. Menores de edad, embarazo y lactancia quedan explícitamente fuera de alcance de la Fase
  1 — el motor de cálculos bloquea el resultado y lo advierte en vez de usar fórmulas de adultos por
  default.
- No se incorporó el Sistema Mexicano de Alimentos Equivalentes (SMAE) ni ningún catálogo con licencia
  de terceros: el catálogo de alimentos se construye manualmente por la nutrióloga o con fuentes de
  datos abiertas que ella misma valide. Ver sección 7 (dependencias y licencias).
- No se implementó ninguna integración externa simulada (WhatsApp/SMS, pasarela de pago, IA). Donde el
  spec original las menciona, esta propuesta las deja para Fase 2/3 y no las anuncia como
  funcionales.
- Los datos de demostración (`scripts/seed.ts`) son 100% ficticios.

## 3. Mapa de pantallas (Fase 1)

**Staff** (nutrióloga / asistente):

```
/dashboard                          Panel principal (métricas reales)
/pacientes                          Lista, búsqueda, filtro por estado
/pacientes/nuevo                    Alta de paciente
/pacientes/[id]                     Resumen
/pacientes/[id]/expediente          Antecedentes, alergias, hábitos, preferencias
/pacientes/[id]/consultas           Historial de consultas
/pacientes/[id]/consultas/nueva     Nueva consulta + motor de cálculos en vivo
/pacientes/[id]/mediciones          Historial de mediciones
/pacientes/[id]/comparativas        Tabla de evolución (dos fechas libres)
/pacientes/[id]/fotografias         Galería, comparador antes/después
/pacientes/[id]/documentos          Archivos con versionado
/pacientes/[id]/planes              Planes del paciente
/planes, /planes/nuevo, /planes/[id]  Constructor, aprobación, publicación, PDF
/alimentos                          Catálogo de alimentos
/recetas, /recetas/[id]             Recetas con recálculo automático
/agenda, /mensajes, /reportes, /configuracion   Placeholders — Fase 2/3
```

**Portal del paciente** (mobile-first):

```
/portal                 Resumen
/portal/plan             Plan vigente publicado
/portal/fotografias      Ver fotos compartidas, subir foto propia
/portal/comparativas     Ver su propia evolución
/portal/documentos       Documentos compartidos
```

## 4. Arquitectura y modelo de datos

- **Next.js 16** (App Router, Server Components + Server Actions) sobre **Supabase** (Postgres +
  Auth + Storage). Justificación: Supabase da autenticación, RLS a nivel de fila y storage privado
  "de fábrica", lo que resuelve directamente los requisitos de la sección 15 del spec (permisos por
  rol y paciente aplicados en el servidor y en el storage) sin construir esa capa desde cero.
- **Nota de versión importante**: este proyecto usa Next.js 16, que renombró `middleware.ts` a
  `proxy.ts` (misma función, solo refresca la sesión). La autorización real nunca vive ahí: cada
  módulo en `src/data/*.ts` (la Data Access Layer) vuelve a verificar sesión y rol server-side antes
  de tocar datos, y Postgres RLS es la última línea de defensa aunque alguien se salte la UI o la DAL.
- **Motor de cálculos** (`src/lib/calc/`): funciones puras, sin dependencias de red ni de UI, cada una
  documentada con fórmula/versión/fuente/población aplicable, con 27 pruebas unitarias (`npm test`)
  verificadas contra cálculos hechos a mano. Se ejecuta tanto en el cliente (vista previa en vivo al
  capturar una consulta) como en el servidor (resultado que realmente se guarda) — nunca se confía en
  el número que mostró el navegador.
- **Modelo de datos**: ver `supabase/migrations/0001_init.sql` (esquema) y `0002_rls.sql` (políticas).
  Entidades: consultorios, profiles (rol), pacientes, consentimientos, consultas, mediciones,
  resultados_laboratorio, calculos, fuentes_nutricionales, alimentos, recetas,
  receta_ingredientes, planes (+ plan_dias/plan_tiempos/plan_items con versionado), fotografías,
  documentos (+ documento_versiones), auditoría. Los planes publicados y las consultas pasadas nunca
  se sobrescriben: una nueva versión de plan referencia a la anterior (`plan_anterior_id`) y la marca
  `sustituido`; editar el catálogo de alimentos no altera consultas o planes ya guardados porque estos
  guardan una copia congelada de los cálculos (`calculos.resultado` es un JSON snapshot).
- **Storage**: dos buckets privados (`fotos-progreso`, `documentos`), sin URLs públicas — todo acceso
  es vía URL firmada de corta duración. La política de Storage para pacientes no solo valida la
  carpeta (`paciente_id/...`) sino que consulta la fila real en la tabla correspondiente para
  confirmar que esa foto/documento específico ya fue marcado como compartido — evita que un paciente
  acceda a una foto propia que sigue siendo privada para análisis clínico interno.

## 5. Matriz de funciones de referencia (Avena)

No se tuvo acceso a la cuenta de Avena de Daniela ni a su documentación técnica durante esta primera
iteración, así que esta matriz describe **categorías funcionales típicas de software de consultorio
de nutrición**, no una auditoría 1:1 de los cálculos exactos de Avena. Antes de declarar equivalencia
real, se necesita que Daniela exporte o comparta ejemplos concretos de cálculos ya hechos en Avena
para verificarlos contra el motor de `src/lib/calc/`.

| Función | Estado |
|---|---|
| Registro y expediente de pacientes | ✅ Implementado (Fase 1) |
| Consultas con historial no destructivo | ✅ Implementado (Fase 1) |
| IMC, metabolismo basal (Mifflin-St Jeor, Harris-Benedict), GET, macros | ✅ Implementado y probado con casos de referencia manuales — **pendiente de contrastar contra ejemplos reales de Avena** |
| Catálogo de alimentos y recetas con recálculo | ✅ Implementado (catálogo propio, sin SMAE) |
| Constructor de planes con estados y versionado | ✅ Implementado (versión simplificada: alimentos por gramos; no incluye aún "equivalentes" ni alternativas automáticas) |
| Seguimiento fotográfico con comparador | ✅ Implementado (galería, comparador de dos fechas, deslizador) |
| Tabla comparativa de evolución | ✅ Implementado |
| Documentos con versionado | ✅ Implementado |
| Portal del paciente | ✅ Implementado (versión básica: plan, fotos, progreso, documentos) |
| Exportación de planes a PDF | ✅ Implementado |
| Importación/migración de datos desde Avena | ⏳ Pendiente — depende de qué exporte Avena realmente (sección 8) |
| Agenda, recordatorios, mensajería, pagos | ⏳ Pendiente — Fase 2 |
| IA supervisada (borradores, resúmenes) | ⏳ Pendiente — Fase 3 |

## 6. Seguridad — lo que se probó

- **RLS por rol y por paciente** en las 15 tablas clínicas: staff ve todo, paciente solo su propio
  registro y solo lo marcado como compartido (planes publicados, fotos/documentos compartidos).
- **Notas internas de consulta** (`consultas.notas_internas`) nunca se exponen al paciente: no existe
  ninguna política RLS de `select` para el rol `paciente` sobre la tabla `consultas`.
- **Storage a prueba de "adivinar la URL"**: aunque alguien obtenga el `storage_path` de una foto
  privada dentro de su propia carpeta, la política de Storage consulta la fila en `fotografias`/
  `documentos` y niega el acceso si no está marcada como compartida.
- Pendiente antes de producción real: pruebas de penetración dirigidas (la sección 19 del spec original
  pide "impedir acceso cruzado incluso usando enlaces directos o solicitudes al servidor" — las
  políticas están escritas y compiladas en las migraciones, pero deben ejecutarse contra el proyecto
  Supabase real con datos de prueba antes de dar por buena esta garantía en producción).

## 7. Dependencias, licencias y costos externos

| Dependencia | Costo | Notas |
|---|---|---|
| Supabase (Postgres + Auth + Storage) | Gratis en plan Free para desarrollo; planes pagados desde ~$25 USD/mes si se necesita más almacenamiento/cómputo en producción | Proyecto dedicado, separado de otros clientes de NODDO |
| Vercel (hosting) | Gratis en plan Hobby; Pro desde $20 USD/mes si se requiere dominio de equipo o más ejecución | |
| GitHub | Ya en uso por NODDO | Repo bajo la cuenta `noddosoftware-afk` |
| Fuente de datos nutricionales | **No resuelta** | No se usó SMAE ni ninguna base con licencia — el catálogo actual son datos de ejemplo capturados a mano. Si se quiere una base de datos nutricional más completa, hay que resolver su licencia antes de incorporarla (sección 6 del spec original) |
| WhatsApp/SMS, pasarela de pago, IA | **No integrados** | Quedan para Fase 2/3, con su propio costo por proveedor cuando se decida cuál usar |

## 8. Plan de implementación y pendientes explícitos

**Hecho (Fase 1):** autenticación y roles, pacientes y expediente, consultas con historial, motor de
cálculos validado con pruebas unitarias, catálogo de alimentos y recetas, constructor de planes con
estados y versionado, seguimiento fotográfico con comparador, tabla comparativa, documentos con
versionado, portal del paciente básico, exportación a PDF.

**Pendiente (Fase 2 — operación del consultorio):** agenda con disponibilidad y recordatorios,
mensajería privada, plantillas avanzadas de expediente/planes, importación desde Avena (una vez que
Daniela confirme qué puede exportar), administración de pagos y paquetes.

**Pendiente (Fase 3 — capacidades avanzadas):** IA supervisada (siempre con revisión profesional
obligatoria, nunca calculando nutrición vía modelo de lenguaje), integraciones externas, reportes
avanzados.

**Explícitamente fuera de alcance hasta nueva instrucción:** cálculos para menores/embarazo/lactancia,
cualquier integración de facturación fiscal, cualquier afirmación de cumplimiento legal en materia de
datos de salud en México (requiere validación legal especializada, no solo técnica).
