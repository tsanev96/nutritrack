type Props = Readonly<{
  children?: React.ReactNode;
  className?: string;
}>;

export default function Span({ children, className = "" }: Props) {
  if (!children) return null;
  return <span className={`text-sm text-gray-600 ${className}`}>{children}</span>;
}
