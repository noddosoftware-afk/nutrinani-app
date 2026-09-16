import { describe, expect, it } from "vitest";
import { calcularObjetivoEnergetico } from "../energyGoal";

describe("calcularObjetivoEnergetico", () => {
  it("aplica un déficit definido por la nutrióloga con motivo", () => {
    const r = calcularObjetivoEnergetico({
      tdeeKcal: 2556,
      ajusteKcal: -500,
      motivo: "Déficit moderado para pérdida de grasa, acordado con la paciente",
    });
    expect(r.valor).toBe(2056);
    expect(r.bloqueado).toBe(false);
  });

  it("bloquea el ajuste si no tiene motivo documentado", () => {
    const r = calcularObjetivoEnergetico({ tdeeKcal: 2556, ajusteKcal: -500, motivo: "" });
    expect(r.bloqueado).toBe(true);
  });

  it("advierte si el objetivo resultante es demasiado bajo", () => {
    const r = calcularObjetivoEnergetico({
      tdeeKcal: 1800,
      ajusteKcal: -900,
      motivo: "Prueba límite",
    });
    expect(r.bloqueado).toBe(false);
    expect(r.advertencias.some((a) => a.includes("muy bajo"))).toBe(true);
  });
});
