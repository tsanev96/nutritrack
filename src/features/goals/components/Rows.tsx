"use client";

type Props = Readonly<{
  rows: { label: string; value: string }[];
}>;

export default function Rows({ rows }: Props) {
  return (
    <ul className="divide-y">
      {rows.map(({ label, value }) => (
        <li key={label} className="flex justify-between py-2 text-sm">
          <span className="text-gray-500">{label}</span>
          <span className="font-medium text-gray-900">{value}</span>
        </li>
      ))}
    </ul>
  );
}
