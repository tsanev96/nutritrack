"use client";

import { useState } from "react";
import { useTrackerStore } from "@/store/useTrackerStore";
import type { MicroNutrients } from "@/types";
import { MICRO_NUTRIENTS_NAMES } from "@/lib/constants";
import Headline from "@/components/common/Headline";

type MicroKey = keyof MicroNutrients;

const GROUPS: { label: string; keys: MicroKey[] }[] = [
  {
    label: "Fats",
    keys: [
      "saturatedFat",
      "polyunsaturatedFat",
      "monounsaturatedFat",
      "transFat",
    ],
  },
  { label: "Carbohydrates", keys: ["fiber", "sugar"] },
  {
    label: "Minerals",
    keys: ["cholesterol", "sodium", "potassium", "calcium", "iron"],
  },
  {
    label: "Vitamins",
    keys: ["vitaminA", "vitaminC", "vitaminD", "vitaminE", "vitaminK"],
  },
];

export default function MicronutrientsSection() {
  const goals = useTrackerStore((s) => s.microNutrientGoals);
  const setGoals = useTrackerStore((s) => s.setMicroNutrientGoals);

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<Record<MicroKey, string>>(
    Object.fromEntries(
      Object.entries(goals).map(([k, v]) => [k, String(v.value)]),
    ) as Record<MicroKey, string>,
  );

  function handleSave() {
    const updated = Object.fromEntries(
      Object.entries(goals).map(([k, v]) => [
        k,
        { value: Number(form[k as MicroKey]) || 0, unit: v.unit },
      ]),
    ) as MicroNutrients;
    setGoals(updated);
    setIsEditing(false);
  }

  function handleCancel() {
    setForm(
      Object.fromEntries(
        Object.entries(goals).map(([k, v]) => [k, String(v.value)]),
      ) as Record<MicroKey, string>,
    );
    setIsEditing(false);
  }

  return (
    <section className="rounded-lg bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <Headline title="Micronutrients" variant="h2" />
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-sm text-blue-600 hover:underline"
          >
            Edit
          </button>
        )}
      </div>

      {GROUPS.map(({ label, keys }) => (
        <div key={label} className="mb-4 last:mb-0">
          <p className="mb-1 text-xs font-semibold text-gray-400">{label}</p>
          {isEditing ? (
            <div className="grid grid-cols-2 gap-2">
              {keys.map((key) => (
                <div key={key}>
                  <label className="mb-0.5 block text-xs text-gray-600">
                    {MICRO_NUTRIENTS_NAMES[key]} ({goals[key].unit})
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={form[key]}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, [key]: e.target.value }))
                    }
                    className="w-full rounded-md border px-2 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}
            </div>
          ) : (
            <ul className="divide-y">
              {keys.map((key) => (
                <li key={key} className="flex justify-between py-1.5 text-sm">
                  <span className="text-gray-500">
                    {MICRO_NUTRIENTS_NAMES[key]}
                  </span>
                  <span className="font-medium text-gray-900">
                    {goals[key].value} {goals[key].unit}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}

      {isEditing && (
        <div className="mt-4 flex gap-2">
          <button
            onClick={handleSave}
            className="flex-1 rounded-md bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Save
          </button>
          <button
            onClick={handleCancel}
            className="flex-1 rounded-md border py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      )}
    </section>
  );
}
