import type { TrackerState, TrackerActions } from "@/types";
import { calcCalories } from "@/utils/calculateCalories";

type Store = TrackerState & TrackerActions;

/** How many calories the user's macros goal add up to */
export const selectDailyCalories = (s: Store) => calcCalories(s.macroGoals);

/** How many calories the user has actually consumed today */
export const selectConsumedCalories = (s: Store) =>
  Object.values(s.entries)
    .flat()
    .reduce((sum, entry) => sum + entry.calories, 0);

/** How many calories are left for the day (can be negative if over goal) */
export const selectRemainingCalories = (s: Store) =>
  selectDailyCalories(s) - selectConsumedCalories(s);
