import * as React from "react";
import Link from "next/link";
import { WorkspaceShell } from "@/components/layout/WorkspaceShell";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { CommunityPostCard } from "@/components/ui/CardArchetypes";
import { Plus, Users } from "lucide-react";

export default function CommunityPage() {
  return (
    <WorkspaceShell>
      <PageContainer
        eyebrow="Positive Connection"
        title="Kindred Circles &amp; Community"
        description="Share work-in-progress, celebrate small steps, and connect with fellow creators in a quiet, positive space."
        breadcrumbs={[{ label: "Community" }]}
        actions={
          <div className="flex items-center gap-2">
            <Link href="/groups/botanical-artists">
              <Button variant="outline" size="sm" leftIcon={<Users className="w-4 h-4" />}>
                Explore Circles
              </Button>
            </Link>
            <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
              Share a Small Step
            </Button>
          </div>
        }
      >
        <div className="flex flex-col gap-6 max-w-3xl text-left">
          {/* Feed Posts */}
          <div className="flex flex-col gap-4">
            <CommunityPostCard
              authorName="Clara Bow"
              handle="clarabow_art"
              category="art-craft"
              content="First batch of wild blackberry watercolor pigment extracted and test-painted on linen paper! Loving the earthy muted violet tone."
              timeAgo="2 hours ago"
              likes={18}
              comments={4}
            />

            <CommunityPostCard
              authorName="Marcus Thorne"
              handle="marcus_ferment"
              category="cooking"
              content="Finally caught that open crumb on my 75% hydration loaf after 3 weeks of gentle practice. Progress feels sweet!"
              timeAgo="5 hours ago"
              likes={32}
              comments={7}
            />
          </div>
        </div>
      </PageContainer>
    </WorkspaceShell>
  );
}
