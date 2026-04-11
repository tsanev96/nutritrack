import { supabase } from "@/lib/supabase";
import type { Entry, Exercise, Meal } from "@/types";
import type { FoodLogs } from "@/stores/slices/foodSlice";

// ─── Food logs ────────────────────────────────────────────────────────────────

export async function fetchFoodLogs(userId: string): Promise<FoodLogs> {
  const { data, error } = await supabase
    .from("food_logs")
    .select("*")
    .eq("user_id", userId);

  if (error) throw error;

  const logs: FoodLogs = {};
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
      sodium: row.sodium ?? undefined,
      sugar: row.sugar ?? undefined,
    });
  }
  return logs;
}

export async function insertFoodLog({
  userId,
  date,
  meal,
  entry,
}: {
  userId: string;
  date: string;
  meal: Meal;
  entry: Entry;
}) {
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

export async function deleteFoodLog(id: string) {
  const { error } = await supabase.from("food_logs").delete().eq("id", id);
  if (error) console.error("deleteFoodLog:", error.message);
}

export async function fetchRecentFoods(userId: string): Promise<Entry[]> {
  const { data, error } = await supabase
    .from("recent_foods")
    .select("*")
    .eq("user_id", userId)
    .order("added_at", { ascending: false })
    .limit(20);

  if (error) throw error;

  return (data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    calories: row.calories,
    protein: row.protein ?? undefined,
    carbs: row.carbs ?? undefined,
    fats: row.fats ?? undefined,
    sodium: row.sodium ?? undefined,
    sugar: row.sugar ?? undefined,
  }));
}

export async function upsertRecentFood(userId: string, entry: Entry) {
  const { error } = await supabase.from("recent_foods").upsert(
    {
      user_id: userId,
      name: entry.name,
      calories: entry.calories,
      protein: entry.protein ?? null,
      carbs: entry.carbs ?? null,
      fats: entry.fats ?? null,
      sodium: entry.sodium ?? null,
      sugar: entry.sugar ?? null,
      added_at: new Date().toISOString(),
    },
    { onConflict: "user_id,name" },
  );
  if (error) console.error("upsertRecentFood:", error.message);
}

// ─── Exercise logs ────────────────────────────────────────────────────────────

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

// ─── Water intake ─────────────────────────────────────────────────────────────

export async function fetchWaterLogs(
  userId: string,
): Promise<Record<string, number>> {
  const { data, error } = await supabase
    .from("water_intake")
    .select("date, amount_ml")
    .eq("user_id", userId);

  if (error) throw error;

  return Object.fromEntries(
    (data ?? []).map((row) => [row.date, row.amount_ml]),
  );
}

export async function upsertWaterIntake(
  userId: string,
  date: string,
  totalMl: number,
) {
  const { error } = await supabase.from("water_intake").upsert(
    {
      user_id: userId,
      date,
      amount_ml: totalMl,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,date" },
  );
  if (error) console.error("upsertWaterIntake:", error.message);
}
