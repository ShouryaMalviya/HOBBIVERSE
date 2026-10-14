"use client";

import * as React from "react";
import Link from "next/link";
import { WorkspaceShell } from "@/components/layout/WorkspaceShell";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Dialog } from "@/components/ui/Dialog";
import { useHobbiverseStore } from "@/services/useStore";
import { useAuth } from "@/services/auth";
import { SEED_HOBBIES } from "@/services/seedData";
import { CATEGORY_THEMES } from "@/styles/tokens";
import { Hobby, SavedHobby, ActivitySession } from "@/types";
import {
  Search,
  X,
  Clock,
  ArrowRight,
  Plus,
  Compass,
  Check,
  Trash2,
  Bookmark,
} from "lucide-react";

export default function MyHobbiesPage() {
  const { isDemo } = useAuth();
  const { savedHobbies, toggleSaveHobby, logSession } = useHobbiverseStore();

  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");
  const [sortBy, setSortBy] = React.useState<"recent" | "progress" | "name">("recent");
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  // Quick session modal state
  const [isLogModalOpen, setIsLogModalOpen] = React.useState(false);
  const [selectedHobbySlug, setSelectedHobbySlug] = React.useState<string>(
    savedHobbies[0]?.hobbySlug || SEED_HOBBIES[0].slug
  );
  const [selectedDuration, setSelectedDuration] = React.useState<number>(15);
  const [selectedMood, setSelectedMood] = React.useState<string>("Calm & Centered");
  const [sessionNotes, setSessionNotes] = React.useState<string>("");

  // Toast helper
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Remove saved hobby
  const handleRemoveHobby = async (saved: SavedHobby) => {
    const fullHobby =
      SEED_HOBBIES.find((h) => h.id === saved.hobbyId || h.slug === saved.hobbySlug) ||
      ({ id: saved.hobbyId, slug: saved.hobbySlug, title: saved.hobbyTitle } as Hobby);

    await toggleSaveHobby(fullHobby);
    triggerToast(`Removed "${saved.hobbyTitle}" from your atelier bookshelf.`);
  };

  // Save session log
  const handleSaveSession = async () => {
    const fullHobby =
      SEED_HOBBIES.find((h) => h.slug === selectedHobbySlug) || SEED_HOBBIES[0];

    const sessionData: Omit<ActivitySession, "id" | "createdAt"> = {
      hobbyId: fullHobby.id,
      hobbySlug: fullHobby.slug,
      hobbyTitle: fullHobby.title,
      category: fullHobby.category,
      date: new Date().toISOString().split("T")[0],
      durationMinutes: selectedDuration,
      notes: sessionNotes.trim() || undefined,
      reflectionMood: selectedMood,
    };

    await logSession(sessionData);
    setIsLogModalOpen(false);
    setSessionNotes("");
    triggerToast(`Logged ${selectedDuration} min for "${fullHobby.title}". Wonderful practice!`);
  };

  // Categories present in saved hobbies
  const savedCategories = React.useMemo(() => {
    const cats = new Set(savedHobbies.map((s) => s.category));
    return Array.from(cats);
  }, [savedHobbies]);

  // Filtered & sorted saved hobbies
  const displayHobbies = React.useMemo(() => {
    let list = [...savedHobbies];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((s) =>
        s.hobbyTitle.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        (s.notes && s.notes.toLowerCase().includes(q))
      );
    }

    // Category
    if (selectedCategory !== "all") {
      list = list.filter((s) => s.category === selectedCategory);
    }

    // Sort
    if (sortBy === "name") {
      list.sort((a, b) => a.hobbyTitle.localeCompare(b.hobbyTitle));
    } else if (sortBy === "progress") {
      list.sort((a, b) => {
        const aCount = a.completedStepIds?.length || 0;
        const bCount = b.completedStepIds?.length || 0;
        return bCount - aCount;
      });
    } else {
      // Recent (default: by savedAt or natural order)
      list.sort((a, b) => (b.savedAt || "").localeCompare(a.savedAt || ""));
    }

    return list;
  }, [savedHobbies, searchQuery, selectedCategory, sortBy]);

  return (
    <WorkspaceShell>
      <PageContainer
        eyebrow="Personal Atelier Bookshelf"
        title="My Saved Hobbies &amp; Pathways"
        description="Your gentle, self-paced creative collection. Revisit active pathways, track milestones, and log quiet practice."
        breadcrumbs={[{ label: "My Hobbies" }]}
        badge={
          isDemo ? (
            <Badge variant="outdoors-nature" dot size="sm">
              Demo Mode &middot; Local Storage
            </Badge>
          ) : (
            <Badge variant="mindful" dot size="sm">
              Active Collection
            </Badge>
          )
        }
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                if (savedHobbies.length > 0) {
                  setSelectedHobbySlug(savedHobbies[0].hobbySlug);
                }
                setIsLogModalOpen(true);
              }}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Log a Session
            </Button>
            <Link href="/explore">
              <Button variant="primary" size="sm" leftIcon={<Compass className="w-4 h-4" />}>
                Discover More Hobbies
              </Button>
            </Link>
          </div>
        }
      >
        <div className="flex flex-col gap-6 text-left">
          {/* Toast Notification Alert */}
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

          {/* SEARCH, CATEGORY, & SORT BAR (Shown if user has saved items) */}
          {savedHobbies.length > 0 && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-[var(--radius-xl)] bg-[var(--paper-100)] border border-[var(--sand-400)]">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--stone-600)]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter your saved crafts by name or keyword..."
                  className="w-full pl-9 pr-8 py-1.5 rounded-[var(--radius-md)] bg-[var(--bg-surface)] border border-[var(--sand-400)] text-xs text-[var(--ink-950)] focus:outline-none focus:border-[var(--wine-700)]"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    aria-label="Clear search"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--stone-600)] hover:text-[var(--ink-950)] cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Category Filter Chips */}
              {savedCategories.length > 1 && (
                <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs">
                  <button
                    type="button"
                    onClick={() => setSelectedCategory("all")}
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                      selectedCategory === "all"
                        ? "bg-[var(--wine-800)] text-[var(--paper-50)]"
                        : "bg-[var(--paper-200)] text-[var(--stone-700)] hover:bg-[var(--paper-300)]"
                    }`}
                  >
                    All ({savedHobbies.length})
                  </button>
                  {savedCategories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                        selectedCategory === cat
                          ? "bg-[var(--wine-800)] text-[var(--paper-50)] font-bold"
                          : "bg-[var(--paper-200)] text-[var(--stone-700)] hover:bg-[var(--paper-300)]"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}

              {/* Sort Selector */}
              <div className="flex items-center gap-1.5 text-xs shrink-0">
                <span className="text-[var(--stone-600)]">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  aria-label="Sort saved hobbies"
                  className="bg-[var(--bg-surface)] border border-[var(--sand-400)] text-[var(--ink-950)] rounded-[var(--radius-md)] px-2.5 py-1 text-xs font-semibold focus:outline-none cursor-pointer"
                >
                  <option value="recent">Recently Added</option>
                  <option value="progress">Most Milestones</option>
                  <option value="name">Alphabetical (A-Z)</option>
                </select>
              </div>
            </div>
          )}

          {/* EMPTY STATE */}
          {savedHobbies.length === 0 ? (
            <Card variant="editorial" className="p-8 sm:p-12 text-center text-left">
              <div className="max-w-md mx-auto flex flex-col items-center gap-4 text-center">
                <div className="w-14 h-14 rounded-full bg-[var(--brand-soft)] flex items-center justify-center text-[var(--wine-700)]">
                  <Bookmark className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-[var(--wine-950)]">
                  Your Atelier Bookshelf is Waiting
                </h3>
                <p className="text-xs sm:text-sm text-[var(--stone-600)] leading-relaxed">
                  You haven&apos;t saved any hobbies yet. Browse our discovery library to save beginner crafts, check off starter supplies, and track your quiet creative steps.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <Link href="/explore">
                    <Button variant="primary" size="sm" leftIcon={<Compass className="w-4 h-4" />}>
                      Explore Creative Pathways
                    </Button>
                  </Link>
                  <Link href="/home">
                    <Button variant="secondary" size="sm">
                      Return to Dashboard
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ) : displayHobbies.length === 0 ? (
            /* NO RESULTS MATCHING QUERY */
            <div className="p-8 text-center rounded-[var(--radius-xl)] bg-[var(--paper-100)] border border-[var(--sand-400)] text-xs text-[var(--stone-600)]">
              <p className="mb-2 text-sm font-semibold text-[var(--ink-950)]">
                No saved hobbies match &ldquo;{searchQuery}&rdquo;
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                className="text-xs text-[var(--wine-700)] underline font-semibold hover:text-[var(--wine-900)] cursor-pointer"
              >
                Clear filter and show all saved ({savedHobbies.length})
              </button>
            </div>
          ) : (
            /* SAVED HOBBIES GRID */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayHobbies.map((saved) => {
                const fullHobby = SEED_HOBBIES.find(
                  (h) => h.id === saved.hobbyId || h.slug === saved.hobbySlug
                );
                const totalSteps = fullHobby?.steps?.length || 3;
                const completedCount = saved.completedStepIds?.length || 0;
                const percentage = Math.round((completedCount / totalSteps) * 100);
                const theme = CATEGORY_THEMES[saved.category] || CATEGORY_THEMES["art-craft"];

                // Next upcoming step
                const nextStep =
                  fullHobby?.steps.find((s) => !saved.completedStepIds?.includes(s.id)) ||
                  fullHobby?.steps[0];

                return (
                  <div
                    key={saved.id}
                    style={{
                      backgroundColor: theme.bgSubtle,
                      borderColor: theme.border,
                    }}
                    className="rounded-[var(--radius-xl)] border p-5 sm:p-6 shadow-[var(--shadow-subtle)] hover:shadow-[var(--shadow-warm)] transition-all flex flex-col justify-between text-left"
                  >
                    <div>
                      {/* Category Badge & Remove Action */}
                      <div className="flex items-center justify-between mb-3">
                        <Badge variant={saved.category} dot size="sm">
                          {fullHobby?.categoryName || saved.category}
                        </Badge>

                        <button
                          type="button"
                          onClick={() => handleRemoveHobby(saved)}
                          aria-label={`Remove ${saved.hobbyTitle} from saved`}
                          title="Remove from my hobbies"
                          className="p-1 rounded-full text-[var(--stone-600)] hover:text-[var(--wine-700)] hover:bg-[var(--paper-300)] transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Title */}
                      <Link href={`/hobbies/${saved.hobbySlug}`}>
                        <h4 className="text-lg font-bold text-[var(--wine-950)] hover:text-[var(--wine-700)] transition-colors mb-2 tracking-tight">
                          {saved.hobbyTitle}
                        </h4>
                      </Link>

                      {/* Summary */}
                      <p className="text-xs text-[var(--ink-700)] line-clamp-2 mb-4 leading-relaxed">
                        {fullHobby?.summary || "Gentle creative exploration in your atelier."}
                      </p>

                      {/* Progress Bar & Next Step Card */}
                      <div className="p-3.5 rounded-[var(--radius-lg)] bg-[var(--bg-surface)]/85 border border-[var(--border-subtle)] mb-4">
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className="font-bold text-[var(--wine-900)]">
                            Path Progress
                          </span>
                          <span className="font-semibold text-[var(--forest-700)]">
                            {completedCount} of {totalSteps} ({percentage}%)
                          </span>
                        </div>

                        <div className="w-full bg-[var(--paper-300)] h-1.5 rounded-full overflow-hidden mb-2.5">
                          <div
                            className="h-full bg-[var(--forest-700)] rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>

                        {nextStep && (
                          <div className="text-[11px] text-[var(--ink-950)]">
                            <span className="text-[var(--stone-600)]">Next step: </span>
                            <span className="font-medium">
                              Step {nextStep.order}: {nextStep.title}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 pt-3 border-t border-[var(--border-subtle)]">
                      <Link href={`/hobbies/${saved.hobbySlug}`} className="flex-1">
                        <Button size="sm" variant="primary" className="w-full" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                          Continue Path
                        </Button>
                      </Link>

                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          setSelectedHobbySlug(saved.hobbySlug);
                          setIsLogModalOpen(true);
                        }}
                        title="Log a practice session"
                        leftIcon={<Clock className="w-3.5 h-3.5" />}
                      >
                        Log
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* QUICK SESSION MODAL */}
        <Dialog
          isOpen={isLogModalOpen}
          onClose={() => setIsLogModalOpen(false)}
          title="Log a Creative Practice Session"
          description="Record quiet minutes in your atelier. Stored privately on your device."
          footer={
            <div className="flex items-center justify-end gap-2 w-full">
              <Button variant="ghost" size="sm" onClick={() => setIsLogModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleSaveSession}>
                Save Session to Log
              </Button>
            </div>
          }
        >
          <div className="flex flex-col gap-4 text-left py-2">
            {/* Hobby Picker */}
            <div>
              <label className="text-xs font-bold text-[var(--ink-950)] block mb-1.5">
                Which saved hobby did you practice?
              </label>
              <select
                value={selectedHobbySlug}
                onChange={(e) => setSelectedHobbySlug(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-[var(--radius-md)] bg-[var(--paper-100)] border border-[var(--sand-400)] text-sm text-[var(--ink-950)] focus:outline-none focus:border-[var(--wine-700)] cursor-pointer"
              >
                {savedHobbies.map((s) => (
                  <option key={s.id} value={s.hobbySlug}>
                    {s.hobbyTitle} ({s.category})
                  </option>
                ))}
                {savedHobbies.length === 0 &&
                  SEED_HOBBIES.map((h) => (
                    <option key={h.id} value={h.slug}>
                      {h.title}
                    </option>
                  ))}
              </select>
            </div>

            {/* Duration */}
            <div>
              <label className="text-xs font-bold text-[var(--ink-950)] block mb-1.5">
                Duration (minutes)
              </label>
              <div className="flex flex-wrap gap-2">
                {[10, 15, 20, 30, 45, 60].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setSelectedDuration(mins)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      selectedDuration === mins
                        ? "bg-[var(--wine-700)] text-[var(--paper-50)] shadow-xs"
                        : "bg-[var(--paper-200)] text-[var(--ink-800)] hover:bg-[var(--paper-300)]"
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>
            </div>

            {/* Mood */}
            <div>
              <label className="text-xs font-bold text-[var(--ink-950)] block mb-1.5">
                How did this practice feel?
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  "Calm & Centered",
                  "Grounded",
                  "Restorative",
                  "Curious Focus",
                  "Joyful",
                  "Steady",
                ].map((mood) => (
                  <button
                    key={mood}
                    type="button"
                    onClick={() => setSelectedMood(mood)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                      selectedMood === mood
                        ? "bg-[var(--sage-200)] text-[var(--forest-900)] border border-[var(--forest-700)] font-bold"
                        : "bg-[var(--paper-200)] text-[var(--stone-700)] hover:bg-[var(--paper-300)] border border-transparent"
                    }`}
                  >
                    {mood}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="text-xs font-bold text-[var(--ink-950)] block mb-1.5">
                Quiet Notes or Sensory Observations (Optional)
              </label>
              <textarea
                value={sessionNotes}
                onChange={(e) => setSessionNotes(e.target.value)}
                placeholder="What details or small joys did you notice?"
                rows={3}
                className="w-full px-3.5 py-2.5 rounded-[var(--radius-md)] bg-[var(--paper-100)] border border-[var(--sand-400)] text-xs text-[var(--ink-950)] focus:outline-none focus:border-[var(--wine-700)] resize-none"
              />
            </div>
          </div>
        </Dialog>
      </PageContainer>
    </WorkspaceShell>
  );
}
