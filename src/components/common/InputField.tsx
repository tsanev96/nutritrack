"use client";

type Props<T extends string | number> = Readonly<{
  id?: string;
  label?: string;
  value: T;
  onChange: (value: T) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  error?: string;
  placeholder?: string;
  type: "text" | "number" | "email" | "password" | "date";
  required?: boolean;
  disabled?: boolean;
  className?: string;
  min?: string | number;
  max?: string | number;
  step?: number;
}>;

export default function InputField<T extends string | number>({
  value,
  id,
  label,
  onChange,
  onKeyDown,
  error,
  placeholder,
  type,
  required = true,
  disabled,
  className = "",
  max,
  min,
  step,
}: Props<T>) {
  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={label}
          className={`${className} mb-1 block text-sm font-medium text-gray-700`}
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        id={id}
        disabled={disabled}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value as unknown as T)}
        onKeyDown={(e) => (onKeyDown ? onKeyDown(e) : null)}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        className="text-gray-700 w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
