import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  TrackerState,
  TrackerActions,
  DayLog,
  Meal,
  Entry,
  Macros,
  MicroNutrients,
  FitnessGoals,
  CheckIn,
} from "@/types";
import {
  DEFAULT_MACRO_GOALS,
  DEFAULT_MICRO_GOALS,
  DEFAULT_FITNESS_GOALS,
  STORAGE_KEY,
} from "@/lib/constants";

const emptyDayLog = (): DayLog => ({
  breakfast: [],
  lunch: [],
  dinner: [],
  snacks: [],
});

export const useTrackerStore = create<TrackerState & TrackerActions>()(
  persist(
    (set) => ({
      logs: {},
      macroGoals: DEFAULT_MACRO_GOALS,
      microNutrientGoals: DEFAULT_MICRO_GOALS,
      fitnessGoals: DEFAULT_FITNESS_GOALS,
      checkIns: [],

      addEntry: ({ date, meal, entry }) =>
        set((state) => {
          const dayLog = state.logs[date] ?? emptyDayLog();
          return {
            logs: {
              ...state.logs,
              [date]: { ...dayLog, [meal]: [...dayLog[meal], entry] },
            },
          };
        }),

      removeEntry: ({ date, meal, id }) =>
        set((state) => {
          const dayLog = state.logs[date];
          if (!dayLog) return state;
          return {
            logs: {
              ...state.logs,
              [date]: {
                ...dayLog,
                [meal]: dayLog[meal].filter((e) => e.id !== id),
              },
            },
          };
        }),

      setMacroGoals: (goals: Macros) => set({ macroGoals: goals }),
      setMicroNutrientGoals: (goals: MicroNutrients) =>
        set({ microNutrientGoals: goals }),
      setFitnessGoals: (goals: FitnessGoals) => set({ fitnessGoals: goals }),
      addCheckIn: (checkIn: CheckIn) =>
        set((state) => ({
          checkIns: [
            ...state.checkIns.filter((c) => c.date !== checkIn.date),
            checkIn,
          ],
        })),
    }),
    {
      name: STORAGE_KEY,
      version: 3,
      migrate: () => ({
        logs: {},
        macroGoals: DEFAULT_MACRO_GOALS,
        microNutrientGoals: DEFAULT_MICRO_GOALS,
        fitnessGoals: DEFAULT_FITNESS_GOALS,
        checkIns: [],
      }),
    },
  ),
);
