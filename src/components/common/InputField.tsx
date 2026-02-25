"use client";

type Props<T extends string | number> = Readonly<{
  label: string;
  value: T;
  onChange: (value: T) => void;
  error?: string;
  placeholder?: string;
}>;

export default function InputField<T extends string | number>({
  value,
  label,
  onChange,
  error,
  placeholder,
}: Props<T>) {
  return (
    <div>
      <label
        htmlFor={label}
        className="mb-1 block text-sm font-medium text-gray-700"
      >
        {label} <span className="text-red-500">*</span>
      </label>
      <input
        id={label}
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value as unknown as T)}
        placeholder={placeholder}
        min={1}
        className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
