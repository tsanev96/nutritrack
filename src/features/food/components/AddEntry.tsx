"use client";

import { useState } from "react";
import type { Meal } from "@/types";
import { useTrackerStore } from "@/stores/useTrackerStore";
import FoodSearch from "./FoodSearch";
import { FoodSuggestion } from "@/lib/foodApi";
import { FoodUnit, LIQUID_UNITS, SOLID_UNITS, isLiquid } from "@/utils/units";
import { calcUnitMacros } from "@/utils/calcUnitMacros";
import SelectField from "@/components/common/SelectField";
import InputField from "@/components/common/InputField";
import Button from "@/components/ui/Button";
import Headline from "@/components/ui/Headline";
import Span from "@/components/ui/Span";

type Props = Readonly<{
  meal: Meal;
  date: string;
  onClose: () => void;
}>;

export default function AddEntry({ meal, date, onClose }: Props) {
  const addEntry = useTrackerStore((s) => s.addEntry);
  const [foodName, setFoodName] = useState("");
  const [selectedFood, setSelectedFood] = useState<FoodSuggestion | null>(null);
  const [quantity, setQuantity] = useState(100);
  const [unit, setUnit] = useState<FoodUnit>("g");
  const [macros, setMacros] = useState({
    fats: 0,
    protein: 0,
    carbs: 0,
    calories: 0,
  });
  const [errors, setErrors] = useState<{ foodName?: string }>({});

  function handleServingChange(qty: number, u: FoodUnit) {
    setQuantity(qty);
    setUnit(u);
    if (selectedFood) setMacros(calcUnitMacros(selectedFood, qty, u));
  }

  function validate() {
    const next: typeof errors = {};
    if (!foodName.trim()) next.foodName = "Food name is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  const units =
    selectedFood && isLiquid(selectedFood.servingSizeUnit)
      ? LIQUID_UNITS
      : SOLID_UNITS;

  return (
    <div className="rounded-lg bg-white p-4 shadow-sm">
      <Headline title={`Add to ${meal}`} />
      <form
        className="space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          if (!validate()) return;
          addEntry({
            date,
            meal,
            entry: {
              id: crypto.randomUUID(),
              name: foodName.trim(),
              calories: macros.calories,
              fats: macros.fats,
              protein: macros.protein,
              carbs: macros.carbs,
            },
          });
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
            const defaultUnit: FoodUnit = isLiquid(food.servingSizeUnit)
              ? "ml"
              : "g";
            setSelectedFood(food);
            setFoodName(food.description);
            setQuantity(100);
            setUnit(defaultUnit);
            setMacros(calcUnitMacros(food, 100, defaultUnit));
          }}
        />

        {selectedFood && (
          <div className="flex gap-2">
            <div className="flex-1">
              <InputField
                label="Quantity"
                type="number"
                min={0.1}
                step={0.1}
                value={quantity}
                onChange={(v) => handleServingChange(Number(v) || 1, unit)}
              />
            </div>
            <div className="flex-1">
              <SelectField
                label="Unit"
                value={unit}
                onChange={(v) => handleServingChange(quantity, v as FoodUnit)}
                options={units.map((u) => ({ label: u, value: u }))}
              />
            </div>
          </div>
        )}

        <div className="rounded-md bg-slate-50 px-3 py-2 text-sm text-gray-600">
          Calculated: <span className="font-semibold text-gray-900"></span>
          <Span bold>{macros.calories} kcal</Span>
          {selectedFood && (
            <Span>
              P {macros.protein}g · C {macros.carbs}g · F {macros.fats}g
            </Span>
          )}
        </div>

        <div className="flex gap-2 pt-1">
          <Button type="submit" className="flex-1">
            Save
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
