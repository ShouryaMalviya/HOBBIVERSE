"use client";

import * as React from "react";
import Link from "next/link";
import { WorkspaceShell } from "@/components/layout/WorkspaceShell";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Toast } from "@/components/ui/Toast";
import { useHobbiverseStore } from "@/services/useStore";
import { Event, Challenge, CategorySlug } from "@/types";
import { downloadEventIcs, getGoogleCalendarUrl } from "@/lib/calendar";
import {
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  CalendarPlus,
  ExternalLink,
  Sparkles,
  Trophy,
  ArrowRight,
  ShieldCheck,
  Compass,
  Check,
  Plus,
  Search,
} from "lucide-react";

const CATEGORY_FILTERS: { slug: string; label: string }[] = [
  { slug: "all", label: "All Gatherings" },
  { slug: "music", label: "Music & Acoustic" },
  { slug: "art-craft", label: "Art & Craft" },
  { slug: "cooking", label: "Cooking & Baking" },
  { slug: "social-games", label: "Social & Games" },
  { slug: "mindful", label: "Mindful Moments" },
];

export default function EventsPage() {
  const {
    events,
    challenges,
    toggleRsvpEvent,
    toggleJoinChallenge,
    isHydrated,
  } = useHobbiverseStore();

  const [activeTab, setActiveTab] = React.useState<"events" | "challenges">("events");
  const [categoryFilter, setCategoryFilter] = React.useState<string>("all");
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  // Toast State
  const [toastMessage, setToastMessage] = React.useState<{
    type: "success" | "info" | "warning";
    title: string;
    message?: string;
  } | null>(null);

  // Auto-dismiss toast
  React.useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 4500);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const handleToggleRsvp = async (event: Event) => {
    const isNowRsvpd = await toggleRsvpEvent(event.id);
    setToastMessage({
      type: isNowRsvpd ? "success" : "info",
      title: isNowRsvpd ? "RSVP Confirmed" : "RSVP Cancelled",
      message: isNowRsvpd
        ? `You're attending "${event.title}". Download a calendar invite to stay gently reminded.`
        : `You have cancelled your attendance for "${event.title}".`,
    });
  };

  const handleToggleChallenge = async (challenge: Challenge) => {
    const isNowJoined = await toggleJoinChallenge(challenge.id);
    setToastMessage({
      type: isNowJoined ? "success" : "info",
      title: isNowJoined ? "Challenge Joined" : "Challenge Removed",
      message: isNowJoined
        ? `Joined "${challenge.title}". Take practice at your own gentle pace—no streaks, no pressure.`
        : `Removed "${challenge.title}" from your active goals.`,
    });
  };

  const handleDownloadIcs = (event: Event, e: React.MouseEvent) => {
    e.stopPropagation();
    downloadEventIcs(event);
    setToastMessage({
      type: "info",
      title: "Calendar File Saved",
      message: `Downloaded .ics invitation for "${event.title}".`,
    });
  };

  // Filter events
  const filteredEvents = React.useMemo(() => {
    return events.filter((ev) => {
      if (categoryFilter !== "all" && ev.category !== categoryFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = ev.title.toLowerCase().includes(q);
        const matchesDesc = ev.description.toLowerCase().includes(q);
        return matchesTitle || matchesDesc;
      }
      return true;
    });
  }, [events, categoryFilter, searchQuery]);

  return (
    <WorkspaceShell>
      <PageContainer
        eyebrow="Gatherings &amp; Gentle Prompts"
        title="Friendly Challenges &amp; Studio Events"
        description="Low-pressure virtual studio sessions, weekend prompts, and non-shaming milestones to inspire consistency alongside kindred hobbyists."
        breadcrumbs={[{ label: "Events & Challenges" }]}
      >
        {/* Floating Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 max-w-sm animate-in fade-in slide-in-from-bottom-4">
            <Toast
              type={toastMessage.type}
              title={toastMessage.title}
              message={toastMessage.message}
              onClose={() => setToastMessage(null)}
            />
          </div>
        )}

        <div className="flex flex-col gap-8 text-left">
          {/* Main Top Tab Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--sand-400)]/70 pb-4">
            <div className="flex items-center gap-2 p-1 rounded-[var(--radius-lg)] bg-[var(--paper-100)] border border-[var(--border-subtle)] w-fit">
              <button
                type="button"
                onClick={() => setActiveTab("events")}
                className={`px-4 py-2 rounded-[var(--radius-md)] text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === "events"
                    ? "bg-[var(--wine-900)] text-[var(--paper-50)] shadow-xs"
                    : "text-[var(--stone-600)] hover:text-[var(--ink-950)]"
                }`}
              >
                <Calendar className="w-4 h-4" />
                Upcoming Gatherings ({events.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("challenges")}
                className={`px-4 py-2 rounded-[var(--radius-md)] text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === "challenges"
                    ? "bg-[var(--wine-900)] text-[var(--paper-50)] shadow-xs"
                    : "text-[var(--stone-600)] hover:text-[var(--ink-950)]"
                }`}
              >
                <Trophy className="w-4 h-4" />
                Gentle Milestones ({challenges.length})
              </button>
            </div>

            {activeTab === "events" && (
              <div className="flex items-center gap-3">
                {/* Search */}
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-[var(--stone-600)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search studio gatherings..."
                    aria-label="Search studio gatherings"
                    className="w-full pl-9 pr-3 py-1.5 rounded-full bg-[var(--paper-100)] border border-[var(--sand-400)]/70 text-xs text-[var(--ink-950)] placeholder:text-[var(--stone-600)]/70 focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
                  />
                </div>
              </div>
            )}
          </div>

          {/* TAB 1: GATHERINGS & EVENTS */}
          {activeTab === "events" && (
            <div className="flex flex-col gap-6">
              {/* Category Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {CATEGORY_FILTERS.map((cat) => (
                  <button
                    key={cat.slug}
                    type="button"
                    onClick={() => setCategoryFilter(cat.slug)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 cursor-pointer ${
                      categoryFilter === cat.slug
                        ? "bg-[var(--wine-900)] text-[var(--paper-50)] shadow-xs"
                        : "bg-[var(--paper-100)] text-[var(--stone-600)] hover:text-[var(--ink-950)] hover:bg-[var(--paper-200)]"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Events Grid */}
              {filteredEvents.length === 0 ? (
                <div className="p-8 sm:p-10 rounded-[var(--radius-2xl)] border border-dashed border-[var(--sand-400)] bg-[var(--paper-100)] text-center flex flex-col items-center justify-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[var(--rose-100)] text-[var(--wine-700)] flex items-center justify-center">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-[var(--wine-950)]">
                    No Gatherings Found
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--stone-600)] max-w-sm leading-relaxed">
                    Try adjusting your category filter or search term to see more upcoming gatherings.
                  </p>
                  <Button size="sm" variant="secondary" onClick={() => setCategoryFilter("all")}>
                    Show All Gatherings
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredEvents.map((event) => {
                    const isRsvpd = Boolean(event.isRsvpd);
                    const googleCalUrl = getGoogleCalendarUrl(event);

                    return (
                      <div
                        key={event.id}
                        className="p-6 rounded-[var(--radius-xl)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--sand-400)] shadow-[var(--shadow-subtle)] hover:shadow-[var(--shadow-warm)] transition-all flex flex-col justify-between text-left gap-4"
                      >
                        {/* Header metadata */}
                        <div className="flex flex-col gap-2.5">
                          <div className="flex items-center justify-between gap-2">
                            <Badge size="sm" variant={event.category}>
                              {event.format === "online" ? "Virtual Studio Room" : "Studio Meetup"}
                            </Badge>
                            <span className="text-xs text-[var(--stone-600)] flex items-center gap-1 font-medium">
                              <Calendar className="w-3.5 h-3.5 text-[var(--wine-700)]" />
                              {event.scheduledDate} &middot; {event.timeLabel}
                            </span>
                          </div>

                          <Link href={`/events/${event.slug}`} className="group">
                            <h3 className="text-lg font-bold text-[var(--ink-950)] group-hover:text-[var(--wine-700)] transition-colors leading-snug">
                              {event.title}
                            </h3>
                          </Link>

                          <p className="text-sm text-[var(--ink-800)] leading-relaxed">
                            {event.description}
                          </p>

                          {/* Participation Prompt Callout */}
                          <div className="p-3 rounded-[var(--radius-lg)] bg-[var(--paper-100)] border border-[var(--sand-400)]/60 text-xs text-[var(--wine-950)] flex items-start gap-2.5">
                            <Sparkles className="w-4 h-4 text-[var(--wine-700)] shrink-0 mt-0.5" />
                            <div>
                              <span className="font-semibold block mb-0.5">Prompt:</span>
                              <span className="text-[var(--stone-600)] italic">
                                &ldquo;{event.participationPrompt}&rdquo;
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Footer & Actions */}
                        <div className="pt-3 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
                          <span className="text-[var(--stone-600)] flex items-center gap-1">
                            <Users className="w-3.5 h-3.5 text-[var(--forest-700)]" />
                            <strong>{event.participantsCount}</strong> kindred hobbyists attending
                          </span>

                          <div className="flex items-center gap-2">
                            {/* Calendar Export Dropdown / Buttons */}
                            <button
                              type="button"
                              onClick={(e) => handleDownloadIcs(event, e)}
                              title="Download .ics Calendar File"
                              className="p-2 rounded-[var(--radius-md)] border border-[var(--sand-400)] text-[var(--stone-600)] hover:text-[var(--ink-950)] hover:bg-[var(--paper-100)] transition-colors cursor-pointer"
                              aria-label="Download calendar event"
                            >
                              <CalendarPlus className="w-4 h-4" />
                            </button>

                            <a
                              href={googleCalUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Add to Google Calendar"
                              className="p-2 rounded-[var(--radius-md)] border border-[var(--sand-400)] text-[var(--stone-600)] hover:text-[var(--ink-950)] hover:bg-[var(--paper-100)] transition-colors cursor-pointer"
                              aria-label="Add to Google Calendar"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>

                            {/* RSVP Toggle Button */}
                            <Button
                              size="sm"
                              variant={isRsvpd ? "outline" : "primary"}
                              onClick={() => handleToggleRsvp(event)}
                              leftIcon={
                                isRsvpd ? (
                                  <Check className="w-3.5 h-3.5 text-[var(--forest-700)]" />
                                ) : (
                                  <CalendarPlus className="w-3.5 h-3.5" />
                                )
                              }
                            >
                              {isRsvpd ? "Attending · Leave" : "RSVP Attending"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: GENTLE MILESTONES & CHALLENGES */}
          {activeTab === "challenges" && (
            <div className="flex flex-col gap-8">
              {/* Anti-Streak Mindset Banner */}
              <div className="p-5 sm:p-6 rounded-[var(--radius-xl)] bg-[var(--paper-100)] border border-[var(--sand-400)]/70 flex items-start gap-4 text-left shadow-[var(--shadow-subtle)]">
                <div className="w-10 h-10 rounded-full bg-[var(--rose-100)] text-[var(--wine-700)] flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="w-5 h-5" aria-hidden="true" />
                </div>
                <div className="flex-1">
                  <h4 className="text-base font-bold text-[var(--wine-950)] mb-1">
                    Why Hobbiverse Refuses Shaming Streaks
                  </h4>
                  <p className="text-xs sm:text-sm text-[var(--stone-600)] leading-relaxed">
                    Creative hobbies thrive on curiosity, not coercive guilt. In Hobbiverse,
                    there are no streak counters, no reset penalties, and no fire emojis.
                    If you step away for three days or three weeks, your progress waits patiently
                    for you. Every small step counts forever.
                  </p>
                </div>
              </div>

              {/* Challenges Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {challenges.map((challenge) => {
                  const percentage = Math.round(
                    (challenge.currentSessionsCount / challenge.targetSessionsCount) * 100
                  );
                  const isJoined = Boolean(challenge.isJoined);

                  return (
                    <div
                      key={challenge.id}
                      className="p-6 rounded-[var(--radius-xl)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-[var(--shadow-subtle)] flex flex-col justify-between text-left gap-4"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <Badge size="sm" variant={challenge.category}>
                            {challenge.durationDays}-Day Window
                          </Badge>
                          {challenge.isCompleted ? (
                            <span className="text-xs text-[var(--forest-800)] font-semibold flex items-center gap-1 bg-[var(--forest-100)] px-2 py-0.5 rounded-full border border-[var(--forest-300)]">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Milestone Reached
                            </span>
                          ) : isJoined ? (
                            <span className="text-xs text-[var(--wine-700)] font-medium">
                              Active Goal
                            </span>
                          ) : (
                            <span className="text-xs text-[var(--stone-600)]">
                              Available Prompt
                            </span>
                          )}
                        </div>

                        <h3 className="text-base font-bold text-[var(--ink-950)] mb-1 leading-snug">
                          {challenge.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-[var(--stone-600)] leading-relaxed mb-4">
                          {challenge.description}
                        </p>

                        {/* Progress bar */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs text-[var(--stone-600)]">
                            <span>
                              {challenge.currentSessionsCount} of {challenge.targetSessionsCount}{" "}
                              sessions explored
                            </span>
                            <span className="font-semibold">{percentage}%</span>
                          </div>
                          <div className="w-full bg-[var(--paper-200)] h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-[var(--forest-700)] h-full transition-all duration-300 rounded-full"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-[11px] text-[var(--stone-600)] italic block pt-0.5">
                            Take sessions whenever energy allows &middot; Zero reset penalties
                          </span>
                        </div>
                      </div>

                      {/* Card Action */}
                      <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between gap-2">
                        <Link
                          href="/home"
                          className="text-xs font-semibold text-[var(--wine-700)] hover:underline inline-flex items-center gap-1"
                        >
                          Log session in dashboard <ArrowRight className="w-3 h-3" />
                        </Link>

                        <Button
                          size="sm"
                          variant={isJoined ? "outline" : "secondary"}
                          onClick={() => handleToggleChallenge(challenge)}
                        >
                          {isJoined ? "Leave Goal" : "Join Goal"}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Gentle Milestones Showcase */}
              <Card variant="editorial">
                <CardHeader>
                  <CardTitle className="text-lg text-[var(--wine-950)] flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-[var(--wine-700)]" />
                    Atelier Milestone Badges
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="p-4 rounded-[var(--radius-lg)] bg-[var(--paper-100)] border border-[var(--sand-400)]/60 text-left flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[var(--forest-100)] text-[var(--forest-700)] flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[var(--wine-950)]">First Brushstroke</h4>
                      <p className="text-[11px] text-[var(--stone-600)] mt-0.5">
                        Logged your first beginner exploration session.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-[var(--radius-lg)] bg-[var(--paper-100)] border border-[var(--sand-400)]/60 text-left flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[var(--forest-100)] text-[var(--forest-700)] flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[var(--wine-950)]">Gentle First Three</h4>
                      <p className="text-[11px] text-[var(--stone-600)] mt-0.5">
                        Completed 3 creative sessions without rushing.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-[var(--radius-lg)] bg-[var(--paper-100)] border border-[var(--sand-400)]/60 text-left flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[var(--sky-100)] text-[var(--ocean-700)] flex items-center justify-center shrink-0">
                      <Compass className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[var(--wine-950)]">Atelier Explorer</h4>
                      <p className="text-[11px] text-[var(--stone-600)] mt-0.5">
                        Saved hobbies across 2 or more diverse categories.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </PageContainer>
    </WorkspaceShell>
  );
}
