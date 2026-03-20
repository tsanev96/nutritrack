import { Entry, Macros } from "@/types";

interface CalcCaloriesInput {
  fats: number;
  protein: number;
  carbs: number;
}

export function calcCalories({ carbs, fats, protein }: CalcCaloriesInput) {
  return fats * 9 + protein * 4 + carbs * 4;
}

export function calcTotalNutrients(entry: Entry[]) {
  return {
    calories: entry.reduce((sum, e) => sum + e.calories, 0),
    carbs: entry.reduce((sum, e) => sum + (e.carbs ?? 0), 0),
    fats: entry.reduce((sum, e) => sum + (e.fats ?? 0), 0),
    protein: entry.reduce((sum, e) => sum + (e.protein ?? 0), 0),
    sodium: entry.reduce((sum, e) => sum + (e.sodium ?? 0), 0),
    sugar: entry.reduce((sum, e) => sum + (e.sugar ?? 0), 0),
  };
}

export function macroGoalsToNutrients(macros: Macros) {
  return {
    calories: calcCalories(macros),
    carbs: macros.carbs,
    fats: macros.fats,
    protein: macros.protein,
    sodium: macros.sodium ?? null,
    sugar: macros.sugar ?? null,
  };
}
