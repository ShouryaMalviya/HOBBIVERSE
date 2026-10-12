import * as React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "editorial" | "interactive";
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const variantStyles = {
      default:
        "bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-[var(--shadow-subtle)]",
      elevated:
        "bg-[var(--bg-elevated)] border border-[var(--border-subtle)] shadow-[var(--shadow-warm)]",
      editorial:
        "bg-[var(--paper-100)] border border-[var(--sand-400)]/60 shadow-[var(--shadow-warm)] relative overflow-hidden",
      interactive:
        "bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-[var(--shadow-subtle)] hover:shadow-[var(--shadow-warm)] hover:border-[var(--brand-soft-text)]/40 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-[var(--radius-xl)] p-5 sm:p-6 transition-all",
          variantStyles[variant],
          className
        )}
        {...props}
      />
    );
  }
);
Card.displayName = "Card";

export const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col gap-1.5 pb-4", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

export const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-lg sm:text-xl font-bold tracking-tight text-[var(--ink-950)] leading-snug",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-[var(--ink-700)] leading-relaxed", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

export const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

export const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center pt-4 border-t border-[var(--border-subtle)] mt-4",
      className
    )}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";
