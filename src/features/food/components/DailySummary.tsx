"use client";

import { selectDailyCalories, selectConsumedCalories } from "@/stores/selectors";
import { useStore } from "@/stores/useStore";
import { formatDateLabel } from "@/utils/dates";

type Props = Readonly<{
  date: string;
}>;

export default function DailySummary({ date }: Props) {
  const dailyGoal = useStore(selectDailyCalories);
  const totalCalories = useStore(selectConsumedCalories(date));

  const progress = Math.min(100, Math.round((totalCalories / dailyGoal) * 100));

  return (
    <section className="mb-6 rounded-lg bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-700">{formatDateLabel(date)}</p>
          <p className="text-lg font-medium text-gray-600">
            {totalCalories} kcal
          </p>
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
