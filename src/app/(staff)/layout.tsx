import Link from "next/link";
import type { ReactNode } from "react";
import { LogOut } from "lucide-react";
import { redirect } from "next/navigation";
import { getSesionActual } from "@/data/auth";
import { cerrarSesion } from "@/app/login/actions";
import { Logo } from "@/components/logo";
import { StaffNavDesktop, StaffMobileNav } from "./staff-nav";

export default async function StaffLayout({ children }: { children: ReactNode }) {
  const sesion = await getSesionActual();
  if (!sesion) redirect("/login");
  if (sesion.rol === "paciente") redirect("/portal");

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="border-b border-cream-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-1">
            <StaffMobileNav />
            <Link href="/dashboard" className="flex items-center gap-2">
              <Logo size={32} />
              <span className="font-display text-lg font-semibold text-brand-900">NutriNani</span>
            </Link>
          </div>
          <StaffNavDesktop />
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden text-ink-soft sm:inline">
              {sesion.nombreCompleto} · {sesion.rol === "nutriologa" ? "Nutrióloga" : "Asistente"}
            </span>
            <form action={cerrarSesion}>
              <button className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-brand-700 hover:bg-cream-100">
                <LogOut size={16} />
                Salir
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">{children}</main>
    </div>
  );
}
