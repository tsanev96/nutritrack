"use client";

import { useState } from "react";
import { useTrackerStore } from "@/store/useTrackerStore";
import InputField from "@/components/common/InputField";
import Headline from "@/components/common/Headline";
import SaveActions from "./SaveActions";
import type { Macros } from "@/types";
import { selectDailyCalories } from "@/store/selectors";

export default function NutritionGoalsSection() {
  const macroGoals = useTrackerStore((s) => s.macroGoals);
  const setMacroGoals = useTrackerStore((s) => s.setMacroGoals);

  const [isEditing, setIsEditing] = useState(false);
  const [macrosForm, setMacrosForm] = useState<Macros>(macroGoals);

  function handleEdit() {
    setMacrosForm(macroGoals);
    setIsEditing(true);
  }

  function handleSave() {
    setMacroGoals(macrosForm);
    setIsEditing(false);
  }

  function handleCancel() {
    setMacrosForm(macroGoals);
    setIsEditing(false);
  }

  const rows = [
    { label: "Calories", value: `${selectDailyCalories(macroGoals)} kcal` },
    { label: "Protein", value: `${macroGoals.protein} g` },
    { label: "Carbs", value: `${macroGoals.carbs} g` },
    { label: "Fat", value: `${macroGoals.fats} g` },
  ];

  const inputFields = [
    {
      label: "Protein (g)",
      key: "protein" as keyof Macros,
      placeholder: "150",
      onChange: (protein: number) => setMacrosForm((p) => ({ ...p, protein })),
    },
    {
      label: "Carbs (g)",
      key: "carbs" as keyof Macros,
      placeholder: "200",
      onChange: (carbs: number) => setMacrosForm((p) => ({ ...p, carbs })),
    },
    {
      label: "Fat (g)",
      key: "fats" as keyof Macros,
      placeholder: "65",
      onChange: (fats: number) => setMacrosForm((p) => ({ ...p, fats })),
    },
  ];

  return (
    <section className="rounded-lg bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <Headline title="Daily Nutrition Goals" />
        {!isEditing && (
          <button
            onClick={handleEdit}
            className="text-sm text-blue-600 hover:underline"
          >
            Edit
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <p className="text-gray-500">
            Calories (kcal) {selectDailyCalories(useTrackerStore.getState())}
          </p>
          {inputFields.map(({ label, key, placeholder, onChange }) => (
            <InputField
              key={key}
              label={label}
              type="number"
              placeholder={placeholder}
              value={macrosForm[key]}
              onChange={onChange}
            />
          ))}
          <SaveActions onSave={handleSave} onCancel={handleCancel} />
        </div>
      ) : (
        <ul className="divide-y">
          {rows.map(({ label, value }) => (
            <li key={label} className="flex justify-between py-2 text-sm">
              <span className="text-gray-500">{label}</span>
              <span className="font-medium text-gray-900">{value}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
