"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ClipboardList, Camera, TrendingUp, FolderOpen, type LucideIcon } from "lucide-react";

const NAV: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/portal", label: "Resumen", icon: Home },
  { href: "/portal/plan", label: "Mi plan", icon: ClipboardList },
  { href: "/portal/fotografias", label: "Fotos", icon: Camera },
  { href: "/portal/comparativas", label: "Progreso", icon: TrendingUp },
  { href: "/portal/documentos", label: "Archivos", icon: FolderOpen },
];

export function PortalNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 flex justify-around border-t border-cream-200 bg-white py-1.5 text-xs">
      {NAV.map((item) => {
        const activo = item.href === "/portal" ? pathname === item.href : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-0.5 rounded-lg px-3 py-1 ${
              activo ? "text-brand-700" : "text-ink-soft"
            }`}
          >
            <item.icon size={20} strokeWidth={activo ? 2.4 : 2} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
