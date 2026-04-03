type Props = Readonly<{ className?: string }>;

export default function SkeletonBlock({ className = "" }: Props) {
  return (
    <div className={`animate-pulse rounded-lg bg-surface-subtle ${className}`} />
  );
}
