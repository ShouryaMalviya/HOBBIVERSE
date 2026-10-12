"use client";

import * as React from "react";
import Link from "next/link";
import { WorkspaceShell } from "@/components/layout/WorkspaceShell";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Badge, BadgeVariant } from "@/components/ui/Badge";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { BotanicalLeaf } from "@/components/ui/BotanicalOrnaments";
import { useHobbiverseStore } from "@/services/useStore";
import { useAuth } from "@/services/auth";
import { SEED_HOBBIES, SEED_CATEGORIES } from "@/services/seedData";
import { CATEGORY_THEMES } from "@/styles/tokens";
import { CategorySlug, Hobby } from "@/types";
import {
  Search,
  X,
  Filter,
  Clock,
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  SlidersHorizontal,
  Sparkles,
  LayoutGrid,
  List,
  RotateCcw,
  Check,
  Zap,
} from "lucide-react";

export default function ExplorePage() {
  const { session } = useAuth();
  const { savedHobbies, toggleSaveHobby } = useHobbiverseStore();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [selectedCategory, setSelectedCategory] = React.useState<CategorySlug | "all">("all");
  const [selectedDifficulty, setSelectedDifficulty] = React.useState<"all" | "beginner" | "easy" | "intermediate">("all");
  const [selectedMaxMinutes, setSelectedMaxMinutes] = React.useState<number | "any">("any");
  const [selectedLocation, setSelectedLocation] = React.useState<"all" | "indoor" | "outdoor" | "flexible">("all");
  const [selectedSocial, setSelectedSocial] = React.useState<"all" | "solo" | "social" | "both">("all");
  const [selectedEnergy, setSelectedEnergy] = React.useState<"all" | "calm" | "medium" | "active">("all");
  const [selectedCollection, setSelectedCollection] = React.useState<"all" | "try-in-15" | "creative-reset" | "hands-on-weekends" | "explore-outdoors">("all");
  const [sortBy, setSortBy] = React.useState<"recommended" | "time-asc" | "time-desc" | "name-asc">("recommended");
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");
  const [showFiltersMobile, setShowFiltersMobile] = React.useState<boolean>(false);
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  // Set of saved hobby IDs for quick lookup
  const savedHobbyIds = React.useMemo(() => {
    return new Set(savedHobbies.map((s) => s.hobbyId));
  }, [savedHobbies]);

  // Handle Save / Bookmark toggle
  const handleToggleSave = async (hobby: Hobby) => {
    const isNowSaved = await toggleSaveHobby(hobby);
    setToastMessage(
      isNowSaved
        ? `Added "${hobby.title}" to your saved atelier bookshelf.`
        : `Removed "${hobby.title}" from your saved hobbies.`
    );
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedDifficulty("all");
    setSelectedMaxMinutes("any");
    setSelectedLocation("all");
    setSelectedSocial("all");
    setSelectedEnergy("all");
    setSelectedCollection("all");
    setSortBy("recommended");
  };

  // Determine if any filters are active
  const isFilteringActive =
    searchQuery.trim().length > 0 ||
    selectedCategory !== "all" ||
    selectedDifficulty !== "all" ||
    selectedMaxMinutes !== "any" ||
    selectedLocation !== "all" ||
    selectedSocial !== "all" ||
    selectedEnergy !== "all" ||
    selectedCollection !== "all";

  // Filter and sort the hobbies
  const filteredHobbies = React.useMemo(() => {
    let result = [...SEED_HOBBIES];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (h) =>
          h.title.toLowerCase().includes(q) ||
          h.summary.toLowerCase().includes(q) ||
          h.description.toLowerCase().includes(q) ||
          h.categoryName.toLowerCase().includes(q) ||
          h.tags.some((t) => t.toLowerCase().includes(q)) ||
          h.materialsNeeded.some((m) => m.toLowerCase().includes(q))
      );
    }

    // Category
    if (selectedCategory !== "all") {
      result = result.filter((h) => h.category === selectedCategory);
    }

    // Difficulty
    if (selectedDifficulty !== "all") {
      result = result.filter((h) => h.difficulty === selectedDifficulty);
    }

    // Max Minutes
    if (selectedMaxMinutes !== "any") {
      result = result.filter((h) => h.estimatedMinutes <= selectedMaxMinutes);
    }

    // Location
    if (selectedLocation !== "all") {
      result = result.filter(
        (h) => h.locationType === selectedLocation || h.locationType === "flexible"
      );
    }

    // Social Dynamic
    if (selectedSocial !== "all") {
      result = result.filter(
        (h) => h.socialType === selectedSocial || h.socialType === "both"
      );
    }

    // Energy Level
    if (selectedEnergy !== "all") {
      result = result.filter((h) => h.energyLevel === selectedEnergy);
    }

    // Curated Collection
    if (selectedCollection !== "all") {
      result = result.filter((h) => h.editorialCollection === selectedCollection);
    }

    // Sort
    if (sortBy === "time-asc") {
      result.sort((a, b) => a.estimatedMinutes - b.estimatedMinutes);
    } else if (sortBy === "time-desc") {
      result.sort((a, b) => b.estimatedMinutes - a.estimatedMinutes);
    } else if (sortBy === "name-asc") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      // Recommended: Featured first, then title
      result.sort((a, b) => {
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return a.title.localeCompare(b.title);
      });
    }

    return result;
  }, [
    searchQuery,
    selectedCategory,
    selectedDifficulty,
    selectedMaxMinutes,
    selectedLocation,
    selectedSocial,
    selectedEnergy,
    selectedCollection,
    sortBy,
  ]);

  // Featured and Small Start subsets for unconstrained browsing
  const featuredPicks = React.useMemo(() => {
    return SEED_HOBBIES.filter((h) => h.isFeatured);
  }, []);

  const smallStarts = React.useMemo(() => {
    return SEED_HOBBIES.filter((h) => h.estimatedMinutes <= 15);
  }, []);

  const content = (
    <PageContainer
      eyebrow="Curated Discovery Engine"
      title="Explore Creative Pathways"
      description="Calm, beginner-friendly crafts and mindful practices. Filter by available time, setting, and energy."
      breadcrumbs={[{ label: "Explore Hobbies" }]}
      actions={
        <Link href="/home">
          <Button variant="secondary" size="sm">
            Open Dashboard
          </Button>
        </Link>
      }
    >
      <div className="flex flex-col gap-8 text-left">
        {/* Toast Feedback Alert */}
        {toastMessage && (
          <div
            role="alert"
            className="flex items-center justify-between p-3.5 rounded-[var(--radius-lg)] bg-[var(--forest-100)] border border-[var(--sage-300)] text-[var(--forest-900)] text-sm animate-in fade-in slide-in-from-top-1 duration-200"
          >
            <div className="flex items-center gap-2.5">
              <Check className="w-4 h-4 text-[var(--forest-700)] shrink-0" />
              <span className="font-medium">{toastMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setToastMessage(null)}
              className="text-xs text-[var(--forest-700)] underline hover:text-[var(--forest-900)] cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* SEARCH & DISCOVERY BAR */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--stone-600)]" aria-hidden="true" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by hobby title, materials, tags (e.g. watercolor, loaf, guitar, tea)..."
              aria-label="Search hobbies by title, material, or keyword"
              className="w-full pl-10 pr-9 py-2.5 rounded-[var(--radius-lg)] bg-[var(--paper-100)] border border-[var(--sand-400)] text-sm text-[var(--ink-950)] placeholder:text-[var(--stone-600)] focus:outline-none focus:border-[var(--wine-700)] shadow-xs transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--stone-600)] hover:text-[var(--ink-950)] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Mobile Filters Toggle */}
            <Button
              variant={isFilteringActive ? "primary" : "secondary"}
              size="sm"
              onClick={() => setShowFiltersMobile(!showFiltersMobile)}
              className="sm:hidden"
              leftIcon={<Filter className="w-4 h-4" />}
            >
              Filters {isFilteringActive && "(Active)"}
            </Button>

            {/* Sort Selector */}
            <div className="flex items-center gap-1.5 bg-[var(--paper-100)] border border-[var(--sand-400)] rounded-[var(--radius-lg)] px-3 py-1.5 text-xs">
              <span className="text-[var(--stone-600)] font-medium">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                aria-label="Sort hobbies"
                className="bg-transparent text-[var(--ink-950)] font-semibold focus:outline-none cursor-pointer"
              >
                <option value="recommended">Atelier Recommended</option>
                <option value="time-asc">Time: Shortest First</option>
                <option value="time-desc">Time: Deepest Practice</option>
                <option value="name-asc">Alphabetical (A-Z)</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="hidden sm:flex items-center rounded-[var(--radius-md)] border border-[var(--sand-400)] bg-[var(--paper-200)] p-0.5">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                aria-label="Grid view"
                className={`p-1.5 rounded-sm transition-colors cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-[var(--paper-50)] text-[var(--wine-800)] shadow-xs"
                    : "text-[var(--stone-600)] hover:text-[var(--ink-950)]"
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                aria-label="List view"
                className={`p-1.5 rounded-sm transition-colors cursor-pointer ${
                  viewMode === "list"
                    ? "bg-[var(--paper-50)] text-[var(--wine-800)] shadow-xs"
                    : "text-[var(--stone-600)] hover:text-[var(--ink-950)]"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* CATEGORY TABS BAR */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none" role="tablist" aria-label="Hobby categories">
          <button
            type="button"
            role="tab"
            aria-selected={selectedCategory === "all"}
            onClick={() => setSelectedCategory("all")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all cursor-pointer ${
              selectedCategory === "all"
                ? "bg-[var(--brand-anchor)] text-[var(--paper-50)] shadow-xs"
                : "bg-[var(--paper-200)] text-[var(--stone-700)] hover:bg-[var(--paper-300)]"
            }`}
          >
            All Categories ({SEED_HOBBIES.length})
          </button>

          {SEED_CATEGORIES.map((cat) => {
            const count = SEED_HOBBIES.filter((h) => h.category === cat.id).length;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => setSelectedCategory(isSelected ? "all" : cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? "bg-[var(--wine-800)] text-[var(--paper-50)] shadow-xs"
                    : "bg-[var(--paper-100)] text-[var(--ink-800)] border border-[var(--sand-400)] hover:bg-[var(--paper-200)]"
                }`}
              >
                <Badge size="sm" variant={cat.id as BadgeVariant} dot className="pointer-events-none">
                  {cat.name}
                </Badge>
                {count > 0 && <span className="opacity-70 text-[10px]">({count})</span>}
              </button>
            );
          })}
        </div>

        {/* MULTI-DIMENSIONAL FILTERS DRAWER / PANEL */}
        <div className={`p-4 sm:p-5 rounded-[var(--radius-xl)] bg-[var(--paper-100)] border border-[var(--sand-400)] flex flex-col gap-4 text-xs ${showFiltersMobile ? "block" : "hidden sm:flex"}`}>
          <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
            <div className="flex items-center gap-2 font-bold text-[var(--wine-950)]">
              <SlidersHorizontal className="w-4 h-4 text-[var(--wine-700)]" />
              <span>Refine by Rhythm, Setting &amp; Energy</span>
            </div>

            {isFilteringActive && (
              <button
                type="button"
                onClick={resetFilters}
                className="flex items-center gap-1.5 text-xs font-semibold text-[var(--wine-700)] hover:underline cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset all filters</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {/* 1. Time Required */}
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-[var(--ink-950)] text-[11px] uppercase tracking-wider">
                Max Time
              </label>
              <select
                value={selectedMaxMinutes}
                onChange={(e) => setSelectedMaxMinutes(e.target.value === "any" ? "any" : Number(e.target.value))}
                aria-label="Filter by time commitment"
                className="w-full px-2.5 py-1.5 rounded-[var(--radius-md)] bg-[var(--bg-surface)] border border-[var(--sand-400)] text-xs text-[var(--ink-950)] focus:outline-none focus:border-[var(--wine-700)] cursor-pointer"
              >
                <option value="any">Any duration</option>
                <option value={15}>15 min or less</option>
                <option value={30}>30 min or less</option>
                <option value={45}>45 min or less</option>
                <option value={60}>60 min or less</option>
              </select>
            </div>

            {/* 2. Skill Level */}
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-[var(--ink-950)] text-[11px] uppercase tracking-wider">
                Skill Level
              </label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value as typeof selectedDifficulty)}
                aria-label="Filter by skill level"
                className="w-full px-2.5 py-1.5 rounded-[var(--radius-md)] bg-[var(--bg-surface)] border border-[var(--sand-400)] text-xs text-[var(--ink-950)] focus:outline-none focus:border-[var(--wine-700)] cursor-pointer"
              >
                <option value="all">All skill levels</option>
                <option value="beginner">Beginner friendly</option>
                <option value="easy">Easy</option>
                <option value="intermediate">Intermediate</option>
              </select>
            </div>

            {/* 3. Setting */}
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-[var(--ink-950)] text-[11px] uppercase tracking-wider">
                Setting / Location
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value as typeof selectedLocation)}
                aria-label="Filter by setting"
                className="w-full px-2.5 py-1.5 rounded-[var(--radius-md)] bg-[var(--bg-surface)] border border-[var(--sand-400)] text-xs text-[var(--ink-950)] focus:outline-none focus:border-[var(--wine-700)] cursor-pointer"
              >
                <option value="all">Any location</option>
                <option value="indoor">Indoor sanctuary</option>
                <option value="outdoor">Outdoors &amp; nature</option>
                <option value="flexible">Flexible</option>
              </select>
            </div>

            {/* 4. Social Dynamic */}
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-[var(--ink-950)] text-[11px] uppercase tracking-wider">
                Social Dynamic
              </label>
              <select
                value={selectedSocial}
                onChange={(e) => setSelectedSocial(e.target.value as typeof selectedSocial)}
                aria-label="Filter by social dynamic"
                className="w-full px-2.5 py-1.5 rounded-[var(--radius-md)] bg-[var(--bg-surface)] border border-[var(--sand-400)] text-xs text-[var(--ink-950)] focus:outline-none focus:border-[var(--wine-700)] cursor-pointer"
              >
                <option value="all">Any dynamic</option>
                <option value="solo">Solo reflection</option>
                <option value="social">Social circles</option>
                <option value="both">Both / adaptable</option>
              </select>
            </div>

            {/* 5. Energy Level */}
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-[var(--ink-950)] text-[11px] uppercase tracking-wider">
                Energy Level
              </label>
              <select
                value={selectedEnergy}
                onChange={(e) => setSelectedEnergy(e.target.value as typeof selectedEnergy)}
                aria-label="Filter by energy level"
                className="w-full px-2.5 py-1.5 rounded-[var(--radius-md)] bg-[var(--bg-surface)] border border-[var(--sand-400)] text-xs text-[var(--ink-950)] focus:outline-none focus:border-[var(--wine-700)] cursor-pointer"
              >
                <option value="all">Any energy</option>
                <option value="calm">Calm &amp; restorative</option>
                <option value="medium">Medium focus</option>
                <option value="active">Active &amp; lively</option>
              </select>
            </div>
          </div>

          {/* ACTIVE FILTER PILLS */}
          {isFilteringActive && (
            <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[var(--border-subtle)]">
              <span className="text-[11px] text-[var(--stone-600)] font-medium">Active:</span>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[var(--paper-300)] text-[11px] text-[var(--ink-950)] hover:bg-[var(--paper-400)] cursor-pointer"
                >
                  <span>Query: &ldquo;{searchQuery}&rdquo;</span>
                  <X className="w-3 h-3" />
                </button>
              )}
              {selectedCategory !== "all" && (
                <button
                  type="button"
                  onClick={() => setSelectedCategory("all")}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[var(--paper-300)] text-[11px] text-[var(--ink-950)] hover:bg-[var(--paper-400)] cursor-pointer"
                >
                  <span>Category: {selectedCategory}</span>
                  <X className="w-3 h-3" />
                </button>
              )}
              {selectedMaxMinutes !== "any" && (
                <button
                  type="button"
                  onClick={() => setSelectedMaxMinutes("any")}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[var(--paper-300)] text-[11px] text-[var(--ink-950)] hover:bg-[var(--paper-400)] cursor-pointer"
                >
                  <span>Time: &le; {selectedMaxMinutes}m</span>
                  <X className="w-3 h-3" />
                </button>
              )}
              {selectedDifficulty !== "all" && (
                <button
                  type="button"
                  onClick={() => setSelectedDifficulty("all")}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[var(--paper-300)] text-[11px] text-[var(--ink-950)] hover:bg-[var(--paper-400)] cursor-pointer"
                >
                  <span>Level: {selectedDifficulty}</span>
                  <X className="w-3 h-3" />
                </button>
              )}
              {selectedLocation !== "all" && (
                <button
                  type="button"
                  onClick={() => setSelectedLocation("all")}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[var(--paper-300)] text-[11px] text-[var(--ink-950)] hover:bg-[var(--paper-400)] cursor-pointer"
                >
                  <span>Setting: {selectedLocation}</span>
                  <X className="w-3 h-3" />
                </button>
              )}
              {selectedEnergy !== "all" && (
                <button
                  type="button"
                  onClick={() => setSelectedEnergy("all")}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[var(--paper-300)] text-[11px] text-[var(--ink-950)] hover:bg-[var(--paper-400)] cursor-pointer"
                >
                  <span>Energy: {selectedEnergy}</span>
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* RESULTS BAR OR SECTION HEADER */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-[var(--wine-950)]">
              {isFilteringActive ? "Filtered Pathways" : "All Creative Pathways"}
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-[var(--paper-200)] text-[var(--stone-700)] text-xs font-semibold">
              {filteredHobbies.length} {filteredHobbies.length === 1 ? "craft" : "crafts"}
            </span>
          </div>

          {isFilteringActive && (
            <button
              type="button"
              onClick={resetFilters}
              className="text-xs text-[var(--wine-700)] hover:underline font-semibold cursor-pointer"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* MAIN RESULTS GRID / LIST */}
        {filteredHobbies.length === 0 ? (
          /* NO-RESULTS COMPASSIONATE STATE */
          <Card variant="editorial" className="p-8 sm:p-12 text-center">
            <div className="max-w-md mx-auto flex flex-col items-center gap-4 text-center">
              <div className="w-14 h-14 rounded-full bg-[var(--brand-soft)] flex items-center justify-center text-[var(--wine-700)]">
                <BotanicalLeaf className="w-7 h-7 text-[var(--forest-700)]" />
              </div>
              <h4 className="text-xl font-bold text-[var(--wine-950)]">
                No pathways match your current filters
              </h4>
              <p className="text-xs sm:text-sm text-[var(--stone-600)] leading-relaxed">
                We couldn&apos;t find any craft matching &ldquo;{searchQuery || "your criteria"}&rdquo;. Try widening your duration or setting filters, or search for broader crafts like &ldquo;paper&rdquo;, &ldquo;baking&rdquo;, or &ldquo;tea&rdquo;.
              </p>
              <Button
                variant="primary"
                size="sm"
                onClick={resetFilters}
                leftIcon={<RotateCcw className="w-4 h-4" />}
              >
                Clear All Filters &amp; Show Library
              </Button>
            </div>
          </Card>
        ) : viewMode === "grid" ? (
          /* GRID VIEW */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHobbies.map((hobby) => {
              const theme = CATEGORY_THEMES[hobby.category] || CATEGORY_THEMES["art-craft"];
              const isSaved = savedHobbyIds.has(hobby.id);

              return (
                <div
                  key={hobby.slug}
                  style={{
                    backgroundColor: theme.bgSubtle,
                    borderColor: theme.border,
                  }}
                  className="rounded-[var(--radius-xl)] border p-5 sm:p-6 shadow-[var(--shadow-subtle)] hover:shadow-[var(--shadow-warm)] hover:-translate-y-0.5 transition-all flex flex-col justify-between text-left"
                >
                  <div>
                    {/* Header: Category Badge & Save Button */}
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant={hobby.category} dot size="sm">
                        {hobby.categoryName}
                      </Badge>

                      <button
                        type="button"
                        onClick={() => handleToggleSave(hobby)}
                        aria-label={isSaved ? `Remove ${hobby.title} from saved` : `Save ${hobby.title} to atelier`}
                        className="p-1.5 rounded-full hover:bg-[var(--paper-300)] text-[var(--wine-700)] transition-colors cursor-pointer"
                        title={isSaved ? "Saved in atelier" : "Save to my hobbies"}
                      >
                        {isSaved ? (
                          <BookmarkCheck className="w-4 h-4 fill-[var(--wine-700)]" />
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    {/* Title */}
                    <Link href={`/hobbies/${hobby.slug}`}>
                      <h4 className="text-lg font-bold text-[var(--wine-950)] hover:text-[var(--wine-700)] transition-colors mb-2 tracking-tight">
                        {hobby.title}
                      </h4>
                    </Link>

                    {/* Summary */}
                    <p className="text-xs text-[var(--ink-700)] mb-4 line-clamp-2 leading-relaxed">
                      {hobby.summary}
                    </p>

                    {/* First Step Callout */}
                    <div className="p-3 rounded-lg bg-[var(--bg-surface)]/80 border border-[var(--border-subtle)] text-[11px] text-[var(--ink-900)] mb-4">
                      <span className="font-bold text-[var(--wine-800)] block mb-0.5">
                        First gentle step:
                      </span>
                      <span className="line-clamp-2">{hobby.firstStepPrompt}</span>
                    </div>
                  </div>

                  {/* Footer Meta & Explore CTA */}
                  <div>
                    <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-[var(--border-subtle)] text-[11px] text-[var(--stone-600)] mb-3">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>{hobby.timeEstimate}</span>
                      </div>
                      <span>&middot;</span>
                      <span className="capitalize">{hobby.difficulty}</span>
                      <span>&middot;</span>
                      <span className="capitalize">{hobby.locationType}</span>
                    </div>

                    <Link href={`/hobbies/${hobby.slug}`}>
                      <Button variant="outline" size="sm" className="w-full" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                        Explore Pathway
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* COMPACT LIST VIEW */
          <div className="flex flex-col gap-3">
            {filteredHobbies.map((hobby) => {
              const isSaved = savedHobbyIds.has(hobby.id);

              return (
                <div
                  key={hobby.slug}
                  className="p-4 rounded-[var(--radius-lg)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--sand-400)] hover:bg-[var(--paper-100)] transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-left shadow-xs"
                >
                  <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
                    <button
                      type="button"
                      onClick={() => handleToggleSave(hobby)}
                      aria-label={isSaved ? `Remove ${hobby.title} from saved` : `Save ${hobby.title}`}
                      className="p-1.5 rounded-full hover:bg-[var(--paper-300)] text-[var(--wine-700)] transition-colors shrink-0 cursor-pointer"
                    >
                      {isSaved ? (
                        <BookmarkCheck className="w-4 h-4 fill-[var(--wine-700)]" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <Badge variant={hobby.category} size="sm">
                          {hobby.categoryName}
                        </Badge>
                        <span className="text-[11px] text-[var(--stone-600)] flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {hobby.timeEstimate}
                        </span>
                        <span className="text-[11px] text-[var(--forest-700)] font-medium capitalize">
                          {hobby.difficulty}
                        </span>
                      </div>

                      <Link href={`/hobbies/${hobby.slug}`}>
                        <h4 className="font-bold text-sm sm:text-base text-[var(--ink-950)] hover:text-[var(--wine-700)] transition-colors truncate">
                          {hobby.title}
                        </h4>
                      </Link>

                      <p className="text-xs text-[var(--stone-600)] line-clamp-1 mt-0.5">
                        {hobby.summary}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 self-end sm:self-center">
                    <Link href={`/hobbies/${hobby.slug}`}>
                      <Button size="sm" variant="ghost" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                        View Path
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* UNCONSTRAINED EDITORIAL SECTIONS (Shown when no search/filters active) */}
        {!isFilteringActive && (
          <div className="flex flex-col gap-10 mt-6 pt-10 border-t border-[var(--border-subtle)]">
            {/* SECTION: Featured Editorial Picks */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-[var(--wine-950)]">
                    Featured Atelier Pathways
                  </h3>
                  <p className="text-xs text-[var(--stone-600)]">
                    Thoughtfully paced step-by-step guides for tactile exploration
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {featuredPicks.slice(0, 2).map((hobby) => (
                  <Card key={hobby.slug} variant="editorial" className="p-6 flex flex-col justify-between text-left">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <Badge variant={hobby.category} dot size="sm">
                          {hobby.categoryName}
                        </Badge>
                        <span className="text-xs text-[var(--stone-600)] flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> {hobby.timeEstimate}
                        </span>
                      </div>

                      <Link href={`/hobbies/${hobby.slug}`}>
                        <CardTitle className="text-xl hover:text-[var(--wine-700)] transition-colors mb-2">
                          {hobby.title}
                        </CardTitle>
                      </Link>

                      <CardDescription className="text-xs leading-relaxed mb-4">
                        {hobby.description}
                      </CardDescription>

                      <div className="p-3 rounded-lg bg-[var(--paper-200)] text-xs text-[var(--ink-900)] mb-4">
                        <span className="font-bold text-[var(--wine-800)] block mb-0.5">
                          First step prompt:
                        </span>
                        <span>{hobby.firstStepPrompt}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-[var(--border-subtle)]">
                      <span className="text-xs text-[var(--forest-700)] font-semibold">
                        Beginner supplies ready
                      </span>
                      <Link href={`/hobbies/${hobby.slug}`}>
                        <Button size="sm" variant="primary" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                          Start Pathway
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* SECTION: 15-Minute Small Starts */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[var(--wine-700)]" />
                    <h3 className="text-xl font-bold text-[var(--wine-950)]">
                      15-Minute Small Starts
                    </h3>
                  </div>
                  <p className="text-xs text-[var(--stone-600)]">
                    Low barrier, sensory activities you can explore in a single quiet tea break
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {smallStarts.map((hobby) => (
                  <div
                    key={hobby.slug}
                    className="p-4 rounded-[var(--radius-lg)] bg-[var(--paper-100)] border border-[var(--sand-400)] hover:border-[var(--wine-700)]/40 transition-all flex flex-col justify-between text-left shadow-xs"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant={hobby.category} size="sm">
                          {hobby.categoryName}
                        </Badge>
                        <span className="text-[11px] font-bold text-[var(--forest-700)] flex items-center gap-1">
                          <Zap className="w-3 h-3" /> 15 min
                        </span>
                      </div>

                      <Link href={`/hobbies/${hobby.slug}`}>
                        <h4 className="font-bold text-sm text-[var(--ink-950)] hover:text-[var(--wine-700)] transition-colors mb-1 truncate">
                          {hobby.title}
                        </h4>
                      </Link>

                      <p className="text-xs text-[var(--stone-600)] line-clamp-2 mb-3">
                        {hobby.summary}
                      </p>
                    </div>

                    <Link href={`/hobbies/${hobby.slug}`}>
                      <Button size="sm" variant="ghost" className="w-full text-xs" rightIcon={<ArrowRight className="w-3 h-3" />}>
                        Try First Step
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );

  // Wrap in WorkspaceShell when signed in / in demo session, otherwise Public layout
  if (session) {
    return <WorkspaceShell>{content}</WorkspaceShell>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-page)] text-[var(--text-body)]">
      <PublicHeader />
      <main className="flex-1 flex flex-col">{content}</main>
      <PublicFooter />
    </div>
  );
}
