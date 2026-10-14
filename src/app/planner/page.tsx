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
import { PlannedActivity, ActivitySession } from "@/types";
import {
  Calendar,
  Clock,
  Plus,
  Check,
  Circle,
  Trash2,
  Edit2,
  HeartHandshake,
  AlertCircle,
  Bell,
} from "lucide-react";

export default function PlannerPage() {
  const { isDemo } = useAuth();
  const {
    plans,
    sessions,
    savedHobbies,
    createPlan,
    updatePlan,
    deletePlan,
    toggleCompletePlan,
    logSession,
  } = useHobbiverseStore();

  const [activeTab, setActiveTab] = React.useState<"upcoming" | "completed" | "all">("upcoming");
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  // Modal: Create or Edit Plan
  const [isPlanModalOpen, setIsPlanModalOpen] = React.useState(false);
  const [editingPlanId, setEditingPlanId] = React.useState<string | null>(null);
  const [planHobbySlug, setPlanHobbySlug] = React.useState<string>(SEED_HOBBIES[0].slug);
  const [planSchedule, setPlanSchedule] = React.useState<string>("Tomorrow 6:00 PM");
  const [planDuration, setPlanDuration] = React.useState<number>(15);
  const [planReminder, setPlanReminder] = React.useState<"none" | "gentle-prompt">("gentle-prompt");
  const [planNote, setPlanNote] = React.useState<string>("");
  const [planError, setPlanError] = React.useState<string | null>(null);

  // Modal: Delete Confirmation
  const [deletingPlanId, setDeletingPlanId] = React.useState<string | null>(null);

  // Modal: Log Activity Session
  const [isLogModalOpen, setIsLogModalOpen] = React.useState(false);
  const [logHobbySlug, setLogHobbySlug] = React.useState<string>(SEED_HOBBIES[0].slug);
  const [logDuration, setLogDuration] = React.useState<number>(15);
  const [logMood, setLogMood] = React.useState<string>("Calm & Centered");
  const [logNotes, setLogNotes] = React.useState<string>("");

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Open Create Plan modal
  const handleOpenCreatePlan = () => {
    setEditingPlanId(null);
    setPlanHobbySlug(savedHobbies[0]?.hobbySlug || SEED_HOBBIES[0].slug);
    setPlanSchedule("Tomorrow 6:00 PM");
    setPlanDuration(15);
    setPlanReminder("gentle-prompt");
    setPlanNote("");
    setPlanError(null);
    setIsPlanModalOpen(true);
  };

  // Open Edit Plan modal
  const handleOpenEditPlan = (plan: PlannedActivity) => {
    setEditingPlanId(plan.id);
    setPlanHobbySlug(plan.hobbySlug);
    setPlanSchedule(plan.scheduledFor);
    setPlanDuration(plan.estimatedDurationMinutes);
    setPlanReminder(plan.reminderPreference || "none");
    setPlanNote(plan.note || "");
    setPlanError(null);
    setIsPlanModalOpen(true);
  };

  // Submit Create or Edit Plan
  const handleSavePlan = async () => {
    if (!planSchedule.trim()) {
      setPlanError("Please enter when you would like to schedule this session.");
      return;
    }

    const matchedHobby =
      SEED_HOBBIES.find((h) => h.slug === planHobbySlug) || SEED_HOBBIES[0];

    if (editingPlanId) {
      await updatePlan(editingPlanId, {
        hobbyId: matchedHobby.id,
        hobbySlug: matchedHobby.slug,
        hobbyTitle: matchedHobby.title,
        category: matchedHobby.category,
        scheduledFor: planSchedule.trim(),
        estimatedDurationMinutes: planDuration,
        reminderPreference: planReminder,
        note: planNote.trim() || undefined,
      });
      triggerToast(`Updated session for "${matchedHobby.title}".`);
    } else {
      await createPlan({
        hobbyId: matchedHobby.id,
        hobbySlug: matchedHobby.slug,
        hobbyTitle: matchedHobby.title,
        category: matchedHobby.category,
        scheduledFor: planSchedule.trim(),
        estimatedDurationMinutes: planDuration,
        reminderPreference: planReminder,
        note: planNote.trim() || undefined,
        isCompleted: false,
      });
      triggerToast(`Scheduled "${matchedHobby.title}" session.`);
    }

    setIsPlanModalOpen(false);
  };

  // Confirm delete plan
  const handleConfirmDeletePlan = async () => {
    if (!deletingPlanId) return;
    await deletePlan(deletingPlanId);
    setDeletingPlanId(null);
    triggerToast("Session invitation removed from your planner.");
  };

  // Toggle plan complete
  const handleTogglePlan = async (id: string) => {
    const isNowComplete = await toggleCompletePlan(id);
    triggerToast(
      isNowComplete
        ? "Session completed! Added to your activity log and progress."
        : "Session marked as pending."
    );
  };

  // Submit direct session log
  const handleSaveDirectSession = async () => {
    const matchedHobby =
      SEED_HOBBIES.find((h) => h.slug === logHobbySlug) || SEED_HOBBIES[0];

    const sessionData: Omit<ActivitySession, "id" | "createdAt"> = {
      hobbyId: matchedHobby.id,
      hobbySlug: matchedHobby.slug,
      hobbyTitle: matchedHobby.title,
      category: matchedHobby.category,
      date: new Date().toISOString().split("T")[0],
      durationMinutes: logDuration,
      notes: logNotes.trim() || undefined,
      reflectionMood: logMood,
    };

    await logSession(sessionData);
    setIsLogModalOpen(false);
    setLogNotes("");
    triggerToast(`Logged ${logDuration} min for "${matchedHobby.title}". Wonderful practice!`);
  };

  // Filtered plans
  const filteredPlans = React.useMemo(() => {
    if (activeTab === "upcoming") {
      return plans.filter((p) => !p.isCompleted);
    }
    if (activeTab === "completed") {
      return plans.filter((p) => p.isCompleted);
    }
    return plans;
  }, [plans, activeTab]);

  return (
    <WorkspaceShell>
      <PageContainer
        eyebrow="Routine &amp; Flow"
        title="Activity Planner &amp; Session Log"
        description="Schedule gentle creative sessions and log completed practices with zero shame or streak penalties."
        breadcrumbs={[{ label: "Planner" }]}
        badge={
          isDemo ? (
            <Badge variant="outdoors-nature" dot size="sm">
              Demo Mode &middot; Local Storage
            </Badge>
          ) : (
            <Badge variant="mindful" dot size="sm">
              Personal Flow
            </Badge>
          )
        }
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsLogModalOpen(true)}
              leftIcon={<Clock className="w-4 h-4" />}
            >
              Log Past Session
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleOpenCreatePlan}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Plan New Session
            </Button>
          </div>
        }
      >
        <div className="flex flex-col gap-8 text-left max-w-5xl">
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

          {/* NON-SHAMING PHILOSOPHY CALLOUT */}
          <div className="p-4 rounded-[var(--radius-xl)] bg-[var(--sage-100)] border border-[var(--sage-300)] text-xs text-[var(--forest-900)] flex items-start gap-3 shadow-xs">
            <HeartHandshake className="w-5 h-5 text-[var(--forest-700)] shrink-0 mt-0.5" />
            <div className="flex flex-col gap-0.5">
              <span className="font-bold text-sm text-[var(--forest-950)]">
                Our Non-Shaming Planning Philosophy
              </span>
              <p className="leading-relaxed">
                Planned times are gentle invitations to create space for yourself. If life gets busy or energy is low, there are no streak penalties, broken records, or guilt-inducing alarms. Pick it back up whenever your mind feels open.
              </p>
            </div>
          </div>

          {/* TAB FILTER & SUMMARY BAR */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[var(--border-subtle)]">
            <div className="flex items-center gap-1.5" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "upcoming"}
                onClick={() => setActiveTab("upcoming")}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                  activeTab === "upcoming"
                    ? "bg-[var(--wine-800)] text-[var(--paper-50)] shadow-xs"
                    : "bg-[var(--paper-200)] text-[var(--stone-700)] hover:bg-[var(--paper-300)]"
                }`}
              >
                Upcoming Invitations ({plans.filter((p) => !p.isCompleted).length})
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "completed"}
                onClick={() => setActiveTab("completed")}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                  activeTab === "completed"
                    ? "bg-[var(--forest-700)] text-[var(--paper-50)] shadow-xs"
                    : "bg-[var(--paper-200)] text-[var(--stone-700)] hover:bg-[var(--paper-300)]"
                }`}
              >
                Completed ({plans.filter((p) => p.isCompleted).length})
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "all"}
                onClick={() => setActiveTab("all")}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                  activeTab === "all"
                    ? "bg-[var(--wine-800)] text-[var(--paper-50)] shadow-xs"
                    : "bg-[var(--paper-200)] text-[var(--stone-700)] hover:bg-[var(--paper-300)]"
                }`}
              >
                All ({plans.length})
              </button>
            </div>

            <span className="text-xs text-[var(--stone-600)]">
              {sessions.length} total sessions recorded across all crafts
            </span>
          </div>

          {/* MAIN SCHEDULED ACTIVITIES LIST */}
          <div className="flex flex-col gap-4">
            {filteredPlans.length === 0 ? (
              <Card variant="editorial" className="p-8 sm:p-12 text-center text-left">
                <div className="max-w-md mx-auto flex flex-col items-center gap-3 text-center">
                  <div className="w-12 h-12 rounded-full bg-[var(--brand-soft)] flex items-center justify-center text-[var(--wine-700)]">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-[var(--wine-950)]">
                    {activeTab === "completed"
                      ? "No completed sessions yet"
                      : "No scheduled sessions in this view"}
                  </h3>
                  <p className="text-xs text-[var(--stone-600)] leading-relaxed">
                    {activeTab === "completed"
                      ? "When you check off a planned session or log a practice, your completed activities will celebrate your presence here."
                      : "Schedule an upcoming 15-minute tea break or weekend craft to reserve time for yourself."}
                  </p>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleOpenCreatePlan}
                    leftIcon={<Plus className="w-4 h-4" />}
                  >
                    Plan a Session
                  </Button>
                </div>
              </Card>
            ) : (
              filteredPlans.map((plan) => {
                const theme = CATEGORY_THEMES[plan.category] || CATEGORY_THEMES["art-craft"];

                return (
                  <div
                    key={plan.id}
                    style={{
                      backgroundColor: plan.isCompleted ? "var(--paper-100)" : theme.bgSubtle,
                      borderColor: plan.isCompleted ? "var(--border-subtle)" : theme.border,
                    }}
                    className={`p-4 sm:p-5 rounded-[var(--radius-xl)] border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-left shadow-xs ${
                      plan.isCompleted ? "opacity-85" : "hover:shadow-[var(--shadow-warm)]"
                    }`}
                  >
                    {/* Left: Completion Toggle & Title Info */}
                    <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
                      <button
                        type="button"
                        onClick={() => handleTogglePlan(plan.id)}
                        aria-label={plan.isCompleted ? "Mark incomplete" : "Mark complete"}
                        title={plan.isCompleted ? "Mark incomplete" : "Mark complete"}
                        className={`w-7 h-7 rounded-full flex items-center justify-center border transition-colors cursor-pointer shrink-0 mt-0.5 sm:mt-0 ${
                          plan.isCompleted
                            ? "bg-[var(--forest-700)] border-[var(--forest-700)] text-[var(--paper-50)]"
                            : "border-[var(--sand-500)] hover:border-[var(--wine-700)] bg-[var(--paper-50)]"
                        }`}
                      >
                        {plan.isCompleted ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Circle className="w-3.5 h-3.5 opacity-25" />
                        )}
                      </button>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <Badge variant={plan.category} size="sm">
                            {plan.category}
                          </Badge>
                          <span className="text-xs font-semibold text-[var(--stone-600)] flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> {plan.estimatedDurationMinutes}m
                          </span>
                          {plan.reminderPreference === "gentle-prompt" && (
                            <span className="text-[10px] text-[var(--wine-700)] flex items-center gap-1 font-medium bg-[var(--paper-300)] px-2 py-0.5 rounded-full">
                              <Bell className="w-3 h-3" /> Gentle prompt
                            </span>
                          )}
                        </div>

                        <Link href={`/hobbies/${plan.hobbySlug}`}>
                          <h4
                            className={`font-bold text-base hover:text-[var(--wine-700)] transition-colors truncate ${
                              plan.isCompleted
                                ? "line-through text-[var(--stone-600)]"
                                : "text-[var(--ink-950)]"
                            }`}
                          >
                            {plan.hobbyTitle}
                          </h4>
                        </Link>

                        <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--stone-600)] mt-0.5">
                          <span className="font-medium text-[var(--wine-900)]">
                            {plan.scheduledFor}
                          </span>
                          {plan.note && (
                            <>
                              <span>&middot;</span>
                              <span className="italic truncate max-w-sm">{plan.note}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={() => handleOpenEditPlan(plan)}
                        aria-label="Edit session details"
                        title="Edit schedule"
                        className="p-1.5 rounded-md text-[var(--stone-600)] hover:text-[var(--ink-950)] hover:bg-[var(--paper-300)] transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeletingPlanId(plan.id)}
                        aria-label="Delete session invitation"
                        title="Delete invitation"
                        className="p-1.5 rounded-md text-[var(--stone-600)] hover:text-[var(--wine-700)] hover:bg-[var(--paper-300)] transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <Button
                        size="sm"
                        variant={plan.isCompleted ? "secondary" : "primary"}
                        onClick={() => handleTogglePlan(plan.id)}
                      >
                        {plan.isCompleted ? "Completed" : "Log Done"}
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* RECENTLY COMPLETED SESSIONS HISTORY */}
          <div className="flex flex-col gap-4 mt-6 pt-6 border-t border-[var(--border-subtle)]">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-[var(--wine-950)]">
                  Completed Practice History
                </h3>
                <p className="text-xs text-[var(--stone-600)]">
                  Moments of focus and presence recorded from plans and direct logs
                </p>
              </div>

              <Link
                href="/journal"
                className="text-xs text-[var(--wine-700)] hover:underline font-semibold"
              >
                View private reflections &rarr;
              </Link>
            </div>

            {sessions.length === 0 ? (
              <p className="text-xs text-[var(--stone-600)] italic">
                No past practices recorded yet. Complete a scheduled session above or click &ldquo;Log Past Session&rdquo; to begin.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {sessions.slice(0, 6).map((sess) => (
                  <div
                    key={sess.id}
                    className="p-4 rounded-[var(--radius-lg)] bg-[var(--paper-100)] border border-[var(--sand-400)] flex flex-col justify-between text-left shadow-xs"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <Badge variant={sess.category} size="sm">
                          {sess.category}
                        </Badge>
                        <span className="font-bold text-[var(--forest-700)]">
                          {sess.durationMinutes} min
                        </span>
                      </div>

                      <Link href={`/hobbies/${sess.hobbySlug}`}>
                        <h4 className="font-bold text-sm text-[var(--ink-950)] hover:text-[var(--wine-700)] transition-colors truncate">
                          {sess.hobbyTitle}
                        </h4>
                      </Link>

                      <div className="flex items-center justify-between text-[11px] text-[var(--stone-600)] mt-1 mb-2">
                        <span>{sess.date}</span>
                        {sess.reflectionMood && (
                          <span className="font-medium text-[var(--forest-800)]">
                            {sess.reflectionMood}
                          </span>
                        )}
                      </div>

                      {sess.notes && (
                        <p className="text-xs text-[var(--ink-800)] italic line-clamp-2 bg-[var(--paper-200)] p-2 rounded-md">
                          &ldquo;{sess.notes}&rdquo;
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* MODAL: CREATE OR EDIT PLANNED ACTIVITY */}
        <Dialog
          isOpen={isPlanModalOpen}
          onClose={() => setIsPlanModalOpen(false)}
          title={editingPlanId ? "Edit Scheduled Session" : "Schedule a Gentle Creative Session"}
          description="Invitations, not obligations. Pick a comfortable time window with zero pressure."
          footer={
            <div className="flex items-center justify-end gap-2 w-full">
              <Button variant="ghost" size="sm" onClick={() => setIsPlanModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleSavePlan}>
                {editingPlanId ? "Update Invitation" : "Save to Planner"}
              </Button>
            </div>
          }
        >
          <div className="flex flex-col gap-4 text-left py-2">
            {planError && (
              <div className="p-3 rounded-lg bg-[var(--wine-100)] border border-[var(--wine-300)] text-xs text-[var(--wine-900)] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-[var(--wine-700)] shrink-0" />
                <span>{planError}</span>
              </div>
            )}

            {/* Hobby Select */}
            <div>
              <label className="text-xs font-bold text-[var(--ink-950)] block mb-1.5">
                Which hobby?
              </label>
              <select
                value={planHobbySlug}
                onChange={(e) => setPlanHobbySlug(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-[var(--radius-md)] bg-[var(--paper-100)] border border-[var(--sand-400)] text-sm text-[var(--ink-950)] focus:outline-none focus:border-[var(--wine-700)] cursor-pointer"
              >
                {SEED_HOBBIES.map((h) => (
                  <option key={h.id} value={h.slug}>
                    {h.title} ({h.categoryName})
                  </option>
                ))}
              </select>
            </div>

            {/* When / Schedule */}
            <div>
              <label className="text-xs font-bold text-[var(--ink-950)] block mb-1.5">
                When would you like to set aside time?
              </label>
              <input
                type="text"
                value={planSchedule}
                onChange={(e) => {
                  setPlanSchedule(e.target.value);
                  setPlanError(null);
                }}
                placeholder="e.g. Tomorrow 6:00 PM, Sunday morning, or Oct 18"
                className="w-full px-3.5 py-2.5 rounded-[var(--radius-md)] bg-[var(--paper-100)] border border-[var(--sand-400)] text-sm text-[var(--ink-950)] focus:outline-none focus:border-[var(--wine-700)]"
              />
              <div className="flex flex-wrap gap-1.5 mt-2">
                {["Tomorrow 6:00 PM", "Saturday 10:00 AM", "Sunday afternoon", "Midweek evening"].map(
                  (quickTime) => (
                    <button
                      key={quickTime}
                      type="button"
                      onClick={() => setPlanSchedule(quickTime)}
                      className="px-2 py-0.5 rounded-full bg-[var(--paper-200)] text-[11px] text-[var(--stone-700)] hover:bg-[var(--paper-300)] cursor-pointer"
                    >
                      {quickTime}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Estimated Duration */}
            <div>
              <label className="text-xs font-bold text-[var(--ink-950)] block mb-1.5">
                Estimated Duration (minutes)
              </label>
              <div className="flex flex-wrap gap-2">
                {[10, 15, 20, 30, 45, 60].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setPlanDuration(mins)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      planDuration === mins
                        ? "bg-[var(--wine-700)] text-[var(--paper-50)] shadow-xs"
                        : "bg-[var(--paper-200)] text-[var(--ink-800)] hover:bg-[var(--paper-300)]"
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>
            </div>

            {/* Reminder Preference */}
            <div>
              <label className="text-xs font-bold text-[var(--ink-950)] block mb-1.5">
                Reminder Preference
              </label>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-xs text-[var(--ink-950)] cursor-pointer">
                  <input
                    type="radio"
                    name="reminder"
                    checked={planReminder === "gentle-prompt"}
                    onChange={() => setPlanReminder("gentle-prompt")}
                    className="accent-[var(--wine-700)]"
                  />
                  <span>Gentle prompt on dashboard</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-[var(--ink-950)] cursor-pointer">
                  <input
                    type="radio"
                    name="reminder"
                    checked={planReminder === "none"}
                    onChange={() => setPlanReminder("none")}
                    className="accent-[var(--wine-700)]"
                  />
                  <span>No prompts (silent calendar)</span>
                </label>
              </div>
            </div>

            {/* Optional Note */}
            <div>
              <label className="text-xs font-bold text-[var(--ink-950)] block mb-1.5">
                Gentle Note or Step Focus (Optional)
              </label>
              <textarea
                value={planNote}
                onChange={(e) => setPlanNote(e.target.value)}
                placeholder="e.g. Try single-stroke leaf pressure; fold sourdough after 30 mins..."
                rows={2}
                className="w-full px-3.5 py-2 rounded-[var(--radius-md)] bg-[var(--paper-100)] border border-[var(--sand-400)] text-xs text-[var(--ink-950)] focus:outline-none focus:border-[var(--wine-700)] resize-none"
              />
            </div>
          </div>
        </Dialog>

        {/* MODAL: DELETE CONFIRMATION */}
        <Dialog
          isOpen={Boolean(deletingPlanId)}
          onClose={() => setDeletingPlanId(null)}
          title="Remove Scheduled Session"
          description="Are you sure you want to remove this session invitation? You can always plan another one at any time."
          footer={
            <div className="flex items-center justify-end gap-2 w-full">
              <Button variant="ghost" size="sm" onClick={() => setDeletingPlanId(null)}>
                Keep Session
              </Button>
              <Button variant="primary" size="sm" onClick={handleConfirmDeletePlan}>
                Yes, Remove Session
              </Button>
            </div>
          }
        >
          <div className="py-2 text-xs text-[var(--ink-800)] leading-relaxed">
            Removing this session does not affect your completed milestones or saved hobbies.
          </div>
        </Dialog>

        {/* MODAL: DIRECT PRACTICE SESSION LOGGING */}
        <Dialog
          isOpen={isLogModalOpen}
          onClose={() => setIsLogModalOpen(false)}
          title="Log an Atelier Practice Session"
          description="Record quiet minutes in your craft log. Stored privately on your device."
          footer={
            <div className="flex items-center justify-end gap-2 w-full">
              <Button variant="ghost" size="sm" onClick={() => setIsLogModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleSaveDirectSession}>
                Save Session to Log
              </Button>
            </div>
          }
        >
          <div className="flex flex-col gap-4 text-left py-2">
            {/* Hobby Picker */}
            <div>
              <label className="text-xs font-bold text-[var(--ink-950)] block mb-1.5">
                Which hobby?
              </label>
              <select
                value={logHobbySlug}
                onChange={(e) => setLogHobbySlug(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-[var(--radius-md)] bg-[var(--paper-100)] border border-[var(--sand-400)] text-sm text-[var(--ink-950)] focus:outline-none focus:border-[var(--wine-700)] cursor-pointer"
              >
                {SEED_HOBBIES.map((h) => (
                  <option key={h.id} value={h.slug}>
                    {h.title} ({h.categoryName})
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
                    onClick={() => setLogDuration(mins)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      logDuration === mins
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
                    onClick={() => setLogMood(mood)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                      logMood === mood
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
                value={logNotes}
                onChange={(e) => setLogNotes(e.target.value)}
                placeholder="What details did your hands notice during practice?"
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
