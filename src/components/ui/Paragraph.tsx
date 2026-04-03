type Variant = "base" | "sm";

type Props = Readonly<{
  children?: React.ReactNode | null;
  variant?: Variant;
  color?: "body" | "white";
  className?: string;
}>;

const STYLES: Record<Variant, string> = {
  base: "text-base",
  sm: "text-sm",
};

const COLOR_STYLES: Record<"body" | "white", string> = {
  body: "text-body",
  white: "text-white",
};

export default function Paragraph({
  children,
  variant = "base",
  color = "body",
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
