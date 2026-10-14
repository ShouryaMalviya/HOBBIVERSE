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
import { Group, CommunityPost } from "@/types";
import {
  Heart,
  MessageCircle,
  Plus,
  Users,
  Flag,
  ShieldCheck,
  EyeOff,
  Sparkles,
  ArrowLeft,
  Send,
  UserPlus,
  CheckCircle2,
  Check,
  X,
  VolumeX,
} from "lucide-react";

const REPORT_REASONS = [
  "Unkind, harsh, or disparaging tone",
  "Commercial promotion or unsolicited advertising",
  "Diagnostic or medical advice claim",
  "Competitive pressure or gatekeeping",
  "Off-topic or irrelevant content",
  "Other concern",
];

export interface GroupDetailViewProps {
  initialGroup: Group;
}

export function GroupDetailView({ initialGroup }: GroupDetailViewProps) {
  const { user } = useAuth();
  const {
    groups,
    communityPosts,
    comments,
    mutedUsers,
    savedHobbies,
    toggleJoinGroup,
    createCommunityPost,
    toggleLikePost,
    createComment,
    reportContent,
    toggleMuteUser,
  } = useHobbiverseStore();

  // Find live reactive group state
  const liveGroup = groups.find((g) => g.id === initialGroup.id) || initialGroup;
  const isJoined = Boolean(liveGroup.isJoined);

  // Group Post Composer State
  const [isComposerOpen, setIsComposerOpen] = React.useState(false);
  const [composerContent, setComposerContent] = React.useState("");
  const [composerHobbySlug, setComposerHobbySlug] = React.useState("");
  const [isSubmittingPost, setIsSubmittingPost] = React.useState(false);
  const composerInputRef = React.useRef<HTMLTextAreaElement>(null);

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

  const handleToggleJoin = async () => {
    const joined = await toggleJoinGroup(liveGroup.id);
    setToastMessage({
      type: joined ? "success" : "info",
      title: joined ? "Welcome to the Circle!" : "Left Circle",
      message: joined
        ? `You joined ${liveGroup.name}. You'll see discussions and meetups in your atelier feed.`
        : `You have left ${liveGroup.name}.`,
    });
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
        category: liveGroup.category,
        content: composerContent.trim(),
        hobbySlug: selectedHobby?.hobbySlug,
        hobbyTitle: selectedHobby?.hobbyTitle,
      });

      setComposerContent("");
      setIsComposerOpen(false);
      setToastMessage({
        type: "success",
        title: "Circle Note Shared",
        message: `Your practice note was shared with ${liveGroup.name}.`,
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
        "Thank you for looking out for our kindred space. This item has been recorded in local demo storage.",
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

  // Group-specific filtered posts
  const groupPosts = React.useMemo(() => {
    return communityPosts.filter((post) => {
      if (mutedUsers.includes(post.authorHandle)) return false;
      return post.category === liveGroup.category;
    });
  }, [communityPosts, mutedUsers, liveGroup.category]);

  return (
    <WorkspaceShell>
      <PageContainer
        eyebrow="Kindred Circle"
        title={liveGroup.name}
        description={liveGroup.description}
        breadcrumbs={[
          { label: "Community", href: "/community" },
          { label: liveGroup.name },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Link href="/community">
              <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
                All Circles
              </Button>
            </Link>
            <Button
              variant={isJoined ? "outline" : "primary"}
              size="sm"
              leftIcon={
                isJoined ? (
                  <Check className="w-4 h-4 text-[var(--forest-700)]" />
                ) : (
                  <UserPlus className="w-4 h-4" />
                )
              }
              onClick={handleToggleJoin}
            >
              {isJoined ? "Joined Circle (Leave)" : "Join Circle"}
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
            {/* Circle Header Info Card */}
            <div className="p-5 sm:p-6 rounded-[var(--radius-xl)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-[var(--shadow-subtle)] flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge size="sm" variant={liveGroup.category} dot>
                    {liveGroup.memberCount} Kindred Members
                  </Badge>
                  <span className="text-xs text-[var(--stone-600)]">Active Circle</span>
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                  onClick={handleOpenComposer}
                >
                  Share in Circle
                </Button>
              </div>
              <p className="text-sm text-[var(--ink-800)] leading-relaxed">
                Welcome to {liveGroup.name}! Here we gather to share process notes, ask gentle
                beginner questions, and celebrate quiet progress without comparison.
              </p>
            </div>

            {/* Post Composer Card */}
            {isComposerOpen && (
              <div className="p-5 sm:p-6 rounded-[var(--radius-xl)] bg-[var(--bg-surface)] border border-[var(--sand-400)] shadow-[var(--shadow-warm)] animate-in fade-in duration-200">
                <form onSubmit={handlePublishPost} className="flex flex-col gap-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={user?.displayName || "Elena Rostova"} size="sm" />
                      <div>
                        <h4 className="text-sm font-bold text-[var(--ink-950)]">
                          {user?.displayName || "Elena Rostova"}
                        </h4>
                        <span className="text-xs text-[var(--stone-600)]">
                          Posting in {liveGroup.name}
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
                      htmlFor="group-post-content"
                      className="block text-xs font-semibold text-[var(--stone-600)] uppercase tracking-wider mb-1.5"
                    >
                      Your Note or Reflection
                    </label>
                    <textarea
                      id="group-post-content"
                      ref={composerInputRef}
                      value={composerContent}
                      onChange={(e) => setComposerContent(e.target.value)}
                      rows={3}
                      maxLength={500}
                      placeholder="Share a work-in-progress, a question, or a small breakthrough in this circle..."
                      className="w-full px-3.5 py-2.5 rounded-[var(--radius-md)] bg-[var(--paper-50)] border border-[var(--sand-400)] text-[var(--ink-950)] text-sm placeholder:text-[var(--stone-600)]/70 focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] resize-none"
                    />
                    <div className="flex items-center justify-between mt-1 text-xs text-[var(--stone-600)]">
                      <span>Kind, respectful observations welcomed</span>
                      <span>{composerContent.length}/500</span>
                    </div>
                  </div>

                  {savedHobbies.length > 0 && (
                    <div>
                      <label
                        htmlFor="group-post-hobby-select"
                        className="block text-xs font-semibold text-[var(--stone-600)] uppercase tracking-wider mb-1.5"
                      >
                        Tag a Saved Hobby (Optional)
                      </label>
                      <select
                        id="group-post-hobby-select"
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
                  )}

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
                      {isSubmittingPost ? "Publishing..." : "Post to Circle"}
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {/* Circle Posts Feed */}
            {groupPosts.length === 0 ? (
              <div className="p-8 sm:p-10 rounded-[var(--radius-2xl)] border border-dashed border-[var(--sand-400)] bg-[var(--paper-100)] text-center flex flex-col items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[var(--rose-100)] text-[var(--wine-700)] flex items-center justify-center">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-[var(--wine-950)]">
                  Quiet Circle Room
                </h3>
                <p className="text-xs sm:text-sm text-[var(--stone-600)] max-w-sm leading-relaxed">
                  No notes have been posted in this circle yet. Start the conversation with a gentle
                  update from your practice!
                </p>
                <Button size="sm" variant="secondary" onClick={handleOpenComposer}>
                  Share the First Note
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                {groupPosts.map((post) => {
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
                          {/* Options */}
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

                      {/* Post Content */}
                      <p className="text-sm text-[var(--ink-800)] leading-relaxed whitespace-pre-line">
                        {post.content}
                      </p>

                      {/* Post Footer */}
                      <div className="flex items-center justify-between pt-3 border-t border-[var(--border-subtle)] text-xs text-[var(--stone-600)]">
                        <div className="flex items-center gap-4">
                          <button
                            type="button"
                            onClick={() => toggleLikePost(post.id)}
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

                        <span className="text-xs text-[var(--stone-600)] font-serif italic">
                          {liveGroup.name}
                        </span>
                      </div>

                      {/* Comments Thread */}
                      {isExpanded && (
                        <div className="mt-3 pt-3 border-t border-[var(--border-subtle)]/70 flex flex-col gap-3.5 bg-[var(--paper-100)]/50 -mx-5 sm:-mx-6 -mb-5 sm:-mb-6 p-4 sm:p-5 rounded-b-[var(--radius-xl)]">
                          {postComments.length === 0 ? (
                            <p className="text-xs text-[var(--stone-600)] italic">
                              No reflections yet. Add a gentle note below.
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

          {/* Sidebar (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6 text-left">
            {/* Guidelines Card */}
            <Card variant="editorial">
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-[var(--wine-950)] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[var(--wine-700)]" />
                  Circle Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-[var(--stone-600)] flex flex-col gap-2.5 leading-relaxed">
                {liveGroup.guidelines.map((g, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[var(--forest-700)] shrink-0 mt-0.5" />
                    <span>{g}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Other Circles */}
            <Card variant="default">
              <CardHeader className="pb-2 border-b border-[var(--border-subtle)]">
                <CardTitle className="text-sm text-[var(--wine-950)] flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-[var(--wine-700)]" /> Other Kindred Circles
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-3 flex flex-col gap-2">
                {groups
                  .filter((g) => g.id !== liveGroup.id)
                  .map((other) => (
                    <Link
                      key={other.id}
                      href={`/groups/${other.slug}`}
                      className="p-2.5 rounded-[var(--radius-md)] bg-[var(--paper-100)] hover:bg-[var(--paper-200)] transition-colors flex items-center justify-between"
                    >
                      <div className="text-xs font-semibold text-[var(--wine-950)]">
                        {other.name}
                      </div>
                      <Badge size="sm" variant={other.category}>
                        {other.memberCount}
                      </Badge>
                    </Link>
                  ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Safe Moderation & Reporting Dialog */}
        <Dialog
          isOpen={reportModalOpen}
          onClose={() => setReportModalOpen(false)}
          title="Flag Content for Review"
          description={`You are reporting an item by @${
            reportingItem?.authorHandle || "author"
          }.`}
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
                Reason for report
              </label>
              <div className="flex flex-col gap-2">
                {REPORT_REASONS.map((reason) => (
                  <label
                    key={reason}
                    className="flex items-center gap-2.5 p-2.5 rounded-[var(--radius-md)] hover:bg-[var(--paper-100)] border border-transparent hover:border-[var(--sand-400)] cursor-pointer text-xs sm:text-sm text-[var(--ink-950)]"
                  >
                    <input
                      type="radio"
                      name="group-report-reason"
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
              <strong>Local Sandbox Notice:</strong> Reports are logged directly into your browser
              demo store and are not transmitted to external third parties.
            </div>
          </div>
        </Dialog>
      </PageContainer>
    </WorkspaceShell>
  );
}
