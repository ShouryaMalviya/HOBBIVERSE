import * as React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className }) => {
  return (
    <nav
      aria-label="Breadcrumbs"
      className={cn("flex items-center text-xs text-[var(--stone-600)] mb-4", className)}
    >
      <ol className="flex items-center gap-1.5 flex-wrap">
        <li>
          <Link
            href="/home"
            className="flex items-center gap-1 hover:text-[var(--wine-700)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)] rounded"
          >
            <Home className="w-3.5 h-3.5" aria-hidden="true" />
            <span className="sr-only">Home</span>
          </Link>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
              <ChevronRight className="w-3 h-3 text-[var(--sand-400)] shrink-0" aria-hidden="true" />
              {isLast || !item.href ? (
                <span className="font-semibold text-[var(--ink-950)] truncate max-w-[200px]" aria-current={isLast ? "page" : undefined}>
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="hover:text-[var(--wine-700)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)] rounded"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
