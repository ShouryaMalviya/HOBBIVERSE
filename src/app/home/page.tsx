"use client";

import * as React from "react";
import Link from "next/link";
import { WorkspaceShell } from "@/components/layout/WorkspaceShell";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Dialog } from "@/components/ui/Dialog";
import { useHobbiverseStore } from "@/services/useStore";
import { useAuth } from "@/services/auth";
import { SEED_HOBBIES } from "@/services/seedData";
import { CATEGORY_THEMES } from "@/styles/tokens";
import { Hobby, ActivitySession } from "@/types";
import {
  Sparkles,
  Clock,
  Calendar,
  BookOpen,
  CheckCircle2,
  Circle,
  Bookmark,
  BookmarkCheck,
  Lock,
  Plus,
  Compass,
  ArrowRight,
  Leaf,
  Check,
  HeartHandshake,
} from "lucide-react";

export default function WorkspaceHomePage() {
  const { user, isDemo } = useAuth();
  const {
    savedHobbies,
    sessions,
    plans,
    journalEntries,
    preferences,
    profile,
    toggleSaveHobby,
    toggleCompleteStep,
    logSession,
    toggleCompletePlan,
  } = useHobbiverseStore();

  const [greeting, setGreeting] = React.useState("Welcome to your atelier");
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  // Quick session modal state
  const [isLogModalOpen, setIsLogModalOpen] = React.useState(false);
  const [selectedHobbySlug, setSelectedHobbySlug] = React.useState<string>(SEED_HOBBIES[0].slug);
  const [selectedDuration, setSelectedDuration] = React.useState<number>(15);
  const [selectedMood, setSelectedMood] = React.useState<string>("Calm & Centered");
  const [sessionNotes, setSessionNotes] = React.useState<string>("");

  // Hydration-safe dynamic greeting
  React.useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      const hour = new Date().getHours();
      let prefix = "Welcome";
      if (hour >= 5 && hour < 12) prefix = "Good morning";
      else if (hour >= 12 && hour < 17) prefix = "Good afternoon";
      else if (hour >= 17 && hour < 22) prefix = "Good evening";
      else prefix = "Peaceful night";

      const name = user?.displayName || profile?.displayName || "Explorer";
      setGreeting(`${prefix}, ${name}`);
    });
    return () => cancelAnimationFrame(frameId);
  }, [user, profile]);

  // Show transient toast banner
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Determine "Your Next Small Step" featured hobby and step
  const featuredInfo = React.useMemo(() => {
    if (savedHobbies.length > 0) {
      const activeSaved = savedHobbies[0];
      const found = SEED_HOBBIES.find((h) => h.id === activeSaved.hobbyId || h.slug === activeSaved.hobbySlug);
      if (found) {
        const nextStep =
          found.steps.find((s) => !activeSaved.completedStepIds.includes(s.id)) || found.steps[0];
        const isFinished = activeSaved.completedStepIds.length === found.steps.length;
        return {
          hobby: found,
          step: nextStep,
          completedCount: activeSaved.completedStepIds.length,
          totalCount: found.steps.length,
          isCompleted: activeSaved.completedStepIds.includes(nextStep.id),
          allCompleted: isFinished,
          isFromSaved: true,
        };
      }
    }

    // Fallback: Recommend based on user onboarding preferences
    const preferredCategory = preferences?.interests?.[0];
    const match =
      (preferredCategory && SEED_HOBBIES.find((h) => h.category === preferredCategory)) ||
      SEED_HOBBIES[0];

    return {
      hobby: match,
      step: match.steps[0],
      completedCount: 0,
      totalCount: match.steps.length,
      isCompleted: false,
      allCompleted: false,
      isFromSaved: false,
    };
  }, [savedHobbies, preferences]);

  // Toggle complete on featured step
  const handleCompleteFeaturedStep = async () => {
    if (!featuredInfo.hobby || !featuredInfo.step) return;
    await toggleCompleteStep(featuredInfo.hobby.id, featuredInfo.step.id);
    triggerToast(
      `Step completed! "${featuredInfo.step.title}" recorded in your creative journey.`
    );
  };

  // Toggle plan completion
  const handleTogglePlan = async (planId: string) => {
    const isNowComplete = await toggleCompletePlan(planId);
    triggerToast(
      isNowComplete
        ? "Session completed! Added to your activity log and progress."
        : "Session marked as pending."
    );
  };

  // Save/Unsave hobby
  const handleToggleSave = async (hobby: Hobby) => {
    const isSaved = await toggleSaveHobby(hobby);
    triggerToast(
      isSaved
        ? `Added "${hobby.title}" to your saved atelier bookshelf.`
        : `Removed "${hobby.title}" from your saved hobbies.`
    );
  };

  // Submit quick session log
  const handleSaveSession = async () => {
    const currentHobby =
      SEED_HOBBIES.find((h) => h.slug === selectedHobbySlug) || SEED_HOBBIES[0];

    const sessionData: Omit<ActivitySession, "id" | "createdAt"> = {
      hobbyId: currentHobby.id,
      hobbySlug: currentHobby.slug,
      hobbyTitle: currentHobby.title,
      category: currentHobby.category,
      date: new Date().toISOString().split("T")[0],
      durationMinutes: selectedDuration,
      notes: sessionNotes.trim() || undefined,
      reflectionMood: selectedMood,
    };

    await logSession(sessionData);
    setIsLogModalOpen(false);
    setSessionNotes("");
    triggerToast(`Logged ${selectedDuration} min for "${currentHobby.title}". Wonderful practice!`);
  };

  // Personalized hobby suggestions based on preferences
  const suggestedHobbies = React.useMemo(() => {
    const userInterests = preferences?.interests || ["art-craft", "cooking"];
    const savedIds = new Set(savedHobbies.map((s) => s.hobbyId));

    // Sort hobbies matching user preferences first, excluding saved if possible
    const ranked = [...SEED_HOBBIES].sort((a, b) => {
      const aMatches = userInterests.includes(a.category);
      const bMatches = userInterests.includes(b.category);
      if (aMatches && !bMatches) return -1;
      if (!aMatches && bMatches) return 1;
      return 0;
    });

    return ranked.filter((h) => !savedIds.has(h.id)).slice(0, 3);
  }, [preferences, savedHobbies]);

  // Aggregate metrics for non-clinical participation
  const totalMinutesPracticed = React.useMemo(() => {
    return sessions.reduce((acc, s) => acc + (s.durationMinutes || 0), 0);
  }, [sessions]);

  const totalStepsCompleted = React.useMemo(() => {
    return savedHobbies.reduce((acc, s) => acc + (s.completedStepIds?.length || 0), 0);
  }, [savedHobbies]);

  // Latest private journal entry
  const latestJournal = journalEntries[0] || null;

  const currentTheme =
    CATEGORY_THEMES[featuredInfo.hobby.category] || CATEGORY_THEMES["art-craft"];

  return (
    <WorkspaceShell>
      <PageContainer
        eyebrow="Atelier Dashboard"
        title={greeting}
        description="Your gentle space for quiet curiosity, mindful routines, and private reflection."
        badge={
          isDemo ? (
            <Badge variant="outdoors-nature" dot size="sm">
              Demo Mode &middot; Local Storage
            </Badge>
          ) : (
            <Badge variant="mindful" dot size="sm">
              Connected Atelier
            </Badge>
          )
        }
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsLogModalOpen(true)}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Log a Session
            </Button>
            <Link href="/journal">
              <Button variant="secondary" size="sm" leftIcon={<BookOpen className="w-4 h-4" />}>
                Private Reflection
              </Button>
            </Link>
            <Link href="/planner">
              <Button variant="primary" size="sm" leftIcon={<Calendar className="w-4 h-4" />}>
                Activity Planner
              </Button>
            </Link>
          </div>
        }
      >
        <div className="flex flex-col gap-8 text-left">
          {/* Toast Notification Alert Banner */}
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

          {/* FIRST VIEWPORT: Featured Next Small Step & Non-Clinical Participation Constellation */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Featured Next Small Step Card (2 cols) */}
            <div className="lg:col-span-2">
              <div
                style={{
                  backgroundColor: currentTheme.bgSubtle,
                  borderColor: currentTheme.border,
                }}
                className="relative rounded-[var(--radius-2xl)] border p-6 sm:p-8 shadow-[var(--shadow-warm)] overflow-hidden flex flex-col justify-between h-full text-left"
              >
                {/* Decorative Linework Glow */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-[var(--rose-100)]/40 rounded-full blur-3xl pointer-events-none" />

                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-2">
                      <Badge variant={featuredInfo.hobby.category} dot size="sm">
                        {featuredInfo.hobby.categoryName}
                      </Badge>
                      <span className="text-xs font-bold uppercase tracking-wider text-[var(--stone-600)]">
                        Your Next Small Step
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-[var(--stone-600)]">
                      <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>{featuredInfo.step.estimatedMinutes} min gentle practice</span>
                    </div>
                  </div>

                  <Link href={`/hobbies/${featuredInfo.hobby.slug}`}>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--wine-950)] hover:text-[var(--wine-700)] transition-colors mb-2 tracking-tight">
                      {featuredInfo.hobby.title}
                    </h2>
                  </Link>

                  <p className="text-sm text-[var(--ink-700)] mb-5 leading-relaxed">
                    {featuredInfo.hobby.summary}
                  </p>

                  {/* Step Action Box */}
                  <div className="p-4 rounded-[var(--radius-xl)] bg-[var(--bg-surface)]/90 border border-[var(--border-subtle)] shadow-xs mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-[var(--wine-700)]">
                        Step {featuredInfo.step.order} of {featuredInfo.totalCount}:{" "}
                        {featuredInfo.step.title}
                      </span>
                      {featuredInfo.isCompleted && (
                        <span className="text-[11px] font-semibold text-[var(--forest-700)] flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-[var(--ink-950)] leading-relaxed mb-3">
                      {featuredInfo.step.description}
                    </p>
                    {featuredInfo.step.instructions && featuredInfo.step.instructions.length > 0 && (
                      <div className="p-3 rounded-lg bg-[var(--paper-200)] text-xs text-[var(--stone-700)] flex items-start gap-2">
                        <Leaf className="w-3.5 h-3.5 text-[var(--forest-700)] shrink-0 mt-0.5" />
                        <span>{featuredInfo.step.instructions[0]}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Action Row */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[var(--border-subtle)]">
                  <div className="text-xs text-[var(--stone-600)]">
                    {featuredInfo.completedCount} of {featuredInfo.totalCount} path steps explored
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant={featuredInfo.isCompleted ? "secondary" : "primary"}
                      onClick={handleCompleteFeaturedStep}
                      leftIcon={
                        featuredInfo.isCompleted ? (
                          <Check className="w-4 h-4 text-[var(--forest-700)]" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4" />
                        )
                      }
                    >
                      {featuredInfo.isCompleted ? "Completed" : "Complete Step"}
                    </Button>

                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        setSelectedHobbySlug(featuredInfo.hobby.slug);
                        setIsLogModalOpen(true);
                      }}
                      leftIcon={<Clock className="w-4 h-4" />}
                    >
                      Log 15 Min
                    </Button>

                    <Link href={`/hobbies/${featuredInfo.hobby.slug}`}>
                      <Button size="sm" variant="ghost" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                        View Path
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Non-Clinical Participation Visualisation Card (1 col) */}
            <div className="lg:col-span-1">
              <Card variant="editorial" className="h-full flex flex-col justify-between text-left">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--wine-700)]">
                      Atelier Participation
                    </span>
                    <Sparkles className="w-4 h-4 text-[var(--wine-700)]" />
                  </div>
                  <CardTitle className="text-lg">Weekly Gentle Rhythm</CardTitle>
                  <CardDescription>
                    Celebrating quiet time spent without toxic streaks or pressure
                  </CardDescription>
                </CardHeader>

                <CardContent className="flex flex-col gap-5">
                  {/* Metric Tiles */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-[var(--radius-lg)] bg-[var(--paper-100)] border border-[var(--sand-400)] text-center">
                      <span className="text-2xl font-extrabold text-[var(--wine-950)] block">
                        {totalMinutesPracticed}
                      </span>
                      <span className="text-[11px] text-[var(--stone-600)] font-medium">
                        Minutes Practiced
                      </span>
                    </div>

                    <div className="p-3 rounded-[var(--radius-lg)] bg-[var(--paper-100)] border border-[var(--sand-400)] text-center">
                      <span className="text-2xl font-extrabold text-[var(--wine-950)] block">
                        {totalStepsCompleted}
                      </span>
                      <span className="text-[11px] text-[var(--stone-600)] font-medium">
                        Milestones Reached
                      </span>
                    </div>
                  </div>

                  {/* 7-Day Rhythm Circles */}
                  <div>
                    <span className="text-xs font-semibold text-[var(--ink-950)] block mb-2">
                      This Week&apos;s Creative Touchpoints
                    </span>
                    <div className="flex items-center justify-between p-3 rounded-[var(--radius-lg)] bg-[var(--paper-200)] border border-[var(--border-subtle)]">
                      {[
                        { day: "Mon", active: true },
                        { day: "Tue", active: true },
                        { day: "Wed", active: false },
                        { day: "Thu", active: true },
                        { day: "Fri", active: false },
                        { day: "Sat", active: false },
                        { day: "Sun", active: false },
                      ].map((item, idx) => (
                        <div key={idx} className="flex flex-col items-center gap-1">
                          <div
                            title={item.active ? `${item.day}: Active practice session` : `${item.day}: Rest day (resting nurtures curiosity)`}
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-transform ${
                              item.active
                                ? "bg-[var(--brand-anchor)] text-[var(--paper-50)] shadow-xs"
                                : "bg-[var(--paper-300)] text-[var(--stone-600)]"
                            }`}
                          >
                            {item.active ? <Check className="w-3.5 h-3.5" /> : <Circle className="w-2 h-2 opacity-40" />}
                          </div>
                          <span className="text-[10px] text-[var(--stone-600)] font-medium">
                            {item.day}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Non-clinical affirmation */}
                  <div className="p-3 rounded-lg bg-[var(--sage-100)] border border-[var(--sage-300)] text-xs text-[var(--forest-800)] flex items-start gap-2">
                    <HeartHandshake className="w-4 h-4 text-[var(--forest-700)] shrink-0 mt-0.5" />
                    <span>
                      Rest days are vital for creative synthesis. You have nothing to prove and no streaks to protect.
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* SECOND VIEWPORT: Planned Activities & Private Reflection Shortcut */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Planned Activities Card (Non-shaming consistency) */}
            <Card variant="default" className="text-left flex flex-col justify-between">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--wine-700)]">
                    Gentle Routine
                  </span>
                  <Link
                    href="/planner"
                    className="text-xs text-[var(--wine-700)] hover:underline font-semibold"
                  >
                    Open Planner &rarr;
                  </Link>
                </div>
                <CardTitle className="text-lg">This Week&apos;s Planned Sessions</CardTitle>
                <CardDescription>
                  Invitations, not obligations. Take your craft at a pace that fits your real life.
                </CardDescription>
              </CardHeader>

              <CardContent className="flex flex-col gap-3">
                {plans.length === 0 ? (
                  <div className="p-6 text-center rounded-[var(--radius-lg)] bg-[var(--paper-200)] border border-[var(--border-subtle)] text-xs text-[var(--stone-600)]">
                    <p className="mb-3">No sessions scheduled for this week.</p>
                    <Link href="/planner">
                      <Button size="sm" variant="secondary">
                        Schedule a 15-Minute Session
                      </Button>
                    </Link>
                  </div>
                ) : (
                  plans.map((plan) => (
                    <div
                      key={plan.id}
                      className={`p-3.5 rounded-[var(--radius-lg)] border transition-all flex items-center justify-between gap-3 ${
                        plan.isCompleted
                          ? "bg-[var(--sage-100)]/60 border-[var(--sage-300)] opacity-85"
                          : "bg-[var(--paper-100)] border-[var(--sand-400)] hover:border-[var(--wine-700)]/40"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <button
                          type="button"
                          onClick={() => handleTogglePlan(plan.id)}
                          aria-label={plan.isCompleted ? "Mark incomplete" : "Mark completed"}
                          className={`w-6 h-6 rounded-full flex items-center justify-center border transition-colors cursor-pointer shrink-0 ${
                            plan.isCompleted
                              ? "bg-[var(--forest-700)] border-[var(--forest-700)] text-[var(--paper-50)]"
                              : "border-[var(--sand-500)] hover:border-[var(--wine-700)] bg-[var(--paper-50)]"
                          }`}
                        >
                          {plan.isCompleted && <Check className="w-3.5 h-3.5" />}
                        </button>

                        <div className="min-w-0">
                          <Link href={`/hobbies/${plan.hobbySlug}`}>
                            <span
                              className={`text-sm font-bold block truncate hover:text-[var(--wine-700)] transition-colors ${
                                plan.isCompleted
                                  ? "line-through text-[var(--stone-600)]"
                                  : "text-[var(--ink-950)]"
                              }`}
                            >
                              {plan.hobbyTitle}
                            </span>
                          </Link>
                          <div className="flex items-center gap-2 text-xs text-[var(--stone-600)] mt-0.5">
                            <span>{plan.scheduledFor}</span>
                            <span>&middot;</span>
                            <span>{plan.estimatedDurationMinutes} min</span>
                            {plan.note && (
                              <>
                                <span>&middot;</span>
                                <span className="italic truncate max-w-[150px]">{plan.note}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0">
                        {plan.isCompleted ? (
                          <Badge variant="outdoors-nature" size="sm">
                            Done
                          </Badge>
                        ) : (
                          <Badge variant="mindful" size="sm">
                            Upcoming
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))
                )}

                {/* Non-shaming copy */}
                <p className="text-[11px] text-[var(--stone-600)] mt-2 italic text-center">
                  Missed an activity? No alarms or penalties. You can reschedule or complete it whenever your mind is clear.
                </p>
              </CardContent>
            </Card>

            {/* Private Reflection Shortcut Card */}
            <Card variant="editorial" className="text-left flex flex-col justify-between">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-[var(--wine-700)] font-bold uppercase tracking-wider">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Private & Confidential</span>
                  </div>
                  <Link
                    href="/journal"
                    className="text-xs text-[var(--wine-700)] hover:underline font-semibold"
                  >
                    Open Journal &rarr;
                  </Link>
                </div>
                <CardTitle className="text-lg">Recent Personal Reflection</CardTitle>
                <CardDescription>
                  Your thoughts remain on your device. Never shared with public circles.
                </CardDescription>
              </CardHeader>

              <CardContent className="flex flex-col gap-4">
                {latestJournal ? (
                  <div className="p-4 rounded-[var(--radius-xl)] bg-[var(--paper-100)] border border-[var(--sand-400)] shadow-xs">
                    <div className="flex items-center justify-between mb-2 text-xs text-[var(--stone-600)]">
                      <span>{latestJournal.date}</span>
                      {latestJournal.moodLabel && (
                        <Badge size="sm" variant="mindful">
                          {latestJournal.moodLabel}
                        </Badge>
                      )}
                    </div>
                    <blockquote className="text-sm italic font-serif text-[var(--ink-950)] leading-relaxed mb-3">
                      &ldquo;{latestJournal.content}&rdquo;
                    </blockquote>
                    {latestJournal.hobbyTitle && (
                      <span className="text-xs font-semibold text-[var(--wine-700)]">
                        Hobby: {latestJournal.hobbyTitle}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="p-6 text-center rounded-[var(--radius-lg)] bg-[var(--paper-200)] border border-[var(--border-subtle)] text-xs text-[var(--stone-600)]">
                    <p className="mb-2">No reflections recorded yet.</p>
                    <p className="text-[11px] text-[var(--stone-500)]">
                      Journaling after a practice helps ground your senses and track subtle joy.
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-[var(--border-subtle)]">
                  <span className="text-xs text-[var(--stone-600)]">
                    {journalEntries.length} private notes in your atelier
                  </span>
                  <Link href="/journal">
                    <Button size="sm" variant="primary" leftIcon={<BookOpen className="w-4 h-4" />}>
                      Write Today&apos;s Reflection
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* THIRD VIEWPORT: Pick Up Where You Left Off (Saved Hobbies Bookshelf) */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-[var(--wine-950)]">
                  Pick Up Where You Left Off
                </h3>
                <p className="text-xs text-[var(--stone-600)]">
                  Your saved crafts and active learning milestones
                </p>
              </div>

              <Link
                href="/my-hobbies"
                className="text-xs text-[var(--wine-700)] hover:underline font-semibold"
              >
                View all saved ({savedHobbies.length}) &rarr;
              </Link>
            </div>

            {savedHobbies.length === 0 ? (
              /* Useful No-Data / First-Time State */
              <Card variant="editorial" className="p-8 text-center text-left">
                <div className="max-w-md mx-auto flex flex-col items-center text-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[var(--brand-soft)] flex items-center justify-center text-[var(--wine-700)]">
                    <Bookmark className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold text-[var(--wine-950)]">
                    Your Atelier Bookshelf is Empty
                  </h4>
                  <p className="text-xs text-[var(--stone-600)] leading-relaxed">
                    Save a hobby to keep track of its learning path, supplies checklist, and order of steps without rushing.
                  </p>
                  <Link href="/explore">
                    <Button variant="primary" size="sm" leftIcon={<Compass className="w-4 h-4" />}>
                      Discover Beginner Hobbies
                    </Button>
                  </Link>
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {savedHobbies.slice(0, 3).map((saved) => {
                  const fullHobby = SEED_HOBBIES.find((h) => h.id === saved.hobbyId || h.slug === saved.hobbySlug);
                  const totalSteps = fullHobby?.steps?.length || 3;
                  const completedCount = saved.completedStepIds?.length || 0;
                  const percentage = Math.round((completedCount / totalSteps) * 100);

                  return (
                    <Card
                      key={saved.id}
                      variant="default"
                      className="flex flex-col justify-between hover:shadow-[var(--shadow-warm)] transition-shadow text-left"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant={saved.category} size="sm">
                            {saved.category}
                          </Badge>
                          <span className="text-[11px] font-bold text-[var(--wine-700)]">
                            {percentage}% complete
                          </span>
                        </div>

                        <Link href={`/hobbies/${saved.hobbySlug}`}>
                          <CardTitle className="text-base hover:text-[var(--wine-700)] transition-colors">
                            {saved.hobbyTitle}
                          </CardTitle>
                        </Link>
                        <CardDescription className="line-clamp-2 text-xs">
                          {fullHobby?.summary || "Gentle creative study in your atelier."}
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="pt-0">
                        {/* Progress Bar */}
                        <div className="w-full bg-[var(--paper-300)] h-1.5 rounded-full overflow-hidden mb-3">
                          <div
                            className="h-full bg-[var(--forest-700)] rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between text-xs text-[var(--stone-600)] mb-4">
                          <span>
                            Step {completedCount} of {totalSteps}
                          </span>
                          <span className="text-[11px] font-medium text-[var(--forest-700)]">
                            Flexible pace
                          </span>
                        </div>

                        <div className="flex items-center gap-2 pt-3 border-t border-[var(--border-subtle)]">
                          <Link href={`/hobbies/${saved.hobbySlug}`} className="flex-1">
                            <Button size="sm" variant="secondary" className="w-full">
                              Continue
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setSelectedHobbySlug(saved.hobbySlug);
                              setIsLogModalOpen(true);
                            }}
                            title="Log session"
                          >
                            <Clock className="w-4 h-4 text-[var(--stone-600)]" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          {/* FOURTH VIEWPORT: Suggested Hobbies for You & Recent Sessions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Suggested Hobbies Based on Preferences (2 cols) */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-[var(--wine-950)]">
                    Curated for Your Interests
                  </h3>
                  <p className="text-xs text-[var(--stone-600)]">
                    Recommendations calibrated to your onboarding pace and curiosity
                  </p>
                </div>

                <Link
                  href="/explore"
                  className="text-xs text-[var(--wine-700)] hover:underline font-semibold"
                >
                  Explore All ({SEED_HOBBIES.length}) &rarr;
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {suggestedHobbies.slice(0, 2).map((hobby) => {
                  const isSaved = savedHobbies.some((s) => s.hobbyId === hobby.id);

                  return (
                    <div
                      key={hobby.id}
                      className="p-5 rounded-[var(--radius-xl)] bg-[var(--paper-100)] border border-[var(--sand-400)] hover:border-[var(--wine-700)]/40 transition-all flex flex-col justify-between text-left shadow-xs"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <Badge variant={hobby.category} size="sm">
                            {hobby.categoryName}
                          </Badge>
                          <button
                            type="button"
                            onClick={() => handleToggleSave(hobby)}
                            aria-label={isSaved ? "Remove from saved" : "Save hobby"}
                            className="p-1.5 rounded-full hover:bg-[var(--paper-300)] text-[var(--wine-700)] transition-colors cursor-pointer"
                          >
                            {isSaved ? (
                              <BookmarkCheck className="w-4 h-4 fill-[var(--wine-700)]" />
                            ) : (
                              <Bookmark className="w-4 h-4" />
                            )}
                          </button>
                        </div>

                        <Link href={`/hobbies/${hobby.slug}`}>
                          <h4 className="font-extrabold text-base text-[var(--ink-950)] hover:text-[var(--wine-700)] transition-colors mb-1.5">
                            {hobby.title}
                          </h4>
                        </Link>

                        <p className="text-xs text-[var(--stone-600)] line-clamp-2 mb-4 leading-relaxed">
                          {hobby.summary}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-[var(--border-subtle)] text-xs">
                        <div className="flex items-center gap-1.5 text-[var(--stone-600)]">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{hobby.timeEstimate}</span>
                        </div>

                        <Link href={`/hobbies/${hobby.slug}`}>
                          <Button size="sm" variant="ghost" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                            Explore
                          </Button>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Practice Sessions (1 col) */}
            <div className="lg:col-span-1 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-[var(--wine-950)]">Recent Sessions</h3>
                  <p className="text-xs text-[var(--stone-600)]">Private practice activity</p>
                </div>
              </div>

              <Card variant="default" className="text-left flex-1 flex flex-col justify-between">
                <CardContent className="p-4 flex flex-col gap-3">
                  {sessions.length === 0 ? (
                    <div className="p-6 text-center text-xs text-[var(--stone-600)]">
                      <p>No activity logged yet.</p>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setIsLogModalOpen(true)}
                        className="mt-3"
                      >
                        Log Your First 15 Min
                      </Button>
                    </div>
                  ) : (
                    sessions.slice(0, 3).map((sess) => (
                      <div
                        key={sess.id}
                        className="p-3 rounded-[var(--radius-md)] bg-[var(--paper-200)] flex flex-col gap-1.5 text-xs text-left"
                      >
                        <div className="flex items-center justify-between">
                          <Link
                            href={`/hobbies/${sess.hobbySlug}`}
                            className="font-bold text-[var(--ink-950)] hover:underline truncate"
                          >
                            {sess.hobbyTitle}
                          </Link>
                          <span className="font-semibold text-[var(--wine-700)] shrink-0">
                            {sess.durationMinutes}m
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-[var(--stone-600)]">
                          <span>{sess.date}</span>
                          {sess.reflectionMood && (
                            <span className="text-[var(--forest-700)] font-medium">
                              {sess.reflectionMood}
                            </span>
                          )}
                        </div>

                        {sess.notes && (
                          <p className="text-[11px] text-[var(--ink-700)] italic line-clamp-1">
                            &ldquo;{sess.notes}&rdquo;
                          </p>
                        )}
                      </div>
                    ))
                  )}
                </CardContent>

                <div className="p-4 border-t border-[var(--border-subtle)] bg-[var(--paper-100)] flex items-center justify-between">
                  <span className="text-xs text-[var(--stone-600)]">
                    {sessions.length} sessions recorded
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setIsLogModalOpen(true)}
                    leftIcon={<Plus className="w-3.5 h-3.5" />}
                  >
                    Quick Log
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* INTERACTIVE QUICK SESSION MODAL */}
        <Dialog
          isOpen={isLogModalOpen}
          onClose={() => setIsLogModalOpen(false)}
          title="Log an Atelier Practice Session"
          description="Record a gentle session to update your quiet milestones. Private to your device."
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
            {/* Hobby Selector */}
            <div>
              <label className="text-xs font-bold text-[var(--ink-950)] block mb-1.5">
                Which hobby did you practice?
              </label>
              <select
                value={selectedHobbySlug}
                onChange={(e) => setSelectedHobbySlug(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-[var(--radius-md)] bg-[var(--paper-100)] border border-[var(--sand-400)] text-sm text-[var(--ink-950)] focus:outline-none focus:border-[var(--wine-700)]"
              >
                {SEED_HOBBIES.map((h) => (
                  <option key={h.id} value={h.slug}>
                    {h.title} ({h.categoryName})
                  </option>
                ))}
              </select>
            </div>

            {/* Duration Picker */}
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

            {/* Mood / Feeling */}
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
                  "Playful",
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

            {/* Optional Reflection Note */}
            <div>
              <label className="text-xs font-bold text-[var(--ink-950)] block mb-1.5">
                Quiet Reflection or Observation (Optional)
              </label>
              <textarea
                value={sessionNotes}
                onChange={(e) => setSessionNotes(e.target.value)}
                placeholder="What did your hands notice? Did any colors, textures, or chords bring delight?"
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
