import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  TrackerState,
  TrackerActions,
  Meal,
  Entry,
  Macros,
  MicroNutrients,
  FitnessGoals,
} from "@/types";
import {
  DEFAULT_MACRO_GOALS,
  DEFAULT_MICRO_GOALS,
  DEFAULT_FITNESS_GOALS,
  STORAGE_KEY,
} from "@/lib/constants";

const emptyDayLog = (): TrackerState["entries"] => ({
  breakfast: [],
  lunch: [],
  dinner: [],
  snacks: [],
});

export const useTrackerStore = create<TrackerState & TrackerActions>()(
  persist(
    (set) => ({
      entries: emptyDayLog(),
      macroGoals: DEFAULT_MACRO_GOALS,
      microNutrientGoals: DEFAULT_MICRO_GOALS,
      fitnessGoals: DEFAULT_FITNESS_GOALS,

      addEntry: (meal: Meal, entry: Entry) =>
        set((state) => ({
          entries: {
            ...state.entries,
            [meal]: [...state.entries[meal], entry],
          },
        })),

      removeEntry: (meal: Meal, id: string) =>
        set((state) => ({
          entries: {
            ...state.entries,
            [meal]: state.entries[meal].filter((e) => e.id !== id),
          },
        })),

      // setDailyGoal: (goal: number) => set({ dailyGoal: goal }),
      setMacroGoals: (goals: Macros) => set({ macroGoals: goals }),
      setMicroNutrientGoals: (goals: MicroNutrients) =>
        set({ microNutrientGoals: goals }),
      setFitnessGoals: (goals: FitnessGoals) => set({ fitnessGoals: goals }),
    }),
    { name: STORAGE_KEY },
  ),
);
