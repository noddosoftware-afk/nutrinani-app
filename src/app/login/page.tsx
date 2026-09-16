import { LoginForm } from "./login-form";

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const params = await searchParams;
  const next = typeof params.next === "string" ? params.next : "/";

  return (
    <main className="flex flex-1 items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-emerald-800">NutriNani</h1>
          <p className="mt-1 text-sm text-stone-500">Consultorio de nutrición de Daniela</p>
        </div>
        <LoginForm next={next} />
      </div>
    </main>
  );
}
