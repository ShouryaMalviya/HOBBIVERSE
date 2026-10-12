"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2, Info, AlertTriangle, AlertCircle, X } from "lucide-react";

export type ToastType = "success" | "info" | "warning" | "error";

export interface ToastProps {
  id?: string;
  type?: ToastType;
  title: string;
  message?: string;
  onClose?: () => void;
  className?: string;
}

export const Toast: React.FC<ToastProps> = ({
  type = "info",
  title,
  message,
  onClose,
  className,
}) => {
  const iconMap: Record<ToastType, React.ReactNode> = {
    success: <CheckCircle2 className="w-5 h-5 text-[var(--forest-700)] shrink-0" aria-hidden="true" />,
    info: <Info className="w-5 h-5 text-[var(--ocean-700)] shrink-0" aria-hidden="true" />,
    warning: <AlertTriangle className="w-5 h-5 text-[var(--ochre-700)] shrink-0" aria-hidden="true" />,
    error: <AlertCircle className="w-5 h-5 text-[var(--berry-700)] shrink-0" aria-hidden="true" />,
  };

  const styleMap: Record<ToastType, string> = {
    success: "bg-[var(--sage-100)] border-[var(--sage-300)] text-[var(--ink-950)]",
    info: "bg-[var(--sky-100)] border-[var(--sky-300)] text-[var(--ink-950)]",
    warning: "bg-[var(--butter-100)] border-[var(--butter-300)] text-[var(--ink-950)]",
    error: "bg-[var(--coral-100)] border-[var(--coral-300)] text-[var(--ink-950)]",
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex items-start gap-3 p-4 rounded-[var(--radius-lg)] border shadow-[var(--shadow-warm)] transition-all",
        styleMap[type],
        className
      )}
    >
      <div className="pt-0.5">{iconMap[type]}</div>
      <div className="flex-1 flex flex-col gap-0.5 text-left">
        <h4 className="text-sm font-semibold">{title}</h4>
        {message && <p className="text-xs opacity-90 leading-relaxed">{message}</p>}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          aria-label="Dismiss notification"
          className="p-1 text-[var(--ink-700)] hover:text-[var(--ink-950)] rounded-full hover:bg-black/5 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
};
