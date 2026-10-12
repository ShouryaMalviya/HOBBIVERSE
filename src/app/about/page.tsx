import * as React from "react";
import Link from "next/link";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { BotanicalBranch, AtelierArch } from "@/components/ui/BotanicalOrnaments";
import { Compass, ShieldCheck, Heart, Sparkles, BookOpen } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-page)] text-[var(--text-body)]">
      <PublicHeader />

      <PageContainer
        eyebrow="Our Philosophy"
        title="Making Gentle Space for Creative Routines"
        description="Hobbiverse was built on the belief that everyday creative hobbies enrich life without needing to be monetized, optimized, or graded."
        breadcrumbs={[{ label: "About" }]}
      >
        <div className="flex flex-col gap-10 max-w-4xl text-left">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card variant="editorial">
              <CardHeader>
                <div className="w-10 h-10 rounded-xl bg-[var(--brand-soft)] text-[var(--wine-800)] flex items-center justify-center mb-2">
                  <Sparkles className="w-5 h-5" aria-hidden="true" />
                </div>
                <CardTitle className="text-base text-[var(--wine-950)]">Zero Pressure Pacing</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-[var(--ink-700)] leading-relaxed">
                Consistency without guilt. Missed days are celebrated as breathing room, never punished with broken red streak counters.
              </CardContent>
            </Card>

            <Card variant="editorial">
              <CardHeader>
                <div className="w-10 h-10 rounded-xl bg-[var(--sage-100)] text-[var(--forest-700)] flex items-center justify-center mb-2">
                  <BookOpen className="w-5 h-5" aria-hidden="true" />
                </div>
                <CardTitle className="text-base text-[var(--ink-950)]">Private Sanctuary</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-[var(--ink-700)] leading-relaxed">
                Your mood check-ins and session reflections remain client-isolated and strictly private by design. We never broadcast your personal notes.
              </CardContent>
            </Card>

            <Card variant="editorial">
              <CardHeader>
                <div className="w-10 h-10 rounded-xl bg-[var(--peach-100)] text-[var(--clay-700)] flex items-center justify-center mb-2">
                  <Heart className="w-5 h-5" aria-hidden="true" />
                </div>
                <CardTitle className="text-base text-[var(--ink-950)]">Supportive Circles</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-[var(--ink-700)] leading-relaxed">
                Niche community clubs designed like warm studio circles rather than addictive, engagement-maximizing algorithms.
              </CardContent>
            </Card>
          </div>

          {/* Honest Boundary Notice */}
          <div className="p-6 rounded-[var(--radius-xl)] bg-[var(--paper-200)] border border-[var(--sand-400)] text-left flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--wine-900)]">
              <ShieldCheck className="w-4 h-4 text-[var(--wine-700)]" aria-hidden="true" />
              <span>Ethical Product Boundary</span>
            </div>
            <p className="text-sm text-[var(--ink-800)] leading-relaxed">
              Hobbiverse supports everyday wellbeing through creative exploration. It is <strong>not</strong> a medical, diagnostic, psychiatric, therapy, or emergency crisis service. If you are experiencing acute distress or need professional support, please contact a licensed medical provider or crisis helpline in your region.
            </p>
          </div>

          {/* Action Banner */}
          <AtelierArch className="text-center py-8">
            <BotanicalBranch color="var(--wine-700)" className="w-24 h-8 mx-auto mb-2 opacity-60" />
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--wine-950)] mb-2">
              Ready to discover your next craft?
            </h2>
            <p className="text-xs sm:text-sm text-[var(--ink-700)] max-w-md mx-auto mb-5 leading-relaxed">
              Browse beginner-friendly pathways or jump straight into the atelier in Demo Mode.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link href="/explore">
                <Button variant="primary" size="md" leftIcon={<Compass className="w-4 h-4" />}>
                  Explore Hobbies
                </Button>
              </Link>
              <Link href="/home">
                <Button variant="secondary" size="md">
                  Enter Demo Workspace
                </Button>
              </Link>
            </div>
          </AtelierArch>
        </div>
      </PageContainer>

      <PublicFooter />
    </div>
  );
}
