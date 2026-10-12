import * as React from "react";
import Link from "next/link";
import { WorkspaceShell } from "@/components/layout/WorkspaceShell";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { ProgressCard } from "@/components/ui/CardArchetypes";
import { Plus } from "lucide-react";

export default function MyHobbiesPage() {
  return (
    <WorkspaceShell>
      <PageContainer
        eyebrow="Personal Collection"
        title="My Saved Hobbies &amp; Pathways"
        description="Your gentle creative pursuits. Follow steps at your own pace whenever you have time."
        breadcrumbs={[{ label: "My Hobbies" }]}
        actions={
          <Link href="/explore">
            <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
              Discover More Hobbies
            </Button>
          </Link>
        }
      >
        <div className="flex flex-col gap-8 text-left">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ProgressCard
              title="Botanical Watercolor Painting"
              stepCurrent={1}
              stepTotal={5}
              category="art-craft"
            />
            <ProgressCard
              title="Artisan Sourdough Rhythm"
              stepCurrent={2}
              stepTotal={4}
              category="outdoors-nature"
            />
            <ProgressCard
              title="Fingerstyle Acoustic Guitar"
              stepCurrent={1}
              stepTotal={4}
              category="mindful"
            />
          </div>
        </div>
      </PageContainer>
    </WorkspaceShell>
  );
}
