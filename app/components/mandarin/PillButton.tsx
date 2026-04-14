type Variant = "outline" | "filled" | "ghost";
type Size = "sm" | "xs";

interface PillButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantClasses: Record<Variant, string> = {
  outline: "border border-sub-color text-sub-color hover:bg-sub-color/10",
  filled: "bg-sub-color text-white border border-sub-color",
  ghost: "border border-text-color/20 text-text-color opacity-60",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-1 text-sm",
  xs: "px-2 py-0.5 text-xs",
};

export function PillButton({
  variant = "outline",
  size = "sm",
  className = "",
  ...props
}: PillButtonProps) {
  return (
    <button
      {...props}
      className={`font-work font-medium rounded-full transition-colors ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    />
  );
}
