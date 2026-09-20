import { CreditCard } from "lucide-react";
import { listarPagosPaciente } from "@/data/pagos";
import { Campo, Input, Select, Boton } from "@/components/campo";
import { registrarPagoAction } from "./actions";

const METODO_LABEL: Record<string, string> = {
  efectivo: "Efectivo",
  transferencia: "Transferencia",
  tarjeta: "Tarjeta",
  otro: "Otro",
};

export default async function PagosPacientePage({ params }: PageProps<"/pacientes/[id]/pagos">) {
  const { id } = await params;
  const pagos = await listarPagosPaciente(id);
  const total = pagos.reduce((acc, p) => acc + Number(p.monto), 0);
  const registrar = registrarPagoAction.bind(null, id);

  return (
    <div className="max-w-2xl space-y-6">
      <div className="rounded-lg border border-cream-200 bg-white p-4">
        <h2 className="mb-3 text-sm font-semibold text-ink">Registrar pago</h2>
        <p className="mb-3 text-xs text-ink-soft">
          Registro manual — esto no procesa cobros ni tarjetas, solo lleva el control de lo ya recibido.
        </p>
        <form action={registrar} className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Campo label="Concepto" name="concepto" className="col-span-2">
            <Input name="concepto" required placeholder="Consulta de seguimiento" />
          </Campo>
          <Campo label="Monto (MXN)" name="monto">
            <Input name="monto" type="number" step="0.01" min="0" required />
          </Campo>
          <Campo label="Fecha" name="fecha">
            <Input name="fecha" type="date" defaultValue={new Date().toISOString().slice(0, 10)} />
          </Campo>
          <Campo label="Método" name="metodo" className="col-span-2 sm:col-span-4">
            <Select name="metodo" defaultValue="efectivo">
              <option value="efectivo">Efectivo</option>
              <option value="transferencia">Transferencia</option>
              <option value="tarjeta">Tarjeta</option>
              <option value="otro">Otro</option>
            </Select>
          </Campo>
          <div className="col-span-2 sm:col-span-4">
            <Boton type="submit">Registrar pago</Boton>
          </div>
        </form>
      </div>

      <div className="rounded-lg border border-cream-200 bg-white p-4">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-ink">Historial de pagos</h2>
          <span className="text-sm font-semibold text-brand-800">Total: ${total.toLocaleString("es-MX")} MXN</span>
        </div>
        {pagos.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-8 text-center">
            <CreditCard size={24} className="text-ink-soft" />
            <p className="text-sm text-ink-soft">Sin pagos registrados todavía.</p>
          </div>
        ) : (
          <ul className="divide-y divide-cream-100 text-sm">
            {pagos.map((p) => (
              <li key={p.id} className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium text-ink">{p.concepto}</p>
                  <p className="text-xs text-ink-soft">
                    {new Date(p.fecha).toLocaleDateString("es-MX")} · {METODO_LABEL[p.metodo]}
                  </p>
                </div>
                <span className="font-medium text-ink">${Number(p.monto).toLocaleString("es-MX")}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
