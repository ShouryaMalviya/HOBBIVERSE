import * as React from "react";
import { cn } from "@/lib/utils";

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  "aria-label": string;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "soft";
  size?: "sm" | "md" | "lg";
  icon: React.ReactNode;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      className,
      variant = "ghost",
      size = "md",
      icon,
      "aria-label": ariaLabel,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center transition-all duration-200 cursor-pointer select-none rounded-[var(--radius-md)] disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)]";

    const variantStyles = {
      primary:
        "bg-[var(--brand-anchor)] text-[var(--paper-50)] hover:bg-[var(--brand-hover)] shadow-[var(--shadow-subtle)]",
      secondary:
        "bg-[var(--paper-200)] text-[var(--ink-800)] hover:bg-[var(--paper-300)] border border-[var(--border-subtle)]",
      outline:
        "bg-transparent border border-[var(--border-default)] text-[var(--ink-800)] hover:bg-[var(--paper-200)]",
      ghost:
        "bg-transparent text-[var(--ink-700)] hover:bg-[var(--paper-200)] hover:text-[var(--ink-950)]",
      soft: "bg-[var(--brand-soft)] text-[var(--brand-soft-text)] hover:bg-[var(--rose-300)]/50",
    };

    const sizeStyles = {
      sm: "w-8 h-8 text-sm",
      md: "w-10 h-10 text-base",
      lg: "w-12 h-12 text-lg",
    };

    return (
      <button
        ref={ref}
        aria-label={ariaLabel}
        disabled={disabled}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {icon}
      </button>
    );
  }
);

IconButton.displayName = "IconButton";
