# NutriNani

Plataforma clínica para el consultorio de nutrición de Daniela. Ver `docs/PROPUESTA.md` para el
resumen completo (arquitectura, supuestos, matriz de funciones, plan de fases).

## Stack

Next.js 16 (App Router) + TypeScript + Tailwind CSS 4 + Supabase (Postgres, Auth, Storage).

## Requisitos

- Node 20+
- Un proyecto de Supabase dedicado (no compartido con otros clientes)

## Instalación local

1. Instalar dependencias:

   ```bash
   npm install
   ```

2. Copiar `.env.example` a `.env.local` y llenar con los datos de tu proyecto Supabase
   (Project Settings → API):

   ```bash
   cp .env.example .env.local
   ```

3. Aplicar el esquema de base de datos. Con la CLI de Supabase enlazada a tu proyecto:

   ```bash
   supabase link --project-ref <tu-project-ref>
   supabase db push
   ```

   (Esto aplica `supabase/migrations/0001_init.sql` y `0002_rls.sql`.)

4. (Opcional pero recomendado) Sembrar datos ficticios de demostración:

   ```bash
   npm run seed
   ```

   Crea tres cuentas de prueba, todas con contraseña `DemoNutriNani123!`:
   - `daniela@nutrinani.demo` (nutrióloga)
   - `asistente@nutrinani.demo` (asistente)
   - `paciente1@nutrinani.demo` (portal del paciente)

5. Correr en desarrollo:

   ```bash
   npm run dev
   ```

## Pruebas

```bash
npm test          # motor de cálculos nutricionales (27 pruebas, valores de referencia documentados en el código)
npm run lint       # ESLint
npm run build      # build de producción + chequeo de tipos
```

## Estructura relevante

```
src/lib/calc/        Motor de cálculos nutricionales (funciones puras, documentadas, con pruebas)
src/data/             Data Access Layer — TODA consulta a Supabase pasa por aquí y re-verifica rol/sesión
src/app/(staff)/      Pantallas de la nutrióloga y asistente
src/app/(portal)/     Portal del paciente (mobile-first)
supabase/migrations/  Esquema y políticas RLS
scripts/seed.ts       Datos ficticios para desarrollo/demo
docs/PROPUESTA.md     Resumen de la solución, supuestos, arquitectura, plan de fases
```

## Seguridad

Los permisos se aplican en tres capas: la interfaz (oculta lo que no aplica), la Data Access Layer en
`src/data/*.ts` (re-verifica sesión y rol en cada función server-side), y Row Level Security de
Postgres (última línea de defensa, incluso si alguien llama a la API directamente). Ver
`docs/PROPUESTA.md` sección 6 para el detalle de qué se probó y qué falta validar contra el proyecto
real antes de producción.
