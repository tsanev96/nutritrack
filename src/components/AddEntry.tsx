"use client";

import { useState } from "react";
import type { Meal } from "@/types";
import { useTrackerStore } from "@/store/useTrackerStore";
import FoodSearch from "./FoodSearch";
import MacroInputs from "./MacroInputs";
import { calcCalories } from "@/utils/calculateCalories";
import { FoodSuggestion } from "@/lib/foodApi";
type Props = Readonly<{
  meal: Meal;
  date: string;
  onClose: () => void;
}>;

export default function AddEntry({ meal, date, onClose }: Props) {
  const addEntry = useTrackerStore((s) => s.addEntry);
  const [foodName, setFoodName] = useState("");
  const [selectedFood, setSelectedFood] = useState<FoodSuggestion | null>(null);
  const [grams, setGrams] = useState(100);
  const [macros, setMacros] = useState({ fats: 0, protein: 0, carbs: 0 });
  const [errors, setErrors] = useState<{ foodName?: string }>({});

  function setMacro(key: keyof typeof macros) {
    return (val: number | string) =>
      setMacros((prev) => ({ ...prev, [key]: Number(val) || 0 }));
  }

  function handleGramsChange(g: number) {
    setGrams(g);
    if (selectedFood) {
      setMacros({
        protein: Math.round((selectedFood.protein * g) / 100),
        carbs: Math.round((selectedFood.carbs * g) / 100),
        fats: Math.round((selectedFood.fats * g) / 100),
      });
    }
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
          addEntry({date, meal, entry:{
            id: String(Date.now()),
            name: foodName.trim(),
            calories: calcCalories(macros),
            fats: macros.fats,
            protein: macros.protein,
            carbs: macros.carbs,
          }});
          onClose();
        }}
      >
        <FoodSearch
          foodName={foodName}
          foodNameError={errors.foodName}
          onFoodChange={(name) => {
            setFoodName(name);
            setSelectedFood(null);
          }}
          onFoodAdd={(food) => {
            setSelectedFood(food);
            setFoodName(food.description);
            setGrams(100);
            setMacros({
              protein: food.protein,
              carbs: food.carbs,
              fats: food.fats,
            });
          }}
        />

        {selectedFood && (
          <div>
            <label
              htmlFor="serving-size"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Serving size (g)
            </label>
            <input
              id="serving-size"
              type="number"
              min={1}
              value={grams}
              onChange={(e) => handleGramsChange(Number(e.target.value) || 1)}
              className="w-full rounded-md border px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        <MacroInputs
          macros={macros}
          onChange={setMacro}
          disabled={!!selectedFood}
        />

        <div className="rounded-md bg-slate-50 px-3 py-2 text-sm text-gray-600">
          Calculated:{" "}
          <span className="font-semibold text-gray-900">
            {calcCalories(macros)} kcal
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
