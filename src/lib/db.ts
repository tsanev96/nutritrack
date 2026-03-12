import { supabase } from "./supabase";
import type {
  Macros,
  MicroNutrients,
  FitnessGoals,
  CheckIn,
  Entry,
  Meal,
  DayLog,
} from "@/types";
import {
  DEFAULT_MACRO_GOALS,
  DEFAULT_MICRO_GOALS,
  DEFAULT_FITNESS_GOALS,
} from "./constants";

// ── Food Logs ──────────────────────────────────────────────────────────────

/**
 * Fetches all food entries for a user and groups them by date and meal type.
 * The DB stores one row per entry (flat). This re-shapes them into:
 * `{ "2024-01-01": { breakfast: [...], lunch: [...], ... } }`
 */
export async function fetchFoodLogs(
  userId: string,
): Promise<Record<string, DayLog>> {
  const { data, error } = await supabase
    .from("food_logs")
    .select("*")
    .eq("user_id", userId);

  if (error) throw error;

  const logs: Record<string, DayLog> = {};
  for (const row of data ?? []) {
    if (!logs[row.date]) {
      logs[row.date] = { breakfast: [], lunch: [], dinner: [], snacks: [] };
    }
    logs[row.date][row.meal_type as Meal].push({
      id: row.id,
      name: row.name,
      calories: row.calories,
      protein: row.protein ?? undefined,
      carbs: row.carbs ?? undefined,
      fats: row.fats ?? undefined,
    });
  }
  return logs;
}

type InsertFoodLogParams = {
  userId: string;
  date: string;
  meal: Meal;
  entry: Entry;
};

/**
 * Inserts a single food entry into the DB.
 * The `entry.id` is a UUID generated client-side via `crypto.randomUUID()`.
 */
export async function insertFoodLog({
  date,
  entry,
  userId,
  meal,
}: InsertFoodLogParams) {
  const { error } = await supabase.from("food_logs").insert({
    id: entry.id,
    user_id: userId,
    date,
    meal_type: meal,
    name: entry.name,
    calories: entry.calories,
    protein: entry.protein ?? null,
    carbs: entry.carbs ?? null,
    fats: entry.fats ?? null,
  });
  if (error) console.error("insertFoodLog:", error.message);
}

/**
 * Deletes a food entry by its ID.
 */
export async function deleteFoodLog(id: string) {
  const { error } = await supabase.from("food_logs").delete().eq("id", id);
  if (error) console.error("deleteFoodLog:", error.message);
}

// ── Macro Goals ────────────────────────────────────────────────────────────

/**
 * Fetches the user's macro goals (protein, carbs, fats).
 * Returns defaults if the user hasn't saved any yet.
 */
export async function fetchMacroGoals(userId: string): Promise<Macros> {
  const { data } = await supabase
    .from("macro_goals")
    .select("protein, carbs, fats")
    .eq("user_id", userId)
    .single();

  return data ?? DEFAULT_MACRO_GOALS;
}

/**
 * Saves the user's macro goals.
 * Upsert = insert on first save, update on every save after.
 * Each user has exactly one row, identified by `user_id`.
 */
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

// ── Micro Nutrient Goals ───────────────────────────────────────────────────

/**
 * Fetches the user's micronutrient goals.
 * The DB stores plain numbers (e.g. `20`). This reconstructs the full typed
 * object with units (e.g. `{ value: 20, unit: "g" }`) using defaults for units.
 * Returns defaults if the user hasn't saved any yet.
 */
export async function fetchMicroGoals(
  userId: string,
): Promise<MicroNutrients> {
  const { data } = await supabase
    .from("micro_nutrient_goals")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (!data) return DEFAULT_MICRO_GOALS;

  const d = DEFAULT_MICRO_GOALS;
  return {
    saturatedFat: { value: data.saturated_fat ?? d.saturatedFat.value, unit: "g" },
    polyunsaturatedFat: { value: data.polyunsaturated_fat ?? d.polyunsaturatedFat.value, unit: "g" },
    monounsaturatedFat: { value: data.monounsaturated_fat ?? d.monounsaturatedFat.value, unit: "g" },
    transFat: { value: data.trans_fat ?? d.transFat.value, unit: "g" },
    fiber: { value: data.fiber ?? d.fiber.value, unit: "g" },
    sugar: { value: data.sugar ?? d.sugar.value, unit: "g" },
    cholesterol: { value: data.cholesterol ?? d.cholesterol.value, unit: "mg" },
    sodium: { value: data.sodium ?? d.sodium.value, unit: "mg" },
    potassium: { value: data.potassium ?? d.potassium.value, unit: "mg" },
    calcium: { value: data.calcium ?? d.calcium.value, unit: "mg" },
    iron: { value: data.iron ?? d.iron.value, unit: "mg" },
    vitaminA: { value: data.vitamin_a ?? d.vitaminA.value, unit: "mcg" },
    vitaminC: { value: data.vitamin_c ?? d.vitaminC.value, unit: "mg" },
    vitaminD: { value: data.vitamin_d ?? d.vitaminD.value, unit: "mcg" },
    vitaminE: { value: data.vitamin_e ?? d.vitaminE.value, unit: "mg" },
    vitaminK: { value: data.vitamin_k ?? d.vitaminK.value, unit: "mcg" },
  };
}

/**
 * Saves the user's micronutrient goals.
 * Maps camelCase TypeScript keys to snake_case DB column names.
 * Only the numeric value is stored — units are fixed per nutrient.
 */
export async function upsertMicroGoals(userId: string, goals: MicroNutrients) {
  const { error } = await supabase.from("micro_nutrient_goals").upsert(
    {
      user_id: userId,
      saturated_fat: goals.saturatedFat.value,
      polyunsaturated_fat: goals.polyunsaturatedFat.value,
      monounsaturated_fat: goals.monounsaturatedFat.value,
      trans_fat: goals.transFat.value,
      fiber: goals.fiber.value,
      sugar: goals.sugar.value,
      cholesterol: goals.cholesterol.value,
      sodium: goals.sodium.value,
      potassium: goals.potassium.value,
      calcium: goals.calcium.value,
      iron: goals.iron.value,
      vitamin_a: goals.vitaminA.value,
      vitamin_c: goals.vitaminC.value,
      vitamin_d: goals.vitaminD.value,
      vitamin_e: goals.vitaminE.value,
      vitamin_k: goals.vitaminK.value,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );
  if (error) console.error("upsertMicroGoals:", error.message);
}

// ── Fitness Goals ──────────────────────────────────────────────────────────

/**
 * Fetches the user's fitness goals (target weight, activity level, weekly goal).
 * Returns defaults if the user hasn't saved any yet.
 */
export async function fetchFitnessGoals(
  userId: string,
): Promise<FitnessGoals> {
  const { data } = await supabase
    .from("fitness_goals")
    .select("target_weight, weight_unit, activity_level, weekly_goal")
    .eq("user_id", userId)
    .single();

  if (!data) return DEFAULT_FITNESS_GOALS;

  return {
    targetWeight: data.target_weight,
    weightUnit: data.weight_unit as "kg" | "lbs",
    activityLevel: data.activity_level as FitnessGoals["activityLevel"],
    weeklyGoal: data.weekly_goal as FitnessGoals["weeklyGoal"],
  };
}

/**
 * Saves the user's fitness goals.
 * Maps camelCase TypeScript keys to snake_case DB column names.
 */
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

// ── Check-ins ──────────────────────────────────────────────────────────────

/**
 * Fetches all check-ins for a user (weight + body measurements per day).
 */
export async function fetchCheckIns(userId: string): Promise<CheckIn[]> {
  const { data, error } = await supabase
    .from("check_ins")
    .select("date, weight, neck, waist, hips")
    .eq("user_id", userId);

  if (error) throw error;

  return (data ?? []).map((row) => ({
    date: row.date,
    weight: row.weight ?? undefined,
    measurements: {
      neck: row.neck ?? undefined,
      waist: row.waist ?? undefined,
      hips: row.hips ?? undefined,
    },
  }));
}

/**
 * Saves a check-in for a given date.
 * If a check-in already exists for that date, it is overwritten.
 * Unique constraint: one check-in per user per day (`user_id, date`).
 */
export async function upsertCheckIn(userId: string, checkIn: CheckIn) {
  const { error } = await supabase.from("check_ins").upsert(
    {
      user_id: userId,
      date: checkIn.date,
      weight: checkIn.weight ?? null,
      neck: checkIn.measurements.neck ?? null,
      waist: checkIn.measurements.waist ?? null,
      hips: checkIn.measurements.hips ?? null,
    },
    { onConflict: "user_id,date" },
  );
  if (error) console.error("upsertCheckIn:", error.message);
}

// ── Bulk fetch ─────────────────────────────────────────────────────────────

/**
 * Fetches all user data in parallel and returns it as a single object
 * ready to be passed directly to the store's `hydrate()` action.
 * To add new data types in the future, add a fetch call here.
 */
export async function fetchAllUserData(userId: string) {
  const [logs, macroGoals, microNutrientGoals, fitnessGoals, checkIns] =
    await Promise.all([
      fetchFoodLogs(userId),
      fetchMacroGoals(userId),
      fetchMicroGoals(userId),
      fetchFitnessGoals(userId),
      fetchCheckIns(userId),
    ]);

  return { logs, macroGoals, microNutrientGoals, fitnessGoals, checkIns };
}
