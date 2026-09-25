"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  Dumbbell,
  type LucideIcon,
} from "lucide-react";
import { Select } from "@/components/campo";

const TABS: { seg: string; label: string; icon: LucideIcon }[] = [
  { seg: "", label: "Resumen", icon: LayoutGrid },
  { seg: "expediente", label: "Expediente", icon: FileText },
  { seg: "consultas", label: "Consultas", icon: Stethoscope },
  { seg: "mediciones", label: "Mediciones", icon: Ruler },
  { seg: "planes", label: "Planes", icon: ClipboardList },
  { seg: "rutinas", label: "Rutinas", icon: Dumbbell },
  { seg: "fotografias", label: "Fotografías", icon: Camera },
  { seg: "comparativas", label: "Comparativas", icon: TrendingUp },
  { seg: "documentos", label: "Archivos", icon: FolderOpen },
  { seg: "pagos", label: "Pagos", icon: CreditCard },
];

export function PacienteTabs({ id }: { id: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const base = `/pacientes/${id}`;

  const esTabActivo = (seg: string) => {
    const href = `${base}${seg ? `/${seg}` : ""}`;
    return seg === "" ? pathname === base : pathname.startsWith(href);
  };
  const tabActivo = TABS.find((tab) => esTabActivo(tab.seg)) ?? TABS[0];

  return (
    <>
      {/* En pantallas angostas 9 pestañas no caben — un scroll horizontal sin
          ninguna pista visual dejaba Comparativas/Archivos/Pagos invisibles. */}
      <div className="pb-3 md:hidden">
        <Select
          aria-label="Sección del paciente"
          value={tabActivo.seg}
          onChange={(e) => router.push(`${base}${e.target.value ? `/${e.target.value}` : ""}`)}
        >
          {TABS.map((tab) => (
            <option key={tab.seg} value={tab.seg}>
              {tab.label}
            </option>
          ))}
        </Select>
      </div>

      <nav className="hidden gap-1 overflow-x-auto border-b border-cream-200 text-sm md:flex">
        {TABS.map((tab) => {
          const href = `${base}${tab.seg ? `/${tab.seg}` : ""}`;
          const activo = esTabActivo(tab.seg);
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
    </>
  );
}
