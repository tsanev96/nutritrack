import { supabase } from "@/lib/supabase";
import type { FitnessGoals, Macros, MicroNutrients } from "@/types";
import {
  DEFAULT_FITNESS_GOALS,
  DEFAULT_MACRO_GOALS,
  DEFAULT_MICRO_GOALS,
  DEFAULT_WATER_GOAL,
} from "@/config/constants";

/** "upsert" = insert if the row doesn't exist, update if it does.
 * The conflict is on user_id — each user has exactly one row. */
export async function upsertMacroGoals(userId: string, goals: Macros) {
  const { error } = await supabase.from("macro_goals").upsert(
    {
      user_id: userId,
      protein: goals.protein,
      carbs: goals.carbs,
      fats: goals.fats,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );
  if (error) console.error("upsertMacroGoals:", error.message);
}

/** Each user has at most one row. If none exists yet, we return the defaults/ */
export async function fetchMacroGoals(userId: string): Promise<Macros> {
  const { data } = await supabase
    .from("macro_goals")
    .select("protein, carbs, fats")
    .eq("user_id", userId)
    .single();

  return data ?? DEFAULT_MACRO_GOALS;
}

/**
 * Fetches the user's fitness goals (target weight, activity level, weekly goal).
 * Returns defaults if the user hasn't saved any yet.
 */
export async function fetchFitnessGoals(userId: string): Promise<FitnessGoals> {
  const { data } = await supabase
    .from("fitness_goals")
    .select("target_weight, weight_unit, activity_level, weekly_goal")
    .eq("user_id", userId)
    .single();

  if (!data) return DEFAULT_FITNESS_GOALS;

  const { activity_level, target_weight, weekly_goal, weight_unit } = data;
  return {
    targetWeight: target_weight,
    weightUnit: weight_unit as "kg" | "lbs",
    activityLevel: activity_level as FitnessGoals["activityLevel"],
    weeklyGoal: weekly_goal as FitnessGoals["weeklyGoal"],
  };
}

export async function upsertFitnessGoals(userId: string, goals: FitnessGoals) {
  const { error } = await supabase.from("fitness_goals").upsert(
    {
      user_id: userId,
      target_weight: goals.targetWeight,
      weight_unit: goals.weightUnit,
      activity_level: goals.activityLevel,
      weekly_goal: goals.weeklyGoal,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );
  if (error) console.error("upsertFitnessGoals:", error.message);
}

/** The DB stores just the numbers (e.g. 20), the TypeScript type stores { value: 20, unit: "g" }.
 * So when we read from DB, we reconstruct the full typed object using defaults for units.
 */
export async function fetchMicroGoals(userId: string): Promise<MicroNutrients> {
  const { data } = await supabase
    .from("micro_nutrient_goals")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (!data) return DEFAULT_MICRO_GOALS;

  const {
    saturated_fat,
    polyunsaturated_fat,
    monounsaturated_fat,
    trans_fat,
    fiber,
    sugar,
    cholesterol,
    sodium,
    potassium,
    calcium,
    iron,
    vitamin_a,
    vitamin_c,
    vitamin_d,
    vitamin_e,
    vitamin_k,
  } = data;

  const d = DEFAULT_MICRO_GOALS;
  return {
    saturatedFat: {
      value: saturated_fat ?? d.saturatedFat.value,
      unit: "g",
    },
    polyunsaturatedFat: {
      value: polyunsaturated_fat ?? d.polyunsaturatedFat.value,
      unit: "g",
    },
    monounsaturatedFat: {
      value: monounsaturated_fat ?? d.monounsaturatedFat.value,
      unit: "g",
    },
    transFat: { value: trans_fat ?? d.transFat.value, unit: "g" },
    fiber: { value: fiber ?? d.fiber.value, unit: "g" },
    sugar: { value: sugar ?? d.sugar.value, unit: "g" },
    cholesterol: { value: cholesterol ?? d.cholesterol.value, unit: "mg" },
    sodium: { value: sodium ?? d.sodium.value, unit: "mg" },
    potassium: { value: potassium ?? d.potassium.value, unit: "mg" },
    calcium: { value: calcium ?? d.calcium.value, unit: "mg" },
    iron: { value: iron ?? d.iron.value, unit: "mg" },
    vitaminA: { value: vitamin_a ?? d.vitaminA.value, unit: "mcg" },
    vitaminC: { value: vitamin_c ?? d.vitaminC.value, unit: "mg" },
    vitaminD: { value: vitamin_d ?? d.vitaminD.value, unit: "mcg" },
    vitaminE: { value: vitamin_e ?? d.vitaminE.value, unit: "mg" },
    vitaminK: { value: vitamin_k ?? d.vitaminK.value, unit: "mcg" },
  };
}

export async function fetchWaterGoal(userId: string): Promise<number> {
  const { data } = await supabase
    .from("water_goals")
    .select("amount_ml")
    .eq("user_id", userId)
    .single();

  return data?.amount_ml ?? DEFAULT_WATER_GOAL;
}

export async function upsertWaterGoal(userId: string, amountMl: number) {
  const { error } = await supabase.from("water_goals").upsert(
    { user_id: userId, amount_ml: amountMl, updated_at: new Date().toISOString() },
    { onConflict: "user_id" },
  );
  if (error) console.error("upsertWaterGoal:", error.message);
}

export async function upsertMicroGoals(userId: string, goals: MicroNutrients) {
  const {
    calcium,
    cholesterol,
    fiber,
    iron,
    monounsaturatedFat,
    polyunsaturatedFat,
    potassium,
    saturatedFat,
    transFat,
    vitaminA,
    vitaminC,
    vitaminD,
    vitaminE,
    vitaminK,
    sugar,
    sodium,
  } = goals;
  const { error } = await supabase.from("micro_nutrient_goals").upsert(
    {
      user_id: userId,
      saturated_fat: saturatedFat.value,
      polyunsaturated_fat: polyunsaturatedFat.value,
      monounsaturated_fat: monounsaturatedFat.value,
      trans_fat: transFat.value,
      fiber: fiber.value,
      sugar: sugar.value,
      cholesterol: cholesterol.value,
      sodium: sodium.value,
      potassium: potassium.value,
      calcium: calcium.value,
      iron: iron.value,
      vitamin_a: vitaminA.value,
      vitamin_c: vitaminC.value,
      vitamin_d: vitaminD.value,
      vitamin_e: vitaminE.value,
      vitamin_k: vitaminK.value,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );
  if (error) console.error("upsertMicroGoals:", error.message);
}
