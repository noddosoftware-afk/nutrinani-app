"use client";

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
  type LucideIcon,
} from "lucide-react";

const NAV: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/dashboard", label: "Inicio", icon: Home },
  { href: "/pacientes", label: "Pacientes", icon: Users },
  { href: "/agenda", label: "Agenda", icon: CalendarDays },
  { href: "/planes", label: "Planes", icon: ClipboardList },
  { href: "/alimentos", label: "Alimentos y recetas", icon: Apple },
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
    <nav className="hidden gap-1 text-sm md:flex">
      {NAV.map((item) => {
        const activo = esActivo(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-colors ${
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

export function StaffNavMobile() {
  const pathname = usePathname();
  return (
    <nav className="flex gap-1 overflow-x-auto border-t border-cream-200 px-4 py-2 text-sm md:hidden">
      {NAV.map((item) => {
        const activo = esActivo(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 ${
              activo ? "bg-brand-50 text-brand-800 font-medium" : "text-ink-soft"
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
