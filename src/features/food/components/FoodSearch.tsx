"use client";

import { FoodSuggestion, searchFood } from "@/lib/foodApi";
import { useState } from "react";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { calcCalories } from "@/utils/calculateCalories";
import Button from "@/components/ui/Button";
import InputWithButton from "@/components/common/InputWithButton";

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
      <InputWithButton
        id="food-name"
        label="Food name"
        type="text"
        value={foodName}
        onChange={(value: string) => {
          setSuggestions([]);
          setSearchError(null);
          onFoodChange(value);
        }}
        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleSearch();
          }
        }}
        placeholder="e.g. Roasted chicken"
        button={{
          label: searching ? "..." : "Search",
          onClick: () => { handleSearch(); },
          disabled: searching || !foodName.trim(),
        }}
      />

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
