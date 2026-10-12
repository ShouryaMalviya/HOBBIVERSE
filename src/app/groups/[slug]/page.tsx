import * as React from "react";
import Link from "next/link";
import { WorkspaceShell } from "@/components/layout/WorkspaceShell";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { UserPlus, ArrowLeft } from "lucide-react";
import { SEED_GROUPS } from "@/services/seedData";

export function generateStaticParams() {
  return SEED_GROUPS.map((g) => ({ slug: g.slug }));
}

export default async function GroupDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const readableName = slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <WorkspaceShell>
      <PageContainer
        eyebrow="Niche Circle"
        title={readableName}
        description="A dedicated space for mutual encouragement, process sharing, and thoughtful feedback."
        breadcrumbs={[
          { label: "Community", href: "/community" },
          { label: readableName },
        ]}
        actions={
          <Button variant="primary" size="sm" leftIcon={<UserPlus className="w-4 h-4" />}>
            Join Circle (Demo)
          </Button>
        }
      >
        <div className="flex flex-col gap-6 max-w-3xl text-left">
          <Card variant="editorial">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Badge variant="brand" dot>48 Kindred Members</Badge>
                <span className="text-xs text-[var(--stone-600)]">Active Discussions</span>
              </div>
              <CardTitle className="text-xl mt-2 text-[var(--wine-950)]">
                About this Circle
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-[var(--ink-800)] leading-relaxed">
              We gather to share beginner breakthroughs, swap supply tips, and celebrate creative practice without comparison or competitive pressure.
            </CardContent>
          </Card>

          <div className="flex items-center gap-3">
            <Link href="/community">
              <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
                Back to Community Feed
              </Button>
            </Link>
          </div>
        </div>
      </PageContainer>
    </WorkspaceShell>
  );
}
