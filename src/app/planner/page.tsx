import { WorkspaceShell } from "@/components/layout/WorkspaceShell";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Plus, CheckCircle2 } from "lucide-react";

export default function PlannerPage() {
  return (
    <WorkspaceShell>
      <PageContainer
        eyebrow="Routine &amp; Flow"
        title="Activity Planner &amp; Session Log"
        description="Schedule gentle creative sessions and log completed practices with zero shame or streak penalties."
        breadcrumbs={[{ label: "Planner" }]}
        actions={
          <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
            Plan New Session
          </Button>
        }
      >
        <div className="flex flex-col gap-8 text-left">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Planned Activities */}
            <Card variant="default">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Upcoming Schedule</CardTitle>
                  <Badge variant="outdoors-nature" size="sm">Flexible</Badge>
                </div>
                <CardDescription>Upcoming times set aside for your creative space</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <div className="p-3.5 rounded-lg bg-[var(--paper-200)] border border-[var(--border-subtle)] flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-bold text-sm text-[var(--ink-950)]">Watercolor Color Mixing</span>
                    <span className="text-xs text-[var(--stone-600)]">Tomorrow &middot; 20 min</span>
                  </div>
                  <Button variant="secondary" size="sm">Log Complete</Button>
                </div>

                <div className="p-3.5 rounded-lg bg-[var(--paper-200)] border border-[var(--border-subtle)] flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-bold text-sm text-[var(--ink-950)]">Sourdough Fold &amp; Rest</span>
                    <span className="text-xs text-[var(--stone-600)]">Saturday 10:00 AM &middot; 15 min</span>
                  </div>
                  <Button variant="secondary" size="sm">Log Complete</Button>
                </div>
              </CardContent>
            </Card>

            {/* Completed Sessions Log */}
            <Card variant="default">
              <CardHeader>
                <CardTitle className="text-base">Recent Sessions</CardTitle>
                <CardDescription>Celebrated moments of presence</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <div className="p-3.5 rounded-lg bg-[var(--paper-200)] border border-[var(--border-subtle)] flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-bold text-sm text-[var(--ink-950)]">Guitar Travis Picking</span>
                    <span className="text-xs text-[var(--forest-700)] font-medium">Logged &middot; 25 min</span>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-[var(--forest-700)]" aria-hidden="true" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </PageContainer>
    </WorkspaceShell>
  );
}
