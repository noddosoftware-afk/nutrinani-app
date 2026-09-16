import "server-only";
import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import type { Database } from "./types";

/**
 * Cliente de Supabase para uso en Server Components, Server Actions y Route Handlers.
 * Lee/escribe la sesión vía cookies — NUNCA exponer este cliente ni sus llamadas al navegador.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Se ignora cuando se llama desde un Server Component (sin permiso de escritura);
            // el refresco de sesión real ocurre en proxy.ts.
          }
        },
      },
    }
  );
}

/**
 * Cliente con la service role key — evita RLS por completo.
 * Solo para tareas administrativas del servidor (seed, migraciones de datos).
 * JAMÁS importar este módulo desde código que responde a una request de usuario.
 */
export function createServiceClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
