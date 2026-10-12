import * as React from "react";
import Link from "next/link";
import { WorkspaceShell } from "@/components/layout/WorkspaceShell";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { ArrowLeft, CheckCircle } from "lucide-react";

export function generateStaticParams() {
  return [
    { slug: "acoustic-song-circle" },
    { slug: "weekend-leaf-printing" },
    { slug: "board-game-strategy" },
  ];
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const readableTitle = slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <WorkspaceShell>
      <PageContainer
        eyebrow="Community Event"
        title={readableTitle}
        description="A friendly gathering designed for mutual encouragement and low-stress participation."
        breadcrumbs={[
          { label: "Events & Challenges", href: "/events" },
          { label: readableTitle },
        ]}
        actions={
          <Button variant="primary" size="sm" leftIcon={<CheckCircle className="w-4 h-4" />}>
            RSVP Attending (Demo)
          </Button>
        }
      >
        <div className="flex flex-col gap-6 max-w-3xl text-left">
          <Card variant="editorial">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Badge variant="brand" dot>Virtual Atelier Room</Badge>
                <span className="text-xs text-[var(--stone-600)]">Open to Beginners</span>
              </div>
              <CardTitle className="text-xl mt-2 text-[var(--wine-950)]">
                About this Session
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-[var(--ink-800)] leading-relaxed flex flex-col gap-4">
              <p>
                Bring whatever project you are currently working on. We set a quiet timer, create alongside one another, and spend the final 10 minutes sharing small discoveries.
              </p>
              <div className="pt-2 flex items-center gap-3">
                <Link href="/events">
                  <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
                    Back to All Events
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    </WorkspaceShell>
  );
}
