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
      <label htmlFor={name} className="block text-sm font-medium text-stone-700">
        {label}
      </label>
      <div className="mt-1">{children}</div>
    </div>
  );
}

const inputClase =
  "w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500";

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
  const base = "rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50";
  const variantes = {
    primario: "bg-emerald-700 text-white hover:bg-emerald-800",
    secundario: "border border-stone-300 text-stone-700 hover:bg-stone-100",
  };
  return <button {...props} className={`${base} ${variantes[variante]} ${props.className ?? ""}`} />;
}
