"use client";

import { useState } from "react";
import type { Meal } from "@/types";
import { useTrackerStore } from "@/store/useTrackerStore";
import InputField from "./common/InputField";
import { calcCalories } from "@/utils/calculateCalories";
import { searchFood, type FoodSuggestion } from "@/lib/foodApi";

type Props = Readonly<{
  meal: Meal;
  onClose: () => void;
}>;

export default function AddEntry({ meal, onClose }: Props) {
  const addEntry = useTrackerStore((s) => s.addEntry);
  const [foodName, setFoodName] = useState("");
  const [macros, setMacros] = useState({ fats: 0, protein: 0, carbs: 0 });
  const [errors, setErrors] = useState<{ foodName?: string }>({});
  const [suggestions, setSuggestions] = useState<FoodSuggestion[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const totalCalories = calcCalories(macros);

  function setMacro(key: keyof typeof macros) {
    return (val: number | string) =>
      setMacros((prev) => ({ ...prev, [key]: Number(val) || 0 }));
  }

  async function handleSearch() {
    if (!foodName.trim()) return;
    setSearching(true);
    setSearchError(null);
    setSuggestions([]);
    try {
      const results = await searchFood(foodName.trim());
      if (results.length === 0) {
        setSearchError("No results found");
        return;
      }
      setSuggestions(results);
    } catch {
      setSearchError("Search failed — check your API key in .env.local");
    } finally {
      setSearching(false);
    }
  }

  function applyFood(food: FoodSuggestion) {
    setMacros({ protein: food.protein, carbs: food.carbs, fats: food.fats });
    setSuggestions([]);
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
        {/* Food name + search */}
        <div>
          <label
            htmlFor="food-name"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Food name <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2">
            <input
              id="food-name"
              type="text"
              value={foodName}
              onChange={(e) => {
                setFoodName(e.target.value);
                setSuggestions([]);
                setSearchError(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSearch();
                }
              }}
              placeholder="e.g. Roasted chicken"
              className="min-w-0 flex-1 rounded-md border px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={handleSearch}
              disabled={searching || !foodName.trim()}
              className="shrink-0 rounded-md bg-slate-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-slate-200 disabled:opacity-40"
            >
              {searching ? "..." : "Search"}
            </button>
          </div>
          {errors.foodName && (
            <p className="mt-1 text-xs text-red-500">{errors.foodName}</p>
          )}
          {searchError && (
            <p className="mt-1 text-xs text-red-500">{searchError}</p>
          )}

          {/* Suggestions dropdown */}
          {suggestions.length > 0 && (
            <ul className="mt-1 divide-y rounded-md border bg-white shadow-sm">
              {suggestions.map((food) => (
                <li key={food.fdcId}>
                  <button
                    type="button"
                    onClick={() => applyFood(food)}
                    className="w-full px-3 py-2 text-left hover:bg-slate-50"
                  >
                    <div className="line-clamp-1 text-sm text-gray-800">
                      {food.description}
                    </div>
                    <div className="mt-0.5 text-xs text-gray-400">
                      P {food.protein}g · C {food.carbs}g · F {food.fats}g
                      <span className="ml-2 text-gray-500">
                        ({calcCalories(food)} kcal) per 100g
                      </span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Macro inputs */}
        <div className="grid grid-cols-3 gap-3">
          <InputField
            label="Protein (g)"
            type="number"
            value={macros.protein}
            onChange={setMacro("protein")}
            placeholder="0"
            required={false}
          />
          <InputField
            label="Carbs (g)"
            type="number"
            value={macros.carbs}
            onChange={setMacro("carbs")}
            placeholder="0"
            required={false}
          />
          <InputField
            label="Fat (g)"
            type="number"
            value={macros.fats}
            onChange={setMacro("fats")}
            placeholder="0"
            required={false}
          />
        </div>

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
