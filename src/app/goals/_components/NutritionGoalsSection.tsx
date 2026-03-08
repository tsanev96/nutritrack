"use client";

import { useState } from "react";
import { useTrackerStore } from "@/store/useTrackerStore";
import InputField from "@/components/common/InputField";
import Headline from "@/components/common/Headline";
import SaveActions from "./SaveActions";

export default function NutritionGoalsSection() {
  const dailyGoal = useTrackerStore((s) => s.dailyGoal);
  const macroGoals = useTrackerStore((s) => s.macroGoals);
  const setDailyGoal = useTrackerStore((s) => s.setDailyGoal);
  const setMacroGoals = useTrackerStore((s) => s.setMacroGoals);

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    calories: String(dailyGoal),
    protein: String(macroGoals.protein),
    carbs: String(macroGoals.carbs),
    fats: String(macroGoals.fats),
  });

  function handleSave() {
    setDailyGoal(Number(form.calories) || 0);
    setMacroGoals({
      protein: Number(form.protein) || 0,
      carbs: Number(form.carbs) || 0,
      fats: Number(form.fats) || 0,
    });
    setIsEditing(false);
  }

  function handleCancel() {
    setForm({
      calories: String(dailyGoal),
      protein: String(macroGoals.protein),
      carbs: String(macroGoals.carbs),
      fats: String(macroGoals.fats),
    });
    setIsEditing(false);
  }

  const rows = [
    { label: "Calories", value: `${dailyGoal} kcal` },
    { label: "Protein", value: `${macroGoals.protein} g` },
    { label: "Carbs", value: `${macroGoals.carbs} g` },
    { label: "Fat", value: `${macroGoals.fats} g` },
  ];

  const inputFields = [
    {
      label: "Calories (kcal)",
      key: "calories",
      placeholder: "2000",
      onChange: (calories: string) => setForm((p) => ({ ...p, calories })),
    },
    {
      label: "Protein (g)",
      key: "protein",
      placeholder: "150",
      onChange: (protein: string) => setForm((p) => ({ ...p, protein })),
    },
    {
      label: "Carbs (g)",
      key: "carbs",
      placeholder: "200",
      onChange: (carbs: string) => setForm((p) => ({ ...p, carbs })),
    },
    {
      label: "Fat (g)",
      key: "fats",
      placeholder: "65",
      onChange: (fats: string) => setForm((p) => ({ ...p, fats })),
    },
  ];

  return (
    <section className="rounded-lg bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <Headline title="Daily Nutrition Goals" />
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-sm text-blue-600 hover:underline"
          >
            Edit
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-3">
          {inputFields.map(({ label, key, placeholder, onChange }) => (
            <InputField
              key={key}
              label={label}
              type="number"
              placeholder={placeholder}
              value={form[key as keyof typeof form]}
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
