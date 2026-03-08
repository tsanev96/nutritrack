"use client";

import { useState } from "react";
import { useTrackerStore } from "@/store/useTrackerStore";
import InputField from "@/components/common/InputField";
import Headline from "@/components/common/Headline";

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
          <InputField label="Calories (kcal)" type="number" value={form.calories} onChange={(v) => setForm((p) => ({ ...p, calories: v }))} placeholder="2000" />
          <InputField label="Protein (g)" type="number" value={form.protein} onChange={(v) => setForm((p) => ({ ...p, protein: v }))} placeholder="150" />
          <InputField label="Carbs (g)" type="number" value={form.carbs} onChange={(v) => setForm((p) => ({ ...p, carbs: v }))} placeholder="200" />
          <InputField label="Fat (g)" type="number" value={form.fats} onChange={(v) => setForm((p) => ({ ...p, fats: v }))} placeholder="65" />
          <div className="flex gap-2 pt-1">
            <button onClick={handleSave} className="flex-1 rounded-md bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700">Save</button>
            <button onClick={handleCancel} className="flex-1 rounded-md border py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
          </div>
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
