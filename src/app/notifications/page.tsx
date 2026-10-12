import * as React from "react";
import { WorkspaceShell } from "@/components/layout/WorkspaceShell";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Check, Sparkles, Trophy } from "lucide-react";

export default function NotificationsPage() {
  return (
    <WorkspaceShell>
      <PageContainer
        eyebrow="Activity Center"
        title="Notifications &amp; Reminders"
        description="Gentle updates about your scheduled sessions and community milestones."
        breadcrumbs={[{ label: "Notifications" }]}
        actions={
          <Button variant="secondary" size="sm" leftIcon={<Check className="w-4 h-4" />}>
            Mark All as Read
          </Button>
        }
      >
        <div className="flex flex-col gap-4 max-w-3xl text-left">
          <div className="p-4 rounded-[var(--radius-xl)] bg-[var(--paper-100)] border border-[var(--border-subtle)] flex items-start gap-3.5 shadow-[var(--shadow-subtle)]">
            <div className="w-9 h-9 rounded-full bg-[var(--brand-soft)] text-[var(--wine-700)] flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="flex flex-col gap-0.5 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[var(--ink-950)]">
                  Welcome to the Atelier
                </span>
                <span className="text-[10px] text-[var(--stone-600)]">Just now</span>
              </div>
              <p className="text-xs text-[var(--ink-700)] leading-relaxed">
                Your local demo workspace is ready. Explore beginner pathways in botanical arts, cooking, and music.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-[var(--radius-xl)] bg-[var(--paper-100)] border border-[var(--border-subtle)] flex items-start gap-3.5 shadow-[var(--shadow-subtle)]">
            <div className="w-9 h-9 rounded-full bg-[var(--sage-100)] text-[var(--forest-700)] flex items-center justify-center shrink-0 mt-0.5">
              <Trophy className="w-4 h-4" />
            </div>
            <div className="flex flex-col gap-0.5 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[var(--ink-950)]">
                  Community Challenge Available
                </span>
                <span className="text-[10px] text-[var(--stone-600)]">1 hour ago</span>
              </div>
              <p className="text-xs text-[var(--ink-700)] leading-relaxed">
                The Weekend Leaf Printing prompt is open for optional participation. No pressure to join.
              </p>
            </div>
          </div>
        </div>
      </PageContainer>
    </WorkspaceShell>
  );
}
