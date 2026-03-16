"use client";

import { JSX } from "react";

type Props = Readonly<{
  headers: string[];
  rows?: (string | JSX.Element)[][];
  getRowKey: (row: React.ReactNode[], index: number) => React.Key;
}>;

export default function Table({ headers, rows, getRowKey }: Props) {
  if (rows?.length === 0 || !rows)
    return <p className="text-sm text-gray-400">No items</p>;

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
          {headers.map((header) => (
            <th key={header} className="px-4 py-2 text-left font-medium">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {rows.map((row, index) => (
          <tr key={getRowKey(row, index)} className="hover:bg-gray-50">
            {row.map((cell, cellIndex) => (
              <td
                key={cellIndex}
                className="px-4 py-2 font-medium text-gray-700"
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
