import { Color, COLOR_STYLES } from "../common/types";

type Variant = "base" | "sm";

type Props = Readonly<{
  children?: React.ReactNode | null;
  variant?: Variant;
  color?: Color;
  className?: string;
}>;

const STYLES: Record<Variant, string> = {
  base: "text-base",
  sm: "text-sm",
};

export default function Paragraph({
  children,
  variant = "base",
  color = "black",
  className,
}: Props) {
  if (!children) return null;

  return (
    <p
      className={`${STYLES[variant]} mb-2 ${COLOR_STYLES[color]} ${className ?? ""}`}
    >
      {children}
    </p>
  );
}
