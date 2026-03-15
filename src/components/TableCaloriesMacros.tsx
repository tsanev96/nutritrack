"use client";

import { Entry } from "@/types";
import { TrashIcon } from "@heroicons/react/24/outline";
import Button from "./common/Button";

type Props = Readonly<{
  entries?: Entry[];
  onRemoveEntry?: (id: string) => void;
}>;
export default function TableCaloriesMacros({ entries, onRemoveEntry }: Props) {
  if (!entries || entries.length === 0)
    return <p className="text-sm text-gray-400">No items</p>;

  return (
    <div>
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
            <th className="px-4 py-2 text-left font-medium" />
            <th className="px-4 py-2 text-left font-medium">Calories</th>
            <th className="px-3 py-2 text-right font-medium">Carbs</th>
            <th className="px-3 py-2 text-right font-medium">Fat</th>
            <th className="px-3 py-2 text-right font-medium">Protein</th>
            <th className="px-3 py-2 text-right font-medium">Sodium</th>
            <th className="px-3 py-2 text-right font-medium">Sugar</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {entries.map((entry) => (
            <tr key={entry.id} className="">
              <td className="px-4 py-2 font-medium text-gray-700">
                {entry.name}
              </td>
              <td className="px-3 py-2 text-right text-gray-600">
                {entry.calories}
              </td>
              <td className="px-3 py-2 text-right text-gray-600">
                {entry.carbs ?? 0}
              </td>
              <td className="px-3 py-2 text-right text-gray-600">
                {entry.fats ?? 0}
              </td>
              <td className="px-3 py-2 text-right text-gray-600">
                {entry.sodium ?? 0}
              </td>
              <td className="px-3 py-2 text-right text-gray-600">
                {entry.sugar ?? 0}
              </td>
              <td className="px-3 py-2 text-right">
                <TrashIcon onClick={() => onRemoveEntry?.(entry.id)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
