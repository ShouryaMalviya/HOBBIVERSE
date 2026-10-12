import * as React from "react";
import { cn } from "@/lib/utils";

export type BadgeVariant =
  | "brand"
  | "neutral"
  | "outline"
  // 8 Category Themes
  | "art-craft"
  | "outdoors-nature"
  | "music"
  | "cooking"
  | "movement"
  | "mindful"
  | "reading-writing"
  | "social-games";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: "sm" | "md";
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = "brand",
  size = "md",
  dot = false,
  children,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center font-medium rounded-[var(--radius-pill)] border transition-colors select-none";

  const sizeStyles = {
    sm: "text-[11px] px-2.5 py-0.5 gap-1.5",
    md: "text-xs px-3 py-1 gap-2",
  };

  const variantStyles: Record<BadgeVariant, string> = {
    brand:
      "bg-[var(--wine-800)] text-[var(--paper-50)] border-transparent",
    neutral:
      "bg-[var(--paper-200)] text-[var(--ink-800)] border-[var(--border-subtle)]",
    outline:
      "bg-transparent text-[var(--ink-700)] border-[var(--border-default)]",
    // Category accents
    "art-craft":
      "bg-[var(--peach-100)] text-[var(--clay-700)] border-[var(--peach-300)]",
    "outdoors-nature":
      "bg-[var(--sage-100)] text-[var(--forest-700)] border-[var(--sage-300)]",
    music:
      "bg-[var(--lilac-100)] text-[var(--plum-700)] border-[var(--lilac-300)]",
    cooking:
      "bg-[var(--butter-100)] text-[var(--ochre-700)] border-[var(--butter-300)]",
    movement:
      "bg-[var(--sky-100)] text-[var(--ocean-700)] border-[var(--sky-300)]",
    mindful:
      "bg-[var(--lagoon-100)] text-[var(--deep-teal-700)] border-[var(--lagoon-300)]",
    "reading-writing":
      "bg-[var(--rose-100)] text-[var(--wine-700)] border-[var(--rose-300)]",
    "social-games":
      "bg-[var(--coral-100)] text-[var(--berry-700)] border-[var(--coral-300)]",
  };

  const dotColors: Record<BadgeVariant, string> = {
    brand: "bg-[var(--paper-50)]",
    neutral: "bg-[var(--stone-600)]",
    outline: "bg-[var(--brand-anchor)]",
    "art-craft": "bg-[var(--clay-700)]",
    "outdoors-nature": "bg-[var(--forest-700)]",
    music: "bg-[var(--plum-700)]",
    cooking: "bg-[var(--ochre-700)]",
    movement: "bg-[var(--ocean-700)]",
    mindful: "bg-[var(--deep-teal-700)]",
    "reading-writing": "bg-[var(--wine-700)]",
    "social-games": "bg-[var(--berry-700)]",
  };

  return (
    <span
      className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
      {...props}
    >
      {dot && (
        <span
          className={cn("w-1.5 h-1.5 rounded-full shrink-0", dotColors[variant])}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
};
