import { MEALS } from "@/config/constants";
import { calcCalories } from "@/utils/calculateCalories";
import type { Macros, Entry } from "@/types";
import type { FoodLogs } from "./slices/foodSlice";

export const selectDailyCalories = (s: { macroGoals: Macros }) =>
  calcCalories(s.macroGoals);

export const selectConsumedCalories =
  (date: string) => (s: { foodLogs: FoodLogs }) =>
    MEALS.flatMap((meal) => s.foodLogs[date]?.[meal] ?? []).reduce(
      (sum: number, entry: Entry) => sum + entry.calories,
      0,
    );

export const selectRemainingCalories =
  (date: string) =>
  (s: { macroGoals: Macros; foodLogs: FoodLogs }): number => {
    const daily = calcCalories(s.macroGoals);
    const consumed = MEALS.flatMap(
      (meal) => s.foodLogs[date]?.[meal] ?? [],
    ).reduce((sum: number, entry: Entry) => sum + entry.calories, 0);
    return daily - consumed;
  };
