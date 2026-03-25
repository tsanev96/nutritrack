import { Color, COLOR_STYLES } from "../common/types";

type Variant = "h1" | "h2" | "h3";

type Props = Readonly<{
  title: string;
  variant?: Variant;
  color?: Color;
  className?: string;
}>;

const STYLES: Record<Variant, string> = {
  h1: "text-2xl font-semibold mb-3",
  h2: "text-xl font-semibold tracking-wide mb-3",
  h3: "text-xs font-semibold tracking-wide mb-3",
};

// todo title as children
export default function Headline({
  title,
  variant = "h2",
  color = "black",
  className,
}: Props) {
  const Tag = variant;
  return (
    <Tag
      className={`${STYLES[variant]} ${COLOR_STYLES[color]} ${className ?? ""}`}
    >
      {title}
    </Tag>
  );
}
