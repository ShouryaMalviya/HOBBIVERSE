import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { BotanicalBranch, BotanicalLeaf } from "@/components/ui/BotanicalOrnaments";
import { Compass, Home } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-body)] paper-texture flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-[var(--paper-100)] border border-[var(--sand-400)] rounded-[var(--radius-2xl)] p-8 sm:p-10 shadow-[var(--shadow-warm)] flex flex-col items-center">
        <BotanicalBranch color="var(--wine-700)" className="w-24 h-8 mb-4 opacity-75" />

        <div className="w-12 h-12 rounded-full bg-[var(--brand-soft)] text-[var(--brand-soft-text)] flex items-center justify-center font-bold text-lg mb-3">
          404
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--wine-950)] tracking-tight mb-2">
          Path Not Found
        </h1>

        <p className="text-sm text-[var(--ink-700)] leading-relaxed mb-6">
          This corner of the Hobbiverse atelier doesn&apos;t seem to exist yet, or the pathway may have moved.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
          <Link href="/explore" className="w-full sm:w-auto flex-1">
            <Button variant="primary" size="md" className="w-full" leftIcon={<Compass className="w-4 h-4" />}>
              Explore Hobbies
            </Button>
          </Link>
          <Link href="/" className="w-full sm:w-auto flex-1">
            <Button variant="secondary" size="md" className="w-full" leftIcon={<Home className="w-4 h-4" />}>
              Atelier Home
            </Button>
          </Link>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-[var(--forest-700)] mt-6 pt-4 border-t border-[var(--border-subtle)] w-full justify-center">
          <BotanicalLeaf className="w-3.5 h-3.5" />
          <span>Hobbiverse &middot; Supportive Exploration</span>
        </div>
      </div>
    </div>
  );
}
