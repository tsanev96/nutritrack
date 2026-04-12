"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { MEALS } from "@/config/constants";
import DailySummary from "./DailySummary";
import MealCard from "./MealCard";
import { getTodayDate } from "@/utils/dates";
import Headline from "@/components/ui/Headline";
import SkeletonBlock from "@/components/common/SkeletonBlock";
import DatePickerDropDown from "@/components/common/DatePickerDropDown";

const NutritionSummaryTable = dynamic(() => import("./NutritionSummaryTable"), {
  loading: () => <SkeletonBlock className="mt-4 h-24" />,
});

export default function CalorieTracker() {
  const [date, setDate] = useState(getTodayDate());

  return (
    <div className="mb-6">
      <div className="mb-6 flex items-center justify-between">
        <Headline title="Food Diary" variant="h1" />
        <DatePickerDropDown
          label="Eating date"
          value={date}
          onChange={setDate}
          maxDate={getTodayDate()}
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
