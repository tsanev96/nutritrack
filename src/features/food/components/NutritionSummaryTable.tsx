"use client";

import { useTrackerStore } from "@/stores/useTrackerStore";
import {
  calcTotalNutrients,
  macroGoalsToNutrients,
} from "@/utils/calculateCalories";
import { NUTRIENTS, type Nutrient } from "@/types";
import { MEALS } from "@/config/constants";
import { useShallow } from "zustand/shallow";
import Table from "@/components/Table";

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

  const headers = ["", ...NUTRIENTS.map((col) => LABELS[col])];
  const columnAlignments: ("left" | "right")[] = ["left", ...NUTRIENTS.map(() => "right" as const)];

  const rows = [
    ["Totals", ...NUTRIENTS.map((col) => totals[col].toString())],
    ["Daily Goal", ...NUTRIENTS.map((col) => (goals[col] ?? "—").toString())],
    [
      "Remaining",
      ...NUTRIENTS.map((col) => {
        const rem = getRemaining(col);
        return (
          <span key={col} className={rem === null || rem >= 0 ? "text-emerald-600" : "text-red-500"}>
            {rem ?? "—"}
          </span>
        );
      }),
    ],
  ];

  return (
    <div className="mt-6 overflow-x-auto rounded-lg bg-white shadow-sm">
      <Table
        headers={headers}
        rows={rows}
        getRowKey={(_, index) => index}
        columnAlignments={columnAlignments}
      />
    </div>
  );
}
