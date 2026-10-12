import * as React from "react";
import { cn } from "@/lib/utils";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  rounded?: "sm" | "md" | "lg" | "full";
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  rounded = "md",
  ...props
}) => {
  const roundedStyles = {
    sm: "rounded-[var(--radius-sm)]",
    md: "rounded-[var(--radius-md)]",
    lg: "rounded-[var(--radius-xl)]",
    full: "rounded-full",
  };

  return (
    <div
      aria-hidden="true"
      className={cn(
        "bg-[var(--paper-200)] animate-pulse border border-[var(--border-subtle)]/40",
        roundedStyles[rounded],
        className
      )}
      {...props}
    />
  );
};
