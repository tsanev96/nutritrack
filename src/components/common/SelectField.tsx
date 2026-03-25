import type { ReactNode } from "react";

type Props = Readonly<{
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  children?: ReactNode;
}>;

export default function SelectField({
  label,
  options,
  value,
  onChange,
  children,
}: Props) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className={children ? "flex gap-2" : undefined}>
        {children}
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`rounded-md border px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${children ? "shrink-0" : "w-full"}`}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
