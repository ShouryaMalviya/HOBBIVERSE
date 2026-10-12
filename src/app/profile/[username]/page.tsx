import * as React from "react";
import Link from "next/link";
import { WorkspaceShell } from "@/components/layout/WorkspaceShell";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { ShieldCheck, Edit3 } from "lucide-react";

export function generateStaticParams() {
  return [
    { username: "demo-user" },
    { username: "clara" },
  ];
}

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const displayName = username
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <WorkspaceShell>
      <PageContainer
        eyebrow="Member Profile"
        title={displayName}
        description={`@${username} · Creative explorer in the Hobbiverse atelier.`}
        breadcrumbs={[
          { label: "Community", href: "/community" },
          { label: `@${username}` },
        ]}
        actions={
          <Link href="/settings">
            <Button variant="outline" size="sm" leftIcon={<Edit3 className="w-4 h-4" />}>
              Edit Profile Settings
            </Button>
          </Link>
        }
      >
        <div className="flex flex-col gap-8 max-w-4xl text-left">
          {/* Profile Card */}
          <div className="p-6 rounded-[var(--radius-xl)] bg-[var(--paper-100)] border border-[var(--sand-400)] flex flex-col sm:flex-row items-start sm:items-center gap-5 shadow-[var(--shadow-subtle)]">
            <Avatar name={displayName} size="xl" status="online" />
            <div className="flex flex-col gap-1.5 flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-[var(--wine-950)]">{displayName}</h2>
                <Badge variant="outdoors-nature" size="sm">Local Explorer</Badge>
              </div>
              <p className="text-sm text-[var(--ink-700)]">
                Exploring botanical watercolors, sourdough baking, and acoustic guitar at a peaceful, steady rhythm.
              </p>
              <div className="flex items-center gap-3 pt-2 text-xs text-[var(--stone-600)]">
                <span>3 Saved Pursuits</span>
                <span>&middot;</span>
                <span>4 Planned Sessions</span>
                <span>&middot;</span>
                <span className="text-[var(--forest-700)] font-medium">Journal Private</span>
              </div>
            </div>
          </div>

          {/* Privacy Isolation Notice */}
          <div className="p-4 rounded-[var(--radius-lg)] bg-[var(--paper-200)] border border-[var(--border-subtle)] flex items-center gap-3 text-xs text-[var(--ink-800)]">
            <ShieldCheck className="w-4 h-4 text-[var(--forest-700)] shrink-0" aria-hidden="true" />
            <span>
              <strong>Zero-Leakage Privacy:</strong> Private journal entries, personal reflection check-ins, and draft notes are never visible on public member profiles.
            </span>
          </div>
        </div>
      </PageContainer>
    </WorkspaceShell>
  );
}
