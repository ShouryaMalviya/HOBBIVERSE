import * as React from "react";
import Link from "next/link";
import { WorkspaceShell } from "@/components/layout/WorkspaceShell";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import {
  FeaturedEditorialCard,
  ProgressCard,
  ReflectionCard,
} from "@/components/ui/CardArchetypes";
import { Calendar, BookOpen } from "lucide-react";

export default function WorkspaceHomePage() {
  return (
    <WorkspaceShell>
      <PageContainer
        eyebrow="Atelier Dashboard"
        title="Welcome to your creative space"
        description="Pick up where you left off or take today's next gentle step."
        badge={<Badge variant="outdoors-nature" dot size="sm">Demo Mode Active</Badge>}
        actions={
          <div className="flex items-center gap-2">
            <Link href="/planner">
              <Button variant="secondary" size="sm" leftIcon={<Calendar className="w-4 h-4" />}>
                View Planner
              </Button>
            </Link>
            <Link href="/journal">
              <Button variant="primary" size="sm" leftIcon={<BookOpen className="w-4 h-4" />}>
                Private Reflection
              </Button>
            </Link>
          </div>
        }
      >
        <div className="flex flex-col gap-8 text-left">
          {/* Featured "Next Small Step" */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <FeaturedEditorialCard
                category="art-craft"
                title="Botanical Watercolor Leaf Studies"
                excerpt="Today's step: Practice simple gradient washes on 3 leaves. Estimated time: 15 minutes."
                timeEstimate="15 min"
              />
            </div>

            <div>
              <ProgressCard
                title="Artisan Sourdough Rhythm"
                stepCurrent={2}
                stepTotal={4}
                category="outdoors-nature"
              />
            </div>
          </div>

          {/* Quick Actions & Reflections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ReflectionCard
              date="Yesterday &middot; Evening"
              moodLabel="Calm & Restored"
              quote="Mixed olive greens and cobalt blues. It felt quiet and deeply restorative after a busy day."
              activityName="Watercolor Painting"
            />

            <Card variant="default">
              <CardHeader>
                <CardTitle className="text-base">Upcoming Planned Sessions</CardTitle>
                <CardDescription>Flexible routine without guilt or penalties</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <div className="p-3 rounded-lg bg-[var(--paper-200)] flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-[var(--ink-950)] block">Guitar Chord Transition</span>
                    <span className="text-[var(--stone-600)]">Tomorrow &middot; 20 minutes</span>
                  </div>
                  <Link href="/planner">
                    <Button variant="ghost" size="sm">Edit</Button>
                  </Link>
                </div>

                <div className="p-3 rounded-lg bg-[var(--paper-200)] flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-[var(--ink-950)] block">Pressed Herbarium Specimen</span>
                    <span className="text-[var(--stone-600)]">Saturday &middot; 30 minutes</span>
                  </div>
                  <Link href="/planner">
                    <Button variant="ghost" size="sm">Edit</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </PageContainer>
    </WorkspaceShell>
  );
}
