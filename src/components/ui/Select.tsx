import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  error?: string;
  options?: SelectOption[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      label,
      helperText,
      error,
      options,
      children,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const selectId = id || generatedId;
    const errorId = `${selectId}-error`;
    const helperId = `${selectId}-helper`;

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label && (
          <label
            htmlFor={selectId}
            className="text-xs font-semibold uppercase tracking-wider text-[var(--ink-700)] select-none"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center w-full">
          <select
            id={selectId}
            ref={ref}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : helperText ? helperId : undefined}
            className={cn(
              "w-full bg-[var(--paper-100)] text-[var(--ink-950)] appearance-none cursor-pointer",
              "border rounded-[var(--radius-md)] px-3.5 py-2 pr-10 text-sm transition-all duration-150 min-h-[42px]",
              "border-[var(--border-default)] hover:border-[var(--stone-500)]",
              "focus:bg-[var(--bg-elevated)] focus:border-[var(--brand-anchor)] focus:outline-none focus:ring-3 focus:ring-[var(--brand-anchor)]/15",
              "disabled:bg-[var(--paper-200)] disabled:text-[var(--stone-500)] disabled:cursor-not-allowed",
              error && "border-[var(--berry-700)] focus:border-[var(--berry-700)]",
              className
            )}
            {...props}
          >
            {options
              ? options.map((opt) => (
                  <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                    {opt.label}
                  </option>
                ))
              : children}
          </select>

          <ChevronDown
            className="absolute right-3.5 w-4 h-4 text-[var(--stone-600)] pointer-events-none"
            aria-hidden="true"
          />
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

Select.displayName = "Select";
