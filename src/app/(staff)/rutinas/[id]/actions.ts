"use server";

import { revalidatePath } from "next/cache";
import { publicarRutina } from "@/data/rutinas";

export async function publicarRutinaAction(id: string) {
  await publicarRutina(id);
  revalidatePath(`/rutinas/${id}`);
}
