import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      label,
      helperText,
      error,
      leftIcon,
      rightIcon,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold uppercase tracking-wider text-[var(--ink-700)] select-none"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center w-full">
          {leftIcon && (
            <div className="absolute left-3.5 text-[var(--stone-600)] pointer-events-none flex items-center justify-center">
              {leftIcon}
            </div>
          )}

          <input
            id={inputId}
            ref={ref}
            type={type}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : helperText ? helperId : undefined}
            className={cn(
              "w-full bg-[var(--paper-100)] text-[var(--ink-950)] placeholder:text-[var(--stone-500)]",
              "border rounded-[var(--radius-md)] px-3.5 py-2 text-sm transition-all duration-150 min-h-[42px]",
              "border-[var(--border-default)] hover:border-[var(--stone-500)]",
              "focus:bg-[var(--bg-elevated)] focus:border-[var(--brand-anchor)] focus:outline-none focus:ring-3 focus:ring-[var(--brand-anchor)]/15",
              "disabled:bg-[var(--paper-200)] disabled:text-[var(--stone-500)] disabled:cursor-not-allowed",
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              error && "border-[var(--berry-700)] focus:border-[var(--berry-700)] focus:ring-[var(--berry-700)]/20",
              className
            )}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3.5 text-[var(--stone-600)] flex items-center justify-center">
              {rightIcon}
            </div>
          )}
        </div>

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

Input.displayName = "Input";
