// This file is the bridge between your app and the Supabase database.
// Every function here does exactly one thing: read or write data for a specific user.
// All functions use the user's ID to ensure they only touch their own data.

import { supabase } from "./supabase";
import type { Entry, Exercise, Meal, DayLog } from "@/types";
import { fetchCheckIns } from "@/features/checkIn/services/api";
import {
  fetchFitnessGoals,
  fetchMacroGoals,
  fetchMicroGoals,
} from "@/features/goals/services/api";

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
