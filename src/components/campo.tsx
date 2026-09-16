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
      <div className="mt-1">{children}</div>
    </div>
  );
}

const inputClase =
  "w-full rounded-lg border border-cream-200 bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-soft/60 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-100 transition-colors";

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
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variante?: "primario" | "secundario" }) {
  const base = "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50";
  const variantes = {
    primario: "bg-brand-700 text-white shadow-sm hover:bg-brand-800",
    secundario: "border border-cream-200 bg-white text-ink hover:bg-cream-100",
  };
  return <button {...props} className={`${base} ${variantes[variante]} ${props.className ?? ""}`} />;
}

export function Tarjeta({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-cream-200 bg-white shadow-[0_1px_2px_rgba(44,38,32,0.04)] ${className ?? ""}`}>
      {children}
    </div>
  );
}
