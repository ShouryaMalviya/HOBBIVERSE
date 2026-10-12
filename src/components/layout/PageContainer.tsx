import * as React from "react";
import { cn } from "@/lib/utils";
import { Breadcrumbs, BreadcrumbItem } from "./Breadcrumbs";

export interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  eyebrow?: string;
  badge?: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  maxWidth?: "md" | "lg" | "xl" | "full";
}

export const PageContainer: React.FC<PageContainerProps> = ({
  title,
  description,
  eyebrow,
  badge,
  breadcrumbs,
  actions,
  maxWidth = "xl",
  className,
  children,
  ...props
}) => {
  const maxWidthMap = {
    md: "max-w-4xl",
    lg: "max-w-5xl",
    xl: "max-w-7xl",
    full: "max-w-full",
  };

  return (
    <div
      className={cn(
        "w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 flex flex-col gap-8",
        maxWidthMap[maxWidth],
        className
      )}
      {...props}
    >
      {(breadcrumbs || title || actions) && (
        <header className="flex flex-col gap-3 pb-6 border-b border-[var(--border-subtle)] text-left">
          {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div className="flex flex-col gap-1.5 max-w-2xl">
              <div className="flex items-center gap-2">
                {eyebrow && (
                  <span className="text-xs font-bold uppercase tracking-widest text-[var(--wine-700)]">
                    {eyebrow}
                  </span>
                )}
                {badge}
              </div>

              {title && (
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[var(--wine-950)] leading-tight">
                  {title}
                </h1>
              )}

              {description && (
                <p className="text-sm sm:text-base text-[var(--ink-700)] leading-relaxed mt-1">
                  {description}
                </p>
              )}
            </div>

            {actions && <div className="flex items-center gap-2.5 shrink-0 pt-2 sm:pt-0">{actions}</div>}
          </div>
        </header>
      )}

      <main className="w-full flex-1 flex flex-col">{children}</main>
    </div>
  );
};
