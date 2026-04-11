"use client";

import { useShallow } from "zustand/shallow";
import { useStore } from "@/stores/useStore";
import { MEALS } from "@/config/constants";
import { getTodayDate } from "@/utils/dates";
import Rows from "./Rows";
import CardSection from "@/components/common/CardSection";
import HeadlineWrapper from "./HeadlineWrapper";

export default function MealsCalories() {
  const today = getTodayDate();
  const dayLog = useStore(useShallow((s) => s.foodLogs[today] ?? {}));

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
