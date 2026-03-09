"use client";

import { useTrackerStore } from "@/store/useTrackerStore";
import Rows from "./Rows";
import Card from "@/components/common/Card";
import HeadlineWrapper from "./HeadlineWrapper";

export default function MealsCalories() {
  const meals = useTrackerStore((s) => s.entries);

  const rows = Object.entries(meals).map(([meal, entries]) => {
    const calories = entries.reduce((sum, entry) => sum + entry.calories, 0);
    return { label: meal, value: `${calories} kcal` };
  });

  return (
    <Card>
      <HeadlineWrapper title="Calories per Meal" />
      <Rows rows={rows} />
    </Card>
  );
}
