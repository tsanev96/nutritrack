import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { TrackerState, TrackerActions, Meal, Entry } from "@/types";
import { DEFAULT_DAILY_GOAL, STORAGE_KEY } from "@/lib/constants";

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
      dailyGoal: DEFAULT_DAILY_GOAL,

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
            [meal]: state.entries[meal].filter((e) => e.id != id),
          },
        })),
      setDailyGoal: (goal: number) => set({ dailyGoal: goal }),
    }),
    {
      name: STORAGE_KEY,
    },
  ),
);

/*


set((state) => ({
          entries: {
            ...state.entries,
            [meal]: state.entries[meal].filter((e) => e.id !== id),
          },
        }))
*/
