"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import type { VariantProps } from "class-variance-authority";

type ButtonProps = Readonly<{
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: VariantProps<typeof buttonVariants>["variant"];
  className?: string;
}>;

type Props<T extends string | number> = Readonly<{
  id?: string;
  label?: string;
  value: T;
  onChange: (value: string) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  error?: string;
  placeholder?: string;
  // todo
  type: "text" | "number" | "email" | "password" | "date";
  required?: boolean;
  disabled?: boolean;
  button: ButtonProps;
}>;

export default function InputWithButton<T extends string | number>({
  id,
  label,
  value,
  onChange,
  onKeyDown,
  error,
  placeholder,
  type,
  required = true,
  disabled,
  button,
}: Props<T>) {
  return (
    <div>
      {label && (
        <label
          htmlFor={id}
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="flex gap-2">
        <input
          id={id}
          disabled={disabled}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => (onKeyDown ? onKeyDown(e) : null)}
          placeholder={placeholder}
          className="text-gray-700 flex-1 rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Button
          onClick={button.onClick}
          disabled={button.disabled}
          variant={button.variant}
          className={button.className}
        >
          {button.label}
        </Button>
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
