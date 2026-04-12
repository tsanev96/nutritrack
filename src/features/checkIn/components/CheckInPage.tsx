"use client";

import { useState } from "react";
import Link from "next/link";
import { useStore } from "@/stores/useStore";

import Headline from "@/components/ui/Headline";
import CardSection from "@/components/common/CardSection";
import { Button } from "@/components/ui/button";
import { getTodayDate } from "@/utils/dates";
import { addCheckInMeasurements, getMeasurementsValues } from "@/utils/checkIn";
import { MEASUREMENT_KEYS } from "@/config/constants";
import InputField from "@/components/common/InputField";
import Paragraph from "@/components/ui/Paragraph";
import PageWrapper from "@/components/common/PageWrapper";

const headers = ["Measurement", "Last entry", "Today"];

export default function CheckInPage() {
  const checkIns = useStore((s) => s.checkIns);
  const addCheckIn = useStore((s) => s.addCheckIn);
  const weightUnit = useStore((s) => s.fitnessGoals.weightUnit);

  const [date, setDate] = useState(getTodayDate());
  const [saved, setSaved] = useState(false);

  const existingEntry = checkIns.find((c) => c.date === date);
  const lastEntry = [...checkIns]
    .filter((c) => c.date < date)
    .sort((a, b) => b.date.localeCompare(a.date))[0];

  const [weight, setWeight] = useState(existingEntry?.weight ?? 0);
  const [measurements, setMeasurements] = useState(
    getMeasurementsValues(existingEntry),
  );

  function handleDateChange(newDate: string) {
    setDate(newDate);
    const entry = checkIns.find((c) => c.date === newDate);
    setWeight(entry?.weight ?? 0);
    setMeasurements(getMeasurementsValues(entry));
  }

  function handleSave() {
    addCheckIn(addCheckInMeasurements({ date, weight, measurements }));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <PageWrapper>
        <div className="flex items-center justify-between">
          <Headline title="Check-in" variant="h1" />
          <div className="flex items-center gap-3">
            <InputField
              type="date"
              value={date}
              onChange={(value) => handleDateChange(value)}
              max={getTodayDate()}
            />
            <Link
              href="/measurements/edit"
              className="text-sm font-medium text-primary hover:underline"
            >
              Edit history
            </Link>
          </div>
        </div>

        <CardSection>
          <Headline title="Today's Weight" variant="h2" />
          <div className="mt-3 flex items-center gap-3">
            <InputField
              value={weight}
              onChange={(value) => setWeight(Number(value) || 0)}
              type="number"
              placeholder="0.0"
            />
            <span className="shrink-0 text-sm font-medium text-gray-500">
              {weightUnit}
            </span>
          </div>
          {lastEntry?.weight && (
            <Paragraph>
              Last entry: {lastEntry.weight} {weightUnit} ({lastEntry.date})
            </Paragraph>
          )}
        </CardSection>

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
              {MEASUREMENT_KEYS.map((key) => (
                <tr key={key}>
                  <td className="py-2 text-gray-500">
                    {key[0].toUpperCase() + key.slice(1)}
                  </td>
                  <td className="py-2 text-gray-400">
                    {lastEntry?.measurements[key] ?? "—"}
                  </td>
                  <td className="py-2">
                    <InputField
                      type="number"
                      value={measurements[key]}
                      onChange={(value) =>
                        setMeasurements((p) => ({
                          ...p,
                          [key]: value,
                        }))
                      }
                      placeholder="0.0"
                      min={0}
                      className="w-24"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardSection>

        <Button onClick={handleSave} className="w-full">
          Save
        </Button>

        {saved && (
          <Paragraph className="text-green-600">Check-in saved!</Paragraph>
        )}
    </PageWrapper>
  );
}
