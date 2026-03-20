"use client";

import { useState } from "react";
import { useTrackerStore } from "@/store/useTrackerStore";
import InputField from "@/components/common/InputField";
import SaveActions from "./SaveActions";
import type { CoreMacros } from "@/types";
import { calcCalories } from "@/utils/calculateCalories";
import CardSection from "@/components/common/CardSection";
import Rows from "./Rows";
import HeadlineWrapper from "./HeadlineWrapper";

export default function NutritionGoalsSection() {
  const macroGoals = useTrackerStore((s) => s.macroGoals);
  const setMacroGoals = useTrackerStore((s) => s.setMacroGoals);

  const [isEditing, setIsEditing] = useState(false);

  const [macrosForm, setMacrosForm] = useState<CoreMacros>({
    protein: macroGoals.protein,
    carbs: macroGoals.carbs,
    fats: macroGoals.fats,
  });

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
    {
      label: "Calories",
      value: `${calcCalories(macroGoals)} kcal`,
    },
    { label: "Protein", value: `${macroGoals.protein} g` },
    { label: "Carbs", value: `${macroGoals.carbs} g` },
    { label: "Fat", value: `${macroGoals.fats} g` },
  ];

  const inputFields: {
    label: string;
    key: keyof CoreMacros;
    placeholder: string;
    onChange: (v: number) => void;
  }[] = [
    {
      label: "Protein (g)",
      key: "protein" as keyof CoreMacros,
      placeholder: "150",
      onChange: (protein: number) => setMacrosForm((p) => ({ ...p, protein })),
    },
    {
      label: "Carbs (g)",
      key: "carbs" as keyof CoreMacros,
      placeholder: "200",
      onChange: (carbs: number) => setMacrosForm((p) => ({ ...p, carbs })),
    },
    {
      label: "Fat (g)",
      key: "fats" as keyof CoreMacros,
      placeholder: "65",
      onChange: (fats: number) => setMacrosForm((p) => ({ ...p, fats })),
    },
  ];

  return (
    <CardSection>
      <HeadlineWrapper title="Daily Nutrition Goals" onEdit={handleEdit} />

      {isEditing ? (
        <div className="space-y-3">
          <p className="text-gray-500">
            Calories (kcal) {calcCalories(macrosForm)}
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
        <Rows rows={rows} />
      )}
    </CardSection>
  );
}
