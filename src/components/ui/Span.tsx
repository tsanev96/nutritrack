type Props = Readonly<{
  children?: React.ReactNode;
  className?: string;
  bold?: boolean;
}>;

export default function Span({ children, className = "", bold }: Props) {
  if (!children) return null;
  return <span className={`text-sm text-gray-600 ${bold ? "font-bold" : ""} ${className}`}>{children}</span>;
}
