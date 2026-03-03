"use client";

import type { Meal } from "@/types";
import { useTrackerStore } from "@/store/useTrackerStore";
import { useState } from "react";
import AddEntry from "./AddEntry";

type Props = Readonly<{ meal: Meal }>;

export default function MealCard({ meal }: Props) {
  const [showAddForm, setShowAddForm] = useState(false);
  const entries = useTrackerStore((s) => s.entries[meal]);
  const removeEntry = useTrackerStore((s) => s.removeEntry);

  if (showAddForm) {
    return <AddEntry meal={meal} onClose={() => setShowAddForm(false)} />;
  }

  return (
    <div className="rounded-lg bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="capitalize font-medium text-gray-400">{meal}</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="rounded-md bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
        >
          Add
        </button>
      </div>
      <ul className="space-y-2">
        {entries.length === 0 && (
          <li className="text-sm text-gray-400">No items</li>
        )}
        {entries.map((e) => (
          <li key={e.id} className="flex items-start justify-between">
            <div>
              <div className="text-sm font-medium text-gray-500">{e.name}</div>
              <div className="text-xs text-gray-500">{e.calories} kcal</div>
              <div className="mt-0.5 flex gap-2 text-xs text-gray-400">
                {e.protein !== undefined && <span>P {e.protein}g</span>}
                {e.carbs !== undefined && <span>C {e.carbs}g</span>}
                {e.fats !== undefined && <span>F {e.fats}g</span>}
              </div>
            </div>
            <button
              onClick={() => removeEntry(meal, e.id)}
              className="text-sm text-red-600 hover:underline"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
