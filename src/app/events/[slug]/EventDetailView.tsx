"use client";

import * as React from "react";
import Link from "next/link";
import { WorkspaceShell } from "@/components/layout/WorkspaceShell";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Toast } from "@/components/ui/Toast";
import { useHobbiverseStore } from "@/services/useStore";
import { Event } from "@/types";
import { downloadEventIcs, getGoogleCalendarUrl } from "@/lib/calendar";
import {
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  CalendarPlus,
  ExternalLink,
  Sparkles,
  ArrowLeft,
  ShieldCheck,
  Check,
  Video,
  Volume2,
  Coffee,
} from "lucide-react";

export interface EventDetailViewProps {
  initialEvent: Event;
}

export function EventDetailView({ initialEvent }: EventDetailViewProps) {
  const { events, toggleRsvpEvent, savedHobbies } = useHobbiverseStore();

  const liveEvent = events.find((e) => e.id === initialEvent.id) || initialEvent;
  const isRsvpd = Boolean(liveEvent.isRsvpd);

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

  const handleToggleRsvp = async () => {
    const isNowRsvpd = await toggleRsvpEvent(liveEvent.id);
    setToastMessage({
      type: isNowRsvpd ? "success" : "info",
      title: isNowRsvpd ? "RSVP Confirmed!" : "RSVP Cancelled",
      message: isNowRsvpd
        ? `You're signed up for "${liveEvent.title}". We're looking forward to sharing a quiet hour with you.`
        : `You have left "${liveEvent.title}".`,
    });
  };

  const handleDownloadIcs = () => {
    downloadEventIcs(liveEvent);
    setToastMessage({
      type: "info",
      title: "Calendar File Saved",
      message: `Downloaded .ics invitation for "${liveEvent.title}".`,
    });
  };

  const googleCalUrl = getGoogleCalendarUrl(liveEvent);

  // Sample participant names for social warmth
  const sampleParticipants = [
    "Clara Bow",
    "Marcus Thorne",
    "Elena Rostova",
    "Julian Vance",
    "Sora Takahashi",
    "Amara Okafor",
  ];

  return (
    <WorkspaceShell>
      <PageContainer
        eyebrow="Community Gathering"
        title={liveEvent.title}
        description={liveEvent.description}
        breadcrumbs={[
          { label: "Events & Challenges", href: "/events" },
          { label: liveEvent.title },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Link href="/events">
              <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
                All Gatherings
              </Button>
            </Link>
            <Button
              variant={isRsvpd ? "outline" : "primary"}
              size="sm"
              leftIcon={
                isRsvpd ? (
                  <Check className="w-4 h-4 text-[var(--forest-700)]" />
                ) : (
                  <CalendarPlus className="w-4 h-4" />
                )
              }
              onClick={handleToggleRsvp}
            >
              {isRsvpd ? "Attending · Leave?" : "RSVP Attending"}
            </Button>
          </div>
        }
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
          {/* Main Info Column (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Session Overview Card */}
            <Card variant="editorial">
              <CardHeader className="pb-3 border-b border-[var(--border-subtle)]">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge size="sm" variant={liveEvent.category} dot>
                      {liveEvent.format === "online" ? "Virtual Studio" : "Studio Workshop"}
                    </Badge>
                    <span className="text-xs text-[var(--forest-800)] bg-[var(--forest-100)] px-2.5 py-0.5 rounded-full border border-[var(--forest-300)] font-medium">
                      Open to Beginners
                    </span>
                  </div>
                  <div className="text-xs text-[var(--wine-900)] font-semibold flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{liveEvent.scheduledDate} &middot; {liveEvent.timeLabel}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4 flex flex-col gap-4 text-sm text-[var(--ink-800)] leading-relaxed">
                <p>{liveEvent.description}</p>

                {/* Participation Prompt Callout */}
                <div className="p-4 rounded-[var(--radius-xl)] bg-[var(--paper-100)] border border-[var(--sand-400)]/70 text-left flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[var(--rose-100)] text-[var(--wine-700)] flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--wine-950)] mb-0.5">
                      Gentle Participation Prompt
                    </h4>
                    <p className="text-sm italic font-serif text-[var(--ink-950)] leading-relaxed">
                      &ldquo;{liveEvent.participationPrompt}&rdquo;
                    </p>
                  </div>
                </div>

                {/* Calendar Export Links */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <Button
                    size="sm"
                    variant="outline"
                    leftIcon={<CalendarPlus className="w-4 h-4" />}
                    onClick={handleDownloadIcs}
                  >
                    Download .ics Calendar File
                  </Button>
                  <a
                    href={googleCalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex"
                  >
                    <Button
                      size="sm"
                      variant="ghost"
                      leftIcon={<ExternalLink className="w-4 h-4" />}
                    >
                      Add to Google Calendar
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Atmosphere & Etiquette */}
            <Card variant="default">
              <CardHeader className="pb-3 border-b border-[var(--border-subtle)]">
                <CardTitle className="text-base text-[var(--wine-950)] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[var(--wine-700)]" />
                  What to Expect in Virtual Studio
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 flex flex-col gap-3 text-xs sm:text-sm text-[var(--stone-600)] leading-relaxed">
                <div className="flex items-start gap-3">
                  <Video className="w-4 h-4 text-[var(--forest-700)] shrink-0 mt-0.5" />
                  <span>
                    <strong>Cameras &amp; Microphones Optional:</strong> You are welcome to create
                    silently with camera off or just listen in with a warm cup of tea.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <Volume2 className="w-4 h-4 text-[var(--ocean-700)] shrink-0 mt-0.5" />
                  <span>
                    <strong>Quiet Studio Rhythm:</strong> The first 40 minutes are dedicated to
                    uninterrupted individual making. Gentle ambient music plays in the background.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <Coffee className="w-4 h-4 text-[var(--ochre-700)] shrink-0 mt-0.5" />
                  <span>
                    <strong>Friendly 10-Minute Closing Circle:</strong> The final minutes are for
                    informal observations. Unsolicited critique and comparison are strictly left out.
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Column (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6 text-left">
            {/* RSVP Status Card */}
            <Card variant="default">
              <CardHeader className="pb-2 border-b border-[var(--border-subtle)]">
                <CardTitle className="text-sm text-[var(--wine-950)] flex items-center gap-2">
                  <Users className="w-4 h-4 text-[var(--wine-700)]" />
                  Attending Community
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-3 flex flex-col gap-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[var(--stone-600)]">Kindred Hobbyists</span>
                  <Badge size="sm" variant={liveEvent.category}>
                    {liveEvent.participantsCount} Joined
                  </Badge>
                </div>

                {/* Avatar stack */}
                <div className="flex flex-col gap-2 pt-1">
                  <span className="text-xs font-semibold text-[var(--stone-600)] uppercase tracking-wider">
                    Recent RSVPs
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {sampleParticipants.slice(0, 5).map((name) => (
                      <div
                        key={name}
                        className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-[var(--paper-100)] border border-[var(--sand-400)]/60 text-xs text-[var(--ink-950)]"
                      >
                        <Avatar name={name} size="sm" />
                        <span>{name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-[var(--border-subtle)]">
                  <Button
                    size="sm"
                    variant={isRsvpd ? "outline" : "primary"}
                    className="w-full"
                    leftIcon={
                      isRsvpd ? (
                        <Check className="w-3.5 h-3.5 text-[var(--forest-700)]" />
                      ) : (
                        <CalendarPlus className="w-3.5 h-3.5" />
                      )
                    }
                    onClick={handleToggleRsvp}
                  >
                    {isRsvpd ? "You're Attending (Leave?)" : "RSVP for this Gathering"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Kind Reminder Card */}
            <div className="p-4 rounded-[var(--radius-xl)] bg-[var(--paper-100)] border border-[var(--sand-400)]/70 text-xs text-[var(--stone-600)] leading-relaxed flex flex-col gap-2">
              <span className="font-bold text-[var(--wine-950)] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[var(--forest-700)]" />
                No Preparation Required
              </span>
              <p>
                You don't need any polished skills or completed work to join. First-timers and
                curious explorers are warmly welcomed.
              </p>
            </div>
          </div>
        </div>
      </PageContainer>
    </WorkspaceShell>
  );
}
