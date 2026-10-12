"use client";

import * as React from "react";
import { WorkspaceShell } from "@/components/layout/WorkspaceShell";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Bot, Send } from "lucide-react";

export default function CompanionPage() {
  const [prompt, setPrompt] = React.useState("");

  return (
    <WorkspaceShell>
      <PageContainer
        eyebrow="Hobby Discovery Guide"
        title="Atelier Hobby Companion"
        description="Describe your mood, time, or curiosity. The companion helps match you with gentle creative practices."
        badge={<Badge variant="reading-writing" size="sm">Demo Mode &middot; Deterministic Rules</Badge>}
        breadcrumbs={[{ label: "Companion" }]}
      >
        <div className="flex flex-col gap-6 max-w-3xl text-left">
          {/* Honest AI Boundary Notice */}
          <div className="p-4 rounded-[var(--radius-xl)] bg-[var(--paper-200)] border border-[var(--sand-400)] flex items-start gap-3">
            <Bot className="w-5 h-5 text-[var(--wine-800)] shrink-0 mt-0.5" aria-hidden="true" />
            <div className="flex flex-col gap-1 text-xs text-[var(--ink-800)]">
              <span className="font-bold text-sm text-[var(--wine-950)]">
                Demo suggestions &mdash; No remote AI key configured
              </span>
              <p>
                Recommendations are generated deterministically from our local hobby catalogue based on time and energy preferences. The companion does not provide therapy, psychiatric advice, or medical counseling.
              </p>
            </div>
          </div>

          {/* Quick Prompts */}
          <div className="flex flex-wrap gap-2">
            {[
              "I have 15 quiet minutes tonight",
              "Something tactile with my hands",
              "A low-cost outdoor activity",
              "A soothing musical practice",
            ].map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => setPrompt(suggestion)}
                className="px-3 py-1.5 rounded-full bg-[var(--paper-100)] border border-[var(--border-subtle)] text-xs text-[var(--ink-800)] hover:bg-[var(--paper-200)] transition-colors cursor-pointer"
              >
                &ldquo;{suggestion}&rdquo;
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div className="flex items-center gap-2">
            <Input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Tell the atelier companion what you are seeking today..."
            />
            <Button
              variant="primary"
              size="md"
              leftIcon={<Send className="w-4 h-4" />}
              onClick={() => {}}
            >
              Ask
            </Button>
          </div>
        </div>
      </PageContainer>
    </WorkspaceShell>
  );
}
