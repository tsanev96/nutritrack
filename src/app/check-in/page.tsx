"use client";

import { useState } from "react";
import { useTrackerStore } from "@/store/useTrackerStore";
import type { BodyMeasurements } from "@/types";
import Headline from "@/components/common/Headline";
import CardSection from "@/components/common/CardSection";
import Button from "@/components/common/Button";

const TODAY = new Date().toISOString().split("T")[0];

const MEASUREMENT_LABELS: { key: keyof BodyMeasurements; label: string }[] = [
  { key: "neck", label: "Neck" },
  { key: "waist", label: "Waist" },
  { key: "hips", label: "Hips" },
];

export default function CheckInPage() {
  const checkIns = useTrackerStore((s) => s.checkIns);
  const addCheckIn = useTrackerStore((s) => s.addCheckIn);
  const weightUnit = useTrackerStore((s) => s.fitnessGoals.weightUnit);

  const todayEntry = checkIns.find((c) => c.date === TODAY);
  const lastEntry = [...checkIns]
    .filter((c) => c.date < TODAY)
    .sort((a, b) => b.date.localeCompare(a.date))[0];

  const [weight, setWeight] = useState(todayEntry?.weight || 0);
  const [measurements, setMeasurements] = useState<
    Record<keyof BodyMeasurements, string>
  >({
    neck: todayEntry?.measurements.neck?.toString() ?? "",
    waist: todayEntry?.measurements.waist?.toString() ?? "",
    hips: todayEntry?.measurements.hips?.toString() ?? "",
  });

  function handleSave() {
    addCheckIn({
      date: TODAY,
      weight,
      measurements: {
        neck: measurements.neck ? Number(measurements.neck) : undefined,
        waist: measurements.waist ? Number(measurements.waist) : undefined,
        hips: measurements.hips ? Number(measurements.hips) : undefined,
      },
    });
  }

  const headers = ["Measurement", "Last entry", "Today"];

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-lg space-y-4">
        <Headline title="Check-in" variant="h1" />

        {/* Weight */}
        <CardSection>
          <Headline title="Today's Weight" variant="h2" />
          <div className="mt-3 flex items-center gap-3">
            <input
              type="number"
              min={0}
              step={0.1}
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value) || 0)}
              placeholder="0.0"
              className="w-full rounded-md border px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="shrink-0 text-sm font-medium text-gray-500">
              {weightUnit}
            </span>
          </div>
          {lastEntry?.weight && (
            <p className="mt-2 text-xs text-gray-400">
              Last entry: {lastEntry.weight} {weightUnit} ({lastEntry.date})
            </p>
          )}
        </CardSection>
        {/* Measurements */}
        <CardSection>
          <Headline title="Measurements (cm)" variant="h2" />
          <table className="mt-3 w-full text-sm">
            <thead>
              <tr className="text-left text-xs font-medium text-gray-400">
                {headers.map((header) => (
                  <th key={header} className="pb-2">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {MEASUREMENT_LABELS.map(({ key, label }) => (
                <tr key={key}>
                  <td className="py-2 text-gray-500">{label}</td>
                  <td className="py-2 text-gray-400">
                    {lastEntry?.measurements[key] ?? "—"}
                  </td>
                  <td className="py-2">
                    <input
                      type="number"
                      min={0}
                      step={0.1}
                      value={measurements[key]}
                      onChange={(e) =>
                        setMeasurements((p) => ({
                          ...p,
                          [key]: e.target.value,
                        }))
                      }
                      placeholder="0.0"
                      className="w-24 rounded-md border px-2 py-1 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardSection>

        <Button onClick={handleSave} className="w-full ">
          Save
        </Button>
      </div>
    </div>
  );
}
