import { create } from "zustand";
import type {
  TrackerState,
  TrackerActions,
  DayLog,
  Macros,
  MicroNutrients,
  FitnessGoals,
  CheckIn,
  Exercise,
} from "@/types";
import {
  DEFAULT_MACRO_GOALS,
  DEFAULT_MICRO_GOALS,
  DEFAULT_FITNESS_GOALS,
  DEFAULT_WATER_GOAL,
} from "@/lib/constants";
import {
  insertFoodLog,
  deleteFoodLog,
  upsertMacroGoals,
  upsertMicroGoals,
  upsertFitnessGoals,
  upsertCheckIn,
  insertExerciseLog,
  deleteExerciseLog,
  upsertWaterIntake,
} from "@/lib/db";

const emptyDayLog = (): DayLog => ({
  breakfast: [],
  lunch: [],
  dinner: [],
  snacks: [],
  exercises: [],
});

// Each action does two things:
//   1. Updates local state instantly (so the UI feels fast)
//   2. Fires a background write to Supabase (fire-and-forget)
// The background write uses `get()` to read the current userId without
// needing it passed in as an argument every time.
export const useTrackerStore = create<TrackerState & TrackerActions>()(
  (set, get) => ({
    userId: null,
    logs: {},
    macroGoals: DEFAULT_MACRO_GOALS,
    microNutrientGoals: DEFAULT_MICRO_GOALS,
    fitnessGoals: DEFAULT_FITNESS_GOALS,
    checkIns: [],
    waterGoals: DEFAULT_WATER_GOAL,

    setUserId: (userId) => set({ userId }),

    // Called once on login with all data fetched from Supabase
    hydrate: (payload) => set(payload),

    addEntry: ({ date, meal, entry }) => {
      set((state) => {
        const dayLog = state.logs[date] ?? emptyDayLog();
        return {
          logs: {
            ...state.logs,
            [date]: { ...dayLog, [meal]: [...dayLog[meal], entry] },
          },
        };
      });
      const { userId } = get();
      if (userId) insertFoodLog({ userId, date, meal, entry });
    },

    removeEntry: ({ date, meal, id }) => {
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
      });
      deleteFoodLog(id);
    },

    addExercise: ({ date, exercise }) => {
      set((state) => {
        const dayLog = state.logs[date] ?? emptyDayLog();
        return {
          logs: {
            ...state.logs,
            [date]: { ...dayLog, exercises: [...dayLog.exercises, exercise] },
          },
        };
      });
      const { userId } = get();
      if (userId) insertExerciseLog({ userId, date, exercise });
    },

    removeExercise: ({ date, id }) => {
      set((state) => {
        const dayLog = state.logs[date];
        if (!dayLog) return state;
        return {
          logs: {
            ...state.logs,
            [date]: {
              ...dayLog,
              exercises: dayLog.exercises.filter((e) => e.id !== id),
            },
          },
        };
      });
      deleteExerciseLog(id);
    },

    addWaterIntake: ({ date, amount }) => {
      set((state) => {
        const dayLog = state.logs[date] ?? emptyDayLog();
        return {
          logs: {
            ...state.logs,
            [date]: { ...dayLog, water: (dayLog.water ?? 0) + amount },
          },
        };
      });
      const { userId } = get();
      if (userId) upsertWaterIntake(userId, date, amount);
    },

    setMacroGoals: (goals: Macros) => {
      set({ macroGoals: goals });
      const { userId } = get();
      if (userId) upsertMacroGoals(userId, goals);
    },

    setMicroNutrientGoals: (goals: MicroNutrients) => {
      set({ microNutrientGoals: goals });
      const { userId } = get();
      if (userId) upsertMicroGoals(userId, goals);
    },

    setFitnessGoals: (goals: FitnessGoals) => {
      set({ fitnessGoals: goals });
      const { userId } = get();
      if (userId) upsertFitnessGoals(userId, goals);
    },

    setWaterGoals: (ml: number) => {
      set({ waterGoals: ml });
    },

    addCheckIn: (checkIn: CheckIn) => {
      set((state) => ({
        checkIns: [
          ...state.checkIns.filter((c) => c.date !== checkIn.date),
          checkIn,
        ],
      }));
      const { userId } = get();
      if (userId) upsertCheckIn(userId, checkIn);
    },
  }),
);
