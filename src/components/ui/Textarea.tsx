import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, helperText, error, id, disabled, rows = 3, ...props }, ref) => {
    const generatedId = React.useId();
    const textareaId = id || generatedId;
    const errorId = `${textareaId}-error`;
    const helperId = `${textareaId}-helper`;

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-xs font-semibold uppercase tracking-wider text-[var(--ink-700)] select-none"
          >
            {label}
          </label>
        )}

        <textarea
          id={textareaId}
          ref={ref}
          rows={rows}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          className={cn(
            "w-full bg-[var(--paper-100)] text-[var(--ink-950)] placeholder:text-[var(--stone-500)]",
            "border rounded-[var(--radius-md)] p-3 text-sm transition-all duration-150 resize-y",
            "border-[var(--border-default)] hover:border-[var(--stone-500)]",
            "focus:bg-[var(--bg-elevated)] focus:border-[var(--brand-anchor)] focus:outline-none focus:ring-3 focus:ring-[var(--brand-anchor)]/15",
            "disabled:bg-[var(--paper-200)] disabled:text-[var(--stone-500)] disabled:cursor-not-allowed",
            error && "border-[var(--berry-700)] focus:border-[var(--berry-700)] focus:ring-[var(--berry-700)]/20",
            className
          )}
          {...props}
        />

        {error ? (
          <p id={errorId} className="text-xs font-medium text-[var(--berry-700)]" role="alert">
            {error}
          </p>
        ) : helperText ? (
          <p id={helperId} className="text-xs text-[var(--stone-600)]">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
