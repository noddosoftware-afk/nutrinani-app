import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getSesionActual } from "@/data/auth";
import { Logo } from "@/components/logo";
import { StaffSidebar, StaffMobileNav } from "./staff-nav";

export default async function StaffLayout({ children }: { children: ReactNode }) {
  const sesion = await getSesionActual();
  if (!sesion) redirect("/login");
  if (sesion.rol === "paciente") redirect("/portal");

  const rolLabel = sesion.rol === "nutriologa" ? "Nutrióloga" : "Asistente";

  return (
    <div className="flex min-h-full flex-1">
      <StaffSidebar nombre={sesion.nombreCompleto} rol={rolLabel} />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-2 border-b border-cream-200 bg-white px-4 py-3 lg:hidden">
          <StaffMobileNav nombre={sesion.nombreCompleto} rol={rolLabel} />
          <Logo size={28} />
          <span className="font-display text-base font-semibold text-brand-900">NutriNani</span>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">{children}</main>
      </div>
    </div>
  );
}
