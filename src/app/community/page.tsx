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
import { useAuth } from "@/services/auth";
import { CategorySlug, CommunityPost } from "@/types";
import {
  Heart,
  MessageCircle,
  Plus,
  Users,
  Flag,
  ShieldCheck,
  EyeOff,
  Search,
  Sparkles,
  ArrowRight,
  Send,
  UserPlus,
  CheckCircle2,
  Check,
  X,
  VolumeX,
} from "lucide-react";

const CATEGORY_OPTIONS: { slug: CategorySlug; label: string }[] = [
  { slug: "art-craft", label: "Art & Craft" },
  { slug: "cooking", label: "Cooking & Baking" },
  { slug: "music", label: "Music & Acoustic" },
  { slug: "outdoors-nature", label: "Outdoors & Nature" },
  { slug: "mindful", label: "Mindful Moments" },
  { slug: "movement", label: "Movement" },
  { slug: "reading-writing", label: "Reading & Writing" },
  { slug: "social-games", label: "Social & Games" },
];

const REPORT_REASONS = [
  "Unkind, harsh, or disparaging tone",
  "Commercial promotion or unsolicited advertising",
  "Diagnostic or medical advice claim",
  "Competitive pressure or gatekeeping",
  "Off-topic or irrelevant content",
  "Other concern",
];

export default function CommunityPage() {
  const { user } = useAuth();
  const {
    communityPosts,
    comments,
    mutedUsers,
    groups,
    savedHobbies,
    createCommunityPost,
    toggleLikePost,
    createComment,
    reportContent,
    toggleMuteUser,
    toggleJoinGroup,
    isHydrated,
  } = useHobbiverseStore();

  // Composer State
  const [isComposerOpen, setIsComposerOpen] = React.useState(false);
  const [composerContent, setComposerContent] = React.useState("");
  const [composerCategory, setComposerCategory] = React.useState<CategorySlug>("art-craft");
  const [composerHobbySlug, setComposerHobbySlug] = React.useState("");
  const [isSubmittingPost, setIsSubmittingPost] = React.useState(false);
  const composerInputRef = React.useRef<HTMLTextAreaElement>(null);

  // Filter & Search State
  const [activeCategory, setActiveCategory] = React.useState<string>("all");
  const [searchQuery, setSearchQuery] = React.useState("");

  // Comment Thread Expansion & Inline Comment State
  const [expandedComments, setExpandedComments] = React.useState<Record<string, boolean>>({});
  const [commentInputs, setCommentInputs] = React.useState<Record<string, string>>({});
  const [isSubmittingComment, setIsSubmittingComment] = React.useState<Record<string, boolean>>({});

  // Safety & Moderation Modal State
  const [reportModalOpen, setReportModalOpen] = React.useState(false);
  const [reportingItem, setReportingItem] = React.useState<{
    id: string;
    type: "post" | "comment" | "user";
    authorHandle: string;
  } | null>(null);
  const [selectedReason, setSelectedReason] = React.useState(REPORT_REASONS[0]);

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

  const handleOpenComposer = () => {
    setIsComposerOpen(true);
    setTimeout(() => {
      composerInputRef.current?.focus();
    }, 100);
  };

  const handlePublishPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!composerContent.trim() || composerContent.trim().length < 5) return;

    setIsSubmittingPost(true);
    try {
      const selectedHobby = savedHobbies.find((h) => h.hobbySlug === composerHobbySlug);

      await createCommunityPost({
        authorId: user?.id || "user-demo-1",
        authorName: user?.displayName || "Elena Rostova",
        authorHandle: user?.username || "elena_crafts",
        category: composerCategory,
        content: composerContent.trim(),
        hobbySlug: selectedHobby?.hobbySlug,
        hobbyTitle: selectedHobby?.hobbyTitle,
      });

      setComposerContent("");
      setIsComposerOpen(false);
      setToastMessage({
        type: "success",
        title: "Small Step Shared",
        message: "Your practice note has been gently shared with kindred circles.",
      });
    } finally {
      setIsSubmittingPost(false);
    }
  };

  const handleToggleComments = (postId: string) => {
    setExpandedComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleAddComment = async (postId: string) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;

    setIsSubmittingComment((prev) => ({ ...prev, [postId]: true }));
    try {
      await createComment({
        postId,
        authorName: user?.displayName || "Elena Rostova",
        authorHandle: user?.username || "elena_crafts",
        content: text,
      });

      setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
      setToastMessage({
        type: "success",
        title: "Reflection Added",
        message: "Your supportive comment was posted to the thread.",
      });
    } finally {
      setIsSubmittingComment((prev) => ({ ...prev, [postId]: false }));
    }
  };

  const handleToggleLike = async (post: CommunityPost) => {
    await toggleLikePost(post.id);
  };

  const handleOpenReport = (
    id: string,
    type: "post" | "comment" | "user",
    authorHandle: string
  ) => {
    setReportingItem({ id, type, authorHandle });
    setSelectedReason(REPORT_REASONS[0]);
    setReportModalOpen(true);
  };

  const handleSubmitReport = async () => {
    if (!reportingItem) return;

    await reportContent({
      contentId: reportingItem.id,
      contentType: reportingItem.type,
      reason: selectedReason,
    });

    setReportModalOpen(false);
    setToastMessage({
      type: "info",
      title: "Report Received",
      message:
        "Thank you for preserving kindness. In this demo sandbox, the item has been logged to local moderation storage.",
    });
    setReportingItem(null);
  };

  const handleToggleMute = async (handle: string) => {
    const isNowMuted = await toggleMuteUser(handle);
    setToastMessage({
      type: isNowMuted ? "warning" : "info",
      title: isNowMuted ? `Muted @${handle}` : `Unmuted @${handle}`,
      message: isNowMuted
        ? `Posts by @${handle} are now hidden from your feed.`
        : `Posts by @${handle} will now appear in your feed.`,
    });
  };

  // Filter posts
  const filteredPosts = React.useMemo(() => {
    return communityPosts.filter((post) => {
      // Filter out muted creators
      if (mutedUsers.includes(post.authorHandle)) {
        return false;
      }
      // Category filter
      if (activeCategory !== "all" && post.category !== activeCategory) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesContent = post.content.toLowerCase().includes(q);
        const matchesAuthor =
          post.authorName.toLowerCase().includes(q) ||
          post.authorHandle.toLowerCase().includes(q);
        const matchesHobby = post.hobbyTitle?.toLowerCase().includes(q);
        return matchesContent || matchesAuthor || matchesHobby;
      }
      return true;
    });
  }, [communityPosts, mutedUsers, activeCategory, searchQuery]);

  const mutedCount = mutedUsers.length;

  return (
    <WorkspaceShell>
      <PageContainer
        eyebrow="Positive Connection"
        title="Kindred Circles & Community"
        description="Share work-in-progress, celebrate gentle milestones, and exchange beginner encouragement in a quiet, positive space."
        breadcrumbs={[{ label: "Community" }]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Users className="w-4 h-4" />}
              onClick={() => {
                const el = document.getElementById("kindred-circles-sidebar");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Explore Circles
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={handleOpenComposer}
            >
              Share a Small Step
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
          {/* Main Feed Column (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Kind Community Agreement Banner */}
            <div className="p-4 sm:p-5 rounded-[var(--radius-xl)] bg-[var(--paper-100)] border border-[var(--sand-400)]/70 flex items-start gap-3.5 text-left shadow-[var(--shadow-subtle)]">
              <div className="w-9 h-9 rounded-full bg-[var(--rose-100)] text-[var(--wine-700)] flex items-center justify-center shrink-0 mt-0.5">
                <ShieldCheck className="w-5 h-5" aria-hidden="true" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-[var(--wine-950)] mb-1">
                  Our Quiet Atelier Principles
                </h4>
                <p className="text-xs sm:text-sm text-[var(--stone-600)] leading-relaxed">
                  We honor imperfect beginnings, unpolished sketches, and gentle daily rhythms.
                  Critique is shared only when invited; unsolicited advice and comparison are left
                  at the door. Private journal reflections stay completely private and are never
                  broadcast here.
                </p>
              </div>
            </div>

            {/* Post Composer Card */}
            <div className="p-5 sm:p-6 rounded-[var(--radius-xl)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-[var(--shadow-warm)]">
              {!isComposerOpen ? (
                <button
                  type="button"
                  onClick={handleOpenComposer}
                  className="w-full flex items-center gap-3 p-3.5 rounded-[var(--radius-lg)] bg-[var(--paper-100)] hover:bg-[var(--paper-200)] border border-[var(--border-subtle)] transition-colors text-left cursor-pointer group"
                >
                  <Avatar name={user?.displayName || "Elena Rostova"} size="sm" />
                  <span className="text-sm text-[var(--stone-600)] group-hover:text-[var(--ink-950)] transition-colors flex-1">
                    What small creative step or experiment did you explore today?
                  </span>
                  <div className="w-7 h-7 rounded-full bg-[var(--rose-100)] text-[var(--wine-700)] flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Plus className="w-4 h-4" />
                  </div>
                </button>
              ) : (
                <form onSubmit={handlePublishPost} className="flex flex-col gap-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={user?.displayName || "Elena Rostova"} size="sm" />
                      <div>
                        <h4 className="text-sm font-bold text-[var(--ink-950)]">
                          {user?.displayName || "Elena Rostova"}
                        </h4>
                        <span className="text-xs text-[var(--stone-600)]">
                          @{user?.username || "elena_crafts"} &middot; Sharing Practice
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsComposerOpen(false)}
                      className="p-1 rounded-full text-[var(--stone-600)] hover:text-[var(--ink-950)] hover:bg-[var(--paper-200)] transition-colors cursor-pointer"
                      aria-label="Close composer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div>
                    <label
                      htmlFor="community-post-content"
                      className="block text-xs font-semibold text-[var(--stone-600)] uppercase tracking-wider mb-1.5"
                    >
                      Your Note or Breakthrough
                    </label>
                    <textarea
                      id="community-post-content"
                      ref={composerInputRef}
                      value={composerContent}
                      onChange={(e) => setComposerContent(e.target.value)}
                      rows={3}
                      maxLength={500}
                      placeholder="Share a sensory observation, a messy first try, or a quiet insight from your practice today..."
                      className="w-full px-3.5 py-2.5 rounded-[var(--radius-md)] bg-[var(--paper-50)] border border-[var(--sand-400)] text-[var(--ink-950)] text-sm placeholder:text-[var(--stone-600)]/70 focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] resize-none"
                    />
                    <div className="flex items-center justify-between mt-1 text-xs text-[var(--stone-600)]">
                      <span>Beginner attempts and small reflections warmly welcomed</span>
                      <span>{composerContent.length}/500</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label
                        htmlFor="composer-category-select"
                        className="block text-xs font-semibold text-[var(--stone-600)] uppercase tracking-wider mb-1.5"
                      >
                        Kindred Circle
                      </label>
                      <select
                        id="composer-category-select"
                        value={composerCategory}
                        onChange={(e) => setComposerCategory(e.target.value as CategorySlug)}
                        className="w-full px-3 py-2 rounded-[var(--radius-md)] bg-[var(--paper-50)] border border-[var(--sand-400)] text-[var(--ink-950)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
                      >
                        {CATEGORY_OPTIONS.map((opt) => (
                          <option key={opt.slug} value={opt.slug}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="composer-hobby-select"
                        className="block text-xs font-semibold text-[var(--stone-600)] uppercase tracking-wider mb-1.5"
                      >
                        Hobby Link (Optional)
                      </label>
                      <select
                        id="composer-hobby-select"
                        value={composerHobbySlug}
                        onChange={(e) => setComposerHobbySlug(e.target.value)}
                        className="w-full px-3 py-2 rounded-[var(--radius-md)] bg-[var(--paper-50)] border border-[var(--sand-400)] text-[var(--ink-950)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
                      >
                        <option value="">None / General Practice</option>
                        {savedHobbies.map((h) => (
                          <option key={h.id} value={h.hobbySlug}>
                            {h.hobbyTitle}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[var(--border-subtle)]">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsComposerOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      size="sm"
                      leftIcon={<Send className="w-3.5 h-3.5" />}
                      disabled={isSubmittingPost || composerContent.trim().length < 5}
                    >
                      {isSubmittingPost ? "Publishing..." : "Publish Small Step"}
                    </Button>
                  </div>
                </form>
              )}
            </div>

            {/* Filter Tabs & Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                <button
                  type="button"
                  onClick={() => setActiveCategory("all")}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 cursor-pointer ${
                    activeCategory === "all"
                      ? "bg-[var(--wine-900)] text-[var(--paper-50)] shadow-xs"
                      : "bg-[var(--paper-100)] text-[var(--stone-600)] hover:text-[var(--ink-950)] hover:bg-[var(--paper-200)]"
                  }`}
                >
                  All Circles
                </button>
                {CATEGORY_OPTIONS.slice(0, 5).map((cat) => (
                  <button
                    key={cat.slug}
                    type="button"
                    onClick={() => setActiveCategory(cat.slug)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 cursor-pointer ${
                      activeCategory === cat.slug
                        ? "bg-[var(--wine-900)] text-[var(--paper-50)] shadow-xs"
                        : "bg-[var(--paper-100)] text-[var(--stone-600)] hover:text-[var(--ink-950)] hover:bg-[var(--paper-200)]"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Search Box */}
              <div className="relative w-full sm:w-60 shrink-0">
                <Search className="w-4 h-4 text-[var(--stone-600)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search reflections..."
                  aria-label="Search reflections or creators"
                  className="w-full pl-9 pr-3 py-1.5 rounded-full bg-[var(--paper-100)] border border-[var(--sand-400)]/70 text-xs text-[var(--ink-950)] placeholder:text-[var(--stone-600)]/70 focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--stone-600)] hover:text-[var(--ink-950)] cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Muted Authors Banner Notice */}
            {mutedCount > 0 && (
              <div className="p-3 rounded-[var(--radius-lg)] bg-[var(--paper-200)]/60 border border-[var(--sand-400)]/60 flex items-center justify-between text-xs text-[var(--stone-600)]">
                <span className="flex items-center gap-1.5">
                  <EyeOff className="w-3.5 h-3.5 text-[var(--stone-600)]" />
                  {mutedCount} creator{mutedCount > 1 ? "s" : ""} muted. Their posts are hidden from
                  your feed.
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById("muted-creators-list");
                    el?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="text-[var(--wine-700)] font-semibold hover:underline cursor-pointer"
                >
                  Manage muted
                </button>
              </div>
            )}

            {/* Posts List */}
            {filteredPosts.length === 0 ? (
              <div className="p-8 sm:p-10 rounded-[var(--radius-2xl)] border border-dashed border-[var(--sand-400)] bg-[var(--paper-100)] text-center flex flex-col items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[var(--rose-100)] text-[var(--wine-700)] flex items-center justify-center">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-[var(--wine-950)]">
                  No Reflections Found
                </h3>
                <p className="text-xs sm:text-sm text-[var(--stone-600)] max-w-sm leading-relaxed">
                  {searchQuery || activeCategory !== "all"
                    ? "Try adjusting your circle filter or search keyword to see more practice notes."
                    : "Be the first kindred soul to post a small practice note or breakthrough today."}
                </p>
                <Button size="sm" variant="secondary" onClick={handleOpenComposer}>
                  Share a Small Step
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                {filteredPosts.map((post) => {
                  const postComments = comments.filter((c) => c.postId === post.id);
                  const isExpanded = Boolean(expandedComments[post.id]);
                  const commentInputText = commentInputs[post.id] || "";
                  const isPostingComment = Boolean(isSubmittingComment[post.id]);

                  return (
                    <div
                      key={post.id}
                      className="p-5 sm:p-6 rounded-[var(--radius-xl)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-[var(--shadow-subtle)] text-left flex flex-col gap-3 transition-shadow hover:shadow-[var(--shadow-warm)]"
                    >
                      {/* Post Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <Avatar name={post.authorName} size="md" />
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-[var(--ink-950)] leading-tight">
                                {post.authorName}
                              </h4>
                              {post.hobbyTitle && (
                                <span className="hidden sm:inline-block text-xs font-serif italic text-[var(--stone-600)]">
                                  &middot; {post.hobbyTitle}
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-[var(--stone-600)]">
                              @{post.authorHandle} &middot; {post.createdAt}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <Badge size="sm" variant={post.category}>
                            Circle
                          </Badge>
                          {/* Post Action Menu */}
                          <div className="relative group/menu">
                            <button
                              type="button"
                              className="p-1 rounded-full text-[var(--stone-600)] hover:text-[var(--ink-950)] hover:bg-[var(--paper-200)] transition-colors cursor-pointer"
                              aria-label="Post options"
                            >
                              <VolumeX className="w-3.5 h-3.5" />
                            </button>
                            <div className="absolute right-0 top-full mt-1 w-36 bg-[var(--bg-surface)] border border-[var(--sand-400)] rounded-[var(--radius-md)] shadow-[var(--shadow-elevated)] py-1 z-20 hidden group-hover/menu:block hover:block">
                              <button
                                type="button"
                                onClick={() => handleToggleMute(post.authorHandle)}
                                className="w-full px-3 py-1.5 text-left text-xs text-[var(--stone-600)] hover:text-[var(--ink-950)] hover:bg-[var(--paper-100)] flex items-center gap-1.5 cursor-pointer"
                              >
                                <EyeOff className="w-3 h-3" />
                                Mute @{post.authorHandle}
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  handleOpenReport(post.id, "post", post.authorHandle)
                                }
                                className="w-full px-3 py-1.5 text-left text-xs text-[var(--berry-700)] hover:bg-[var(--paper-100)] flex items-center gap-1.5 cursor-pointer"
                              >
                                <Flag className="w-3 h-3" />
                                Report note
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Post Body */}
                      <p className="text-sm text-[var(--ink-800)] leading-relaxed whitespace-pre-line">
                        {post.content}
                      </p>

                      {/* Post Footer Actions */}
                      <div className="flex items-center justify-between pt-3 border-t border-[var(--border-subtle)] text-xs text-[var(--stone-600)]">
                        <div className="flex items-center gap-4">
                          {/* Heart / Applaud Button */}
                          <button
                            type="button"
                            onClick={() => handleToggleLike(post)}
                            className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                              post.hasLiked
                                ? "text-[var(--rose-700)] font-semibold"
                                : "hover:text-[var(--rose-700)]"
                            }`}
                            aria-label={post.hasLiked ? "Unlike reflection" : "Like reflection"}
                          >
                            <Heart
                              className={`w-4 h-4 transition-transform active:scale-125 ${
                                post.hasLiked
                                  ? "fill-[var(--rose-700)] text-[var(--rose-700)]"
                                  : ""
                              }`}
                            />
                            <span>{post.likesCount}</span>
                          </button>

                          {/* Reflections / Comments Toggle Button */}
                          <button
                            type="button"
                            onClick={() => handleToggleComments(post.id)}
                            className="flex items-center gap-1.5 hover:text-[var(--wine-700)] transition-colors cursor-pointer"
                            aria-label="Toggle comments thread"
                          >
                            <MessageCircle className="w-4 h-4" />
                            <span>
                              {postComments.length}{" "}
                              {postComments.length === 1 ? "reflection" : "reflections"}
                            </span>
                          </button>
                        </div>

                        {/* Quiet Share Button */}
                        <button
                          type="button"
                          onClick={() => {
                            if (typeof window !== "undefined") {
                              navigator.clipboard?.writeText(window.location.href);
                              setToastMessage({
                                type: "info",
                                title: "Link Copied",
                                message: "Circle reflection link copied to your clipboard.",
                              });
                            }
                          }}
                          className="hover:text-[var(--ink-950)] transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-[var(--wine-700)]" />
                          <span>Share</span>
                        </button>
                      </div>

                      {/* Expandable Comments Thread */}
                      {isExpanded && (
                        <div className="mt-3 pt-3 border-t border-[var(--border-subtle)]/70 flex flex-col gap-3.5 bg-[var(--paper-100)]/50 -mx-5 sm:-mx-6 -mb-5 sm:-mb-6 p-4 sm:p-5 rounded-b-[var(--radius-xl)]">
                          {/* Existing Comments */}
                          {postComments.length === 0 ? (
                            <p className="text-xs text-[var(--stone-600)] italic">
                              No reflections yet. Add a gentle note of encouragement below.
                            </p>
                          ) : (
                            <div className="flex flex-col gap-3">
                              {postComments.map((comment) => (
                                <div
                                  key={comment.id}
                                  className="p-3 rounded-[var(--radius-lg)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs text-left flex flex-col gap-1.5"
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <Avatar name={comment.authorName} size="sm" />
                                      <span className="font-bold text-[var(--ink-950)]">
                                        {comment.authorName}
                                      </span>
                                      <span className="text-[var(--stone-600)]">
                                        @{comment.authorHandle} &middot; {comment.createdAt}
                                      </span>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleOpenReport(
                                          comment.id,
                                          "comment",
                                          comment.authorHandle
                                        )
                                      }
                                      className="text-[var(--stone-600)] hover:text-[var(--berry-700)] transition-colors cursor-pointer"
                                      aria-label="Report comment"
                                    >
                                      <Flag className="w-3 h-3" />
                                    </button>
                                  </div>
                                  <p className="text-[var(--ink-800)] leading-relaxed pl-6">
                                    {comment.content}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Inline Comment Composer */}
                          <div className="flex items-center gap-2 pt-1">
                            <input
                              type="text"
                              value={commentInputText}
                              onChange={(e) =>
                                setCommentInputs((prev) => ({
                                  ...prev,
                                  [post.id]: e.target.value,
                                }))
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                  e.preventDefault();
                                  handleAddComment(post.id);
                                }
                              }}
                              placeholder="Add a gentle note of encouragement..."
                              aria-label="Add reflection"
                              className="flex-1 px-3 py-2 rounded-[var(--radius-md)] bg-[var(--bg-surface)] border border-[var(--sand-400)] text-xs text-[var(--ink-950)] placeholder:text-[var(--stone-600)]/70 focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
                            />
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => handleAddComment(post.id)}
                              disabled={isPostingComment || !commentInputText.trim()}
                            >
                              {isPostingComment ? "Posting..." : "Reply"}
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Sidebar: Kindred Circles & Principles (4 cols) */}
          <div
            id="kindred-circles-sidebar"
            className="lg:col-span-4 flex flex-col gap-6 text-left"
          >
            {/* Kindred Circles Widget */}
            <Card variant="default">
              <CardHeader className="pb-3 border-b border-[var(--border-subtle)]">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base text-[var(--wine-950)] flex items-center gap-2">
                    <Users className="w-4 h-4 text-[var(--wine-700)]" />
                    Kindred Circles
                  </CardTitle>
                  <span className="text-xs text-[var(--stone-600)]">Local Demo</span>
                </div>
              </CardHeader>
              <CardContent className="pt-4 flex flex-col gap-3">
                {groups.map((group) => {
                  const isJoined = Boolean(group.isJoined);
                  return (
                    <div
                      key={group.id}
                      className="p-3.5 rounded-[var(--radius-lg)] bg-[var(--paper-100)] border border-[var(--sand-400)]/60 flex flex-col gap-2 hover:border-[var(--sand-400)] transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <Badge size="sm" variant={group.category}>
                            {group.memberCount} members
                          </Badge>
                          <Link
                            href={`/groups/${group.slug}`}
                            className="block font-bold text-sm text-[var(--wine-950)] hover:text-[var(--wine-700)] transition-colors mt-1 leading-snug"
                          >
                            {group.name}
                          </Link>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleJoinGroup(group.id)}
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all shrink-0 cursor-pointer flex items-center gap-1 ${
                            isJoined
                              ? "bg-[var(--forest-100)] text-[var(--forest-800)] border border-[var(--forest-300)] hover:bg-[var(--forest-200)]"
                              : "bg-[var(--wine-900)] text-[var(--paper-50)] hover:bg-[var(--wine-950)] shadow-xs"
                          }`}
                        >
                          {isJoined ? (
                            <>
                              <Check className="w-3 h-3" />
                              Joined
                            </>
                          ) : (
                            <>
                              <UserPlus className="w-3 h-3" />
                              Join
                            </>
                          )}
                        </button>
                      </div>
                      <p className="text-xs text-[var(--stone-600)] line-clamp-2 leading-relaxed">
                        {group.description}
                      </p>
                      <Link
                        href={`/groups/${group.slug}`}
                        className="text-xs font-semibold text-[var(--wine-700)] hover:underline inline-flex items-center gap-1 pt-1"
                      >
                        Enter circle room <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Quiet Space Guidelines Card */}
            <Card variant="editorial">
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-[var(--wine-950)] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[var(--wine-700)]" />
                  Quiet Space Commitments
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-[var(--stone-600)] flex flex-col gap-2.5 leading-relaxed">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[var(--forest-700)] shrink-0 mt-0.5" />
                  <span>
                    <strong>Zero Algorithmic Agitation:</strong> Posts are chronological. No rage-bait
                    or engagement streaks.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[var(--forest-700)] shrink-0 mt-0.5" />
                  <span>
                    <strong>Strict Reflection Privacy:</strong> Personal journals are isolated and
                    never synced or published.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[var(--forest-700)] shrink-0 mt-0.5" />
                  <span>
                    <strong>Non-Diagnostic Boundaries:</strong> We celebrate creative recreation, not
                    clinical diagnosis.
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Muted Creators Drawer / List */}
            {mutedUsers.length > 0 && (
              <div
                id="muted-creators-list"
                className="p-4 rounded-[var(--radius-xl)] bg-[var(--bg-surface)] border border-[var(--sand-400)]/70 flex flex-col gap-3"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--stone-600)] flex items-center gap-1.5">
                    <VolumeX className="w-3.5 h-3.5" /> Muted Creators
                  </h4>
                  <span className="text-xs text-[var(--stone-600)]">
                    {mutedUsers.length} hidden
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  {mutedUsers.map((handle) => (
                    <div
                      key={handle}
                      className="flex items-center justify-between text-xs py-1 px-2 rounded-[var(--radius-md)] bg-[var(--paper-100)]"
                    >
                      <span className="text-[var(--ink-950)] font-medium">@{handle}</span>
                      <button
                        type="button"
                        onClick={() => handleToggleMute(handle)}
                        className="text-[var(--wine-700)] hover:underline font-semibold cursor-pointer"
                      >
                        Unmute
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Safe Moderation & Reporting Dialog */}
        <Dialog
          isOpen={reportModalOpen}
          onClose={() => setReportModalOpen(false)}
          title="Flag Content for Review"
          description={`You are reporting a ${reportingItem?.type || "item"} by @${
            reportingItem?.authorHandle || "author"
          }. Thank you for helping keep our atelier gentle and safe.`}
          footer={
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setReportModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSubmitReport}
                className="bg-[var(--berry-700)] hover:bg-[var(--berry-800)] text-white"
              >
                Submit Report
              </Button>
            </>
          }
        >
          <div className="flex flex-col gap-4 text-left">
            <div>
              <label className="block text-xs font-semibold text-[var(--stone-600)] uppercase tracking-wider mb-2">
                Why are you reporting this?
              </label>
              <div className="flex flex-col gap-2">
                {REPORT_REASONS.map((reason) => (
                  <label
                    key={reason}
                    className="flex items-center gap-2.5 p-2.5 rounded-[var(--radius-md)] hover:bg-[var(--paper-100)] border border-transparent hover:border-[var(--sand-400)] cursor-pointer text-xs sm:text-sm text-[var(--ink-950)]"
                  >
                    <input
                      type="radio"
                      name="report-reason"
                      value={reason}
                      checked={selectedReason === reason}
                      onChange={() => setSelectedReason(reason)}
                      className="text-[var(--wine-700)] focus:ring-[var(--focus-ring)]"
                    />
                    <span>{reason}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-[var(--radius-md)] bg-[var(--paper-200)]/70 text-xs text-[var(--stone-600)] leading-relaxed">
              <strong>Local Sandbox Notice:</strong> Hobbiverse runs in local demo mode.
              Submitted reports are logged directly into your browser demo store and will not be
              transmitted to external third parties.
            </div>
          </div>
        </Dialog>
      </PageContainer>
    </WorkspaceShell>
  );
}
