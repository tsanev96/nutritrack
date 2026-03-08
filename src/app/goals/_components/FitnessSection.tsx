"use client";

import { useState } from "react";
import { useTrackerStore } from "@/store/useTrackerStore";
import type { ActivityLevel, WeeklyGoal } from "@/types";
import Headline from "@/components/common/Headline";

const ACTIVITY_LABELS: Record<ActivityLevel, string> = {
  sedentary: "Sedentary (little or no exercise)",
  light: "Lightly active (1–3 days/week)",
  moderate: "Moderately active (3–5 days/week)",
  active: "Active (6–7 days/week)",
  veryActive: "Very active (hard exercise daily)",
};

const WEEKLY_GOAL_LABELS: Record<WeeklyGoal, string> = {
  lose: "Lose weight",
  maintain: "Maintain weight",
  gain: "Gain weight",
};

export default function FitnessSection() {
  const goals = useTrackerStore((s) => s.fitnessGoals);
  const setGoals = useTrackerStore((s) => s.setFitnessGoals);

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState(goals);

  function handleSave() {
    setGoals(form);
    setIsEditing(false);
  }

  function handleCancel() {
    setForm(goals);
    setIsEditing(false);
  }

  const rows = [
    { label: "Target Weight", value: `${goals.targetWeight} ${goals.weightUnit}` },
    { label: "Activity Level", value: ACTIVITY_LABELS[goals.activityLevel] },
    { label: "Weekly Goal", value: WEEKLY_GOAL_LABELS[goals.weeklyGoal] },
  ];

  return (
    <section className="rounded-lg bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <Headline title="Fitness" />
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
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Target Weight
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                min={0}
                value={form.targetWeight}
                onChange={(e) =>
                  setForm((p) => ({ ...p, targetWeight: Number(e.target.value) || 0 }))
                }
                className="min-w-0 flex-1 rounded-md border px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={form.weightUnit}
                onChange={(e) =>
                  setForm((p) => ({ ...p, weightUnit: e.target.value as "kg" | "lbs" }))
                }
                className="rounded-md border px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="kg">kg</option>
                <option value="lbs">lbs</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Activity Level
            </label>
            <select
              value={form.activityLevel}
              onChange={(e) =>
                setForm((p) => ({ ...p, activityLevel: e.target.value as ActivityLevel }))
              }
              className="w-full rounded-md border px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {(Object.keys(ACTIVITY_LABELS) as ActivityLevel[]).map((level) => (
                <option key={level} value={level}>
                  {ACTIVITY_LABELS[level]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Weekly Goal
            </label>
            <select
              value={form.weeklyGoal}
              onChange={(e) =>
                setForm((p) => ({ ...p, weeklyGoal: e.target.value as WeeklyGoal }))
              }
              className="w-full rounded-md border px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {(Object.keys(WEEKLY_GOAL_LABELS) as WeeklyGoal[]).map((goal) => (
                <option key={goal} value={goal}>
                  {WEEKLY_GOAL_LABELS[goal]}
                </option>
              ))}
            </select>
          </div>

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
