"use client";

import * as React from "react";
import Link from "next/link";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { HobbiverseBrand } from "@/components/layout/HobbiverseBrand";
import { Sparkles, ArrowRight, Mail, Lock } from "lucide-react";

export default function SignInPage() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-page)] text-[var(--text-body)]">
      <PublicHeader />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md bg-[var(--paper-100)] border border-[var(--sand-400)] rounded-[var(--radius-2xl)] p-6 sm:p-8 shadow-[var(--shadow-warm)] text-left flex flex-col gap-6">
          <div className="text-center flex flex-col items-center gap-2">
            <HobbiverseBrand size="md" />
            <h1 className="text-2xl font-extrabold text-[var(--wine-950)] mt-2">
              Welcome Back
            </h1>
            <p className="text-xs text-[var(--stone-600)]">
              Continue your creative routine in the atelier
            </p>
          </div>

          {/* Explicit Demo Mode Button */}
          <div className="p-4 rounded-[var(--radius-lg)] bg-[var(--brand-soft)] border border-[var(--rose-300)] flex flex-col gap-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-[var(--brand-soft-text)]">
              <Sparkles className="w-4 h-4 text-[var(--wine-700)]" aria-hidden="true" />
              <span>Instant Local Demo</span>
            </div>
            <p className="text-xs text-[var(--ink-700)] leading-relaxed">
              Explore all features with realistic sample data stored right in your browser. Zero cloud account needed.
            </p>
            <Link href="/home" className="w-full">
              <Button variant="primary" size="sm" className="w-full" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Enter Atelier Demo Workspace
              </Button>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-[var(--border-subtle)]" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--stone-600)]">
              Or Sign In
            </span>
            <div className="flex-1 h-px bg-[var(--border-subtle)]" />
          </div>

          <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-4">
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              leftIcon={<Mail className="w-4 h-4" />}
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              leftIcon={<Lock className="w-4 h-4" />}
            />

            <Link href="/home">
              <Button variant="secondary" size="md" className="w-full mt-2">
                Sign In (Demo Fallback)
              </Button>
            </Link>
          </form>

          <div className="text-center text-xs text-[var(--stone-600)] pt-2 border-t border-[var(--border-subtle)]">
            Don&apos;t have an account yet?{" "}
            <Link href="/sign-up" className="font-semibold text-[var(--wine-800)] hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
