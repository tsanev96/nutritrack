"use client";

import { useState } from "react";
import type { Meal } from "@/types";
import { useTrackerStore } from "@/store/useTrackerStore";
import { calcCalories } from "@/utils/calculateCalories";
import FoodSearch from "./FoodSearch";
import MacroInputs from "./MacroInputs";

type Props = Readonly<{
  meal: Meal;
  onClose: () => void;
}>;

export default function AddEntry({ meal, onClose }: Props) {
  const addEntry = useTrackerStore((s) => s.addEntry);
  const [foodName, setFoodName] = useState("");
  const [macros, setMacros] = useState({ fats: 0, protein: 0, carbs: 0 });
  const [errors, setErrors] = useState<{ foodName?: string }>({});

  const totalCalories = calcCalories(macros);

  function setMacro(key: keyof typeof macros) {
    return (val: number | string) =>
      setMacros((prev) => ({ ...prev, [key]: Number(val) || 0 }));
  }

  function validate() {
    const next: typeof errors = {};
    if (!foodName.trim()) next.foodName = "Food name is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  return (
    <div className="rounded-lg bg-white p-4 shadow-sm">
      <h2 className="mb-4 capitalize font-medium text-gray-700">
        Add to {meal}
      </h2>
      <form
        className="space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          if (!validate()) return;
          addEntry(meal, {
            id: String(Date.now()),
            name: foodName.trim(),
            calories: totalCalories,
            fats: macros.fats,
            protein: macros.protein,
            carbs: macros.carbs,
          });
          onClose();
        }}
      >
        <FoodSearch
          foodName={foodName}
          foodNameError={errors.foodName}
          onFoodChange={setFoodName}
          onFoodAdd={({ carbs, protein, fats }) => {
            setMacros({ protein, carbs, fats });
          }}
        />

        <MacroInputs macros={macros} onChange={setMacro} />

        <div className="rounded-md bg-slate-50 px-3 py-2 text-sm text-gray-600">
          Calculated:{" "}
          <span className="font-semibold text-gray-900">
            {totalCalories} kcal
          </span>
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
