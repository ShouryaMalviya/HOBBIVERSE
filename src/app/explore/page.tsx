import * as React from "react";
import Link from "next/link";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Badge, BadgeVariant } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/Card";
import { CATEGORY_THEMES } from "@/styles/tokens";
import { Clock, ArrowRight } from "lucide-react";
import { SEED_HOBBIES } from "@/services/seedData";

export default function ExplorePage() {
  const sampleHobbies = SEED_HOBBIES;

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-page)] text-[var(--text-body)]">
      <PublicHeader />

      <PageContainer
        eyebrow="Discovery Engine"
        title="Explore Creative Pathways"
        description="Browse beginner-friendly hobbies organized by time commitment, budget, and energy level."
        breadcrumbs={[{ label: "Explore" }]}
        actions={
          <Link href="/home">
            <Button variant="secondary" size="sm">
              Open Workspace
            </Button>
          </Link>
        }
      >
        <div className="flex flex-col gap-8 text-left">
          {/* Category Chips Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <Badge variant="brand" className="cursor-pointer">All Categories</Badge>
            {Object.values(CATEGORY_THEMES).map((cat) => (
              <Badge key={cat.id} variant={cat.id as BadgeVariant} dot className="cursor-pointer shrink-0">
                {cat.name}
              </Badge>
            ))}
          </div>

          {/* Sample Catalog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sampleHobbies.map((hobby) => (
              <Card key={hobby.slug} variant="interactive">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant={hobby.category} dot>
                      {hobby.categoryName}
                    </Badge>
                    <span className="text-xs text-[var(--stone-600)] flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" aria-hidden="true" /> {hobby.timeEstimate}
                    </span>
                  </div>
                  <CardTitle className="mt-2 text-lg">{hobby.title}</CardTitle>
                  <CardDescription>{hobby.description}</CardDescription>
                </CardHeader>
                <CardFooter className="justify-between">
                  <span className="text-xs font-semibold text-[var(--forest-700)]">
                    Beginner friendly &middot; Step 1 ready
                  </span>
                  <Link href={`/hobbies/${hobby.slug}`}>
                    <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                      View Pathway
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </PageContainer>

      <PublicFooter />
    </div>
  );
}
