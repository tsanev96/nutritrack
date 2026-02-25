"use client";

import { useTrackerStore } from "@/store/useTrackerStore";

export default function DailySummary() {
  const entries = useTrackerStore((s) => s.entries);
  const dailyGoal = useTrackerStore((s) => s.dailyGoal);

  const totalCalories = Object.values(entries)
    .flat()
    .reduce((sum, e) => sum + (e.calories || 0), 0);

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
