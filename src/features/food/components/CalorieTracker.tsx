"use client";

import { useState } from "react";
import { MEALS } from "@/config/constants";
import DailySummary from "./DailySummary";
import NutritionSummaryTable from "./NutritionSummaryTable";
import MealCard from "./MealCard";
import { getTodayDate } from "@/utils/dates";
import Headline from "@/components/ui/Headline";

export default function CalorieTracker() {
  const [date, setDate] = useState(getTodayDate());

  return (
    <div className="mb-6">
      <div className="mb-6 flex items-center justify-between">
        <Headline title="Food Diary" variant="h1" color="white" />
        <input
          type="date"
          value={date}
          max={getTodayDate()}
          onChange={(e) => setDate(e.target.value)}
          className="rounded-md border px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <DailySummary date={date} />

      <div className="flex flex-col gap-4">
        {MEALS.map((meal) => (
          <MealCard key={meal} meal={meal} date={date} />
        ))}
      </div>

      <NutritionSummaryTable date={date} />
    </div>
  );
}
