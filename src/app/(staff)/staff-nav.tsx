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
  ChevronsLeft,
  ChevronsRight,
  LogOut,
  type LucideIcon,
} from "lucide-react";
import { Logo } from "@/components/logo";
import { cerrarSesion } from "@/app/login/actions";

const NAV: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/dashboard", label: "Inicio", icon: Home },
  { href: "/pacientes", label: "Pacientes", icon: Users },
  { href: "/agenda", label: "Agenda", icon: CalendarDays },
  { href: "/planes", label: "Planes", icon: ClipboardList },
  { href: "/alimentos", label: "Alimentos", icon: Apple },
  { href: "/entrenamientos", label: "Entrenamientos", icon: Dumbbell },
  { href: "/mensajes", label: "Mensajes", icon: MessageCircle },
  { href: "/reportes", label: "Reportes", icon: BarChart3 },
];

function esActivo(pathname: string, href: string) {
  return href === "/dashboard" ? pathname === href : pathname.startsWith(href);
}

function ItemNav({
  item,
  activo,
  colapsado,
  onClick,
}: {
  item: { href: string; label: string; icon: LucideIcon };
  activo: boolean;
  colapsado?: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={item.href}
      onClick={onClick}
      title={colapsado ? item.label : undefined}
      className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
        activo ? "bg-brand-50 font-medium text-brand-800" : "text-ink-soft hover:bg-cream-100 hover:text-ink"
      } ${colapsado ? "justify-center" : ""}`}
    >
      {activo && <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-brand-600" />}
      <item.icon size={18} strokeWidth={activo ? 2.25 : 1.75} className="shrink-0" />
      {!colapsado && <span className="truncate">{item.label}</span>}
    </Link>
  );
}

function PerfilBloque({
  nombre,
  rol,
  colapsado,
}: {
  nombre: string;
  rol: string;
  colapsado?: boolean;
}) {
  return (
    <div className={`flex items-center gap-3 ${colapsado ? "justify-center" : ""}`}>
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-100 font-display text-sm font-semibold text-brand-800">
        {nombre
          .trim()
          .split(/\s+/)
          .slice(0, 2)
          .map((p) => p[0]?.toUpperCase())
          .join("")}
      </div>
      {!colapsado && (
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-ink">{nombre}</p>
          <p className="truncate text-xs text-ink-soft">{rol}</p>
        </div>
      )}
    </div>
  );
}

/** Sidebar fija de escritorio, colapsable — el layout de Next.js la mantiene montada
 * entre navegaciones dentro del área de staff, así que el estado sobrevive sin
 * necesidad de localStorage (que forzaría un efecto con setState post-montaje). */
export function StaffSidebar({ nombre, rol }: { nombre: string; rol: string }) {
  const pathname = usePathname();
  const [colapsado, setColapsado] = useState(false);

  return (
    <aside
      className={`sticky top-0 hidden h-screen shrink-0 flex-col border-r border-cream-200 bg-white transition-[width] duration-200 lg:flex ${
        colapsado ? "w-[76px]" : "w-64"
      }`}
    >
      <div className={`flex items-center gap-2.5 px-5 py-6 ${colapsado ? "justify-center px-3" : ""}`}>
        <Logo size={32} />
        {!colapsado && (
          <div className="min-w-0">
            <p className="truncate font-display text-base font-semibold text-brand-900">Daniela Balandran</p>
            <p className="truncate text-xs text-ink-soft">Nutrióloga</p>
          </div>
        )}
      </div>

      <nav className={`flex-1 space-y-1 overflow-y-auto px-3 ${colapsado ? "px-2" : ""}`}>
        {NAV.map((item) => (
          <ItemNav key={item.href} item={item} activo={esActivo(pathname, item.href)} colapsado={colapsado} />
        ))}
      </nav>

      <div className={`space-y-1 border-t border-cream-200 px-3 py-3 ${colapsado ? "px-2" : ""}`}>
        <ItemNav
          item={{ href: "/configuracion", label: "Configuración", icon: Settings }}
          activo={esActivo(pathname, "/configuracion")}
          colapsado={colapsado}
        />
        <form action={cerrarSesion}>
          <button
            title={colapsado ? "Salir" : undefined}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-ink-soft transition-colors hover:bg-cream-100 hover:text-ink ${
              colapsado ? "justify-center" : ""
            }`}
          >
            <LogOut size={18} strokeWidth={1.75} className="shrink-0" />
            {!colapsado && <span>Salir</span>}
          </button>
        </form>
        <div className={`mt-2 border-t border-cream-200 pt-3 ${colapsado ? "flex justify-center" : ""}`}>
          <PerfilBloque nombre={nombre} rol={rol} colapsado={colapsado} />
        </div>
        <button
          onClick={() => setColapsado((c) => !c)}
          className={`mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs text-ink-soft/70 transition-colors hover:bg-cream-100 hover:text-ink-soft ${
            colapsado ? "justify-center" : ""
          }`}
        >
          {colapsado ? <ChevronsRight size={15} /> : <ChevronsLeft size={15} />}
          {!colapsado && <span>Colapsar</span>}
        </button>
      </div>
    </aside>
  );
}

/** Botón de hamburguesa + cajón deslizable para pantallas angostas (< lg). */
export function StaffMobileNav({ nombre, rol }: { nombre: string; rol: string }) {
  const [abierto, setAbierto] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <button
        type="button"
        onClick={() => setAbierto(true)}
        aria-label="Abrir menú"
        className="rounded-lg p-2 text-ink-soft hover:bg-cream-100 lg:hidden"
      >
        <Menu size={22} />
      </button>

      {abierto && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Cerrar menú"
            className="absolute inset-0 bg-ink/30 backdrop-blur-[1px]"
            onClick={() => setAbierto(false)}
          />
          <nav className="absolute left-0 top-0 flex h-full w-72 max-w-[80vw] flex-col bg-white shadow-xl">
            <div className="flex items-center justify-between px-5 py-5">
              <div className="flex items-center gap-2.5">
                <Logo size={30} />
                <div>
                  <p className="font-display text-sm font-semibold text-brand-900">Daniela Balandran</p>
                  <p className="text-xs text-ink-soft">Nutrióloga</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAbierto(false)}
                aria-label="Cerrar menú"
                className="rounded-lg p-1.5 text-ink-soft hover:bg-cream-100"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 space-y-1 overflow-y-auto px-3">
              {NAV.map((item) => (
                <ItemNav
                  key={item.href}
                  item={item}
                  activo={esActivo(pathname, item.href)}
                  onClick={() => setAbierto(false)}
                />
              ))}
            </div>
            <div className="space-y-1 border-t border-cream-200 px-3 py-3">
              <ItemNav
                item={{ href: "/configuracion", label: "Configuración", icon: Settings }}
                activo={esActivo(pathname, "/configuracion")}
                onClick={() => setAbierto(false)}
              />
              <form action={cerrarSesion}>
                <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-ink-soft transition-colors hover:bg-cream-100 hover:text-ink">
                  <LogOut size={18} strokeWidth={1.75} />
                  Salir
                </button>
              </form>
              <div className="mt-2 border-t border-cream-200 pt-3">
                <PerfilBloque nombre={nombre} rol={rol} />
              </div>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
