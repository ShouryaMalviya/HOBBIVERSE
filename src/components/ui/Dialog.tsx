"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  className,
}) => {
  const dialogRef = React.useRef<HTMLDivElement>(null);
  const titleId = React.useId();
  const descId = React.useId();

  // Escape key listener
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[var(--ink-950)]/50 backdrop-blur-xs transition-opacity"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="presentation"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descId : undefined}
        className={cn(
          "w-full max-w-lg bg-[var(--paper-50)] text-[var(--ink-950)] rounded-[var(--radius-xl)] shadow-[var(--shadow-elevated)] border border-[var(--sand-400)] p-6 sm:p-8 animate-in fade-in-50 zoom-in-95 duration-200 relative",
          className
        )}
      >
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-5 right-5 text-[var(--stone-600)] hover:text-[var(--ink-950)] p-1.5 rounded-full hover:bg-[var(--paper-200)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)] cursor-pointer"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>

        <div className="flex flex-col gap-1.5 pr-8 mb-5">
          <h2 id={titleId} className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--wine-950)]">
            {title}
          </h2>
          {description && (
            <p id={descId} className="text-sm text-[var(--ink-700)] leading-relaxed">
              {description}
            </p>
          )}
        </div>

        <div className="py-2 text-sm leading-relaxed">{children}</div>

        {footer && (
          <div className="mt-6 pt-4 border-t border-[var(--border-subtle)] flex items-center justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
