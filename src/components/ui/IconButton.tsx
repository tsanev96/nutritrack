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
  className = "",
  disabled,
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`cursor-pointer h-6 w-6 rounded-md m-1.5 text-gray-400 transition-colors hover:text-gray-600 disabled:opacity-40 ${className}`}
    >
      {children}
    </button>
  );
}
