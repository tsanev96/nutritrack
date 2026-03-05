"use client";

type Props = Readonly<{
  message?: string | null;
}>;

export default function ErrorMessage({ message }: Props) {
  return message ? (
    <p className="mt-1 text-xs text-red-500">{message}</p>
  ) : null;
}
