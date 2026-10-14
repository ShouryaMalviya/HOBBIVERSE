"use client";

import * as React from "react";
import Link from "next/link";
import { WorkspaceShell } from "@/components/layout/WorkspaceShell";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Dialog } from "@/components/ui/Dialog";
import { useHobbiverseStore } from "@/services/useStore";
import { useAuth } from "@/services/auth";
import { CATEGORY_THEMES } from "@/styles/tokens";
import { Hobby, ActivitySession } from "@/types";
import {
  Clock,
  Calendar,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  Circle,
  Check,
  Plus,
  Sparkles,
  DollarSign,
  Users,
  User,
  CheckSquare,
  Square,
  ArrowRight,
  Leaf,
  Layers,
} from "lucide-react";

export interface HobbyDetailViewProps {
  hobby: Hobby;
  relatedHobbies: Hobby[];
}

export const HobbyDetailView: React.FC<HobbyDetailViewProps> = ({
  hobby,
  relatedHobbies,
}) => {
  const { session } = useAuth();
  const { savedHobbies, toggleSaveHobby, toggleCompleteStep, logSession } =
    useHobbiverseStore();

  const [toastMessage, setToastMessage] = React.useState<string | null>(null);
  const [checkedSupplies, setCheckedSupplies] = React.useState<Record<string, boolean>>({});

  // Quick session modal state
  const [isLogModalOpen, setIsLogModalOpen] = React.useState(false);
  const [selectedDuration, setSelectedDuration] = React.useState<number>(hobby.estimatedMinutes || 15);
  const [selectedMood, setSelectedMood] = React.useState<string>("Calm & Centered");
  const [sessionNotes, setSessionNotes] = React.useState<string>("");

  const theme = CATEGORY_THEMES[hobby.category] || CATEGORY_THEMES["art-craft"];

  // Find saved state & completed steps
  const savedRecord = savedHobbies.find(
    (s) => s.hobbyId === hobby.id || s.hobbySlug === hobby.slug
  );
  const isSaved = Boolean(savedRecord);
  const completedStepIds = savedRecord?.completedStepIds || [];
  const completedCount = completedStepIds.length;
  const totalSteps = hobby.steps.length;
  const progressPercent = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;

  // Show transient toast
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Toggle Save Hobby
  const handleToggleSave = async () => {
    const isNowSaved = await toggleSaveHobby(hobby);
    triggerToast(
      isNowSaved
        ? `Added "${hobby.title}" to your saved atelier bookshelf.`
        : `Removed "${hobby.title}" from your saved hobbies.`
    );
  };

  // Toggle Step Completion
  const handleToggleStep = async (stepId: string, stepTitle: string) => {
    const updatedCompletedIds = await toggleCompleteStep(hobby.id, stepId);
    const wasCompleted = updatedCompletedIds.includes(stepId);
    triggerToast(
      wasCompleted
        ? `Step completed: "${stepTitle}". Wonderful progress!`
        : `Step marked pending: "${stepTitle}".`
    );
  };

  // Toggle supply checkbox
  const handleToggleSupply = (item: string) => {
    setCheckedSupplies((prev) => ({
      ...prev,
      [item]: !prev[item],
    }));
  };

  // Submit session log
  const handleSaveSession = async () => {
    const sessionData: Omit<ActivitySession, "id" | "createdAt"> = {
      hobbyId: hobby.id,
      hobbySlug: hobby.slug,
      hobbyTitle: hobby.title,
      category: hobby.category,
      date: new Date().toISOString().split("T")[0],
      durationMinutes: selectedDuration,
      notes: sessionNotes.trim() || undefined,
      reflectionMood: selectedMood,
    };

    await logSession(sessionData);
    setIsLogModalOpen(false);
    setSessionNotes("");
    triggerToast(`Logged ${selectedDuration} min for "${hobby.title}". Practice recorded!`);
  };

  const content = (
    <PageContainer
      eyebrow="Hobby Learning Pathway"
      title={hobby.title}
      description={hobby.summary}
      breadcrumbs={[
        { label: "Explore", href: "/explore" },
        { label: hobby.categoryName, href: `/explore` },
        { label: hobby.title },
      ]}
      actions={
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant={isSaved ? "secondary" : "outline"}
            size="sm"
            onClick={handleToggleSave}
            leftIcon={
              isSaved ? (
                <BookmarkCheck className="w-4 h-4 fill-[var(--wine-700)] text-[var(--wine-700)]" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )
            }
          >
            {isSaved ? "Saved in Atelier" : "Save to My Hobbies"}
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsLogModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Log Session
          </Button>

          <Link href="/planner">
            <Button variant="primary" size="sm" leftIcon={<Calendar className="w-4 h-4" />}>
              Schedule Session
            </Button>
          </Link>
        </div>
      }
    >
      <div className="flex flex-col gap-8 text-left max-w-5xl">
        {/* Toast Alert Banner */}
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

        {/* 1. DISTINCTIVE HERO & CATEGORY ACCENT BANNER */}
        <div
          style={{
            backgroundColor: theme.bgSubtle,
            borderColor: theme.border,
          }}
          className="relative rounded-[var(--radius-2xl)] border p-6 sm:p-8 shadow-[var(--shadow-warm)] overflow-hidden"
        >
          {/* Subtle Glow & Linework */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--rose-100)]/40 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <Badge variant={hobby.category} dot size="sm">
                {hobby.categoryName}
              </Badge>
              {hobby.isFeatured && (
                <Badge variant="brand" size="sm">
                  Featured Pick
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-[var(--stone-600)]">
              <Clock className="w-3.5 h-3.5" />
              <span>{hobby.timeEstimate}</span>
              <span>&middot;</span>
              <span className="capitalize">{hobby.difficulty}</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-[var(--wine-950)] tracking-tight mb-4">
            {hobby.title}
          </h1>

          <p className="text-sm sm:text-base text-[var(--ink-800)] leading-relaxed max-w-3xl mb-6">
            {hobby.description}
          </p>

          {/* Quick Start Prompt Banner */}
          <div className="p-4 rounded-[var(--radius-xl)] bg-[var(--bg-surface)]/90 border border-[var(--border-subtle)] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-[var(--brand-soft)] flex items-center justify-center text-[var(--wine-700)] shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--wine-800)] block">
                  Today&apos;s First Small Step
                </span>
                <p className="text-xs sm:text-sm text-[var(--ink-950)] mt-0.5 font-medium">
                  {hobby.firstStepPrompt}
                </p>
              </div>
            </div>

            <Button
              size="sm"
              variant="primary"
              onClick={() => {
                const firstStep = hobby.steps[0];
                if (firstStep) {
                  handleToggleStep(firstStep.id, firstStep.title);
                }
              }}
              leftIcon={<CheckCircle2 className="w-4 h-4" />}
            >
              {completedStepIds.includes(hobby.steps[0]?.id)
                ? "Step 1 Done"
                : "Complete Step 1"}
            </Button>
          </div>
        </div>

        {/* 2. ATTRIBUTES & FIT METRICS GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-[var(--radius-lg)] bg-[var(--paper-100)] border border-[var(--sand-400)]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--stone-600)] block">
              Time Commitment
            </span>
            <span className="text-sm font-bold text-[var(--ink-950)] mt-1 block">
              {hobby.timeEstimate}
            </span>
            <span className="text-[11px] text-[var(--stone-600)] mt-0.5 block">
              Short, focused blocks
            </span>
          </div>

          <div className="p-4 rounded-[var(--radius-lg)] bg-[var(--paper-100)] border border-[var(--sand-400)]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--stone-600)] block">
              Skill &amp; Barrier
            </span>
            <span className="text-sm font-bold text-[var(--forest-700)] mt-1 block capitalize">
              {hobby.difficulty} Friendly
            </span>
            <span className="text-[11px] text-[var(--stone-600)] mt-0.5 block">
              No prior expertise
            </span>
          </div>

          <div className="p-4 rounded-[var(--radius-lg)] bg-[var(--paper-100)] border border-[var(--sand-400)]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--stone-600)] block">
              Setting &amp; Space
            </span>
            <span className="text-sm font-bold text-[var(--ink-950)] mt-1 block capitalize">
              {hobby.locationType}
            </span>
            <span className="text-[11px] text-[var(--stone-600)] mt-0.5 block">
              Quiet corner or desk
            </span>
          </div>

          <div className="p-4 rounded-[var(--radius-lg)] bg-[var(--paper-100)] border border-[var(--sand-400)]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--stone-600)] block">
              Social Dynamic
            </span>
            <span className="text-sm font-bold text-[var(--wine-700)] mt-1 block capitalize">
              {hobby.socialType}
            </span>
            <span className="text-[11px] text-[var(--stone-600)] mt-0.5 block">
              Adaptable to your mood
            </span>
          </div>
        </div>

        {/* 3. STRUCTURED BEGINNER PATH (ORDERED STEPS & COMPLETION CONTROLS) */}
        <div className="flex flex-col gap-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[var(--border-subtle)]">
            <div>
              <h2 className="text-xl font-bold text-[var(--wine-950)]">
                Structured Beginner Path
              </h2>
              <p className="text-xs text-[var(--stone-600)]">
                Ordered, gentle milestones. Mark steps complete as you progress without deadlines.
              </p>
            </div>

            {/* Overall Progress Indicator */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-[var(--wine-800)]">
                {completedCount} of {totalSteps} steps completed ({progressPercent}%)
              </span>
              <div className="w-24 bg-[var(--paper-300)] h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[var(--forest-700)] rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {hobby.steps.map((step) => {
              const isStepDone = completedStepIds.includes(step.id);

              return (
                <div
                  key={step.id}
                  className={`p-5 rounded-[var(--radius-xl)] border transition-all text-left flex flex-col gap-4 ${
                    isStepDone
                      ? "bg-[var(--sage-100)]/40 border-[var(--sage-300)] opacity-90"
                      : "bg-[var(--paper-100)] border-[var(--sand-400)] hover:border-[var(--wine-700)]/40 shadow-xs"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                          isStepDone
                            ? "bg-[var(--forest-700)] text-[var(--paper-50)]"
                            : "bg-[var(--paper-300)] text-[var(--wine-900)]"
                        }`}
                      >
                        Step {step.order}
                      </span>
                      <h3
                        className={`text-base font-bold ${
                          isStepDone
                            ? "line-through text-[var(--stone-600)]"
                            : "text-[var(--ink-950)]"
                        }`}
                      >
                        {step.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[var(--stone-600)] flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {step.estimatedMinutes} min
                      </span>
                      <Button
                        size="sm"
                        variant={isStepDone ? "secondary" : "outline"}
                        onClick={() => handleToggleStep(step.id, step.title)}
                        leftIcon={
                          isStepDone ? (
                            <Check className="w-3.5 h-3.5 text-[var(--forest-700)]" />
                          ) : (
                            <Circle className="w-3.5 h-3.5" />
                          )
                        }
                      >
                        {isStepDone ? "Completed" : "Mark Complete"}
                      </Button>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-[var(--ink-800)] leading-relaxed">
                    {step.description}
                  </p>

                  {/* Step Instructions */}
                  {step.instructions && step.instructions.length > 0 && (
                    <div className="p-3.5 rounded-lg bg-[var(--paper-200)]/80 text-xs text-[var(--ink-900)] flex flex-col gap-2">
                      <span className="font-bold text-[var(--stone-700)] uppercase tracking-wider text-[10px]">
                        Action Steps:
                      </span>
                      <ol className="list-decimal list-inside space-y-1 text-[var(--ink-800)]">
                        {step.instructions.map((inst, i) => (
                          <li key={i} className="leading-relaxed">
                            {inst}
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {/* Step Supplies */}
                  {step.suppliesNeeded && step.suppliesNeeded.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-[var(--stone-600)]">
                      <span className="font-medium text-[var(--stone-700)]">Needed for this step:</span>
                      {step.suppliesNeeded.map((sup, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-[var(--paper-300)] text-[var(--ink-800)]"
                        >
                          {sup}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. BEGINNER SUPPLIES & ESTIMATED COST GUIDANCE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Materials Checklist */}
          <Card variant="editorial" className="text-left">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Leaf className="w-4 h-4 text-[var(--forest-700)]" />
                <CardTitle className="text-lg">Beginner Supplies Checklist</CardTitle>
              </div>
              <CardDescription>
                Check off items you already have at home. No need to buy everything at once.
              </CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col gap-2.5">
              {hobby.materialsNeeded.map((item, idx) => {
                const isChecked = Boolean(checkedSupplies[item]);

                return (
                  <div
                    key={idx}
                    onClick={() => handleToggleSupply(item)}
                    className="p-2.5 rounded-lg bg-[var(--paper-200)] hover:bg-[var(--paper-300)] transition-colors flex items-center justify-between text-xs text-[var(--ink-950)] cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-2.5">
                      {isChecked ? (
                        <CheckSquare className="w-4 h-4 text-[var(--forest-700)] shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-[var(--stone-500)] shrink-0" />
                      )}
                      <span className={isChecked ? "line-through text-[var(--stone-600)]" : "font-medium"}>
                        {item}
                      </span>
                    </div>

                    <span className="text-[10px] text-[var(--stone-600)]">
                      {isChecked ? "On hand" : "Check if owned"}
                    </span>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Cost Transparency & Skills Practiced */}
          <div className="flex flex-col gap-4">
            <Card variant="editorial" className="text-left">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-[var(--wine-700)]" />
                  <CardTitle className="text-lg">Honest Cost Guidance</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-2 text-xs text-[var(--ink-800)] leading-relaxed">
                <p className="font-bold text-sm text-[var(--wine-950)]">
                  {hobby.costRange}
                </p>
                <p className="text-[var(--stone-600)] text-[11px]">
                  Approximate cost estimate for entry-level supplies. We do not sell kits or guarantee prices; check with your favorite local art, music, or secondhand shop.
                </p>
              </CardContent>
            </Card>

            <Card variant="editorial" className="text-left">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[var(--wine-700)]" />
                  <CardTitle className="text-lg">Skills You Will Cultivate</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2 pt-1">
                {hobby.skillsPracticed.map((skill, idx) => (
                  <Badge key={idx} variant="mindful" size="sm">
                    {skill}
                  </Badge>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 5. MAKE IT YOUR OWN (SOLO & SOCIAL ADAPTATIONS) */}
        <div className="flex flex-col gap-4">
          <div className="pb-2 border-b border-[var(--border-subtle)]">
            <h2 className="text-xl font-bold text-[var(--wine-950)]">
              Make It Your Own
            </h2>
            <p className="text-xs text-[var(--stone-600)]">
              Ways to shape this craft around your emotional rhythm, alone or in community.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Solo Practice */}
            <div className="p-5 rounded-[var(--radius-xl)] bg-[var(--paper-100)] border border-[var(--sand-400)] flex flex-col gap-2 text-left shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--forest-700)]">
                <User className="w-4 h-4" />
                <span>Solo Practice Sanctuary</span>
              </div>
              <p className="text-xs sm:text-sm text-[var(--ink-800)] leading-relaxed">
                {hobby.waysToAdapt.solo}
              </p>
            </div>

            {/* Social Practice */}
            <div className="p-5 rounded-[var(--radius-xl)] bg-[var(--paper-100)] border border-[var(--sand-400)] flex flex-col gap-2 text-left shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--wine-700)]">
                <Users className="w-4 h-4" />
                <span>Circle &amp; Shared Connection</span>
              </div>
              <p className="text-xs sm:text-sm text-[var(--ink-800)] leading-relaxed">
                {hobby.waysToAdapt.social}
              </p>
            </div>
          </div>
        </div>

        {/* 6. RELATED HOBBIES (CURATED FROM CATEGORY & SHARED TAGS) */}
        {relatedHobbies.length > 0 && (
          <div className="flex flex-col gap-4 mt-4 pt-6 border-t border-[var(--border-subtle)]">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-[var(--wine-950)]">
                  Complementary Pathways
                </h3>
                <p className="text-xs text-[var(--stone-600)]">
                  Similar crafts sharing tactile mediums and peaceful pacing
                </p>
              </div>

              <Link
                href="/explore"
                className="text-xs text-[var(--wine-700)] hover:underline font-semibold"
              >
                Explore library &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedHobbies.map((rel) => (
                <div
                  key={rel.slug}
                  className="p-4 rounded-[var(--radius-lg)] bg-[var(--paper-100)] border border-[var(--sand-400)] hover:border-[var(--wine-700)]/40 transition-all flex flex-col justify-between text-left shadow-xs"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant={rel.category} size="sm">
                        {rel.categoryName}
                      </Badge>
                      <span className="text-[11px] text-[var(--stone-600)] flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {rel.timeEstimate}
                      </span>
                    </div>

                    <Link href={`/hobbies/${rel.slug}`}>
                      <h4 className="font-bold text-sm text-[var(--ink-950)] hover:text-[var(--wine-700)] transition-colors mb-1 truncate">
                        {rel.title}
                      </h4>
                    </Link>

                    <p className="text-xs text-[var(--stone-600)] line-clamp-2 mb-3">
                      {rel.summary}
                    </p>
                  </div>

                  <Link href={`/hobbies/${rel.slug}`}>
                    <Button size="sm" variant="ghost" className="w-full text-xs" rightIcon={<ArrowRight className="w-3 h-3" />}>
                      View Pathway
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* QUICK SESSION LOGGING MODAL */}
      <Dialog
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        title={`Log Practice: ${hobby.title}`}
        description="Record quiet practice time to update your private atelier log. Saved on your device."
        footer={
          <div className="flex items-center justify-end gap-2 w-full">
            <Button variant="ghost" size="sm" onClick={() => setIsLogModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleSaveSession}>
              Save Session to Atelier
            </Button>
          </div>
        }
      >
        <div className="flex flex-col gap-4 text-left py-2">
          {/* Duration */}
          <div>
            <label className="text-xs font-bold text-[var(--ink-950)] block mb-1.5">
              Practice Duration (minutes)
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
              How did your mind and hands feel?
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
              Notes or Sensory Details (Optional)
            </label>
            <textarea
              value={sessionNotes}
              onChange={(e) => setSessionNotes(e.target.value)}
              placeholder="What colors, textures, or aromas did you notice? Any small joy?"
              rows={3}
              className="w-full px-3.5 py-2.5 rounded-[var(--radius-md)] bg-[var(--paper-100)] border border-[var(--sand-400)] text-xs text-[var(--ink-950)] focus:outline-none focus:border-[var(--wine-700)] resize-none"
            />
          </div>
        </div>
      </Dialog>
    </PageContainer>
  );

  // Wrap in WorkspaceShell if session exists, else Public layout
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
};
