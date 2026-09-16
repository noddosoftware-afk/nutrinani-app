import { describe, expect, it } from "vitest";
import { calcularTotalNutrientes, ItemCantidad } from "../foodTotals";

describe("calcularTotalNutrientes", () => {
  it("suma correctamente arroz cocido (150g) + pechuga de pollo cocida (100g)", () => {
    const items: ItemCantidad[] = [
      {
        gramos: 150,
        perfilPor100g: {
          energiaKcal: 130,
          proteinaG: 2.7,
          carbohidratoG: 28,
          grasaG: 0.3,
          fibraG: 0.4,
          sodioMg: 1,
        },
      },
      {
        gramos: 100,
        perfilPor100g: {
          energiaKcal: 165,
          proteinaG: 31,
          carbohidratoG: 0,
          grasaG: 3.6,
          fibraG: 0,
          sodioMg: 74,
        },
      },
    ];
    const r = calcularTotalNutrientes(items);
    expect(r.energiaKcal).toBe(360); // 195 + 165
    expect(r.proteinaG).toBe(35.1); // 4.05 + 31
    expect(r.carbohidratoG).toBe(42);
    expect(r.grasaG).toBe(4.1); // 0.45 + 3.6
    expect(r.sodioMg).toBe(75.5);
    expect(r.nutrientesIncompletos).toHaveLength(0);
  });

  it("distingue un nutriente desconocido de un valor de cero", () => {
    const items: ItemCantidad[] = [
      {
        gramos: 100,
        perfilPor100g: {
          energiaKcal: 100,
          proteinaG: 5,
          carbohidratoG: 10,
          grasaG: 2,
          fibraG: null, // desconocido, distinto de 0
          sodioMg: 0, // sí es cero, conocido
        },
      },
    ];
    const r = calcularTotalNutrientes(items);
    expect(r.fibraG).toBeNull();
    expect(r.sodioMg).toBe(0);
    expect(r.nutrientesIncompletos).toContain("fibraG");
    expect(r.nutrientesIncompletos).not.toContain("sodioMg");
  });
});
