import { LoginForm } from "./login-form";
import { Logo } from "@/components/logo";

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const params = await searchParams;
  const next = typeof params.next === "string" ? params.next : "/";

  return (
    <main className="flex min-h-full flex-1 flex-col lg:flex-row">
      {/* Panel de marca — 55% en escritorio */}
      <div className="relative flex flex-col justify-between overflow-hidden bg-brand-900 px-8 py-10 text-cream sm:px-14 sm:py-14 lg:w-[55%] lg:px-20 lg:py-16">
        <BotanicoDecorativo />

        <div className="relative flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20">
            <Logo size={24} />
          </div>
          <span className="font-display text-lg tracking-wide">NutriNani</span>
        </div>

        <div className="relative max-w-md py-12 lg:py-0">
          <p className="mb-3 text-sm uppercase tracking-[0.25em] text-brand-100/80">Consultorio privado</p>
          <h1 className="font-display text-4xl italic leading-tight text-white sm:text-5xl">Bienvenida</h1>
          <p className="mt-5 text-base leading-relaxed text-cream/80">
            Gestiona tus pacientes, consultas y planes nutricionales desde un solo lugar.
          </p>
        </div>

        <div className="relative">
          <p className="font-display text-xl italic text-white">Daniela Balandran</p>
          <p className="text-sm text-brand-100/70">Nutrióloga</p>
        </div>
      </div>

      {/* Panel de acceso — 45% en escritorio */}
      <div className="flex flex-1 items-center justify-center px-6 py-14 sm:px-12 lg:w-[45%] lg:px-16">
        <div className="w-full max-w-sm">
          <div className="mb-10 lg:hidden">
            <div className="mb-6 flex items-center gap-2.5">
              <Logo size={30} />
              <span className="font-display text-lg font-semibold text-brand-900">NutriNani</span>
            </div>
            <h1 className="font-display text-3xl italic text-brand-900">Bienvenida</h1>
          </div>
          <div className="hidden lg:block">
            <p className="mb-1 text-sm font-medium text-ink-soft">Inicia sesión</p>
            <h2 className="font-display text-2xl text-ink">Accede a tu consultorio</h2>
          </div>

          <div className="mt-8">
            <LoginForm next={next} />
          </div>
        </div>
      </div>
    </main>
  );
}

/** Trazos botánicos abstractos, extremadamente sutiles — sin fotografías, solo líneas. */
function BotanicoDecorativo() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute -right-24 -top-24 h-[480px] w-[480px] text-brand-100/10 lg:-right-16 lg:top-1/2 lg:-translate-y-1/2"
      viewBox="0 0 400 400"
      fill="none"
    >
      <path
        d="M200 40C170 110 90 130 60 200C90 270 170 290 200 360C230 290 310 270 340 200C310 130 230 110 200 40Z"
        stroke="currentColor"
        strokeWidth="1"
      />
      <path d="M200 40V360" stroke="currentColor" strokeWidth="1" />
      <path d="M200 120C220 140 240 150 260 150" stroke="currentColor" strokeWidth="1" />
      <path d="M200 160C180 180 160 190 140 190" stroke="currentColor" strokeWidth="1" />
      <path d="M200 220C220 240 240 250 260 250" stroke="currentColor" strokeWidth="1" />
      <path d="M200 280C180 300 160 310 140 310" stroke="currentColor" strokeWidth="1" />
      <circle cx="200" cy="200" r="150" stroke="currentColor" strokeWidth="1" opacity="0.5" />
    </svg>
  );
}
