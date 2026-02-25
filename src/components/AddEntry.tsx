"use client";

import { useState } from "react";
import type { Meal } from "@/types";
import { useTrackerStore } from "@/store/useTrackerStore";
import { error } from "console";

type Props = Readonly<{
  meal: Meal;
  onClose: () => void;
}>;

export default function AddEntry({ meal, onClose }: Props) {
  const addEntry = useTrackerStore((s) => s.addEntry);
  const [foodName, setFoodName] = useState("");
  const [calories, setCalories] = useState(0);
  const [errors, setErrors] = useState<{
    foodName?: string;
    calories?: string;
  }>({});

  function validate() {
    const next: typeof errors = {};

    if (!foodName.trim()) next.foodName = "Food name is required";

    // todo later automatically for some foods
    if (!calories) errors.calories = "Calories are required";
    else if (Number.isNaN(calories) || calories < 0)
      next.calories = "Calories must be a positive number";

    setErrors(next);
    if (Object.keys(next).length > 0) return false;
    return true;
  }

  return (
    <div className="rounded-lg bg-white p-4 shadow-sm">
      <h2 className="mb-4 capitalize font-medium">Add to {meal}</h2>
      <form
        className="space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          if (!validate()) return;
          addEntry(meal, {
            id: String(Date.now()),
            name: foodName.trim(),
            calories: Number(calories),
          });
          onClose();
        }}
      >
        <div>
          <label
            htmlFor="food-name"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Food name <span className="text-red-500">*</span>
          </label>
          <input
            id="food-name"
            type="text"
            value={foodName}
            onChange={(e) => setFoodName(e.target.value)}
            placeholder="e.g. Chicken breast"
            className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.foodName && (
            <p className="mt-1 text-xs text-red-500">{errors.foodName}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="food-calories"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Calories (kcal) <span className="text-red-500">*</span>
          </label>
          <input
            id="food-calories"
            type="number"
            value={calories}
            onChange={(e) => setCalories(e.target.valueAsNumber)}
            placeholder="e.g. 250"
            min={1}
            className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.calories && (
            <p className="mt-1 text-xs text-red-500">{errors.calories}</p>
          )}
        </div>

        <div className="flex gap-2 pt-1">
          <button
            type="submit"
            className="flex-1 rounded-md bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Save
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-md border py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
