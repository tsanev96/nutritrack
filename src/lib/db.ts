// Fetches all user data in parallel on login.
// Each domain's read/write logic lives in its own feature service:
//   food/exercise/water → src/features/food/services/api.ts
//   goals              → src/features/goals/services/api.ts
//   check-ins          → src/features/checkIn/services/api.ts

import {
  fetchFoodLogs,
  fetchExerciseLogs,
  fetchWaterLogs,
  fetchRecentFoods,
} from "@/features/food/services/api";
import {
  fetchMacroGoals,
  fetchMicroGoals,
  fetchFitnessGoals,
  fetchWaterGoal,
} from "@/features/goals/services/api";
import { fetchCheckIns } from "@/features/checkIn/services/api";

export async function fetchAllUserData(userId: string) {
  const [
    foodLogs,
    exerciseLogs,
    waterLogs,
    recentFoods,
    macroGoals,
    microNutrientGoals,
    fitnessGoals,
    checkIns,
    waterGoal,
  ] = await Promise.all([
    fetchFoodLogs(userId),
    fetchExerciseLogs(userId),
    fetchWaterLogs(userId),
    fetchRecentFoods(userId),
    fetchMacroGoals(userId),
    fetchMicroGoals(userId),
    fetchFitnessGoals(userId),
    fetchCheckIns(userId),
    fetchWaterGoal(userId),
  ]);

  return {
    foodLogs,
    exerciseLogs,
    waterLogs,
    recentFoods,
    macroGoals,
    microNutrientGoals,
    fitnessGoals,
    checkIns,
    waterGoal,
  };
}
