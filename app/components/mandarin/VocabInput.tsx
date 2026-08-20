import { forwardRef } from "react";

interface VocabInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  size?: "sm" | "lg";
}

export const VocabInput = forwardRef<HTMLInputElement, VocabInputProps>(
  ({ size = "sm", className = "", ...props }, ref) => (
    <input
      ref={ref}
      {...props}
      className={`font-work bg-transparent border-b border-sub-color/50 text-text-color outline-none p-1 placeholder:opacity-40 ${
        size === "lg" ? "text-xl" : "text-sm"
      } ${className}`}
    />
  )
);

VocabInput.displayName = "VocabInput";
