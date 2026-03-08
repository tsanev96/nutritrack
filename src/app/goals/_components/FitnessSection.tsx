"use client";

import { useState } from "react";
import { useTrackerStore } from "@/store/useTrackerStore";
import type { ActivityLevel, WeeklyGoal } from "@/types";
import Headline from "@/components/common/Headline";
import SelectField from "@/components/common/SelectField";
import SaveActions from "./SaveActions";
import { ACTIVITY_LABELS, WEEKLY_GOAL_LABELS } from "@/lib/constants";

const ACTIVITY_OPTIONS = Object.keys(ACTIVITY_LABELS).map((key) => ({
  value: key,
  label: ACTIVITY_LABELS[key as ActivityLevel],
}));

const WEEKLY_GOAL_OPTIONS = Object.keys(WEEKLY_GOAL_LABELS).map((key) => ({
  value: key,
  label: WEEKLY_GOAL_LABELS[key as WeeklyGoal],
}));

const WEIGHT_UNITS = [
  { value: "kg", label: "kg" },
  { value: "lbs", label: "lbs" },
];

export default function FitnessSection() {
  const goals = useTrackerStore((s) => s.fitnessGoals);
  const setGoals = useTrackerStore((s) => s.setFitnessGoals);

  const [isEditing, setIsEditing] = useState(false);
  const [fitnessGoals, setFitnessGoals] = useState(goals);

  function handleSave() {
    setGoals(fitnessGoals);
    setIsEditing(false);
  }

  function handleCancel() {
    setFitnessGoals(goals);
    setIsEditing(false);
  }

  const rows = [
    {
      label: "Target Weight",
      value: `${goals.targetWeight} ${goals.weightUnit}`,
    },
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
          <SelectField
            label="Target Weight"
            options={WEIGHT_UNITS}
            value={fitnessGoals.weightUnit}
            onChange={(value) =>
              setFitnessGoals((p) => ({
                ...p,
                weightUnit: value as "kg" | "lbs",
              }))
            }
          >
            <input
              type="number"
              min={0}
              value={fitnessGoals.targetWeight}
              onChange={(e) =>
                setFitnessGoals((p) => ({
                  ...p,
                  targetWeight: Number(e.target.value) || 0,
                }))
              }
              className="min-w-0 flex-1 rounded-md border px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </SelectField>
          <SelectField
            label="Activity Level"
            options={ACTIVITY_OPTIONS}
            value={fitnessGoals.activityLevel}
            onChange={(value) =>
              setFitnessGoals((p) => ({
                ...p,
                activityLevel: value as ActivityLevel,
              }))
            }
          />
          <SelectField
            label="Weekly Goal"
            options={WEEKLY_GOAL_OPTIONS}
            value={fitnessGoals.weeklyGoal}
            onChange={(value) =>
              setFitnessGoals((p) => ({
                ...p,
                weeklyGoal: value as WeeklyGoal,
              }))
            }
          />

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
