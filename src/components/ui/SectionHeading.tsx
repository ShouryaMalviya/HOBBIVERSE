import * as React from "react";
import { cn } from "@/lib/utils";

export interface SectionHeadingProps extends React.HTMLAttributes<HTMLDivElement> {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  align?: "left" | "center";
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  className,
  eyebrow,
  title,
  description,
  action,
  align = "left",
  ...props
}) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 mb-6 sm:mb-8",
        align === "center" ? "items-center text-center mx-auto max-w-2xl" : "items-start text-left",
        action && "sm:flex-row sm:items-end sm:justify-between sm:gap-6",
        className
      )}
      {...props}
    >
      <div className="flex flex-col gap-1.5">
        {eyebrow && (
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--wine-700)]">
            {eyebrow}
          </span>
        )}
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--wine-950)] leading-tight">
          {title}
        </h2>
        {description && (
          <p className="text-sm sm:text-base text-[var(--ink-700)] leading-relaxed max-w-2xl">
            {description}
          </p>
        )}
      </div>

      {action && <div className="mt-3 sm:mt-0 shrink-0">{action}</div>}
    </div>
  );
};
