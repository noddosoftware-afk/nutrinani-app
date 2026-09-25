import { Dumbbell } from "lucide-react";

/** Loop silencioso corto (mp4, generado con Higgsfield) — visualmente actúa como un GIF
 * pero pesa menos y se ve más nítido que un GIF real. */
export function EjercicioVideo({ src, alt, className }: { src: string | null; alt: string; className?: string }) {
  if (!src) {
    return (
      <div className={`flex items-center justify-center bg-cream-100 text-ink-soft/50 ${className ?? ""}`}>
        <Dumbbell size={28} />
      </div>
    );
  }
  return (
    <video
      src={src}
      autoPlay
      loop
      muted
      playsInline
      aria-label={alt}
      className={`object-cover ${className ?? ""}`}
    />
  );
}
