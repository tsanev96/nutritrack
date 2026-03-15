"use client";

import { FoodSuggestion, searchFood } from "@/lib/foodApi";
import { useState } from "react";
import ErrorMessage from "./common/ErrorMessage";
import { calcCalories } from "@/utils/calculateCalories";
import Button from "./common/Button";

type Props = Readonly<{
  foodName: string;
  foodNameError?: string;
  onFoodChange: (name: string) => void;
  onFoodAdd: (food: FoodSuggestion) => void;
}>;

export default function FoodSearch({
  foodName,
  foodNameError,
  onFoodChange,
  onFoodAdd,
}: Props) {
  const [suggestions, setSuggestions] = useState<FoodSuggestion[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  async function handleSearch() {
    // todo new search should clear previous suggestions and errors
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

  return (
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
            setSuggestions([]);
            setSearchError(null);
            onFoodChange(e.target.value);
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
        <Button
          onClick={handleSearch}
          disabled={searching || !foodName.trim()}
          className={`${searching || !foodName.trim() ? "cursor-none opacity-50" : ""}`}
        >
          {searching ? "..." : "Search"}
        </Button>
      </div>

      <ErrorMessage message={foodNameError} />
      <ErrorMessage message={searchError} />

      <div>
        {suggestions.length > 0 && (
          <ul className="mt-1 divide-y rounded-md border bg-white shadow-sm">
            {suggestions.map((food) => (
              <li key={food.fdcId}>
                <Button
                  onClick={() => {
                    onFoodAdd(food);
                    setSuggestions([]);
                  }}
                  variant="ghost"
                  className="w-full px-3 py-2 text-left hover:bg-slate-50"
                >
                  <div className="line-clamp-1 text-sm text-gray-800">
                    {food.description}
                  </div>
                  <div className="mt-0.5 text-xs text-gray-400">
                    P {food.protein}g · C {food.carbs}g · F {food.fats}g
                    <span className="ml-2 text-gray-500">
                      {calcCalories(food)} kcal per 100g
                    </span>
                  </div>
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
