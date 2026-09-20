"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  FileText,
  Stethoscope,
  Ruler,
  ClipboardList,
  Camera,
  TrendingUp,
  FolderOpen,
  CreditCard,
  type LucideIcon,
} from "lucide-react";

const TABS: { seg: string; label: string; icon: LucideIcon }[] = [
  { seg: "", label: "Resumen", icon: LayoutGrid },
  { seg: "expediente", label: "Expediente", icon: FileText },
  { seg: "consultas", label: "Consultas", icon: Stethoscope },
  { seg: "mediciones", label: "Mediciones", icon: Ruler },
  { seg: "planes", label: "Planes", icon: ClipboardList },
  { seg: "fotografias", label: "Fotografías", icon: Camera },
  { seg: "comparativas", label: "Comparativas", icon: TrendingUp },
  { seg: "documentos", label: "Archivos", icon: FolderOpen },
  { seg: "pagos", label: "Pagos", icon: CreditCard },
];

export function PacienteTabs({ id }: { id: string }) {
  const pathname = usePathname();
  const base = `/pacientes/${id}`;

  return (
    <nav className="flex gap-1 overflow-x-auto border-b border-cream-200 text-sm">
      {TABS.map((tab) => {
        const href = `${base}${tab.seg ? `/${tab.seg}` : ""}`;
        const activo = tab.seg === "" ? pathname === base : pathname.startsWith(href);
        return (
          <Link
            key={tab.seg}
            href={href}
            className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap border-b-2 px-2 pb-2 pt-1 ${
              activo ? "border-brand-700 font-medium text-brand-800" : "border-transparent text-ink-soft hover:text-ink"
            }`}
          >
            <tab.icon size={15} />
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
