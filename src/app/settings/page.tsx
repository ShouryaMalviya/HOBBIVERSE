"use client";

import * as React from "react";
import { WorkspaceShell } from "@/components/layout/WorkspaceShell";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Dialog } from "@/components/ui/Dialog";
import { Toast } from "@/components/ui/Toast";
import { useHobbiverseStore } from "@/services/useStore";
import { UserPreferences, CategorySlug } from "@/types";
import {
  ShieldCheck,
  RotateCcw,
  Sliders,
  Download,
  EyeOff,
  Clock,
  Sparkles,
  Lock,
  Heart,
  VolumeX,
  Palette,
  Check,
} from "lucide-react";

export default function SettingsPage() {
  const {
    profile,
    preferences,
    mutedUsers,
    saveUserProfile,
    saveUserPreferences,
    toggleMuteUser,
    exportLocalData,
    resetDemo,
    isHydrated,
  } = useHobbiverseStore();

  // Local Form State
  const [availableTime, setAvailableTime] = React.useState<number>(
    preferences?.availableTimeMinutes || 20
  );
  const [preferredPace, setPreferredPace] = React.useState<UserPreferences["preferredPace"]>(
    preferences?.preferredPace || "gentle"
  );
  const [socialComfort, setSocialComfort] = React.useState<UserPreferences["soloSocialPreference"]>(
    preferences?.soloSocialPreference || "both"
  );
  const [energyPreference, setEnergyPreference] = React.useState<UserPreferences["energyPreference"]>(
    preferences?.energyPreference || "calm"
  );
  const [isPublic, setIsPublic] = React.useState<boolean>(Boolean(profile?.isPublic));
  const [reduceMotion, setReduceMotion] = React.useState<boolean>(
    Boolean(preferences?.reduceMotion)
  );

  // Sync state when preferences hydrate
  React.useEffect(() => {
    if (preferences) {
      setAvailableTime(preferences.availableTimeMinutes);
      setPreferredPace(preferences.preferredPace);
      setSocialComfort(preferences.soloSocialPreference);
      setEnergyPreference(preferences.energyPreference);
      setReduceMotion(Boolean(preferences.reduceMotion));
    }
    if (profile) {
      setIsPublic(Boolean(profile.isPublic));
    }
  }, [preferences, profile]);

  // Dialog State
  const [isResetDialogOpen, setIsResetDialogOpen] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);

  // Toast state
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

  const handleSavePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await saveUserPreferences({
        interests: preferences?.interests || ["art-craft", "cooking", "music"],
        availableTimeMinutes: availableTime,
        preferredPace,
        budgetComfort: preferences?.budgetComfort || "minimal",
        soloSocialPreference: socialComfort,
        energyPreference,
        reduceMotion,
      });

      await saveUserProfile({
        isPublic,
      });

      setToastMessage({
        type: "success",
        title: "Settings Saved",
        message: "Your atelier pacing and privacy preferences have been updated.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportData = async () => {
    const rawJson = await exportLocalData();
    const blob = new Blob([rawJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `hobbiverse-atelier-backup-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setToastMessage({
      type: "info",
      title: "Data Backup Exported",
      message: "A JSON file of your local creative practice and journals has been downloaded.",
    });
  };

  const handleConfirmReset = async () => {
    await resetDemo();
    setIsResetDialogOpen(false);
    setToastMessage({
      type: "warning",
      title: "Storage Reset",
      message: "Local demo state has been restored to clean factory defaults.",
    });
  };

  const handleUnmute = async (handle: string) => {
    await toggleMuteUser(handle);
    setToastMessage({
      type: "info",
      title: `Unmuted @${handle}`,
      message: `Posts by @${handle} will now appear in your community feed.`,
    });
  };

  return (
    <WorkspaceShell>
      <PageContainer
        eyebrow="Preferences"
        title="Settings &amp; Atelier Controls"
        description="Fine-tune your daily practice window, privacy visibility, local backup files, and moderation tools."
        breadcrumbs={[{ label: "Settings" }]}
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

        <form onSubmit={handleSavePreferences} className="flex flex-col gap-8 max-w-3xl text-left">
          {/* 1. Daily Pacing & Rhythm */}
          <Card variant="default">
            <CardHeader className="border-b border-[var(--border-subtle)] pb-3">
              <CardTitle className="text-base flex items-center gap-2 text-[var(--wine-950)]">
                <Clock className="w-4 h-4 text-[var(--wine-700)]" />
                <span>Pacing &amp; Daily Practice Rhythm</span>
              </CardTitle>
              <CardDescription>
                Customize time windows and encouragement suited to your daily routine
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 flex flex-col gap-5 text-sm text-[var(--ink-800)]">
              {/* Daily Time Window */}
              <div>
                <label className="block text-xs font-semibold text-[var(--stone-600)] uppercase tracking-wider mb-2">
                  Preferred Daily Time Window
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[10, 15, 20, 30].map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => setAvailableTime(mins)}
                      className={`p-3 rounded-[var(--radius-lg)] border text-left text-xs font-semibold transition-all cursor-pointer ${
                        availableTime === mins
                          ? "bg-[var(--wine-900)] text-[var(--paper-50)] border-[var(--wine-900)] shadow-xs"
                          : "bg-[var(--paper-100)] border-[var(--sand-400)]/70 text-[var(--stone-600)] hover:text-[var(--ink-950)]"
                      }`}
                    >
                      <span className="block text-sm sm:text-base font-bold">{mins} min</span>
                      <span className="opacity-80 font-normal">gentle step</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Preferred Pace */}
              <div>
                <label className="block text-xs font-semibold text-[var(--stone-600)] uppercase tracking-wider mb-2">
                  Learning Pace
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {[
                    { id: "gentle", label: "Gentle & Unhurried", desc: "Small micro-steps without rush" },
                    { id: "steady", label: "Moderate & Steady", desc: "Regular weekly sessions" },
                    { id: "flexible", label: "Flexible Rhythm", desc: "Sessions as energy permits" },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPreferredPace(p.id as UserPreferences["preferredPace"])}
                      className={`p-3.5 rounded-[var(--radius-lg)] border text-left transition-all cursor-pointer ${
                        preferredPace === p.id
                          ? "bg-[var(--wine-900)] text-[var(--paper-50)] border-[var(--wine-900)] shadow-xs"
                          : "bg-[var(--paper-100)] border-[var(--sand-400)]/70 text-[var(--ink-800)] hover:border-[var(--sand-400)]"
                      }`}
                    >
                      <span className="text-xs font-bold block mb-0.5">{p.label}</span>
                      <span className="text-[11px] opacity-75">{p.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Social Comfort */}
              <div>
                <label className="block text-xs font-semibold text-[var(--stone-600)] uppercase tracking-wider mb-2">
                  Social Atmosphere Preference
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {[
                    { id: "solo", label: "Solo Sanctuary", desc: "Quiet personal reflection" },
                    { id: "both", label: "Flexible Blend", desc: "Solo making with peer sharing" },
                    { id: "social", label: "Community Circles", desc: "Meetups and discussions" },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSocialComfort(s.id as UserPreferences["soloSocialPreference"])}
                      className={`p-3.5 rounded-[var(--radius-lg)] border text-left transition-all cursor-pointer ${
                        socialComfort === s.id
                          ? "bg-[var(--wine-900)] text-[var(--paper-50)] border-[var(--wine-900)] shadow-xs"
                          : "bg-[var(--paper-100)] border-[var(--sand-400)]/70 text-[var(--ink-800)] hover:border-[var(--sand-400)]"
                      }`}
                    >
                      <span className="text-xs font-bold block mb-0.5">{s.label}</span>
                      <span className="text-[11px] opacity-75">{s.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 2. Privacy & Public Visibility */}
          <Card variant="default">
            <CardHeader className="border-b border-[var(--border-subtle)] pb-3">
              <CardTitle className="text-base flex items-center gap-2 text-[var(--wine-950)]">
                <ShieldCheck className="w-4 h-4 text-[var(--forest-700)]" />
                <span>Privacy &amp; Reflection Boundaries</span>
              </CardTitle>
              <CardDescription>
                Control what other atelier members can see when viewing your profile
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 flex flex-col gap-4 text-sm text-[var(--ink-800)]">
              {/* Public Profile Toggle */}
              <label className="flex items-start justify-between gap-4 p-4 rounded-[var(--radius-lg)] bg-[var(--paper-100)] border border-[var(--sand-400)]/60 cursor-pointer">
                <div>
                  <span className="font-bold text-sm text-[var(--wine-950)] block mb-0.5">
                    Public Bookshelf Visibility
                  </span>
                  <span className="text-xs text-[var(--stone-600)] leading-relaxed">
                    Allow fellow members to view your saved hobby categories and milestone steps.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="mt-1 w-4 h-4 accent-[var(--wine-800)]"
                  aria-label="Toggle public profile visibility"
                />
              </label>

              {/* Strict Isolation Notice */}
              <div className="flex items-start justify-between gap-4 p-4 rounded-[var(--radius-lg)] bg-[var(--paper-200)]/70 border border-[var(--sand-400)]/60">
                <div>
                  <span className="font-bold text-sm text-[var(--wine-950)] block mb-0.5">
                    Private Journal Isolation
                  </span>
                  <span className="text-xs text-[var(--stone-600)] leading-relaxed">
                    Enforced strictly: Personal reflections, feelings check-ins, and companion
                    insights are client-isolated and NEVER visible to other members.
                  </span>
                </div>
                <Badge variant="mindful" size="sm">
                  Locked Private
                </Badge>
              </div>

              {/* Reduced Motion Toggle */}
              <label className="flex items-start justify-between gap-4 p-4 rounded-[var(--radius-lg)] bg-[var(--paper-100)] border border-[var(--sand-400)]/60 cursor-pointer">
                <div>
                  <span className="font-bold text-sm text-[var(--wine-950)] block mb-0.5">
                    Respect Reduced Motion
                  </span>
                  <span className="text-xs text-[var(--stone-600)] leading-relaxed">
                    Minimize UI transitions and ambient animations throughout the atelier.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={reduceMotion}
                  onChange={(e) => setReduceMotion(e.target.checked)}
                  className="mt-1 w-4 h-4 accent-[var(--wine-800)]"
                  aria-label="Toggle reduced motion"
                />
              </label>
            </CardContent>
          </Card>

          {/* 3. Muted Creators Management */}
          <Card variant="default">
            <CardHeader className="border-b border-[var(--border-subtle)] pb-3">
              <CardTitle className="text-base flex items-center gap-2 text-[var(--wine-950)]">
                <VolumeX className="w-4 h-4 text-[var(--wine-700)]" />
                <span>Muted Creators ({mutedUsers.length})</span>
              </CardTitle>
              <CardDescription>
                Manage community members whose notes and reflections you have hidden
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 text-xs sm:text-sm text-[var(--ink-800)]">
              {mutedUsers.length === 0 ? (
                <p className="text-xs text-[var(--stone-600)] italic py-1">
                  No creators are currently muted. You can mute any author from their post options in
                  the community feed.
                </p>
              ) : (
                <div className="flex flex-col gap-2">
                  {mutedUsers.map((handle) => (
                    <div
                      key={handle}
                      className="p-3 rounded-[var(--radius-md)] bg-[var(--paper-100)] border border-[var(--sand-400)]/60 flex items-center justify-between"
                    >
                      <span className="font-semibold text-xs text-[var(--ink-950)]">
                        @{handle}
                      </span>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => handleUnmute(handle)}
                      >
                        Unmute
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* 4. Local Data Backup & Storage Reset */}
          <Card variant="default">
            <CardHeader className="border-b border-[var(--border-subtle)] pb-3">
              <CardTitle className="text-base flex items-center gap-2 text-[var(--wine-950)]">
                <Download className="w-4 h-4 text-[var(--wine-700)]" />
                <span>Local Data Ownership &amp; Sandbox Reset</span>
              </CardTitle>
              <CardDescription>
                Export your personal atelier data as a JSON file, or restore default seed state
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <Button
                type="button"
                variant="outline"
                size="sm"
                leftIcon={<Download className="w-4 h-4" />}
                onClick={handleExportData}
              >
                Export Atelier Backup (.json)
              </Button>

              <Button
                type="button"
                variant="danger"
                size="sm"
                leftIcon={<RotateCcw className="w-4 h-4" />}
                onClick={() => setIsResetDialogOpen(true)}
              >
                Reset Demo Storage
              </Button>
            </CardContent>
          </Card>

          {/* Save Action Bar */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={isSaving}
              leftIcon={<Check className="w-4 h-4" />}
            >
              {isSaving ? "Saving Preferences..." : "Save All Preferences"}
            </Button>
          </div>
        </form>

        {/* Reset Confirmation Dialog */}
        <Dialog
          isOpen={isResetDialogOpen}
          onClose={() => setIsResetDialogOpen(false)}
          title="Reset Local Demo Storage?"
          description="This will restore all demo data, saved hobbies, practice logs, and private reflections back to initial atelier defaults."
          footer={
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsResetDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleConfirmReset}
              >
                Confirm Reset
              </Button>
            </>
          }
        >
          <div className="p-3.5 rounded-[var(--radius-md)] bg-[var(--paper-100)] border border-[var(--sand-400)] text-xs text-[var(--ink-800)] leading-relaxed text-left">
            <strong>Note:</strong> If you wish to preserve your notes, please click{" "}
            <strong>&ldquo;Export Atelier Backup (.json)&rdquo;</strong> before resetting.
          </div>
        </Dialog>
      </PageContainer>
    </WorkspaceShell>
  );
}
