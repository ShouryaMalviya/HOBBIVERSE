"use client";

import * as React from "react";
import Link from "next/link";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { CATEGORY_THEMES } from "@/styles/tokens";
import { ArrowRight, Check } from "lucide-react";

export default function OnboardingPage() {
  const [selectedInterests, setSelectedInterests] = React.useState<string[]>([
    "art-craft",
    "mindful",
  ]);

  const toggleInterest = (id: string) => {
    setSelectedInterests((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-body)] py-8 sm:py-12">
      <PageContainer
        maxWidth="md"
        eyebrow="Personalize Your Atelier"
        title="What kinds of creative joy spark your curiosity?"
        description="Select a few areas you'd like to explore. We use these to recommend your first small steps."
        breadcrumbs={[{ label: "Onboarding" }]}
      >
        <div className="flex flex-col gap-8 text-left">
          {/* Category Chips Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Object.values(CATEGORY_THEMES).map((cat) => {
              const isSelected = selectedInterests.includes(cat.id);
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => toggleInterest(cat.id)}
                  style={{
                    backgroundColor: isSelected ? cat.bgLight : cat.bgSubtle,
                    borderColor: isSelected ? cat.accent : cat.border,
                  }}
                  className="p-4 rounded-[var(--radius-xl)] border text-left flex items-center justify-between transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)]"
                >
                  <div className="flex flex-col">
                    <span style={{ color: cat.textStrong }} className="font-bold text-sm">
                      {cat.name}
                    </span>
                    <span className="text-[11px] opacity-75 mt-0.5" style={{ color: cat.textStrong }}>
                      {cat.colorFamilyName}
                    </span>
                  </div>
                  <div
                    style={{
                      backgroundColor: isSelected ? cat.textStrong : "transparent",
                      borderColor: cat.textStrong,
                    }}
                    className="w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors"
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-[var(--border-subtle)]">
            <span className="text-xs text-[var(--stone-600)]">
              {selectedInterests.length} areas selected &middot; Can be updated anytime in settings
            </span>
            <Link href="/home">
              <Button variant="primary" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Complete Setup &amp; Enter Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
