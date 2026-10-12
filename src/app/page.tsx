"use client";

import * as React from "react";
import Link from "next/link";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardTitle, CardDescription, CardFooter } from "@/components/ui/Card";
import { BotanicalLeaf, BotanicalBranch, AtelierArch } from "@/components/ui/BotanicalOrnaments";
import { SEED_HOBBIES, SEED_CATEGORIES } from "@/services/seedData";
import { CATEGORY_THEMES } from "@/styles/tokens";
import {
  Compass,
  Sparkles,
  ArrowRight,
  Clock,
  Users,
  ShieldCheck,
  CheckCircle2,
  Palette,
  Music,
  Coffee,
  Activity,
  Smile,
  Feather,
} from "lucide-react";

export default function HobbiverseLandingPage() {
  const [activeCategory, setActiveCategory] = React.useState<string>("art-craft");

  // Category Icon Map
  const categoryIcons: Record<string, React.ReactNode> = {
    "art-craft": <Palette className="w-5 h-5" />,
    "outdoors-nature": <BotanicalLeaf className="w-5 h-5 text-current" />,
    music: <Music className="w-5 h-5" />,
    cooking: <Coffee className="w-5 h-5" />,
    movement: <Activity className="w-5 h-5" />,
    mindful: <Smile className="w-5 h-5" />,
    "reading-writing": <Feather className="w-5 h-5" />,
    "social-games": <Users className="w-5 h-5" />,
  };

  const quickStartHobbies = SEED_HOBBIES.filter(
    (h) => h.editorialCollection === "try-in-15" || h.estimatedMinutes <= 20
  ).slice(0, 3);

  const selectedCategoryData =
    SEED_CATEGORIES.find((c) => c.id === activeCategory) || SEED_CATEGORIES[0];
  const selectedTheme = CATEGORY_THEMES[activeCategory] || CATEGORY_THEMES["art-craft"];

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-page)] text-[var(--text-body)] paper-texture transition-colors duration-200">
      <PublicHeader />

      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-[var(--border-subtle)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center text-left">
            {/* Left Narrative Column */}
            <div className="lg:col-span-7 flex flex-col items-start gap-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--brand-soft)] text-[var(--brand-soft-text)] text-xs font-bold uppercase tracking-wider border border-[var(--rose-300)]">
                <Sparkles className="w-3.5 h-3.5 text-[var(--wine-700)]" aria-hidden="true" />
                <span>A Digital Creative Atelier</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[var(--wine-950)] leading-[1.12]">
                Make gentle time for the things that{" "}
                <span className="italic font-serif text-[var(--wine-700)]">bring you joy.</span>
              </h1>

              <p className="text-base sm:text-lg lg:text-xl text-[var(--ink-700)] leading-relaxed max-w-2xl">
                Hobbiverse is a welcoming digital sanctuary where you discover creative hobbies, build routines at your own pace, reflect privately on everyday wellbeing, and connect without algorithmic noise.
              </p>

              {/* Primary CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-2 w-full sm:w-auto">
                <Link href="/explore" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="primary"
                    className="w-full sm:w-auto shadow-[var(--shadow-warm)]"
                    leftIcon={<Compass className="w-5 h-5" />}
                  >
                    Explore Hobbies
                  </Button>
                </Link>

                <Link href="/home" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="w-full sm:w-auto"
                    leftIcon={<Sparkles className="w-5 h-5 text-[var(--wine-800)]" />}
                  >
                    Enter Demo Workspace
                  </Button>
                </Link>

                <Link href="/about" className="w-full sm:w-auto">
                  <Button size="lg" variant="ghost" className="w-full sm:w-auto">
                    Our Philosophy
                  </Button>
                </Link>
              </div>

              {/* Reassuring Product Micro-Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-[var(--border-subtle)] w-full text-xs text-[var(--stone-600)]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[var(--forest-700)] shrink-0" />
                  <span>No shame or streak penalties</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[var(--forest-700)] shrink-0" />
                  <span>Private reflections by design</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[var(--forest-700)] shrink-0" />
                  <span>Explore free in Demo Mode</span>
                </div>
              </div>
            </div>

            {/* Right Bespoke Composition Column */}
            <div className="lg:col-span-5 relative flex justify-center">
              <AtelierArch className="w-full max-w-md p-6 sm:p-8 bg-[var(--paper-100)] shadow-[var(--shadow-elevated)]">
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="art-craft" dot>
                    Featured Beginner Pathway
                  </Badge>
                  <span className="text-xs text-[var(--stone-600)] flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> 15–20 min
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-[var(--paper-50)] border border-[var(--border-subtle)] shadow-[var(--shadow-subtle)] mb-5 text-left">
                  <BotanicalBranch color="var(--wine-700)" className="w-20 h-6 mb-2 opacity-70" />
                  <h3 className="text-lg font-bold text-[var(--wine-950)] leading-snug">
                    Botanical Watercolor Studies
                  </h3>
                  <p className="text-xs text-[var(--ink-700)] mt-1.5 leading-relaxed">
                    Mix sap green puddles and practice single-stroke tapered leaf washes on cold-press paper.
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-[11px] text-[var(--forest-700)] font-semibold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Beginner Step 1 ready to practice</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-[var(--paper-200)] flex items-center justify-between text-left text-xs mb-5">
                  <div className="flex flex-col">
                    <span className="font-bold text-[var(--ink-950)]">First supplies needed:</span>
                    <span className="text-[var(--stone-600)]">Basic watercolor pan &amp; round brush #6</span>
                  </div>
                  <span className="font-mono text-[var(--wine-900)] font-bold text-xs">$15 starter</span>
                </div>

                <Link href="/hobbies/botanical-watercolor" className="w-full block">
                  <Button variant="primary" size="md" className="w-full" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Begin Step 1 &middot; Free
                  </Button>
                </Link>
              </AtelierArch>
            </div>
          </div>
        </div>
      </section>

      {/* 2. INTERACTIVE CATEGORY CONSTELLATION */}
      <section className="py-16 sm:py-20 border-b border-[var(--border-subtle)] bg-[var(--paper-100)] text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[var(--wine-700)] block mb-1">
                Curated Spectrum
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--wine-950)] tracking-tight">
                Eight Distinct Creative Realms
              </h2>
            </div>
            <p className="text-sm text-[var(--stone-600)] max-w-md">
              Each category has a stable accent family and realistic starter paths tailored for busy schedules.
            </p>
          </div>

          {/* Interactive constellation selectors */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 mb-8">
            {SEED_CATEGORIES.map((cat) => {
              const isSelected = activeCategory === cat.id;
              const theme = CATEGORY_THEMES[cat.id];
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  style={{
                    backgroundColor: isSelected ? theme.bgLight : theme.bgSubtle,
                    borderColor: isSelected ? theme.accent : theme.border,
                  }}
                  className="p-3 rounded-[var(--radius-lg)] border flex flex-col items-center text-center gap-2 transition-all cursor-pointer hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)]"
                >
                  <div style={{ color: theme.textStrong }}>
                    {categoryIcons[cat.id]}
                  </div>
                  <span
                    style={{ color: theme.textStrong }}
                    className="text-xs font-bold leading-tight"
                  >
                    {cat.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Category Spotlight Card */}
          <div
            style={{ backgroundColor: selectedTheme.bgSubtle, borderColor: selectedTheme.border }}
            className="p-6 sm:p-8 rounded-[var(--radius-2xl)] border shadow-[var(--shadow-subtle)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
          >
            <div className="flex flex-col gap-2 max-w-xl text-left">
              <div className="flex items-center gap-2">
                <Badge variant={selectedCategoryData.id} dot>
                  {selectedTheme.colorFamilyName} Palette
                </Badge>
                <span className="text-xs text-[var(--stone-600)]">
                  {selectedCategoryData.activityCount} curated activities
                </span>
              </div>
              <h3 style={{ color: selectedTheme.textStrong }} className="text-2xl font-extrabold">
                {selectedCategoryData.name}
              </h3>
              <p className="text-sm text-[var(--ink-800)] leading-relaxed">
                {selectedCategoryData.description}
              </p>
            </div>

            <Link href="/explore">
              <Button
                variant="primary"
                size="md"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Browse {selectedCategoryData.name}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 3. CURATED "TRY IN 15 MINUTES" SECTION */}
      <section className="py-16 sm:py-24 border-b border-[var(--border-subtle)] text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[var(--wine-700)] block mb-1">
                Start Small
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--wine-950)] tracking-tight">
                Try in 15 Minutes
              </h2>
              <p className="text-sm sm:text-base text-[var(--ink-700)] mt-1.5 max-w-xl">
                You don&apos;t need hours of free time to create. These structured beginner pathways are designed for a quick, calming reset.
              </p>
            </div>

            <Link href="/explore">
              <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                View All Pathways
              </Button>
            </Link>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickStartHobbies.map((hobby) => (
              <Card key={hobby.slug} variant="interactive" className="flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant={hobby.category} dot>
                      {hobby.categoryName}
                    </Badge>
                    <span className="text-xs text-[var(--stone-600)] flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" aria-hidden="true" /> {hobby.timeEstimate}
                    </span>
                  </div>

                  <CardTitle className="text-xl mb-2 text-[var(--wine-950)]">
                    {hobby.title}
                  </CardTitle>

                  <CardDescription className="mb-4">
                    {hobby.summary}
                  </CardDescription>

                  <div className="p-3 rounded-lg bg-[var(--paper-200)] text-xs text-[var(--ink-800)] mb-4">
                    <span className="font-bold text-[var(--wine-900)] block mb-0.5">First Step:</span>
                    <p className="line-clamp-2">{hobby.firstStepPrompt}</p>
                  </div>
                </div>

                <CardFooter className="justify-between pt-3 border-t border-[var(--border-subtle)]">
                  <span className="text-xs font-semibold text-[var(--forest-700)]">
                    {hobby.costRange.split(" ")[0]}
                  </span>
                  <Link href={`/hobbies/${hobby.slug}`}>
                    <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                      Explore Path
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 4. THREE-STEP EXPLAINER: HOW HOBBIVERSE WORKS */}
      <section className="py-16 sm:py-24 border-b border-[var(--border-subtle)] bg-[var(--paper-100)] text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--wine-700)] block mb-1">
              Thoughtful Design
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--wine-950)] tracking-tight mb-3">
              How Hobbiverse Supports Your Practice
            </h2>
            <p className="text-base text-[var(--ink-700)] leading-relaxed">
              Designed around intentional pacing and private reflection—not addictive engagement loops or competitive leaderboards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="p-6 rounded-[var(--radius-xl)] bg-[var(--paper-50)] border border-[var(--border-subtle)] shadow-[var(--shadow-subtle)] flex flex-col gap-4 text-left">
              <div className="w-10 h-10 rounded-xl bg-[var(--wine-800)] text-[var(--paper-50)] font-bold font-serif text-lg flex items-center justify-center">
                1
              </div>
              <h3 className="text-xl font-bold text-[var(--wine-950)]">
                Discover Without Overwhelm
              </h3>
              <p className="text-sm text-[var(--ink-700)] leading-relaxed">
                Explore hobbies filtered by time, budget, and energy level. Every activity includes a realistic starter supplies list and a clear 15-minute first step.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-[var(--radius-xl)] bg-[var(--paper-50)] border border-[var(--border-subtle)] shadow-[var(--shadow-subtle)] flex flex-col gap-4 text-left">
              <div className="w-10 h-10 rounded-xl bg-[var(--forest-700)] text-[var(--paper-50)] font-bold font-serif text-lg flex items-center justify-center">
                2
              </div>
              <h3 className="text-xl font-bold text-[var(--wine-950)]">
                Practice at Your Own Rhythm
              </h3>
              <p className="text-sm text-[var(--ink-700)] leading-relaxed">
                Schedule gentle sessions on your calendar or log spur-of-the-moment practices. Missed days are normal breathing room, not a red streak failure.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-[var(--radius-xl)] bg-[var(--paper-50)] border border-[var(--border-subtle)] shadow-[var(--shadow-subtle)] flex flex-col gap-4 text-left">
              <div className="w-10 h-10 rounded-xl bg-[var(--clay-700)] text-[var(--paper-50)] font-bold font-serif text-lg flex items-center justify-center">
                3
              </div>
              <h3 className="text-xl font-bold text-[var(--wine-950)]">
                Reflect Privately, Connect Gently
              </h3>
              <p className="text-sm text-[var(--ink-700)] leading-relaxed">
                Capture private notes in your isolated reflection journal. When ready, share milestones in positive studio circles free of toxic metrics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PRODUCT PHILOSOPHY & WELLBEING NOTICE */}
      <section className="py-16 sm:py-24 border-b border-[var(--border-subtle)] text-left">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card variant="editorial" className="p-8 sm:p-12">
            <BotanicalBranch color="var(--wine-700)" className="w-28 h-8 mb-4 opacity-75" />

            <span className="text-xs font-bold uppercase tracking-widest text-[var(--wine-700)] block mb-2">
              Our Product Philosophy
            </span>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--wine-950)] tracking-tight mb-4">
              Making Time for Everyday Creativity
            </h2>

            <div className="flex flex-col gap-4 text-sm sm:text-base text-[var(--ink-800)] leading-relaxed">
              <p>
                In a world that constantly asks us to monetize our spare moments or turn hobbies into side hustles, Hobbiverse protects the quiet joy of being an enthusiastic beginner.
              </p>
              <p>
                We believe that spending 20 minutes with paper and pigment, kneeling over a warm loaf of sourdough, or plucking slow guitar chords is fundamentally restorative. Not because it solves all life&apos;s challenges, but because giving yourself permission to create is an act of everyday kindness.
              </p>
            </div>

            {/* Clear Ethical Medical Boundary */}
            <div className="mt-8 p-4 rounded-xl bg-[var(--paper-200)] border border-[var(--sand-400)] flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[var(--wine-800)] shrink-0 mt-0.5" aria-hidden="true" />
              <div className="flex flex-col gap-1 text-xs text-[var(--ink-800)]">
                <span className="font-bold text-sm text-[var(--wine-950)]">
                  Respectful Wellbeing Boundary
                </span>
                <p>
                  Hobbiverse supports everyday wellbeing through creative exploration. It is <strong>not</strong> a medical, diagnostic, therapy, or emergency crisis support product. Private reflections remain strictly local and unanalyzed.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* 6. FINAL INVITATION ARCH */}
      <section className="py-16 sm:py-24 text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <AtelierArch className="py-12 sm:py-16 px-6 sm:px-10">
            <BotanicalLeaf className="w-10 h-10 text-[var(--forest-700)] mx-auto mb-4" />

            <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--wine-950)] tracking-tight mb-3">
              Your Atelier Awaits
            </h2>

            <p className="text-base text-[var(--ink-700)] max-w-md mx-auto mb-8 leading-relaxed">
              Start with a single beginner step today. No credit card, no forced signup, and no pressure.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link href="/explore">
                <Button size="lg" variant="primary" leftIcon={<Compass className="w-5 h-5" />}>
                  Explore All Hobbies
                </Button>
              </Link>
              <Link href="/home">
                <Button size="lg" variant="secondary" leftIcon={<Sparkles className="w-5 h-5" />}>
                  Enter Demo Workspace
                </Button>
              </Link>
            </div>
          </AtelierArch>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
