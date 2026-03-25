"use client";

import { useState } from "react";
import { useTrackerStore } from "@/stores/useTrackerStore";
import { useShallow } from "zustand/shallow";
import Button from "@/components/ui/Button";
import InputField from "@/components/common/InputField";
import ErrorMessage from "@/components/ui/ErrorMessage";

type Props = Readonly<{ date: string }>;

// todo form component that can be reused between food and exercise cards

export default function ExerciseCard({ date }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [caloriesBurned, setCaloriesBurned] = useState<number | "">("");
  const [durationMinutes, setDurationMinutes] = useState<number | "">("");
  const [nameError, setNameError] = useState("");

  const exercises = useTrackerStore(
    useShallow((s) => s.logs[date]?.exercises ?? []),
  );
  const addExercise = useTrackerStore((s) => s.addExercise);
  const removeExercise = useTrackerStore((s) => s.removeExercise);

  const totalBurned = exercises.reduce((sum, e) => sum + e.caloriesBurned, 0);

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!name.trim()) {
      setNameError("Exercise name is required");
      return;
    }

    setNameError("");
    addExercise({
      date,
      exercise: {
        id: crypto.randomUUID(),
        name: name.trim(),
        caloriesBurned: Number(caloriesBurned) || 0,
        durationMinutes: durationMinutes ? Number(durationMinutes) : undefined,
      },
    });
    setName("");
    setCaloriesBurned("");
    setDurationMinutes("");
    setShowForm(false);
  }

  return (
    <div className="rounded-lg bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div>
          <h2 className="font-semibold text-gray-700">Exercise</h2>
          {totalBurned > 0 && (
            <span className="text-xs text-gray-400">
              {totalBurned} kcal burned
            </span>
          )}
        </div>
        <Button
          onClick={() => setShowForm((v) => !v)}
          variant="ghost"
          className="text-green-600 hover:text-green-700 text-sm font-medium"
        >
          + Add Exercise
        </Button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="px-4 py-3 border-b border-gray-100 space-y-3 bg-gray-50"
        >
          <InputField
            label="Exercise name"
            type="text"
            value={name}
            onChange={(value) => setName(value)}
            placeholder="e.g. Running, Cycling..."
            className="w-full rounded-md border px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <ErrorMessage message={nameError} />
          <div className="grid grid-cols-2 gap-3">
            <InputField
              label="Calories burned"
              type="number"
              value={caloriesBurned}
              onChange={(value) =>
                setCaloriesBurned(value === "" ? "" : Number(value))
              }
              className="w-full rounded-md border px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <InputField
              label="Duration (min)"
              value={durationMinutes}
              onChange={(value) =>
                setDurationMinutes(value === "" ? "" : Number(value))
              }
              type="number"
              className="w-full rounded-md border px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              // min={0}
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit">Save</Button>
            <Button variant="secondary" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      {exercises.length === 0 ? (
        <p className="px-4 py-3 text-sm text-gray-400">No exercises logged</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
              <th className="px-4 py-2 text-left font-medium">Exercise</th>
              <th className="px-3 py-2 text-right font-medium">Duration</th>
              <th className="px-3 py-2 text-right font-medium">Kcal burned</th>
              <th className="px-3 py-2" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {exercises.map((ex) => (
              <tr key={ex.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 font-medium text-gray-700">
                  {ex.name}
                </td>
                <td className="px-3 py-2 text-right text-gray-500">
                  {ex.durationMinutes !== undefined
                    ? `${ex.durationMinutes} min`
                    : "—"}
                </td>
                <td className="px-3 py-2 text-right text-gray-600">
                  {ex.caloriesBurned}
                </td>
                <td className="px-3 py-2 text-right">
                  <Button
                    onClick={() => removeExercise({ date, id: ex.id })}
                    className="text-red-500 hover:text-red-700 text-xs font-medium"
                  >
                    Remove
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
