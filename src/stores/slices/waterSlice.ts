import type { StateCreator } from "zustand";
import { upsertWaterIntake } from "@/features/food/services/api";
import { upsertWaterGoal } from "@/features/goals/services/api";
import { DEFAULT_WATER_GOAL } from "@/config/constants";

export type WaterSlice = {
  /** date (YYYY-MM-DD) → total ml consumed */
  waterLogs: Record<string, number>;
  waterGoal: number;
  hydrateWater: (waterLogs: Record<string, number>, waterGoal: number) => void;
  addWaterIntake: (args: { date: string; amount: number }) => void;
  setWaterGoal: (ml: number) => void;
};

type WithUserId = { userId: string | null };

export const createWaterSlice: StateCreator<
  WaterSlice & WithUserId,
  [],
  [],
  WaterSlice
> = (set, get) => ({
  waterLogs: {},
  waterGoal: DEFAULT_WATER_GOAL,

  hydrateWater: (waterLogs, waterGoal) => set({ waterLogs, waterGoal }),

  addWaterIntake: ({ date, amount }) => {
    const newTotal = (get().waterLogs[date] ?? 0) + amount;
    set((state) => ({
      waterLogs: { ...state.waterLogs, [date]: newTotal },
    }));
    const { userId } = get();
    if (userId) upsertWaterIntake(userId, date, newTotal);
  },

  setWaterGoal: (ml) => {
    set({ waterGoal: ml });
    const { userId } = get();
    if (userId) upsertWaterGoal(userId, ml);
  },
});
