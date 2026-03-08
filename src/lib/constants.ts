import type { FitnessGoals, Meal, MicroNutrients } from "@/types";

export const MEALS: Meal[] = ["breakfast", "lunch", "dinner", "snacks"];

export const DEFAULT_DAILY_GOAL = 2000;

export const DEFAULT_MACRO_GOALS = { protein: 150, carbs: 200, fats: 65 };

export const DEFAULT_MICRO_GOALS: MicroNutrients = {
  saturatedFat: { value: 20, unit: "g" },
  polyunsaturatedFat: { value: 11, unit: "g" },
  monounsaturatedFat: { value: 22, unit: "g" },
  transFat: { value: 0, unit: "g" },
  fiber: { value: 25, unit: "g" },
  sugar: { value: 50, unit: "g" },
  cholesterol: { value: 300, unit: "mg" },
  sodium: { value: 2300, unit: "mg" },
  potassium: { value: 4700, unit: "mg" },
  calcium: { value: 1000, unit: "mg" },
  iron: { value: 18, unit: "mg" },
  vitaminA: { value: 900, unit: "mcg" },
  vitaminC: { value: 90, unit: "mg" },
  vitaminD: { value: 20, unit: "mcg" },
  vitaminE: { value: 15, unit: "mg" },
  vitaminK: { value: 120, unit: "mcg" },
};

export const DEFAULT_FITNESS_GOALS: FitnessGoals = {
  targetWeight: 70,
  weightUnit: "kg",
  activityLevel: "moderate",
  weeklyGoal: "maintain",
};

export const STORAGE_KEY = "calorie-tracker-v1";
