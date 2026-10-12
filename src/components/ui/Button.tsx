import * as React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "soft" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-200 cursor-pointer select-none rounded-[var(--radius-md)] disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)]";

    const variantStyles = {
      primary:
        "bg-[var(--brand-anchor)] text-[var(--paper-50)] hover:bg-[var(--brand-hover)] active:bg-[var(--brand-active)] shadow-[var(--shadow-subtle)] hover:shadow-[var(--shadow-warm)]",
      secondary:
        "bg-[var(--paper-200)] text-[var(--ink-800)] hover:bg-[var(--paper-300)] active:bg-[var(--sand-400)] border border-[var(--border-subtle)]",
      outline:
        "bg-transparent border border-[var(--brand-anchor)] text-[var(--brand-anchor)] hover:bg-[var(--brand-soft)] active:bg-[var(--rose-300)]/30",
      ghost:
        "bg-transparent text-[var(--ink-800)] hover:bg-[var(--paper-200)] hover:text-[var(--ink-950)]",
      soft: "bg-[var(--brand-soft)] text-[var(--brand-soft-text)] hover:bg-[var(--rose-300)]/50",
      danger:
        "bg-[var(--berry-700)] text-[var(--paper-50)] hover:bg-[#832F36] active:bg-[#68242A]",
    };

    const sizeStyles = {
      sm: "text-xs px-3 py-1.5 gap-1.5 min-h-[32px]",
      md: "text-sm px-4 py-2 gap-2 min-h-[40px]",
      lg: "text-base px-5 py-2.5 gap-2.5 min-h-[48px]",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin shrink-0" aria-hidden="true" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";
