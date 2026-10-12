import { WorkspaceShell } from "@/components/layout/WorkspaceShell";
import { PageContainer } from "@/components/layout/PageContainer";
import { EventTile } from "@/components/ui/CardArchetypes";

export default function EventsPage() {
  return (
    <WorkspaceShell>
      <PageContainer
        eyebrow="Gatherings &amp; Prompts"
        title="Friendly Challenges &amp; Studio Events"
        description="Low-pressure prompts and virtual meetups to inspire consistency alongside other hobbyists."
        breadcrumbs={[{ label: "Events & Challenges" }]}
      >
        <div className="flex flex-col gap-8 text-left">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <EventTile
              title="Acoustic Song Circle &amp; Tea"
              dateStr="Thursday &middot; 7:00 PM"
              category="music"
              participants={16}
            />

            <EventTile
              title="Weekend Leaf Printing Prompt"
              dateStr="Saturday &middot; All Day"
              category="art-craft"
              participants={28}
            />

            <EventTile
              title="Board Game Strategy Night"
              dateStr="Sunday &middot; 5:00 PM"
              category="social-games"
              participants={12}
            />
          </div>
        </div>
      </PageContainer>
    </WorkspaceShell>
  );
}
