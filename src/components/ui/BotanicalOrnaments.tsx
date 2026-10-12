import * as React from "react";
import { cn } from "@/lib/utils";

export const BotanicalLeaf: React.FC<{ className?: string; color?: string }> = ({
  className,
  color = "var(--forest-700)",
}) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn("w-6 h-6", className)}
    aria-hidden="true"
  >
    <path
      d="M12 52C22 48 38 42 52 12C36 18 20 28 12 52Z"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 52C24 38 38 26 52 12"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M26 38C30 35 34 35 37 36"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M34 29C38 27 41 27 44 28"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

export const BotanicalBranch: React.FC<{ className?: string; color?: string }> = ({
  className,
  color = "var(--wine-700)",
}) => (
  <svg
    viewBox="0 0 100 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn("w-20 h-8", className)}
    aria-hidden="true"
  >
    <path
      d="M5 35C30 30 65 20 95 5"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M25 29C22 24 24 18 30 18C33 22 31 27 25 29Z"
      fill={color}
      fillOpacity="0.2"
      stroke={color}
      strokeWidth="1.5"
    />
    <path
      d="M48 23C47 16 51 12 57 13C58 18 54 22 48 23Z"
      fill={color}
      fillOpacity="0.2"
      stroke={color}
      strokeWidth="1.5"
    />
    <path
      d="M72 16C73 9 78 7 83 9C83 14 78 17 72 16Z"
      fill={color}
      fillOpacity="0.2"
      stroke={color}
      strokeWidth="1.5"
    />
  </svg>
);

export const AtelierArch: React.FC<{
  className?: string;
  children: React.ReactNode;
}> = ({ className, children }) => (
  <div
    className={cn(
      "relative rounded-t-[100px] rounded-b-[var(--radius-xl)] border border-[var(--sand-400)] bg-[var(--paper-100)] p-6 shadow-[var(--shadow-warm)] overflow-hidden",
      className
    )}
  >
    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[var(--wine-700)] via-[var(--rose-500)] to-[var(--wine-800)]" />
    {children}
  </div>
);
