import type { ReactNode } from "react";

type Props = Readonly<{
  children: ReactNode;
  className?: string;
}>;

export default function Card({ children, className }: Props) {
  return (
    <section className={`rounded-lg bg-white p-4 shadow-sm ${className ?? ""}`}>
      {children}
    </section>
  );
}
