import type { ReactNode } from "react";
import { LogOut } from "lucide-react";
import { redirect } from "next/navigation";
import { getSesionActual } from "@/data/auth";
import { cerrarSesion } from "@/app/login/actions";
import { Logo } from "@/components/logo";
import { PortalNav } from "./portal-nav";

export default async function PortalLayout({ children }: { children: ReactNode }) {
  const sesion = await getSesionActual();
  if (!sesion) redirect("/login");
  if (sesion.rol !== "paciente") redirect("/dashboard");

  return (
    <div className="flex min-h-full flex-1 flex-col bg-cream-100">
      <header className="border-b border-cream-200 bg-white px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo size={28} />
            <span className="font-display text-lg font-semibold text-brand-900">NutriNani</span>
          </div>
          <form action={cerrarSesion}>
            <button className="flex items-center gap-1 text-sm text-brand-700 hover:underline">
              <LogOut size={14} />
              Salir
            </button>
          </form>
        </div>
        <p className="mt-1 text-sm text-ink-soft">Hola, {sesion.nombreCompleto.split(" ")[0]}</p>
      </header>

      <main className="flex-1 px-4 py-4 pb-20">{children}</main>

      <PortalNav />
    </div>
  );
}
