import Image from "next/image";
import { LoginForm } from "./login-form";
import { Logo } from "@/components/logo";

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const params = await searchParams;
  const next = typeof params.next === "string" ? params.next : "/";

  return (
    <main className="flex flex-1">
      <div className="flex w-full flex-1 flex-col justify-center px-6 py-12 sm:px-12 lg:w-1/2 lg:flex-none xl:px-24">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-10 flex items-center gap-3">
            <Logo size={40} />
            <div>
              <h1 className="font-display text-2xl font-semibold text-brand-900">NutriNani</h1>
              <p className="text-sm text-ink-soft">Consultorio de nutrición de Daniela</p>
            </div>
          </div>
          <LoginForm next={next} />
        </div>
      </div>
      <div className="relative hidden flex-1 lg:block">
        <Image
          src="/brand/hero-login.png"
          alt="Nutrióloga preparando un plan de alimentación saludable"
          fill
          priority
          className="object-cover"
          sizes="50vw"
        />
      </div>
    </main>
  );
}
