import * as React from "react";
import Link from "next/link";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Bookmark, CheckCircle, ArrowLeft, Calendar } from "lucide-react";
import { SEED_HOBBIES } from "@/services/seedData";

export function generateStaticParams() {
  return SEED_HOBBIES.map((h) => ({ slug: h.slug }));
}

export default async function HobbyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Format readable title from slug
  const readableTitle = slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-page)] text-[var(--text-body)]">
      <PublicHeader />

      <PageContainer
        eyebrow="Hobby Pathway"
        title={readableTitle}
        description="A structured, low-pressure beginner path designed to help you take your first creative steps."
        breadcrumbs={[
          { label: "Explore", href: "/explore" },
          { label: readableTitle },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Link href="/my-hobbies">
              <Button variant="outline" size="sm" leftIcon={<Bookmark className="w-4 h-4" />}>
                Save to My Hobbies
              </Button>
            </Link>
            <Link href="/planner">
              <Button variant="primary" size="sm" leftIcon={<Calendar className="w-4 h-4" />}>
                Plan Session
              </Button>
            </Link>
          </div>
        }
      >
        <div className="flex flex-col gap-8 max-w-4xl text-left">
          {/* Overview Metadata */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-[var(--radius-lg)] bg-[var(--paper-100)] border border-[var(--border-subtle)]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--stone-600)] block">
                Time Needed
              </span>
              <span className="text-sm font-bold text-[var(--ink-950)] mt-0.5 block">
                15&ndash;20 min
              </span>
            </div>

            <div className="p-3.5 rounded-[var(--radius-lg)] bg-[var(--paper-100)] border border-[var(--border-subtle)]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--stone-600)] block">
                Skill Level
              </span>
              <span className="text-sm font-bold text-[var(--forest-700)] mt-0.5 block">
                Gentle Beginner
              </span>
            </div>

            <div className="p-3.5 rounded-[var(--radius-lg)] bg-[var(--paper-100)] border border-[var(--border-subtle)]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--stone-600)] block">
                Cost Guidance
              </span>
              <span className="text-sm font-bold text-[var(--ink-950)] mt-0.5 block">
                $10&ndash;$25 or household
              </span>
            </div>

            <div className="p-3.5 rounded-[var(--radius-lg)] bg-[var(--paper-100)] border border-[var(--border-subtle)]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--stone-600)] block">
                Pacing
              </span>
              <span className="text-sm font-bold text-[var(--wine-700)] mt-0.5 block">
                Flexible &middot; No streaks
              </span>
            </div>
          </div>

          {/* First Step Highlight */}
          <Card variant="editorial">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Badge variant="brand" dot>Step 1 of 5</Badge>
                <span className="text-xs text-[var(--stone-600)]">Today&apos;s Next Good Step</span>
              </div>
              <CardTitle className="text-xl mt-2 text-[var(--wine-950)]">
                Gather your simple starter materials
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 text-sm text-[var(--ink-800)] leading-relaxed">
              <p>
                Begin by clearing a comfortable surface. You don&apos;t need professional-grade equipment right away; basic supplies and 15 undisturbed minutes are all you need to start.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <Link href="/my-hobbies">
                  <Button variant="primary" size="sm" leftIcon={<CheckCircle className="w-4 h-4" />}>
                    Mark Step Complete (Demo)
                  </Button>
                </Link>
                <Link href="/explore">
                  <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
                    Back to Explore
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageContainer>

      <PublicFooter />
    </div>
  );
}
