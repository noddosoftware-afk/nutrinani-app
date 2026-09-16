import { renderToBuffer } from "@react-pdf/renderer";
import { obtenerPlanCompleto } from "@/data/planes";
import { PlanPDF } from "./documento";

export async function GET(_request: Request, ctx: RouteContext<"/planes/[id]/pdf">) {
  const { id } = await ctx.params;
  const plan = await obtenerPlanCompleto(id);
  const buffer = await renderToBuffer(PlanPDF({ plan }));

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="plan-${plan.id}.pdf"`,
    },
  });
}
