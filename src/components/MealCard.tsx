"use client";

import type { Meal } from "@/types";
import { useTrackerStore } from "@/store/useTrackerStore";
import { useState } from "react";
import AddEntry from "./AddEntry";
import { useShallow } from "zustand/shallow";
import Button from "./common/Button";
import TableCaloriesMacros from "./TableCaloriesMacros";

type Props = Readonly<{ meal: Meal; date: string }>;

export default function MealCard({ meal, date }: Props) {
  const [showAddForm, setShowAddForm] = useState(false);
  const entries = useTrackerStore(
    useShallow((s) => s.logs[date]?.[meal] ?? []),
  );
  const removeEntry = useTrackerStore((s) => s.removeEntry);

  if (showAddForm) {
    return (
      <AddEntry meal={meal} date={date} onClose={() => setShowAddForm(false)} />
    );
  }

  return (
    <div className="rounded-lg bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="capitalize font-medium text-gray-400">{meal}</h2>
        <Button
          onClick={() => setShowAddForm(true)}
          className="rounded-md bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
        >
          Add{" "}
        </Button>
      </div>
      <TableCaloriesMacros
        entries={entries}
        onRemoveEntry={(id) => removeEntry({ date, meal, id })}
      />
    </div>
  );
}
