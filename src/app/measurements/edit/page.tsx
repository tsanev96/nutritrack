"use client";

import { useState } from "react";
import Link from "next/link";
import { useTrackerStore } from "@/stores/useTrackerStore";
import type { CheckIn } from "@/types";
import Headline from "@/components/Headline";
import CardSection from "@/components/CardSection";
import Button from "@/components/Button";
import { addCheckInMeasurements, getMeasurementsValues } from "@/utils/checkIn";
import { MEASUREMENT_KEYS } from "@/config/constants";
import InputField from "@/components/InputField";
import Paragraph from "@/components/Paragraph";

type EditRowProps = Readonly<{
  checkIn: CheckIn;
  weightUnit: string;
  onSave: (updated: CheckIn) => void;
}>;

function EditRow({ checkIn, weightUnit, onSave }: EditRowProps) {
  const [weight, setWeight] = useState(checkIn.weight ?? 0);
  const [measurements, setMeasurements] = useState(
    getMeasurementsValues(checkIn),
  );

  function handleSave() {
    onSave(
      addCheckInMeasurements({ date: checkIn.date, weight, measurements }),
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <InputField
          label="Weight"
          type="number"
          min={0}
          step={0.1}
          value={weight}
          onChange={(value) => setWeight(Number(value) || 0)}
        />
        <span className="text-sm text-gray-400">{weightUnit}</span>
      </div>
      {MEASUREMENT_KEYS.map((key) => (
        <div key={key} className="flex items-center gap-3">
          <InputField
            label={key[0].toUpperCase() + key.slice(1)}
            type="number"
            min={0}
            step={0.1}
            value={measurements[key]}
            onChange={(value) =>
              setMeasurements((p) => ({ ...p, [key]: value }))
            }
            placeholder="—"
          />
          <span className="text-sm text-gray-400">cm</span>
        </div>
      ))}
      <Button onClick={handleSave}>Save</Button>
    </div>
  );
}

// todo add date change

export default function EditMeasurementsPage() {
  const checkIns = useTrackerStore((s) => s.checkIns);
  const addCheckIn = useTrackerStore((s) => s.addCheckIn);
  const weightUnit = useTrackerStore((s) => s.fitnessGoals.weightUnit);

  const [expandedDate, setExpandedDate] = useState<string | null>(null);

  const sorted = [...checkIns].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-lg space-y-4">
        <div className="flex items-center justify-between">
          <Headline title="Edit History" variant="h1" />
          <Link
            href="/measurements/check-in"
            className="text-sm font-medium text-primary hover:underline"
          >
            Back to check-in
          </Link>
        </div>

        {sorted.length === 0 && <Paragraph>No check-ins yet.</Paragraph>}

        {sorted.map((entry) => (
          <CardSection key={entry.date}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">
                  {entry.date}
                </p>
                <p className="mt-0.5 text-xs text-gray-400">
                  {entry.weight ? `${entry.weight} ${weightUnit}` : "No weight"}{" "}
                  ·{" "}
                  {MEASUREMENT_KEYS.map((key) =>
                    entry.measurements[key]
                      ? `${key.toUpperCase()} ${entry.measurements[key]}cm`
                      : null,
                  )
                    .filter(Boolean)
                    .join(" · ") || "No measurements"}
                </p>
              </div>
              <Button
                variant="ghost"
                onClick={() =>
                  setExpandedDate(
                    expandedDate === entry.date ? null : entry.date,
                  )
                }
              >
                {expandedDate === entry.date ? "Cancel" : "Edit"}
              </Button>
            </div>

            {expandedDate === entry.date && (
              <div className="mt-4 border-t pt-4">
                <EditRow
                  checkIn={entry}
                  weightUnit={weightUnit}
                  onSave={(updated) => {
                    addCheckIn(updated);
                    setExpandedDate(null);
                  }}
                />
              </div>
            )}
          </CardSection>
        ))}
      </div>
    </div>
  );
}
