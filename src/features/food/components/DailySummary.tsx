"use client";

import { selectDailyCalories, selectConsumedCalories, selectRemainingCalories } from "@/stores/selectors";
import { useStore } from "@/stores/useStore";
import { formatDateLabel } from "@/utils/dates";
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from "recharts";

type Props = Readonly<{
  date: string;
}>;

export default function DailySummary({ date }: Props) {
  const dailyGoal = useStore(selectDailyCalories);
  const totalCalories = useStore(selectConsumedCalories(date));
  const remaining = useStore(selectRemainingCalories(date));

  const progress = Math.min(100, Math.round((totalCalories / dailyGoal) * 100));
  const isOver = totalCalories > dailyGoal;
  const fillColor = isOver ? "#ef4444" : "#10b981";

  const chartData = [{ value: progress }];

  return (
    <section className="mb-6 rounded-lg bg-white p-4 shadow-sm">
      <p className="mb-3 text-sm text-gray-500">{formatDateLabel(date)}</p>
      <div className="flex items-center gap-4">
        <div className="relative h-32 w-32 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="70%"
              outerRadius="100%"
              startAngle={90}
              endAngle={-270}
              data={chartData}
            >
              <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
              <RadialBar
                dataKey="value"
                fill={fillColor}
                cornerRadius={8}
                background={{ fill: "#e5e7eb" }}
              />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-bold text-gray-800">{progress}%</span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">Consumed</p>
            <p className="text-xl font-semibold text-gray-800">{totalCalories} <span className="text-sm font-normal text-gray-500">kcal</span></p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">Goal</p>
            <p className="text-base font-medium text-gray-600">{dailyGoal} <span className="text-sm font-normal text-gray-500">kcal</span></p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">{isOver ? "Over by" : "Remaining"}</p>
            <p className={`text-base font-medium ${isOver ? "text-red-500" : "text-emerald-500"}`}>
              {Math.abs(remaining)} <span className="text-sm font-normal">kcal</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
