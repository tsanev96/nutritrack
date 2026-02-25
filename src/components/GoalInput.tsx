"use client";

import { useTrackerStore } from "@/store/useTrackerStore";

export default function GoalInput() {
  const dailyGoal = useTrackerStore((s) => s.dailyGoal);
  const setDailyGoal = useTrackerStore((s) => s.setDailyGoal);

  return (
    <label className="flex items-center gap-2 text-sm">
      Goal
      <input
        className="w-24 rounded border px-2 py-1 text-sm"
        type="number"
        value={dailyGoal}
        onChange={(e) => setDailyGoal(Number(e.target.value || 0))}
      />
    </label>
  );
}
