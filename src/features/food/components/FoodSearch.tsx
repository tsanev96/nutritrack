"use client";

import { FoodSuggestion, searchFood, searchFoodByBarcode } from "@/lib/foodApi";
import { useState } from "react";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { Button } from "@/components/ui/button";
import IconButton from "@/components/ui/IconButton";
import InputWithButton from "@/components/common/InputWithButton";
import Span from "@/components/ui/Span";
import { InformationCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { getNutrientSections } from "@/utils/foodNutrients";
import Paragraph from "@/components/ui/Paragraph";

type Props = Readonly<{
  foodName: string;
  foodNameError?: string;
  onFoodChange: (name: string) => void;
  onFoodAdd: (food: FoodSuggestion) => void;
}>;

function FoodInfoModal({
  food,
  onClose,
}: Readonly<{ food: FoodSuggestion; onClose: () => void }>) {
  const sections = getNutrientSections(food);

  return (
    <dialog
      open
      className="fixed inset-0 z-50 m-0 flex h-full w-full items-center justify-center bg-black/40 p-4"
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
    >
      <div className="w-full max-w-sm rounded-lg bg-white p-5 shadow-xl">
        <div className="mb-3 flex items-start justify-between">
          <div>
            <Paragraph>{food.description}</Paragraph>
            <Paragraph>{food.brandName}</Paragraph>
            {food.householdServing && (
              <Paragraph>
                Serving: {food.householdServing}
                {food.servingSize
                  ? ` (${food.servingSize}${food.servingSizeUnit})`
                  : ""}
              </Paragraph>
            )}
          </div>
          <IconButton onClick={onClose} ariaLabel="close information dialog">
            <XMarkIcon />
          </IconButton>
        </div>

        <div className="space-y-3 text-xs text-gray-600">
          <div className="flex justify-between border-b pb-2">
            <Span>Calories</Span>
            <Span>{food.calories} kcal per serving</Span>
          </div>

          {sections.map(({ title, rows }) => {
            const visible = rows.filter((r) => r.value != null);
            if (visible.length === 0) return null;
            return (
              <div key={title}>
                <Paragraph variant="sm">{title}</Paragraph>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                  {visible.map((r) => (
                    <Row
                      key={r.label}
                      label={r.label}
                      value={r.value}
                      unit={r.unit}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </dialog>
  );
}

function Row({
  label,
  value,
  unit,
}: Readonly<{ label: string; value?: number; unit: string }>) {
  if (value == null) return null;
  return (
    <>
      <span className="text-gray-500">{label}</span>
      <span className="text-right font-medium text-gray-700">
        {value}
        {unit}
      </span>
    </>
  );
}

type SearchMode = "name" | "barcode";

export default function FoodSearch({
  foodName,
  foodNameError,
  onFoodChange,
  onFoodAdd,
}: Props) {
  const [suggestions, setSuggestions] = useState<FoodSuggestion[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [expandedFood, setExpandedFood] = useState<FoodSuggestion | null>(null);
  const [mode, setMode] = useState<SearchMode>("name");

  async function handleSearch() {
    if (!foodName.trim()) return;
    setSearching(true);
    setSearchError(null);
    setSuggestions([]);
    try {
      const results = await (mode === "barcode"
        ? searchFoodByBarcode(foodName.trim())
        : searchFood(foodName.trim()));
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

  function handleModeChange(next: SearchMode) {
    setMode(next);
    onFoodChange("");
    setSuggestions([]);
    setSearchError(null);
  }

  return (
    <div>
      <div className="mb-2 flex gap-3 text-sm">
        {(["name", "barcode"] as SearchMode[]).map((m) => (
          <Button
            key={m}
            onClick={() => handleModeChange(m)}
            className={`capitalize ${mode === m ? "font-semibold text-primary underline" : "text-gray-400"}`}
            variant="link"
          >
            {m}
          </Button>
        ))}
      </div>

      <InputWithButton
        id="food-name"
        type={mode === "barcode" ? "number" : "text"}
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
        placeholder={
          mode === "barcode" ? "e.g. 012345678901" : "e.g. Roasted chicken"
        }
        button={{
          label: searching ? "..." : "Search",
          onClick: () => {
            handleSearch();
          },
          disabled: searching || !foodName.trim(),
        }}
      />

      <ErrorMessage message={foodNameError} />
      <ErrorMessage message={searchError} />

      {suggestions.length > 0 && (
        <ul className="mt-1 divide-y rounded-md border bg-white shadow-sm">
          {suggestions.map((food) => (
            <li key={food.fdcId} className="flex items-center">
              <Button
                onClick={() => {
                  onFoodAdd(food);
                  setSuggestions([]);
                }}
                variant="ghost"
                className="min-w-0 flex-1 px-3 py-2 text-left hover:bg-slate-50"
              >
                <div className="mt-0.5 text-xs text-gray-400">
                  <Span>{food.brandName} </Span>
                  <Span>
                    {food.protein == null ? undefined : `p${food.protein}g`}
                  </Span>{" "}
                  <Span>
                    {food.carbs == null ? undefined : `c${food.carbs}g`}
                  </Span>{" "}
                  <Span>
                    {food.fats == null ? undefined : `f${food.fats}g`}
                  </Span>{" "}
                  <Span>{food.calories} kcal</Span>
                </div>
              </Button>
              <IconButton
                onClick={() => setExpandedFood(food)}
                ariaLabel="More info"
              >
                <InformationCircleIcon />
              </IconButton>
            </li>
          ))}
        </ul>
      )}

      {expandedFood && (
        <FoodInfoModal
          food={expandedFood}
          onClose={() => setExpandedFood(null)}
        />
      )}
    </div>
  );
}
