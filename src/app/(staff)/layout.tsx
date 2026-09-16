import Link from "next/link";
import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getSesionActual } from "@/data/auth";
import { cerrarSesion } from "@/app/login/actions";

const NAV = [
  { href: "/dashboard", label: "Inicio" },
  { href: "/pacientes", label: "Pacientes" },
  { href: "/agenda", label: "Agenda" },
  { href: "/planes", label: "Planes" },
  { href: "/alimentos", label: "Alimentos y recetas" },
  { href: "/mensajes", label: "Mensajes" },
  { href: "/reportes", label: "Reportes" },
  { href: "/configuracion", label: "Configuración" },
];

export default async function StaffLayout({ children }: { children: ReactNode }) {
  const sesion = await getSesionActual();
  if (!sesion) redirect("/login");
  if (sesion.rol === "paciente") redirect("/portal");

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/dashboard" className="text-lg font-semibold text-emerald-800">
            NutriNani
          </Link>
          <nav className="hidden gap-4 text-sm text-stone-600 md:flex">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-emerald-800">
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-stone-500">
              {sesion.nombreCompleto} · {sesion.rol === "nutriologa" ? "Nutrióloga" : "Asistente"}
            </span>
            <form action={cerrarSesion}>
              <button className="text-emerald-700 hover:underline">Salir</button>
            </form>
          </div>
        </div>
        <nav className="flex gap-4 overflow-x-auto border-t border-stone-100 px-4 py-2 text-sm text-stone-600 md:hidden">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="whitespace-nowrap hover:text-emerald-800">
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">{children}</main>
    </div>
  );
}
