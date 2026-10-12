import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface HobbiverseBrandProps {
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
  className?: string;
}

export const HobbiverseBrand: React.FC<HobbiverseBrandProps> = ({
  size = "md",
  showTagline = false,
  className,
}) => {
  const sizeConfig = {
    sm: {
      mark: "w-7 h-7 text-sm",
      title: "text-base",
      tagline: "text-[10px]",
    },
    md: {
      mark: "w-9 h-9 text-base",
      title: "text-lg",
      tagline: "text-xs",
    },
    lg: {
      mark: "w-11 h-11 text-xl",
      title: "text-2xl",
      tagline: "text-sm",
    },
  };

  const config = sizeConfig[size];

  return (
    <Link
      href="/"
      aria-label="Hobbiverse Home"
      className={cn(
        "inline-flex items-center gap-2.5 group select-none focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)] rounded-lg",
        className
      )}
    >
      {/* Handcrafted Botanical Monogram Mark */}
      <div
        className={cn(
          "rounded-xl bg-gradient-to-br from-[var(--wine-800)] to-[var(--wine-950)] text-[var(--paper-50)] flex items-center justify-center font-bold shadow-[var(--shadow-subtle)] relative overflow-hidden group-hover:shadow-[var(--shadow-warm)] transition-all",
          config.mark
        )}
      >
        <span className="relative z-10 font-serif">H</span>
        {/* Subtle decorative leaf accent inside monogram */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="absolute -bottom-1 -right-1 w-4 h-4 text-[var(--rose-300)] opacity-40"
          aria-hidden="true"
        >
          <path
            d="M5 19C10 17 17 14 21 3C14 6 7 11 5 19Z"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      </div>

      <div className="flex flex-col leading-none">
        <span
          className={cn(
            "font-extrabold tracking-tight text-[var(--wine-950)] transition-colors group-hover:text-[var(--wine-700)]",
            config.title
          )}
        >
          Hobbiverse
        </span>
        {showTagline && (
          <span className={cn("text-[var(--text-muted)] font-medium mt-0.5", config.tagline)}>
            Botanical Creative Atelier
          </span>
        )}
      </div>
    </Link>
  );
};
