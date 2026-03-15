type Props = Readonly<{
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  disabled?: boolean;
}>;

const VARIANTS = {
  primary: "bg-primary text-white hover:bg-primary-hover",
  secondary: "border text-gray-600 hover:bg-secondary-hover",
  ghost: "",
};

export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  className = "",
  disabled,
}: Props) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-md px-3 py-2 text-sm font-medium transition-colors disabled:opacity-40 ${disabled ? "cursor-none" : "cursor-pointer"} ${VARIANTS[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
