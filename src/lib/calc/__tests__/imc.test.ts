import { describe, expect, it } from "vitest";
import { calcularIMC } from "../imc";

describe("calcularIMC", () => {
  it("calcula IMC normal para un adulto (referencia manual: 70kg / 1.75m = 22.9)", () => {
    const r = calcularIMC({ pesoKg: 70, tallaCm: 175, edadAnios: 30, poblacion: "adulto" });
    expect(r.bloqueado).toBe(false);
    expect(r.valor?.imc).toBe(22.9);
    expect(r.valor?.categoria).toBe("normal");
  });

  it("clasifica obesidad grado I (referencia: 100kg / 1.70m = 34.6)", () => {
    const r = calcularIMC({ pesoKg: 100, tallaCm: 170, edadAnios: 40, poblacion: "adulto" });
    expect(r.valor?.imc).toBe(34.6);
    expect(r.valor?.categoria).toBe("obesidad_i");
  });

  it("bloquea el cálculo para población menor (no usa categorías de adulto)", () => {
    const r = calcularIMC({ pesoKg: 40, tallaCm: 150, edadAnios: 12, poblacion: "menor" });
    expect(r.bloqueado).toBe(true);
    expect(r.valor).toBeNull();
    expect(r.advertencias.length).toBeGreaterThan(0);
  });

  it("bloquea si faltan datos de peso o talla", () => {
    const r = calcularIMC({ pesoKg: 0, tallaCm: 170, edadAnios: 30, poblacion: "adulto" });
    expect(r.bloqueado).toBe(true);
  });
});
