"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { BotanicalBranch } from "@/components/ui/BotanicalOrnaments";
import { RotateCcw, Home } from "lucide-react";

export default function ErrorBoundaryPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // Log unexpected errors for review
    console.error("Atelier application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-body)] paper-texture flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-[var(--paper-100)] border border-[var(--sand-400)] rounded-[var(--radius-2xl)] p-8 sm:p-10 shadow-[var(--shadow-warm)] flex flex-col items-center">
        <BotanicalBranch color="var(--wine-700)" className="w-24 h-8 mb-4 opacity-75" />

        <div className="w-12 h-12 rounded-full bg-[var(--coral-100)] text-[var(--berry-700)] flex items-center justify-center font-bold text-lg mb-3">
          !
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--wine-950)] tracking-tight mb-2">
          A Momentary Pause
        </h1>

        <p className="text-sm text-[var(--ink-700)] leading-relaxed mb-6">
          We encountered a temporary bump in the atelier. Your notes and locally saved progress remain safe.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
          <Button
            variant="primary"
            size="md"
            onClick={() => reset()}
            className="w-full sm:w-auto flex-1"
            leftIcon={<RotateCcw className="w-4 h-4" />}
          >
            Try Again
          </Button>

          <Link href="/home" className="w-full sm:w-auto flex-1">
            <Button
              variant="secondary"
              size="md"
              className="w-full"
              leftIcon={<Home className="w-4 h-4" />}
            >
              Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
