import * as React from "react";
import { WorkspaceShell } from "@/components/layout/WorkspaceShell";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ReflectionCard } from "@/components/ui/CardArchetypes";
import { Plus, Lock } from "lucide-react";

export default function JournalPage() {
  return (
    <WorkspaceShell>
      <PageContainer
        eyebrow="Private Sanctuary"
        title="Private Wellbeing &amp; Reflection Journal"
        description="A quiet place to record how creative activities make you feel. Strictly confidential."
        badge={<Badge variant="reading-writing" dot size="sm">Private by Design</Badge>}
        breadcrumbs={[{ label: "Journal" }]}
        actions={
          <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
            New Private Reflection
          </Button>
        }
      >
        <div className="flex flex-col gap-6 text-left">
          {/* Privacy Guarantee Banner */}
          <div className="p-4 rounded-[var(--radius-xl)] bg-[var(--paper-200)] border border-[var(--sand-400)] flex items-start gap-3">
            <Lock className="w-5 h-5 text-[var(--wine-800)] shrink-0 mt-0.5" aria-hidden="true" />
            <div className="flex flex-col gap-1 text-xs text-[var(--ink-800)]">
              <span className="font-bold text-sm text-[var(--wine-950)]">
                Privacy Guarantee
              </span>
              <p>
                Journal entries are stored in your private browser sandbox in Demo Mode. Text written here is never exposed to public profiles, community feeds, or external search.
              </p>
            </div>
          </div>

          {/* Sample Reflection Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ReflectionCard
              date="October 11 &middot; 8:40 PM"
              moodLabel="Peaceful & Centered"
              quote="Mixing dark greens with ultramarine felt meditative. I didn't care whether the leaf looked realistic; watching the pigment bleed was calming."
              activityName="Watercolor Painting"
            />
            <ReflectionCard
              date="October 9 &middot; 7:15 PM"
              moodLabel="Joyful Focus"
              quote="The smell of warm sourdough in the oven gave the whole apartment a cozy, grounded feeling."
              activityName="Sourdough Baking"
            />
          </div>
        </div>
      </PageContainer>
    </WorkspaceShell>
  );
}
