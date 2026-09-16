import Link from "next/link";
import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getSesionActual } from "@/data/auth";
import { cerrarSesion } from "@/app/login/actions";

const NAV = [
  { href: "/portal", label: "Resumen" },
  { href: "/portal/plan", label: "Mi plan" },
  { href: "/portal/fotografias", label: "Fotos" },
  { href: "/portal/comparativas", label: "Progreso" },
  { href: "/portal/documentos", label: "Archivos" },
];

export default async function PortalLayout({ children }: { children: ReactNode }) {
  const sesion = await getSesionActual();
  if (!sesion) redirect("/login");
  if (sesion.rol !== "paciente") redirect("/dashboard");

  return (
    <div className="flex min-h-full flex-1 flex-col bg-stone-50">
      <header className="border-b border-stone-200 bg-white px-4 py-3">
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-emerald-800">NutriNani</span>
          <form action={cerrarSesion}>
            <button className="text-sm text-emerald-700 hover:underline">Salir</button>
          </form>
        </div>
        <p className="text-sm text-stone-500">Hola, {sesion.nombreCompleto.split(" ")[0]}</p>
      </header>

      <main className="flex-1 px-4 py-4 pb-20">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 flex justify-around border-t border-stone-200 bg-white py-2 text-xs">
        {NAV.map((item) => (
          <Link key={item.href} href={item.href} className="px-2 py-1 text-stone-600 hover:text-emerald-800">
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
