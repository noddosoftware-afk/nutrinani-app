import { redirect } from "next/navigation";
import { getSesionActual } from "@/data/auth";

export default async function RootPage() {
  const sesion = await getSesionActual();
  if (!sesion) redirect("/login");
  redirect(sesion.rol === "paciente" ? "/portal" : "/dashboard");
}
