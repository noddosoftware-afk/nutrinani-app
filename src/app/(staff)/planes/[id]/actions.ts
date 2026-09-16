"use server";

import { revalidatePath } from "next/cache";
import { aprobarPlan, publicarPlan } from "@/data/planes";

export async function aprobarPlanAction(id: string) {
  await aprobarPlan(id);
  revalidatePath(`/planes/${id}`);
}

export async function publicarPlanAction(id: string) {
  await publicarPlan(id);
  revalidatePath(`/planes/${id}`);
}
