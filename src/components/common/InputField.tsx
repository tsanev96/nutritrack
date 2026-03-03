"use client";

type Props<T extends string | number> = Readonly<{
  label: string;
  value: T;
  onChange: (value: T) => void;
  error?: string;
  placeholder?: string;
  type: "text" | "number";
  required?: boolean;
}>;

export default function InputField<T extends string | number>({
  value,
  label,
  onChange,
  error,
  placeholder,
  type,
  required = true,
}: Props<T>) {
  return (
    <div>
      <label
        htmlFor={label}
        className="mb-1 block text-sm font-medium text-gray-700"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={label}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value as unknown as T)}
        placeholder={placeholder}
        min={0}
        className="text-gray-700 w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
