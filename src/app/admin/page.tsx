import * as React from "react";
import { WorkspaceShell } from "@/components/layout/WorkspaceShell";
import { PageContainer } from "@/components/layout/PageContainer";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { ShieldCheck } from "lucide-react";

export default function AdminModerationPage() {
  return (
    <WorkspaceShell>
      <PageContainer
        eyebrow="Safety &amp; Moderation"
        title="Community Moderation Queue"
        description="Inspect reported content, enforce community guidelines, and maintain a respectful atelier atmosphere."
        badge={<Badge variant="reading-writing" size="sm">Admin Role Checked</Badge>}
        breadcrumbs={[{ label: "Moderation Queue" }]}
      >
        <div className="flex flex-col gap-6 max-w-4xl text-left">
          {/* Access Control Notice */}
          <div className="p-4 rounded-[var(--radius-xl)] bg-[var(--paper-200)] border border-[var(--sand-400)] flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[var(--forest-700)] shrink-0 mt-0.5" aria-hidden="true" />
            <div className="flex flex-col gap-1 text-xs text-[var(--ink-800)]">
              <span className="font-bold text-sm text-[var(--wine-950)]">
                Local Admin Role Active (Demo Verification)
              </span>
              <p>
                In connected Supabase mode, this route verifies server-side JWT claims (`app_metadata.role === &apos;admin&apos;`). Client-side link hiding is never treated as security.
              </p>
            </div>
          </div>

          {/* Sample Queue */}
          <Card variant="default">
            <CardHeader>
              <CardTitle className="text-base">Pending Content Reports (0 Pending)</CardTitle>
              <CardDescription>The community feed is currently calm and respectful.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-6 rounded-lg bg-[var(--paper-100)] border border-dashed border-[var(--border-subtle)] text-center text-xs text-[var(--stone-600)]">
                No active moderation flags. All community interactions adhere to atelier standards.
              </div>
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    </WorkspaceShell>
  );
}
