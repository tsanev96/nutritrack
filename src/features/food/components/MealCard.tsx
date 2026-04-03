"use client";

import type { Meal } from "@/types";
import { useTrackerStore } from "@/stores/useTrackerStore";
import Link from "next/link";
import { useShallow } from "zustand/shallow";
import TableCaloriesMacros from "./TableCaloriesMacros";
import Headline from "@/components/ui/Headline";

type Props = Readonly<{ meal: Meal; date: string }>;

export default function MealCard({ meal, date }: Props) {
  const entries = useTrackerStore(
    useShallow((s) => s.logs[date]?.[meal] ?? []),
  );
  const removeEntry = useTrackerStore((s) => s.removeEntry);

  return (
    <div className="rounded-lg bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <Headline title={meal} variant="h2" className="capitalize" />
        <Link
          href={`/food/diary/add?meal=${meal}&date=${date}`}
          className="rounded-md bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
        >
          Add
        </Link>
      </div>
      <TableCaloriesMacros
        entries={entries}
        onRemoveEntry={(id) => removeEntry({ date, meal, id })}
      />
    </div>
  );
}
