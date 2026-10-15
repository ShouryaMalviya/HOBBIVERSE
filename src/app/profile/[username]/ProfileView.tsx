"use client";

import * as React from "react";
import Link from "next/link";
import { WorkspaceShell } from "@/components/layout/WorkspaceShell";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Dialog } from "@/components/ui/Dialog";
import { Toast } from "@/components/ui/Toast";
import { useHobbiverseStore } from "@/services/useStore";
import { UserProfile, CategorySlug } from "@/types";
import {
  ShieldCheck,
  Edit3,
  Bookmark,
  Calendar,
  Sparkles,
  Lock,
  Globe,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  Settings,
} from "lucide-react";

export interface ProfileViewProps {
  initialProfile: UserProfile;
  isOwner?: boolean;
}

export function ProfileView({ initialProfile, isOwner = true }: ProfileViewProps) {
  const { profile, savedHobbies, sessions, saveUserProfile } = useHobbiverseStore();

  // If viewing the active logged-in user's profile, use live store state
  const liveProfile = isOwner && profile ? profile : initialProfile;

  // Edit Profile Modal State
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [editDisplayName, setEditDisplayName] = React.useState(liveProfile.displayName);
  const [editBio, setEditBio] = React.useState(liveProfile.bio || "");
  const [editIsPublic, setEditIsPublic] = React.useState(Boolean(liveProfile.isPublic));
  const [isSubmitting, setIsSubmitting] = React.useState(false);

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

  const handleOpenEdit = () => {
    setEditDisplayName(liveProfile.displayName);
    setEditBio(liveProfile.bio || "");
    setEditIsPublic(Boolean(liveProfile.isPublic));
    setIsEditOpen(true);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editDisplayName.trim()) return;

    setIsSubmitting(true);
    try {
      await saveUserProfile({
        displayName: editDisplayName.trim(),
        bio: editBio.trim(),
        isPublic: editIsPublic,
      });

      setIsEditOpen(false);
      setToastMessage({
        type: "success",
        title: "Profile Updated",
        message: "Your atelier profile and public visibility settings have been updated.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <WorkspaceShell>
      <PageContainer
        eyebrow="Atelier Member"
        title={liveProfile.displayName}
        description={`@${liveProfile.username} · Creative explorer in the Hobbiverse atelier.`}
        breadcrumbs={[
          { label: "Community", href: "/community" },
          { label: `@${liveProfile.username}` },
        ]}
        actions={
          isOwner ? (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Edit3 className="w-4 h-4" />}
                onClick={handleOpenEdit}
              >
                Edit Profile
              </Button>
              <Link href="/settings">
                <Button variant="ghost" size="sm" leftIcon={<Settings className="w-4 h-4" />}>
                  Settings
                </Button>
              </Link>
            </div>
          ) : undefined
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

        <div className="flex flex-col gap-8 max-w-4xl text-left">
          {/* Profile Header Card */}
          <div className="p-6 sm:p-8 rounded-[var(--radius-2xl)] bg-[var(--paper-100)] border border-[var(--sand-400)] flex flex-col sm:flex-row items-start sm:items-center gap-6 shadow-[var(--shadow-subtle)]">
            <Avatar name={liveProfile.displayName} size="xl" status="online" />
            <div className="flex flex-col gap-2 flex-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-2xl font-bold text-[var(--wine-950)] leading-tight">
                  {liveProfile.displayName}
                </h2>
                <Badge
                  variant={liveProfile.isPublic ? "art-craft" : "mindful"}
                  size="sm"
                  dot
                >
                  {liveProfile.isPublic ? "Public Bookshelf" : "Private Atelier"}
                </Badge>
                <span className="text-xs text-[var(--stone-600)]">
                  Joined {liveProfile.joinedAt}
                </span>
              </div>

              <p className="text-sm text-[var(--ink-800)] leading-relaxed max-w-2xl">
                {liveProfile.bio || "Taking beginner steps at a calm, unhurried pace."}
              </p>

              {/* Interests Tags */}
              {liveProfile.interests && liveProfile.interests.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {liveProfile.interests.map((interest) => (
                    <Badge key={interest} size="sm" variant={interest}>
                      {interest.replace("-", " ")}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Stats Bar */}
              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-[var(--stone-600)] border-t border-[var(--border-subtle)]/70">
                <span className="flex items-center gap-1.5 font-medium">
                  <Bookmark className="w-3.5 h-3.5 text-[var(--wine-700)]" />
                  <strong>{savedHobbies.length}</strong> Saved Pursuits
                </span>
                <span>&middot;</span>
                <span className="flex items-center gap-1.5 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-[var(--forest-700)]" />
                  <strong>{sessions.length}</strong> Sessions Practiced
                </span>
                <span>&middot;</span>
                <span className="flex items-center gap-1.5 text-[var(--forest-800)] font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Reflections Strictly Private
                </span>
              </div>
            </div>
          </div>

          {/* Privacy Isolation Notice */}
          <div className="p-4 sm:p-5 rounded-[var(--radius-xl)] bg-[var(--paper-200)]/80 border border-[var(--sand-400)]/80 flex items-start gap-3.5 text-xs sm:text-sm text-[var(--ink-800)] shadow-xs">
            <ShieldCheck className="w-5 h-5 text-[var(--forest-700)] shrink-0 mt-0.5" aria-hidden="true" />
            <div className="flex flex-col gap-1">
              <span className="font-bold text-[var(--wine-950)] text-sm">
                Zero-Leakage Reflection Privacy
              </span>
              <p className="text-xs text-[var(--stone-600)] leading-relaxed">
                Your private journal reflections, mood tags, and personal check-in notes are never
                visible on public member profiles, community feeds, or peer searches. Only your saved
                hobby titles and completed milestone steps are displayed when public visibility is
                enabled.
              </p>
            </div>
          </div>

          {/* Saved Creative Bookshelf */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-[var(--wine-950)]">Creative Bookshelf</h3>
                <p className="text-xs text-[var(--stone-600)]">
                  {liveProfile.isPublic || isOwner
                    ? "Hobby learning pathways currently explored."
                    : "This member keeps their creative bookshelf private."}
                </p>
              </div>
              {isOwner && (
                <Link href="/my-hobbies">
                  <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                    Manage Bookshelf
                  </Button>
                </Link>
              )}
            </div>

            {!liveProfile.isPublic && !isOwner ? (
              <div className="p-8 rounded-[var(--radius-xl)] border border-dashed border-[var(--sand-400)] bg-[var(--paper-100)] text-center flex flex-col items-center justify-center gap-2">
                <Lock className="w-6 h-6 text-[var(--stone-600)] mb-1" />
                <h4 className="text-sm font-bold text-[var(--wine-950)]">Private Bookshelf</h4>
                <p className="text-xs text-[var(--stone-600)] max-w-sm">
                  This member has chosen to keep their saved learning paths private.
                </p>
              </div>
            ) : savedHobbies.length === 0 ? (
              <div className="p-8 rounded-[var(--radius-xl)] border border-dashed border-[var(--sand-400)] bg-[var(--paper-100)] text-center flex flex-col items-center justify-center gap-2">
                <BookOpen className="w-6 h-6 text-[var(--wine-700)] mb-1" />
                <h4 className="text-sm font-bold text-[var(--wine-950)]">No Saved Pursuits Yet</h4>
                <p className="text-xs text-[var(--stone-600)] max-w-sm">
                  Explore beginner pathways in the atelier to bookmark your first practice.
                </p>
                <Link href="/explore">
                  <Button size="sm" variant="secondary" className="mt-2">
                    Explore Beginner Hobbies
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedHobbies.map((hobby) => (
                  <Link
                    key={hobby.id}
                    href={`/hobbies/${hobby.hobbySlug}`}
                    className="p-5 rounded-[var(--radius-xl)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--sand-400)] shadow-[var(--shadow-subtle)] hover:shadow-[var(--shadow-warm)] transition-all flex flex-col justify-between text-left gap-3 group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Badge size="sm" variant={hobby.category}>
                          Active Pursuit
                        </Badge>
                        <span className="text-[11px] text-[var(--stone-600)]">
                          Saved {hobby.savedAt}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-[var(--ink-950)] group-hover:text-[var(--wine-700)] transition-colors leading-snug">
                        {hobby.hobbyTitle}
                      </h4>
                      {hobby.notes && (
                        <p className="text-xs text-[var(--stone-600)] italic line-clamp-2 mt-1">
                          &ldquo;{hobby.notes}&rdquo;
                        </p>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-xs text-[var(--stone-600)] pt-2 border-t border-[var(--border-subtle)]">
                      <span className="flex items-center gap-1 text-[var(--forest-700)] font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {hobby.completedStepIds.length} steps explored
                      </span>
                      <span className="text-[var(--wine-700)] font-semibold inline-flex items-center gap-0.5">
                        Open <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Edit Profile Modal */}
        {isOwner && (
          <Dialog
            isOpen={isEditOpen}
            onClose={() => setIsEditOpen(false)}
            title="Edit Member Profile"
            description="Update your display name, creative bio, and profile visibility settings."
            footer={
              <>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  form="edit-profile-form"
                  variant="primary"
                  size="sm"
                  disabled={isSubmitting || !editDisplayName.trim()}
                >
                  {isSubmitting ? "Saving..." : "Save Profile"}
                </Button>
              </>
            }
          >
            <form id="edit-profile-form" onSubmit={handleSaveProfile} className="flex flex-col gap-4 text-left">
              <div>
                <label
                  htmlFor="profile-display-name"
                  className="block text-xs font-semibold text-[var(--stone-600)] uppercase tracking-wider mb-1.5"
                >
                  Display Name
                </label>
                <input
                  id="profile-display-name"
                  type="text"
                  value={editDisplayName}
                  onChange={(e) => setEditDisplayName(e.target.value)}
                  required
                  className="w-full px-3.5 py-2 rounded-[var(--radius-md)] bg-[var(--paper-50)] border border-[var(--sand-400)] text-sm text-[var(--ink-950)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
                />
              </div>

              <div>
                <label
                  htmlFor="profile-bio"
                  className="block text-xs font-semibold text-[var(--stone-600)] uppercase tracking-wider mb-1.5"
                >
                  Bio &amp; Creative Intent
                </label>
                <textarea
                  id="profile-bio"
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  rows={3}
                  maxLength={240}
                  placeholder="Share a sentence about the hobbies you are exploring..."
                  className="w-full px-3.5 py-2 rounded-[var(--radius-md)] bg-[var(--paper-50)] border border-[var(--sand-400)] text-sm text-[var(--ink-950)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] resize-none"
                />
                <span className="text-[11px] text-[var(--stone-600)] float-right mt-0.5">
                  {editBio.length}/240
                </span>
              </div>

              <div className="pt-2 border-t border-[var(--border-subtle)]">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editIsPublic}
                    onChange={(e) => setEditIsPublic(e.target.checked)}
                    className="mt-0.5 w-4 h-4 accent-[var(--wine-800)]"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-[var(--wine-950)] block">
                      Public Creative Bookshelf
                    </span>
                    <span className="text-[var(--stone-600)]">
                      When enabled, other atelier members can see your saved hobbies. Private journal
                      reflections remain strictly locked.
                    </span>
                  </div>
                </label>
              </div>
            </form>
          </Dialog>
        )}
      </PageContainer>
    </WorkspaceShell>
  );
}
