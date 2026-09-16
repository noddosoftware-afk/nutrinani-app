import { describe, expect, it } from "vitest";
import { calcularBMR } from "../bmr";

describe("calcularBMR - Mifflin-St Jeor", () => {
  it("hombre, 70kg, 175cm, 30 años → 1649 kcal (cálculo de referencia manual)", () => {
    const r = calcularBMR({
      formula: "mifflin_st_jeor",
      pesoKg: 70,
      tallaCm: 175,
      edadAnios: 30,
      sexo: "masculino",
      poblacion: "adulto",
    });
    // 10*70 + 6.25*175 - 5*30 + 5 = 700 + 1093.75 - 150 + 5 = 1648.75 → 1649
    expect(r.valor).toBe(1649);
    expect(r.bloqueado).toBe(false);
  });

  it("mujer, 60kg, 165cm, 25 años → 1345 kcal (cálculo de referencia manual)", () => {
    const r = calcularBMR({
      formula: "mifflin_st_jeor",
      pesoKg: 60,
      tallaCm: 165,
      edadAnios: 25,
      sexo: "femenino",
      poblacion: "adulto",
    });
    // 10*60 + 6.25*165 - 5*25 - 161 = 600 + 1031.25 - 125 - 161 = 1345.25 → 1345
    expect(r.valor).toBe(1345);
  });
});

describe("calcularBMR - Harris-Benedict revisada", () => {
  it("hombre, 70kg, 175cm, 30 años → 1696 kcal (cálculo de referencia manual)", () => {
    const r = calcularBMR({
      formula: "harris_benedict_revisada",
      pesoKg: 70,
      tallaCm: 175,
      edadAnios: 30,
      sexo: "masculino",
      poblacion: "adulto",
    });
    // 88.362 + 13.397*70 + 4.799*175 - 5.677*30 = 1695.667 → 1696
    expect(r.valor).toBe(1696);
  });

  it("mujer, 60kg, 165cm, 25 años → 1405 kcal (cálculo de referencia manual)", () => {
    const r = calcularBMR({
      formula: "harris_benedict_revisada",
      pesoKg: 60,
      tallaCm: 165,
      edadAnios: 25,
      sexo: "femenino",
      poblacion: "adulto",
    });
    // 447.593 + 9.247*60 + 3.098*165 - 4.33*25 = 1405.333 → 1405
    expect(r.valor).toBe(1405);
  });
});

describe("calcularBMR - reglas de seguridad", () => {
  it("bloquea el cálculo fuera de población adulta", () => {
    const r = calcularBMR({
      formula: "mifflin_st_jeor",
      pesoKg: 30,
      tallaCm: 130,
      edadAnios: 10,
      sexo: "femenino",
      poblacion: "menor",
    });
    expect(r.bloqueado).toBe(true);
    expect(r.valor).toBeNull();
  });

  it("bloquea si faltan datos indispensables", () => {
    const r = calcularBMR({
      formula: "mifflin_st_jeor",
      pesoKg: 0,
      tallaCm: 170,
      edadAnios: 30,
      sexo: "masculino",
      poblacion: "adulto",
    });
    expect(r.bloqueado).toBe(true);
  });
});
