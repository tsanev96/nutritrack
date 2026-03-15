"use client";

import { useState } from "react";
import { MEALS } from "@/lib/constants";
import DailySummary from "./DailySummary";
import MealCard from "./MealCard";
import ExerciseCard from "./ExerciseCard";
import { getTodayDate } from "@/utils/dates";

export default function CalorieTracker() {
  const [date, setDate] = useState(getTodayDate());

  return (
    <div className="min-h-screen bg-slate-500 p-6">
      <div className="mx-auto max-w-4xl">
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Calories Tracker</h1>
          <input
            type="date"
            value={date}
            max={getTodayDate()}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-md border px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </header>

        <DailySummary date={date} />

        <div className="flex flex-col gap-4">
          {MEALS.map((meal) => (
            <MealCard key={meal} meal={meal} date={date} />
          ))}
          <ExerciseCard date={date} />
        </div>
      </div>
    </div>
  );
}
