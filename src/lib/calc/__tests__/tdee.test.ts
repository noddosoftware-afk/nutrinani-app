import { describe, expect, it } from "vitest";
import { calcularTDEE } from "../tdee";

describe("calcularTDEE", () => {
  it("aplica el factor de actividad moderada por defecto (1649 × 1.55 = 2556)", () => {
    const r = calcularTDEE({ bmrKcal: 1649, nivelActividad: "moderado" });
    expect(r.valor).toBe(2556);
    expect(r.bloqueado).toBe(false);
  });

  it("permite un factor personalizado y lo advierte", () => {
    const r = calcularTDEE({ bmrKcal: 1649, nivelActividad: "moderado", factorPersonalizado: 1.4 });
    expect(r.valor).toBe(2309); // 1649 * 1.4 = 2308.6 -> 2309
    expect(r.advertencias.some((a) => a.includes("personalizado"))).toBe(true);
  });

  it("bloquea si no hay BMR válido", () => {
    const r = calcularTDEE({ bmrKcal: 0, nivelActividad: "sedentario" });
    expect(r.bloqueado).toBe(true);
  });
});
