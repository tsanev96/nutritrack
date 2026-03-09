"use client";

import { selectDailyCalories, selectConsumedCalories } from "@/store/selectors";
import { useTrackerStore } from "@/store/useTrackerStore";

export default function DailySummary() {
  const dailyGoal = useTrackerStore(selectDailyCalories);
  const totalCalories = useTrackerStore(selectConsumedCalories);

  const progress = Math.min(100, Math.round((totalCalories / dailyGoal) * 100));

  return (
    <section className="mb-6 rounded-lg bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Today</p>
          <p className="text-lg font-medium">{totalCalories} kcal</p>
        </div>
        <div className="w-1/2">
          <div className="h-3 w-full rounded-full bg-gray-200">
            <div
              className="h-3 rounded-full bg-emerald-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-1 text-right text-sm text-gray-600">{progress}%</p>
        </div>
      </div>
    </section>
  );
}
