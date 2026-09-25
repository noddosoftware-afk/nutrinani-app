import type { ReactNode } from "react";

export function Campo({
  label,
  name,
  children,
  className,
}: {
  label: string;
  name?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={name} className="block text-sm font-medium text-ink-soft">
        {label}
      </label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

const inputClase =
  "w-full rounded-xl border border-cream-200 bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-soft/60 focus:border-brand-600 focus:outline-none focus:ring-4 focus:ring-brand-100/60 transition-colors";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={inputClase + " " + (props.className ?? "")} />;
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={inputClase + " " + (props.className ?? "")} />;
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={inputClase + " " + (props.className ?? "")} />;
}

export function Boton({
  variante = "primario",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variante?: "primario" | "secundario" | "suave" | "peligro";
}) {
  const base =
    "inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors duration-200 disabled:opacity-50 disabled:pointer-events-none";
  const variantes = {
    primario: "bg-brand-700 text-white shadow-soft hover:bg-brand-800",
    secundario: "border border-brand-400/60 bg-white text-ink hover:bg-brand-50",
    suave: "bg-cream-100 text-ink hover:bg-brand-50",
    peligro: "bg-white border border-red-200 text-red-700 hover:bg-red-50",
  };
  return <button {...props} className={`${base} ${variantes[variante]} ${props.className ?? ""}`} />;
}

export function Tarjeta({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={`shadow-soft rounded-2xl border border-cream-200 bg-white ${className ?? ""}`}>{children}</div>
  );
}

export function Badge({
  children,
  tono = "neutro",
  className,
}: {
  children: ReactNode;
  tono?: "neutro" | "activo" | "alerta" | "peligro";
  className?: string;
}) {
  const tonos = {
    neutro: "bg-cream-100 text-ink-soft",
    activo: "bg-brand-50 text-brand-800",
    alerta: "bg-amber-50 text-amber-800",
    peligro: "bg-red-50 text-red-700",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${tonos[tono]} ${className ?? ""}`}>
      {children}
    </span>
  );
}

export function Avatar({ nombre, size = 40 }: { nombre: string; size?: number }) {
  const iniciales = nombre
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
  return (
    <div
      style={{ width: size, height: size, fontSize: size * 0.36 }}
      className="flex shrink-0 items-center justify-center rounded-full bg-brand-100 font-display font-semibold text-brand-800"
    >
      {iniciales || "?"}
    </div>
  );
}

export function EstadoVacio({
  icon: Icon,
  titulo,
  descripcion,
  accion,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  titulo: string;
  descripcion?: string;
  accion?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-cream-200 bg-white py-14 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-700">
        <Icon size={22} />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium text-ink">{titulo}</p>
        {descripcion && <p className="mx-auto max-w-xs text-sm text-ink-soft">{descripcion}</p>}
      </div>
      {accion}
    </div>
  );
}
