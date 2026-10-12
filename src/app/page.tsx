"use client";

import * as React from "react";
import Link from "next/link";
import { PALETTE, CATEGORY_THEMES } from "@/styles/tokens";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Avatar } from "@/components/ui/Avatar";
import { Skeleton } from "@/components/ui/Skeleton";
import { Tooltip } from "@/components/ui/Tooltip";
import { Dialog } from "@/components/ui/Dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { Toast } from "@/components/ui/Toast";
import { BotanicalLeaf, BotanicalBranch, AtelierArch } from "@/components/ui/BotanicalOrnaments";
import {
  FeaturedEditorialCard,
  CompactListRow,
  ProgressCard,
  CategoryTile,
  ReflectionCard,
  EventTile,
  CommunityPostCard,
  EmptyStateCard,
} from "@/components/ui/CardArchetypes";
import {
  Search,
  Sparkles,
  Send,
  Compass,
  Palette,
  Check,
} from "lucide-react";

import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";

export default function AtelierLandingShell() {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);
  const [copiedToken, setCopiedToken] = React.useState<string | null>(null);

  const copyHex = (name: string, hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedToken(name);
    setTimeout(() => setCopiedToken(null), 1800);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-page)] text-[var(--text-body)] paper-texture transition-colors duration-200">
      <PublicHeader />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12 flex flex-col gap-14 w-full">
        {/* Editorial Introduction & Route CTAs */}
        <div className="relative rounded-[var(--radius-2xl)] border border-[var(--sand-400)] bg-[var(--paper-100)] p-6 sm:p-10 shadow-[var(--shadow-warm)] overflow-hidden">
          <div className="absolute top-0 right-0 p-6 pointer-events-none opacity-40">
            <BotanicalBranch color="var(--wine-700)" className="w-32 h-12" />
          </div>

          <div className="max-w-2xl text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--brand-soft)] text-[var(--brand-soft-text)] text-xs font-bold uppercase tracking-wider mb-4 border border-[var(--rose-300)]">
              <Sparkles className="w-3.5 h-3.5 text-[var(--wine-700)]" aria-hidden="true" />
              Route Architecture &middot; Part 03
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--wine-950)] leading-tight mb-4">
              A welcoming digital space for your creative routine.
            </h1>
            <p className="text-base sm:text-lg text-[var(--ink-700)] leading-relaxed mb-6">
              Discover beginner-friendly hobbies, build compassionate habits without guilt, journal privately, and share in positive community circles.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/explore">
                <Button variant="primary" size="md" leftIcon={<Compass className="w-4 h-4" />}>
                  Explore Hobbies
                </Button>
              </Link>
              <Link href="/home">
                <Button variant="secondary" size="md" leftIcon={<Sparkles className="w-4 h-4" />}>
                  Enter Demo Workspace
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="ghost" size="md">
                  Our Philosophy
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Toast Display Area */}
        {toastMessage && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-200">
            <Toast
              type="success"
              title="Design System Status"
              message={toastMessage}
              onClose={() => setToastMessage(null)}
            />
          </div>
        )}

        {/* Section 1: The 50-Colour Token Swatches */}
        <section aria-labelledby="tokens-title" className="text-left">
          <SectionHeading
            eyebrow="Single Source of Truth"
            title="The 50-Colour Token Palette"
            description="All 50 Master Prompt hex tokens centralized in CSS variables and typed constants. Click any swatch to copy its exact hex code."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Burgundy Anchor */}
            <Card variant="default">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base text-[var(--wine-950)]">Burgundy / Rose Anchor</CardTitle>
                  <span className="text-xs font-mono text-[var(--stone-600)]">10 tokens</span>
                </div>
                <CardDescription>Primary actions, logos, editorial headings, focus accents</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-5 gap-2 pt-2">
                {[
                  { name: "wine-950", hex: PALETTE.wine950 },
                  { name: "wine-900", hex: PALETTE.wine900 },
                  { name: "wine-800", hex: PALETTE.wine800 },
                  { name: "wine-700", hex: PALETTE.wine700 },
                  { name: "wine-600", hex: PALETTE.wine600 },
                  { name: "wine-500", hex: PALETTE.wine500 },
                  { name: "rose-700", hex: PALETTE.rose700 },
                  { name: "rose-500", hex: PALETTE.rose500 },
                  { name: "rose-300", hex: PALETTE.rose300 },
                  { name: "rose-100", hex: PALETTE.rose100 },
                ].map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => copyHex(item.name, item.hex)}
                    title={`${item.name}: ${item.hex}`}
                    className="flex flex-col items-center gap-1 group cursor-pointer"
                  >
                    <div
                      style={{ backgroundColor: item.hex }}
                      className="w-full aspect-square rounded-lg border border-[var(--border-subtle)] shadow-xs transition-transform group-hover:scale-110 flex items-center justify-center text-[10px]"
                    >
                      {copiedToken === item.name && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <span className="text-[10px] font-mono text-[var(--stone-600)] truncate w-full text-center">
                      {item.name.replace("wine-", "w-").replace("rose-", "r-")}
                    </span>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Paper / Ink Neutrals */}
            <Card variant="default">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base text-[var(--ink-950)]">Paper / Ink Neutrals</CardTitle>
                  <span className="text-xs font-mono text-[var(--stone-600)]">12 tokens</span>
                </div>
                <CardDescription>Surfaces, text hierarchy, borders, elevated layers</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-6 gap-2 pt-2">
                {[
                  { name: "paper-50", hex: PALETTE.paper50 },
                  { name: "paper-100", hex: PALETTE.paper100 },
                  { name: "paper-200", hex: PALETTE.paper200 },
                  { name: "paper-300", hex: PALETTE.paper300 },
                  { name: "sand-400", hex: PALETTE.sand400 },
                  { name: "stone-500", hex: PALETTE.stone500 },
                  { name: "stone-600", hex: PALETTE.stone600 },
                  { name: "ink-600", hex: PALETTE.ink600 },
                  { name: "ink-700", hex: PALETTE.ink700 },
                  { name: "ink-800", hex: PALETTE.ink800 },
                  { name: "ink-950", hex: PALETTE.ink950 },
                  { name: "pure-white", hex: PALETTE.pureWhite },
                ].map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => copyHex(item.name, item.hex)}
                    title={`${item.name}: ${item.hex}`}
                    className="flex flex-col items-center gap-1 group cursor-pointer"
                  >
                    <div
                      style={{ backgroundColor: item.hex }}
                      className="w-full aspect-square rounded-lg border border-[var(--border-subtle)] shadow-xs transition-transform group-hover:scale-110 flex items-center justify-center text-[10px]"
                    >
                      {copiedToken === item.name && <Check className="w-3.5 h-3.5 text-black" />}
                    </div>
                    <span className="text-[9px] font-mono text-[var(--stone-600)] truncate w-full text-center">
                      {item.name.replace("paper-", "p-").replace("ink-", "i-")}
                    </span>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Accent Families Group 1 (Sage, Sky, Lilac) */}
            <Card variant="default">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base text-[var(--ink-950)]">Sage &amp; Sky Families</CardTitle>
                  <span className="text-xs font-mono text-[var(--stone-600)]">8 tokens</span>
                </div>
                <CardDescription>Nature, movement, calm mindfulness accents</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-4 gap-2 pt-2">
                {[
                  { name: "sage-100", hex: PALETTE.sage100 },
                  { name: "sage-300", hex: PALETTE.sage300 },
                  { name: "sage-500", hex: PALETTE.sage500 },
                  { name: "forest-700", hex: PALETTE.forest700 },
                  { name: "sky-100", hex: PALETTE.sky100 },
                  { name: "sky-300", hex: PALETTE.sky300 },
                  { name: "sky-500", hex: PALETTE.sky500 },
                  { name: "ocean-700", hex: PALETTE.ocean700 },
                ].map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => copyHex(item.name, item.hex)}
                    title={`${item.name}: ${item.hex}`}
                    className="flex flex-col items-center gap-1 group cursor-pointer"
                  >
                    <div
                      style={{ backgroundColor: item.hex }}
                      className="w-full aspect-square rounded-lg border border-[var(--border-subtle)] shadow-xs transition-transform group-hover:scale-110 flex items-center justify-center"
                    >
                      {copiedToken === item.name && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <span className="text-[10px] font-mono text-[var(--stone-600)] truncate w-full text-center">
                      {item.name}
                    </span>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Accent Families Group 2 (Lavender, Peach) */}
            <Card variant="default">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base text-[var(--ink-950)]">Lilac &amp; Peach Families</CardTitle>
                  <span className="text-xs font-mono text-[var(--stone-600)]">8 tokens</span>
                </div>
                <CardDescription>Music, art, craft, and tactile expression</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-4 gap-2 pt-2">
                {[
                  { name: "lilac-100", hex: PALETTE.lilac100 },
                  { name: "lilac-300", hex: PALETTE.lilac300 },
                  { name: "iris-500", hex: PALETTE.iris500 },
                  { name: "plum-700", hex: PALETTE.plum700 },
                  { name: "peach-100", hex: PALETTE.peach100 },
                  { name: "peach-300", hex: PALETTE.peach300 },
                  { name: "apricot-500", hex: PALETTE.apricot500 },
                  { name: "clay-700", hex: PALETTE.clay700 },
                ].map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => copyHex(item.name, item.hex)}
                    title={`${item.name}: ${item.hex}`}
                    className="flex flex-col items-center gap-1 group cursor-pointer"
                  >
                    <div
                      style={{ backgroundColor: item.hex }}
                      className="w-full aspect-square rounded-lg border border-[var(--border-subtle)] shadow-xs transition-transform group-hover:scale-110 flex items-center justify-center"
                    >
                      {copiedToken === item.name && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <span className="text-[10px] font-mono text-[var(--stone-600)] truncate w-full text-center">
                      {item.name}
                    </span>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Accent Families Group 3 (Amber, Lagoon) */}
            <Card variant="default">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base text-[var(--ink-950)]">Butter &amp; Teal Families</CardTitle>
                  <span className="text-xs font-mono text-[var(--stone-600)]">8 tokens</span>
                </div>
                <CardDescription>Cooking, baking, mindful presence, grounding</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-4 gap-2 pt-2">
                {[
                  { name: "butter-100", hex: PALETTE.butter100 },
                  { name: "butter-300", hex: PALETTE.butter300 },
                  { name: "amber-500", hex: PALETTE.amber500 },
                  { name: "ochre-700", hex: PALETTE.ochre700 },
                  { name: "lagoon-100", hex: PALETTE.lagoon100 },
                  { name: "lagoon-300", hex: PALETTE.lagoon300 },
                  { name: "teal-500", hex: PALETTE.teal500 },
                  { name: "deep-teal-700", hex: PALETTE.deepTeal700 },
                ].map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => copyHex(item.name, item.hex)}
                    title={`${item.name}: ${item.hex}`}
                    className="flex flex-col items-center gap-1 group cursor-pointer"
                  >
                    <div
                      style={{ backgroundColor: item.hex }}
                      className="w-full aspect-square rounded-lg border border-[var(--border-subtle)] shadow-xs transition-transform group-hover:scale-110 flex items-center justify-center"
                    >
                      {copiedToken === item.name && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <span className="text-[10px] font-mono text-[var(--stone-600)] truncate w-full text-center">
                      {item.name}
                    </span>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Accent Families Group 4 (Coral & Berry) */}
            <Card variant="default">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base text-[var(--ink-950)]">Coral &amp; Berry Family</CardTitle>
                  <span className="text-xs font-mono text-[var(--stone-600)]">4 tokens</span>
                </div>
                <CardDescription>Social play, friendly games, community warmth</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-4 gap-2 pt-2">
                {[
                  { name: "coral-100", hex: PALETTE.coral100 },
                  { name: "coral-300", hex: PALETTE.coral300 },
                  { name: "coral-500", hex: PALETTE.coral500 },
                  { name: "berry-700", hex: PALETTE.berry700 },
                ].map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => copyHex(item.name, item.hex)}
                    title={`${item.name}: ${item.hex}`}
                    className="flex flex-col items-center gap-1 group cursor-pointer"
                  >
                    <div
                      style={{ backgroundColor: item.hex }}
                      className="w-full aspect-square rounded-lg border border-[var(--border-subtle)] shadow-xs transition-transform group-hover:scale-110 flex items-center justify-center"
                    >
                      {copiedToken === item.name && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <span className="text-[10px] font-mono text-[var(--stone-600)] truncate w-full text-center">
                      {item.name}
                    </span>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Section 2: 8 Stable Category Accents */}
        <section aria-labelledby="categories-title" className="text-left">
          <SectionHeading
            eyebrow="Semantic Color Mapping"
            title="8 Stable Category Accent Families"
            description="Assigned consistent meanings to protect visual coherence and prevent pastel contrast failures."
          />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {Object.values(CATEGORY_THEMES).map((cat) => (
              <div
                key={cat.id}
                style={{ backgroundColor: cat.bgSubtle, borderColor: cat.border }}
                className="p-4 rounded-[var(--radius-xl)] border flex flex-col justify-between min-h-[105px] shadow-[var(--shadow-subtle)]"
              >
                <div className="flex items-center justify-between">
                  <span
                    style={{ color: cat.textStrong }}
                    className="text-xs font-bold uppercase tracking-wider"
                  >
                    {cat.colorFamilyName}
                  </span>
                  <span
                    style={{ backgroundColor: cat.accent }}
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                  />
                </div>
                <h4 style={{ color: cat.textStrong }} className="text-base font-extrabold mt-2">
                  {cat.name}
                </h4>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Base Primitives Showcase */}
        <section aria-labelledby="primitives-title" className="text-left">
          <SectionHeading
            eyebrow="Foundation UI Controls"
            title="Base Primitives &amp; Dimension System"
            description="Custom-built atelier controls with high tactile polish, visible focus rings, and strict accessibility semantics."
          />

          <Tabs defaultValue="buttons">
            <TabsList>
              <TabsTrigger value="buttons">Buttons &amp; Badges</TabsTrigger>
              <TabsTrigger value="forms">Form Inputs</TabsTrigger>
              <TabsTrigger value="feedback">Feedback &amp; Skeletons</TabsTrigger>
            </TabsList>

            {/* Tab 1: Buttons & Badges */}
            <TabsContent value="buttons" className="pt-2">
              <Card variant="default">
                <CardContent className="flex flex-col gap-6 pt-6">
                  {/* Button Variants */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--stone-600)] mb-3">
                      Button Variants (Burgundy Anchor Dominance)
                    </h4>
                    <div className="flex flex-wrap items-center gap-3">
                      <Button variant="primary">Primary Wine</Button>
                      <Button variant="secondary">Secondary Paper</Button>
                      <Button variant="outline">Outline</Button>
                      <Button variant="soft">Soft Rose</Button>
                      <Button variant="ghost">Ghost</Button>
                      <Button variant="danger">Destructive Berry</Button>
                      <Button variant="primary" isLoading>Loading State</Button>
                    </div>
                  </div>

                  {/* Button Sizes */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--stone-600)] mb-3">
                      Button Sizes &amp; Icon Buttons
                    </h4>
                    <div className="flex flex-wrap items-center gap-3">
                      <Button size="sm" variant="primary">Small (32px)</Button>
                      <Button size="md" variant="primary">Medium (40px)</Button>
                      <Button size="lg" variant="primary">Large (48px)</Button>
                      <div className="w-px h-8 bg-[var(--border-subtle)] mx-2" />
                      <IconButton
                        size="sm"
                        variant="secondary"
                        aria-label="Search hobbies"
                        icon={<Search className="w-4 h-4" />}
                      />
                      <IconButton
                        size="md"
                        variant="primary"
                        aria-label="Send reflection"
                        icon={<Send className="w-4 h-4" />}
                      />
                      <Tooltip content="Atelier Compass Tooltip">
                        <IconButton
                          size="lg"
                          variant="soft"
                          aria-label="Discover hobbies"
                          icon={<Compass className="w-5 h-5 text-[var(--wine-800)]" />}
                        />
                      </Tooltip>
                    </div>
                  </div>

                  {/* Badges & Chips */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--stone-600)] mb-3">
                      Category Chips &amp; Status Badges
                    </h4>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="brand" dot>Atelier Brand</Badge>
                      <Badge variant="art-craft" dot>Art &amp; Craft</Badge>
                      <Badge variant="outdoors-nature" dot>Outdoors &amp; Nature</Badge>
                      <Badge variant="music" dot>Music</Badge>
                      <Badge variant="cooking" dot>Cooking</Badge>
                      <Badge variant="movement" dot>Movement</Badge>
                      <Badge variant="mindful" dot>Mindful Moments</Badge>
                      <Badge variant="reading-writing" dot>Reading &amp; Writing</Badge>
                      <Badge variant="social-games" dot>Social &amp; Games</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab 2: Form Inputs */}
            <TabsContent value="forms" className="pt-2">
              <Card variant="default">
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-6">
                  <Input
                    label="Hobby Title"
                    placeholder="e.g. Botanical Watercolor Painting"
                    leftIcon={<Palette className="w-4 h-4" />}
                    helperText="What creative endeavor are you exploring?"
                  />

                  <Select
                    label="Primary Category"
                    options={[
                      { label: "Art & Craft (Peach & Clay)", value: "art-craft" },
                      { label: "Outdoors & Nature (Sage & Forest)", value: "outdoors-nature" },
                      { label: "Music (Lavender & Plum)", value: "music" },
                      { label: "Mindful Moments (Teal & Lagoon)", value: "mindful" },
                    ]}
                    helperText="Determines your path's accent color"
                  />

                  <Input
                    label="Input with Error State"
                    defaultValue="invalid_input"
                    error="Please specify a duration between 5 and 180 minutes."
                  />

                  <Textarea
                    label="Private Reflection Note"
                    placeholder="How did this session feel? (Strictly private)"
                    helperText="Stored locally in demo mode — never shared publicly"
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab 3: Feedback & Skeletons */}
            <TabsContent value="feedback" className="pt-2">
              <Card variant="default">
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                  {/* Toast Variants */}
                  <div className="flex flex-col gap-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--stone-600)]">
                      Accessible Status Banners
                    </h4>
                    <Toast
                      type="success"
                      title="Session Saved"
                      message="Recorded 25 minutes of linocut printmaking."
                    />
                    <Toast
                      type="info"
                      title="Demo Mode Active"
                      message="Operating on locally-scoped storage without remote API requirements."
                    />
                  </div>

                  {/* Shimmer Skeletons & Avatars */}
                  <div className="flex flex-col gap-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--stone-600)]">
                      Avatars &amp; Shimmer Skeletons
                    </h4>
                    <div className="flex items-center gap-3">
                      <Avatar name="Clara Bow" size="lg" status="online" />
                      <Avatar name="Devon Vance" size="md" status="idle" />
                      <Avatar name="Mira Patel" size="sm" status="offline" />
                    </div>

                    <div className="flex flex-col gap-2 pt-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>

        {/* Section 4: All 8 Card Archetypes */}
        <section aria-labelledby="archetypes-title" className="text-left">
          <SectionHeading
            eyebrow="Editorial Variety"
            title="8 Distinct Card Archetypes"
            description="No uniform card walls. Purpose-built compositions designed for varied content densities and emotional resonance."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 1. Featured Editorial Card */}
            <FeaturedEditorialCard
              category="art-craft"
              title="Pressed Botanical Herbarium"
              excerpt="Collect fallen foliage, press under parchment, and preserve organic shapes into minimalist wall prints."
              timeEstimate="20 min starter step"
            />

            {/* 2. Progress Card */}
            <ProgressCard
              title="Morning Sourdough Fermentation"
              stepCurrent={3}
              stepTotal={5}
              category="outdoors-nature"
            />

            {/* 3. Quote / Reflection Card */}
            <ReflectionCard
              date="Today &middot; 4:30 PM"
              moodLabel="Centering"
              quote="Working with clay reminded me that uneven textures have their own quiet beauty. Zero rush."
              activityName="Hand-Building Pottery"
            />

            {/* 4. Event Tile */}
            <EventTile
              title="Acoustic Song Circle &amp; Tea"
              dateStr="Thursday &middot; 7:00 PM"
              category="music"
              participants={14}
            />

            {/* 5. Community Post Card */}
            <CommunityPostCard
              authorName="Elena Rostova"
              handle="botanist_elena"
              category="art-craft"
              content="First batch of wild blackberry watercolor pigment extracted and test-painted on linen paper!"
              timeAgo="2h ago"
              likes={24}
              comments={6}
            />

            {/* 6. Compact List Row */}
            <div className="flex flex-col gap-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--stone-600)]">
                Compact List Rows
              </span>
              <CompactListRow
                title="Japanese Cyanotype Prints"
                subtitle="Solar sun prints on cotton paper"
                badgeLabel="Art & Craft"
                badgeVariant="art-craft"
              />
              <CompactListRow
                title="Sourdough Starter Routine"
                subtitle="Feeding cycle and hydration rhythm"
                badgeLabel="Cooking"
                badgeVariant="cooking"
              />
              <CompactListRow
                title="Fingerstyle Guitar Basics"
                subtitle="Travis picking pattern 1"
                badgeLabel="Music"
                badgeVariant="music"
              />
            </div>

            {/* 7. Category Tile */}
            <div className="flex flex-col gap-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--stone-600)]">
                Category Tile
              </span>
              <CategoryTile
                name="Mindful Moments"
                count={16}
                accentBg="var(--lagoon-100)"
                borderColor="var(--lagoon-300)"
                textColor="var(--deep-teal-700)"
                icon={<Sparkles className="w-6 h-6" />}
              />
            </div>

            {/* 8. Thoughtful Empty State */}
            <div className="md:col-span-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--stone-600)] mb-2 block">
                Thoughtful Empty State
              </span>
              <EmptyStateCard
                title="Your atelier collection is pristine"
                description="When you save hobbies or mark paths in progress, they will gather here like leaves in a sketchbook."
                actionLabel="Explore beginner pathways"
              />
            </div>
          </div>
        </section>

        {/* Section 5: Architectural Arch Composition */}
        <section className="text-left">
          <AtelierArch className="text-center max-w-xl mx-auto py-10">
            <BotanicalLeaf className="w-8 h-8 text-[var(--forest-700)] mx-auto mb-3" />
            <h3 className="text-xl font-bold text-[var(--wine-950)] mb-2">
              Crafted with Care for Hobbiverse
            </h3>
            <p className="text-xs sm:text-sm text-[var(--ink-700)] max-w-md mx-auto mb-5 leading-relaxed">
              Every curve, surface, and contrast ratio adheres to the Burgundy Botanical Atelier design tokens. Ready for route architecture in Part 03.
            </p>
            <div className="flex items-center justify-center gap-2 text-xs font-mono text-[var(--wine-700)]">
              <span>50 Tokens Centralized</span>
              <span>&middot;</span>
              <span>45+ Actively Rendered</span>
            </div>
          </AtelierArch>
        </section>
      </main>

      {/* Accessible Dialog Demonstration */}
      <Dialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title="Atelier Dialog Primitive"
        description="A fully accessible modal dialog respecting focus trap, keyboard Escape, backdrop click, and screen readers."
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={() => setIsDialogOpen(false)}>
              Understood
            </Button>
          </>
        }
      >
        <p className="text-sm text-[var(--ink-800)] leading-relaxed">
          This dialog uses native semantics (`role=&quot;dialog&quot;`, `aria-modal=&quot;true&quot;`) with smooth entrance animation and burgundy atelier token styling.
        </p>
      </Dialog>

      <PublicFooter />
    </div>
  );
}
