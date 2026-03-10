type Variant = "h1" | "h2" | "h3";

type Props = Readonly<{
  title: string;
  variant?: Variant;
}>;

const STYLES: Record<Variant, string> = {
  h1: "text-2xl font-semibold text-gray-900",
  h2: "text-sm font-semibold tracking-wide text-gray-700",
  h3: "text-xs font-semibold tracking-wide text-gray-700",
};

export default function Headline({ title, variant = "h2" }: Props) {
  const Tag = variant;
  return <Tag className={STYLES[variant]}>{title}</Tag>;
}
