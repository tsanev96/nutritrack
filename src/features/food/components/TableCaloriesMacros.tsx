"use client";

import { Entry } from "@/types";
import { TrashIcon } from "@heroicons/react/24/outline";
import Table from "@/components/ui/Table";

type Props = Readonly<{
  entries?: Entry[];
  onRemoveEntry?: (id: string) => void;
}>;
export default function TableCaloriesMacros({ entries, onRemoveEntry }: Props) {
  const headers = [
    "Food",
    "Calories",
    "Carbs",
    "Fat",
    "Protein",
    "Sodium",
    "Sugar",
    "Delete", // todo icon
  ];

  const rows = entries?.map((entry) => [
    entry.name,
    entry.calories.toString(),
    (entry.carbs ?? 0).toString(),
    (entry.fats ?? 0).toString(),
    (entry.protein ?? 0).toString(),
    (entry.sodium ?? 0).toString(),
    (entry.sugar ?? 0).toString(),
    <TrashIcon
      key="delete"
      className="h-5 w-5 cursor-pointer text-gray-400 hover:text-red-600"
      onClick={() => onRemoveEntry?.(entry.id)}
    />,
  ]);
  return (
    <Table
      headers={headers}
      rows={rows}
      getRowKey={(_, index) => entries![index].id}
    />
  );
}
