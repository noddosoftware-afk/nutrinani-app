"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Users,
  CalendarDays,
  ClipboardList,
  Apple,
  MessageCircle,
  BarChart3,
  Settings,
  Menu,
  X,
  Dumbbell,
  type LucideIcon,
} from "lucide-react";

const NAV: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/dashboard", label: "Inicio", icon: Home },
  { href: "/pacientes", label: "Pacientes", icon: Users },
  { href: "/agenda", label: "Agenda", icon: CalendarDays },
  { href: "/planes", label: "Planes", icon: ClipboardList },
  { href: "/alimentos", label: "Alimentos", icon: Apple },
  { href: "/entrenamientos", label: "Entrenamientos", icon: Dumbbell },
  { href: "/mensajes", label: "Mensajes", icon: MessageCircle },
  { href: "/reportes", label: "Reportes", icon: BarChart3 },
  { href: "/configuracion", label: "Configuración", icon: Settings },
];

function esActivo(pathname: string, href: string) {
  return href === "/dashboard" ? pathname === href : pathname.startsWith(href);
}

export function StaffNavDesktop() {
  const pathname = usePathname();
  return (
    <nav className="hidden gap-0.5 text-sm xl:flex">
      {NAV.map((item) => {
        const activo = esActivo(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-2 py-1.5 transition-colors ${
              activo ? "bg-brand-50 text-brand-800 font-medium" : "text-ink-soft hover:bg-cream-100 hover:text-ink"
            }`}
          >
            <item.icon size={16} strokeWidth={2} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

/** Botón de hamburguesa + cajón deslizable — reemplaza el nav horizontal con
 * scroll que en pantallas de teléfono cortaba opciones sin ninguna pista de
 * que había más (Configuración, Pagos, etc. quedaban invisibles). */
export function StaffMobileNav() {
  const [abierto, setAbierto] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <button
        type="button"
        onClick={() => setAbierto(true)}
        aria-label="Abrir menú"
        className="rounded-lg p-2 text-ink-soft hover:bg-cream-100 xl:hidden"
      >
        <Menu size={22} />
      </button>

      {abierto && (
        <div className="fixed inset-0 z-50 xl:hidden">
          <button
            type="button"
            aria-label="Cerrar menú"
            className="absolute inset-0 bg-ink/30"
            onClick={() => setAbierto(false)}
          />
          <nav className="absolute left-0 top-0 flex h-full w-72 max-w-[80vw] flex-col gap-1 overflow-y-auto bg-white p-4 shadow-xl">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-display text-lg font-semibold text-brand-900">Menú</span>
              <button
                type="button"
                onClick={() => setAbierto(false)}
                aria-label="Cerrar menú"
                className="rounded-lg p-1.5 text-ink-soft hover:bg-cream-100"
              >
                <X size={20} />
              </button>
            </div>
            {NAV.map((item) => {
              const activo = esActivo(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setAbierto(false)}
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm ${
                    activo ? "bg-brand-50 font-medium text-brand-800" : "text-ink-soft hover:bg-cream-100 hover:text-ink"
                  }`}
                >
                  <item.icon size={18} strokeWidth={2} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </>
  );
}
