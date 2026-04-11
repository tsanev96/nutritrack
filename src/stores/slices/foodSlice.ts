import type { StateCreator } from "zustand";
import type { Entry, Meal } from "@/types";
import { insertFoodLog, deleteFoodLog, upsertRecentFood } from "@/features/food/services/api";

export type FoodLogs = Record<string, Record<Meal, Entry[]>>;

export type FoodSlice = {
  foodLogs: FoodLogs;
  recentFoods: Entry[];
  hydrateFood: (foodLogs: FoodLogs, recentFoods: Entry[]) => void;
  addEntry: (args: { date: string; meal: Meal; entry: Entry }) => void;
  removeEntry: (args: { date: string; meal: Meal; id: string }) => void;
};

type WithUserId = { userId: string | null };

const emptyMeals = (): Record<Meal, Entry[]> => ({
  breakfast: [],
  lunch: [],
  dinner: [],
  snacks: [],
});

export const createFoodSlice: StateCreator<
  FoodSlice & WithUserId,
  [],
  [],
  FoodSlice
> = (set, get) => ({
  foodLogs: {},
  recentFoods: [],

  hydrateFood: (foodLogs, recentFoods) => set({ foodLogs, recentFoods }),

  addEntry: ({ date, meal, entry }) => {
    set((state) => {
      const dayMeals = state.foodLogs[date] ?? emptyMeals();
      const recentFoods = [
        entry,
        ...state.recentFoods.filter((f) => f.name !== entry.name),
      ].slice(0, 30);
      return {
        foodLogs: {
          ...state.foodLogs,
          [date]: { ...dayMeals, [meal]: [...(dayMeals[meal] ?? []), entry] },
        },
        recentFoods,
      };
    });
    const { userId } = get();
    if (userId) {
      insertFoodLog({ userId, date, meal, entry });
      upsertRecentFood(userId, entry);
    }
  },

  removeEntry: ({ date, meal, id }) => {
    set((state) => {
      const dayMeals = state.foodLogs[date];
      if (!dayMeals) return state;
      return {
        foodLogs: {
          ...state.foodLogs,
          [date]: { ...dayMeals, [meal]: dayMeals[meal].filter((e) => e.id !== id) },
        },
      };
    });
    deleteFoodLog(id);
  },
});
