import { describe, expect, it } from "vitest";
import { calcularCambio } from "../changeMetrics";

describe("calcularCambio", () => {
  it("calcula cambio absoluto y porcentual normal (80kg → 76kg)", () => {
    const r = calcularCambio(80, 76);
    expect(r.cambioAbsoluto).toBe(-4);
    expect(r.cambioPorcentual).toBe(-5);
    expect(r.nota).toBeNull();
  });

  it("no calcula porcentaje si el valor inicial es 0 (no lo convierte en null->0 ni en 100%)", () => {
    const r = calcularCambio(0, 5);
    expect(r.cambioAbsoluto).toBe(5);
    expect(r.cambioPorcentual).toBeNull();
    expect(r.nota).toContain("0");
  });

  it("no convierte un dato faltante en cero", () => {
    const r = calcularCambio(null, 76);
    expect(r.cambioAbsoluto).toBeNull();
    expect(r.cambioPorcentual).toBeNull();
    expect(r.valorInicial).toBeNull();
    expect(r.nota).not.toBeNull();
  });

  it("maneja ambos valores faltantes", () => {
    const r = calcularCambio(undefined, undefined);
    expect(r.cambioAbsoluto).toBeNull();
    expect(r.nota).not.toBeNull();
  });
});
