"use client";

import { MEALS } from "@/lib/constants";
import DailySummary from "./DailySummary";
import GoalInput from "./GoalInput";
import MealCard from "./MealCard";

export default function CalorieTracker() {
  return (
    <div className="min-h-screen bg-slate-500 p-6">
      <div className="mx-auto max-w-4xl">
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Calories Tracker</h1>
          <GoalInput />
        </header>

        <DailySummary />

        <div className="grid gap-4 sm:grid-cols-2">
          {MEALS.map((meal) => (
            <MealCard key={meal} meal={meal} />
          ))}
        </div>
      </div>
    </div>
  );
}
