import { MEALS } from "@/config/constants";
import type { TrackerState, TrackerActions } from "@/types";
import { calcCalories } from "@/utils/calculateCalories";

type Store = TrackerState & TrackerActions;

/** How many calories the user's macros goal add up to */
export const selectDailyCalories = (s: Store) => calcCalories(s.macroGoals);

/** How many calories the user has consumed on a given date */
export const selectConsumedCalories = (date: string) => (s: Store) =>
  MEALS.flatMap((meal) => s.logs[date]?.[meal] ?? []).reduce(
    (sum, entry) => sum + entry.calories,
    0,
  );

/** How many calories are left for a given date (can be negative if over goal) */
export const selectRemainingCalories = (date: string) => (s: Store) =>
  selectDailyCalories(s) - selectConsumedCalories(date)(s);
