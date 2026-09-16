import { describe, expect, it } from "vitest";
import { calcularDistribucionPorTiempos } from "../mealDistribution";
import { calcularMacros } from "../macros";

describe("calcularDistribucionPorTiempos", () => {
  it("reparte el total diario entre desayuno/comida/cena según porcentaje", () => {
    const macros = calcularMacros({
      objetivoKcal: 2000,
      pesoKg: 70,
      porcentajes: { proteina: 30, carbohidrato: 40, grasa: 30 },
    });
    const r = calcularDistribucionPorTiempos({
      totales: macros.valor!,
      objetivoKcal: 2000,
      tiempos: [
        { nombre: "Desayuno", porcentaje: 30 },
        { nombre: "Comida", porcentaje: 40 },
        { nombre: "Cena", porcentaje: 30 },
      ],
    });
    expect(r.bloqueado).toBe(false);
    expect(r.valor).toHaveLength(3);
    expect(r.valor?.[0]).toMatchObject({ nombre: "Desayuno", kcal: 600, proteinaG: 45, carbohidratoG: 60 });
    expect(r.valor?.[1]).toMatchObject({ nombre: "Comida", kcal: 800, proteinaG: 60, carbohidratoG: 80 });
  });

  it("bloquea si los porcentajes de los tiempos no suman 100", () => {
    const macros = calcularMacros({
      objetivoKcal: 2000,
      pesoKg: 70,
      porcentajes: { proteina: 30, carbohidrato: 40, grasa: 30 },
    });
    const r = calcularDistribucionPorTiempos({
      totales: macros.valor!,
      objetivoKcal: 2000,
      tiempos: [
        { nombre: "Desayuno", porcentaje: 30 },
        { nombre: "Comida", porcentaje: 40 },
      ],
    });
    expect(r.bloqueado).toBe(true);
  });
});
