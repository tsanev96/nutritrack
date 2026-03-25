"use client";

import { useShallow } from "zustand/shallow";
import { useTrackerStore } from "@/stores/useTrackerStore";
import { MEALS } from "@/config/constants";
import { getTodayDate } from "@/utils/dates";
import Rows from "./Rows";
import CardSection from "@/components/CardSection";
import HeadlineWrapper from "./HeadlineWrapper";

export default function MealsCalories() {
  const today = getTodayDate();
  const dayLog = useTrackerStore(useShallow((s) => s.logs[today] ?? {}));

  const rows = MEALS.map((meal) => {
    const entries = dayLog[meal] ?? [];
    const calories = entries.reduce((sum, entry) => sum + entry.calories, 0);
    return { label: meal, value: `${calories} kcal` };
  });

  return (
    <CardSection>
      <HeadlineWrapper title="Calories per Meal" />
      <Rows rows={rows} />
    </CardSection>
  );
}
