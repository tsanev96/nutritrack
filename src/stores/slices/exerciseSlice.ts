import type { StateCreator } from "zustand";
import type { Exercise } from "@/types";
import { insertExerciseLog, deleteExerciseLog } from "@/features/food/services/api";

export type ExerciseSlice = {
  exerciseLogs: Record<string, Exercise[]>;
  hydrateExercise: (exerciseLogs: Record<string, Exercise[]>) => void;
  addExercise: (args: { date: string; exercise: Exercise }) => void;
  removeExercise: (args: { date: string; id: string }) => void;
};

type WithUserId = { userId: string | null };

export const createExerciseSlice: StateCreator<
  ExerciseSlice & WithUserId,
  [],
  [],
  ExerciseSlice
> = (set, get) => ({
  exerciseLogs: {},

  hydrateExercise: (exerciseLogs) => set({ exerciseLogs }),

  addExercise: ({ date, exercise }) => {
    set((state) => ({
      exerciseLogs: {
        ...state.exerciseLogs,
        [date]: [...(state.exerciseLogs[date] ?? []), exercise],
      },
    }));
    const { userId } = get();
    if (userId) insertExerciseLog({ userId, date, exercise });
  },

  removeExercise: ({ date, id }) => {
    set((state) => ({
      exerciseLogs: {
        ...state.exerciseLogs,
        [date]: (state.exerciseLogs[date] ?? []).filter((e) => e.id !== id),
      },
    }));
    deleteExerciseLog(id);
  },
});
