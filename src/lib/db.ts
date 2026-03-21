// This file is the bridge between your app and the Supabase database.
// Every function here does exactly one thing: read or write data for a specific user.
// All functions use the user's ID to ensure they only touch their own data.

import { supabase } from "./supabase";
import type {
  Macros,
  FitnessGoals,
  CheckIn,
  Entry,
  Exercise,
  Meal,
  DayLog,
} from "@/types";
import {
  DEFAULT_MACRO_GOALS,
  DEFAULT_FITNESS_GOALS,
} from "./constants";
import { fetchCheckIns } from "@/features/checkIn/api";
import { fetchMicroGoals } from "@/features/goals/api";

/**  Food logs are stored as flat rows (one row per food entry).
 * We fetch them all and re-group them into { "2024-01-01": { breakfast: [], ... } }
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
      logs[row.date] = {
        breakfast: [],
        lunch: [],
        dinner: [],
        snacks: [],
        exercises: [],
      };
    }
    logs[row.date][row.meal_type as Meal].push({
      id: row.id,
      name: row.name,
      calories: row.calories,
      protein: row.protein ?? undefined,
      carbs: row.carbs ?? undefined,
      fats: row.fats ?? undefined,
      sodium: row.sodium ?? undefined,
      sugar: row.sugar ?? undefined,
    });
  }
  return logs;
}

type UpsertFoodLogParams = {
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
}: UpsertFoodLogParams) {
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
    sodium: entry.sodium ?? null,
    sugar: entry.sugar ?? null,
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

/**
 * Fetches exercise logs for a user, grouped by date.
 */
export async function fetchExerciseLogs(
  userId: string,
): Promise<Record<string, Exercise[]>> {
  const { data, error } = await supabase
    .from("exercise_logs")
    .select("*")
    .eq("user_id", userId);

  if (error) throw error;

  const logs: Record<string, Exercise[]> = {};
  for (const row of data ?? []) {
    if (!logs[row.date]) logs[row.date] = [];
    logs[row.date].push({
      id: row.id,
      name: row.name,
      caloriesBurned: row.calories_burned,
      durationMinutes: row.duration_minutes ?? undefined,
    });
  }
  return logs;
}

export async function insertExerciseLog({
  userId,
  date,
  exercise,
}: {
  userId: string;
  date: string;
  exercise: Exercise;
}) {
  const { error } = await supabase.from("exercise_logs").insert({
    id: exercise.id,
    user_id: userId,
    date,
    name: exercise.name,
    calories_burned: exercise.caloriesBurned,
    duration_minutes: exercise.durationMinutes ?? null,
  });
  if (error) console.error("insertExerciseLog:", error.message);
}

export async function deleteExerciseLog(id: string) {
  const { error } = await supabase.from("exercise_logs").delete().eq("id", id);
  if (error) console.error("deleteExerciseLog:", error.message);
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

export async function upsertWaterIntake(
  userId: string,
  date: string,
  waterMl: number,
) {
  const { error } = await supabase.from("water_intake").upsert(
    {
      user_id: userId,
      date,
      amount_ml: waterMl,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,date" },
  );
  if (error) console.error("upsertWaterIntake:", error.message);
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

/** Fetches all user data in parallel. Used by DataProvider on login.
 * If you ever need to add a new data type, add it here and in DataProvider.
 */
export async function fetchAllUserData(userId: string) {
  const [
    logs,
    macroGoals,
    microNutrientGoals,
    fitnessGoals,
    checkIns,
    exerciseMap,
  ] = await Promise.all([
    fetchFoodLogs(userId),
    fetchMacroGoals(userId),
    fetchMicroGoals(userId),
    fetchFitnessGoals(userId),
    fetchCheckIns(userId),
    fetchExerciseLogs(userId),
  ]);

  // Merge exercise logs into the DayLog structure
  for (const [date, exercises] of Object.entries(exerciseMap)) {
    if (!logs[date]) {
      logs[date] = {
        breakfast: [],
        lunch: [],
        dinner: [],
        snacks: [],
        exercises: [],
      };
    }
    logs[date].exercises = exercises;
  }

  return { logs, macroGoals, microNutrientGoals, fitnessGoals, checkIns };
}
