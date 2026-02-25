"use client";

import type { Meal } from "@/types";
import { useTrackerStore } from "@/store/useTrackerStore";

type Props = {
  meal: Meal;
};

export default function MealCard({ meal }: Props) {
  const entries = useTrackerStore((s) => s.entries[meal]);
  const addEntry = useTrackerStore((s) => s.addEntry);
  const removeEntry = useTrackerStore((s) => s.removeEntry);

  function handleAdd() {
    const name = window.prompt(`Add ${meal} — food name`);
    if (!name) return;
    const calRaw = window.prompt("Calories (number)");
    if (!calRaw) return;
    const calories = Number(calRaw);
    if (Number.isNaN(calories)) return alert("Invalid calories");
    addEntry(meal, { id: String(Date.now()), name, calories });
  }

  return (
    <div className="rounded-lg bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="capitalize font-medium">{meal}</h2>
        <button
          onClick={handleAdd}
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
          <li key={e.id} className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">{e.name}</div>
              <div className="text-xs text-gray-500">{e.calories} kcal</div>
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
