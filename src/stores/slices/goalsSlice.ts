import type { StateCreator } from "zustand";
import type { Macros, MicroNutrients, FitnessGoals } from "@/types";
import {
  upsertMacroGoals,
  upsertMicroGoals,
  upsertFitnessGoals,
} from "@/features/goals/services/api";
import {
  DEFAULT_MACRO_GOALS,
  DEFAULT_MICRO_GOALS,
  DEFAULT_FITNESS_GOALS,
} from "@/config/constants";

export type GoalsSlice = {
  macroGoals: Macros;
  microNutrientGoals: MicroNutrients;
  fitnessGoals: FitnessGoals;
  hydrateGoals: (
    macroGoals: Macros,
    microNutrientGoals: MicroNutrients,
    fitnessGoals: FitnessGoals,
  ) => void;
  setMacroGoals: (goals: Macros) => void;
  setMicroNutrientGoals: (goals: MicroNutrients) => void;
  setFitnessGoals: (goals: FitnessGoals) => void;
};

type WithUserId = { userId: string | null };

export const createGoalsSlice: StateCreator<
  GoalsSlice & WithUserId,
  [],
  [],
  GoalsSlice
> = (set, get) => ({
  macroGoals: DEFAULT_MACRO_GOALS,
  microNutrientGoals: DEFAULT_MICRO_GOALS,
  fitnessGoals: DEFAULT_FITNESS_GOALS,

  hydrateGoals: (macroGoals, microNutrientGoals, fitnessGoals) =>
    set({ macroGoals, microNutrientGoals, fitnessGoals }),

  setMacroGoals: (goals) => {
    set({ macroGoals: goals });
    const { userId } = get();
    if (userId) upsertMacroGoals(userId, goals);
  },

  setMicroNutrientGoals: (goals) => {
    set({ microNutrientGoals: goals });
    const { userId } = get();
    if (userId) upsertMicroGoals(userId, goals);
  },

  setFitnessGoals: (goals) => {
    set({ fitnessGoals: goals });
    const { userId } = get();
    if (userId) upsertFitnessGoals(userId, goals);
  },
});
