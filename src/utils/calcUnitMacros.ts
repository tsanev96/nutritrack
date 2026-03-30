import type { FoodSuggestion } from "@/lib/foodApi";
import { FoodUnit, toBaseAmount } from "@/utils/units";

export function calcUnitMacros(food: FoodSuggestion, quantity: number, unit: FoodUnit) {
  const base = toBaseAmount(quantity, unit);
  return {
    protein: Math.round((food.protein * base) / 100),
    carbs: Math.round((food.carbs * base) / 100),
    fats: Math.round((food.fats * base) / 100),
    calories: Math.round((food.calories * base) / 100),
  };
}
