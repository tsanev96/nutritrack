import { Button } from "@/components/ui/button";

type Props = Readonly<{
  children: React.ReactNode;
  onClick?: () => void;
  ariaLabel: string;
  className?: string;
  disabled?: boolean;
}>;

export default function IconButton({
  children,
  onClick,
  ariaLabel,
  className,
  disabled,
}: Props) {
  return (
    <Button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      variant="ghost"
      size="icon-xs"
      className={className}
    >
      {children}
    </Button>
  );
}
