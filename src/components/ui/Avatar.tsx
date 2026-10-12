"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  name?: string;
  size?: "sm" | "md" | "lg" | "xl";
  status?: "online" | "offline" | "idle";
}

export const Avatar: React.FC<AvatarProps> = ({
  className,
  src,
  alt = "User avatar",
  name,
  size = "md",
  status,
  ...props
}) => {
  const [hasError, setHasError] = React.useState(false);

  const initials = React.useMemo(() => {
    if (!name) return "H";
    return name
      .split(" ")
      .map((part) => part[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }, [name]);

  const sizeStyles = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
    xl: "w-16 h-16 text-lg font-bold",
  };

  const statusColors = {
    online: "bg-[var(--forest-700)]",
    idle: "bg-[var(--amber-500)]",
    offline: "bg-[var(--stone-500)]",
  };

  return (
    <div className="relative inline-flex shrink-0 select-none" {...props}>
      <div
        className={cn(
          "rounded-full flex items-center justify-center font-semibold overflow-hidden border border-[var(--border-subtle)] shadow-[var(--shadow-subtle)]",
          sizeStyles[size],
          !src || hasError
            ? "bg-[var(--brand-soft)] text-[var(--brand-soft-text)]"
            : "bg-[var(--paper-200)]",
          className
        )}
      >
        {src && !hasError ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={src}
            alt={alt}
            onError={() => setHasError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <span>{initials}</span>
        )}
      </div>

      {status && (
        <span
          className={cn(
            "absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-[var(--bg-page)]",
            statusColors[status]
          )}
          aria-label={`Status: ${status}`}
        />
      )}
    </div>
  );
};
