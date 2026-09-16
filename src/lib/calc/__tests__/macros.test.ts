import { describe, expect, it } from "vitest";
import { calcularMacros } from "../macros";

describe("calcularMacros", () => {
  it("distribuye 2000 kcal en 30/40/30 correctamente (referencia manual)", () => {
    const r = calcularMacros({
      objetivoKcal: 2000,
      pesoKg: 70,
      porcentajes: { proteina: 30, carbohidrato: 40, grasa: 30 },
    });
    expect(r.bloqueado).toBe(false);
    // proteína: 600 kcal / 4 = 150 g ; 150/70 = 2.14 g/kg
    expect(r.valor?.proteina.gramos).toBe(150);
    expect(r.valor?.proteina.gramosPorKg).toBe(2.14);
    // carbohidrato: 800 kcal / 4 = 200 g ; 200/70 = 2.86 g/kg
    expect(r.valor?.carbohidrato.gramos).toBe(200);
    expect(r.valor?.carbohidrato.gramosPorKg).toBe(2.86);
    // grasa: 600 kcal / 9 = 66.67 g → 67 g ; 66.67/70 = 0.95 g/kg
    expect(r.valor?.grasa.gramos).toBe(67);
    expect(r.valor?.grasa.gramosPorKg).toBe(0.95);
  });

  it("bloquea si los porcentajes no suman 100", () => {
    const r = calcularMacros({
      objetivoKcal: 2000,
      pesoKg: 70,
      porcentajes: { proteina: 30, carbohidrato: 40, grasa: 20 },
    });
    expect(r.bloqueado).toBe(true);
    expect(r.advertencias[0]).toContain("90%");
  });

  it("bloquea sin peso (necesario para g/kg)", () => {
    const r = calcularMacros({
      objetivoKcal: 2000,
      pesoKg: 0,
      porcentajes: { proteina: 30, carbohidrato: 40, grasa: 30 },
    });
    expect(r.bloqueado).toBe(true);
  });
});
