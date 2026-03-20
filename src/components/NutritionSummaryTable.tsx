"use client";

import { useTrackerStore } from "@/store/useTrackerStore";
import {
  calcTotalNutrients,
  macroGoalsToNutrients,
} from "@/utils/calculateCalories";
import { NUTRIENTS, type Nutrient } from "@/types";
import { MEALS } from "@/lib/constants";
import { useShallow } from "zustand/shallow";

type Props = Readonly<{ date: string }>;

const LABELS: Record<Nutrient, string> = {
  calories: "Calories",
  carbs: "Carbs",
  fats: "Fat",
  protein: "Protein",
  sodium: "Sodium",
  sugar: "Sugar",
};

export default function NutritionSummaryTable({ date }: Props) {
  const macroGoals = useTrackerStore((s) => s.macroGoals);
  const entries = useTrackerStore(
    useShallow((s) => MEALS.flatMap((meal) => s.logs[date]?.[meal] ?? [])),
  );

  const totals = calcTotalNutrients(entries);

  const goals = macroGoalsToNutrients(macroGoals);

  const getRemaining = (col: Nutrient): number | null => {
    const goal = goals[col];
    return goal === null ? null : goal - totals[col];
  };

  return (
    <div className="mt-6 overflow-x-auto rounded-lg bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="px-4 py-3 text-left font-medium text-gray-500" />
            {NUTRIENTS.map((col) => (
              <th
                key={col}
                className="px-4 py-3 text-right font-medium text-gray-500"
              >
                {LABELS[col]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-gray-100">
            <td className="px-4 py-3 font-medium text-gray-700">Totals</td>
            {NUTRIENTS.map((col) => (
              <td key={col} className="px-4 py-3 text-right text-gray-800">
                {totals[col]}
              </td>
            ))}
          </tr>
          <tr className="border-b border-gray-100">
            <td className="px-4 py-3 font-medium text-gray-700">Daily Goal</td>
            {NUTRIENTS.map((col) => (
              <td key={col} className="px-4 py-3 text-right text-gray-800">
                {goals[col] ?? "—"}
              </td>
            ))}
          </tr>
          <tr>
            <td className="px-4 py-3 font-medium text-gray-700">Remaining</td>
            {NUTRIENTS.map((col) => {
              const rem = getRemaining(col);
              return (
                <td
                  key={col}
                  className={`px-4 py-3 text-right font-medium ${rem === null || rem >= 0 ? "text-emerald-600" : "text-red-500"}`}
                >
                  {rem ?? "—"}
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
