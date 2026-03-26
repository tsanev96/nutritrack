import {
  calcCalories,
  calcTotalNutrients,
  macroGoalsToNutrients,
} from "@/utils/calculateCalories";
import type { Entry, Macros } from "@/types";

describe("calcCalories", () => {
  it("calculates calories from macros", () => {
    expect(calcCalories({ protein: 100, carbs: 200, fats: 50 })).toBe(1650);
  });

  it("returns 0 when all macros are 0", () => {
    expect(calcCalories({ protein: 0, carbs: 0, fats: 0 })).toBe(0);
  });

  it("applies correct multipliers (protein=4, carbs=4, fats=9)", () => {
    expect(calcCalories({ protein: 10, carbs: 0, fats: 0 })).toBe(40);
    expect(calcCalories({ protein: 0, carbs: 10, fats: 0 })).toBe(40);
    expect(calcCalories({ protein: 0, carbs: 0, fats: 10 })).toBe(90);
  });
});

describe("calcTotalNutrients", () => {
  const entries: Entry[] = [
    {
      id: "1",
      name: "Chicken",
      calories: 200,
      protein: 30,
      carbs: 0,
      fats: 5,
      sodium: 100,
      sugar: 0,
    },
    {
      id: "2",
      name: "Rice",
      calories: 150,
      protein: 3,
      carbs: 33,
      fats: 0,
      sodium: 0,
      sugar: 1,
    },
  ];

  it("sums all nutrients across entries", () => {
    const result = calcTotalNutrients(entries);
    expect(result).toEqual({
      calories: 350,
      protein: 33,
      carbs: 33,
      fats: 5,
      sodium: 100,
      sugar: 1,
    });
  });

  it("returns zeros for empty array", () => {
    const result = calcTotalNutrients([]);
    expect(result.calories).toBe(0);
    expect(result.protein).toBe(0);
  });

  it("treats missing optional fields as 0", () => {
    const sparse: Entry[] = [{ id: "1", name: "Apple", calories: 80 }];
    const result = calcTotalNutrients(sparse);
    expect(result.calories).toBe(80);
    expect(result.protein).toBe(0);
    expect(result.sodium).toBe(0);
  });
});

describe("macroGoalsToNutrients", () => {
  const macros: Macros = { protein: 150, carbs: 200, fats: 60 };

  it("maps macro goals to nutrient shape including calculated calories", () => {
    const result = macroGoalsToNutrients(macros);
    expect(result.calories).toBe(calcCalories(macros));
    expect(result.protein).toBe(150);
    expect(result.carbs).toBe(200);
    expect(result.fats).toBe(60);
  });

  it("sets sodium and sugar to null when not provided", () => {
    const result = macroGoalsToNutrients(macros);
    expect(result.sodium).toBeNull();
    expect(result.sugar).toBeNull();
  });
});
