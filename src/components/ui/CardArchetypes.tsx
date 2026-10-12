import * as React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "./Badge";
import { Button } from "./Button";
import { Avatar } from "./Avatar";
import { BotanicalLeaf } from "./BotanicalOrnaments";
import {
  Clock,
  Sparkles,
  Calendar,
  MessageCircle,
  Heart,
  ChevronRight,
  Bookmark,
  CheckCircle,
} from "lucide-react";

/**
 * 1. Featured Editorial Card
 */
export const FeaturedEditorialCard: React.FC<{
  category: "art-craft" | "reading-writing" | "mindful";
  title: string;
  excerpt: string;
  timeEstimate: string;
  onExplore?: () => void;
  className?: string;
}> = ({ category, title, excerpt, timeEstimate, onExplore, className }) => (
  <div
    className={cn(
      "relative rounded-[var(--radius-2xl)] border border-[var(--sand-400)] bg-[var(--paper-100)] p-6 sm:p-8 shadow-[var(--shadow-warm)] overflow-hidden flex flex-col justify-between text-left",
      className
    )}
  >
    <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--rose-100)]/40 rounded-full blur-2xl pointer-events-none" />
    <div className="flex items-center justify-between mb-4">
      <Badge variant={category} dot>
        Featured Pathway
      </Badge>
      <div className="flex items-center gap-1.5 text-xs text-[var(--stone-600)]">
        <Clock className="w-3.5 h-3.5" aria-hidden="true" />
        <span>{timeEstimate}</span>
      </div>
    </div>
    <div className="mb-6">
      <h3 className="text-xl sm:text-2xl font-extrabold text-[var(--wine-950)] mb-2 tracking-tight">
        {title}
      </h3>
      <p className="text-sm text-[var(--ink-700)] leading-relaxed">{excerpt}</p>
    </div>
    <div className="flex items-center justify-between pt-4 border-t border-[var(--paper-300)]">
      <span className="text-xs font-medium text-[var(--wine-700)]">
        Beginner step ready
      </span>
      <Button size="sm" variant="primary" onClick={onExplore}>
        Begin Step 1
      </Button>
    </div>
  </div>
);

/**
 * 2. Compact List Row
 */
export const CompactListRow: React.FC<{
  title: string;
  subtitle: string;
  badgeLabel: string;
  badgeVariant?: "art-craft" | "cooking" | "music" | "outdoors-nature";
  onClick?: () => void;
  className?: string;
}> = ({ title, subtitle, badgeLabel, badgeVariant = "art-craft", onClick, className }) => (
  <div
    onClick={onClick}
    className={cn(
      "flex items-center justify-between p-3.5 rounded-[var(--radius-lg)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--sand-400)] hover:bg-[var(--paper-200)] transition-all cursor-pointer select-none text-left",
      className
    )}
  >
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-lg bg-[var(--paper-300)] flex items-center justify-center text-[var(--wine-800)] font-bold text-sm shrink-0">
        <BotanicalLeaf className="w-4 h-4 text-[var(--forest-700)]" />
      </div>
      <div>
        <h4 className="text-sm font-semibold text-[var(--ink-950)] leading-tight">{title}</h4>
        <p className="text-xs text-[var(--stone-600)]">{subtitle}</p>
      </div>
    </div>
    <div className="flex items-center gap-2">
      <Badge size="sm" variant={badgeVariant}>{badgeLabel}</Badge>
      <ChevronRight className="w-4 h-4 text-[var(--stone-600)]" aria-hidden="true" />
    </div>
  </div>
);

/**
 * 3. Progress Card
 */
export const ProgressCard: React.FC<{
  title: string;
  stepCurrent: number;
  stepTotal: number;
  category: import("./Badge").BadgeVariant;
  className?: string;
}> = ({ title, stepCurrent, stepTotal, category, className }) => {
  const percentage = Math.round((stepCurrent / stepTotal) * 100);
  return (
    <div
      className={cn(
        "p-5 rounded-[var(--radius-xl)] bg-[var(--bg-elevated)] border border-[var(--border-subtle)] shadow-[var(--shadow-subtle)] text-left",
        className
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <Badge size="sm" variant={category}>In Progress</Badge>
        <span className="text-xs font-bold text-[var(--wine-800)]">{percentage}% complete</span>
      </div>
      <h4 className="text-base font-bold text-[var(--ink-950)] mb-3 leading-snug">{title}</h4>
      <div className="w-full bg-[var(--paper-300)] h-2 rounded-full overflow-hidden mb-3">
        <div
          className="h-full bg-[var(--forest-700)] transition-all duration-300 rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex items-center justify-between text-xs text-[var(--stone-600)]">
        <span>Step {stepCurrent} of {stepTotal}</span>
        <span className="flex items-center gap-1 text-[var(--forest-700)] font-medium">
          <CheckCircle className="w-3.5 h-3.5" aria-hidden="true" /> Flexible pace
        </span>
      </div>
    </div>
  );
};

/**
 * 4. Category Tile
 */
export const CategoryTile: React.FC<{
  name: string;
  count: number;
  accentBg: string;
  textColor: string;
  borderColor: string;
  icon: React.ReactNode;
  onClick?: () => void;
  className?: string;
}> = ({ name, count, accentBg, textColor, borderColor, icon, onClick, className }) => (
  <button
    type="button"
    onClick={onClick}
    style={{ backgroundColor: accentBg, borderColor: borderColor }}
    className={cn(
      "p-5 rounded-[var(--radius-xl)] border transition-all text-left flex flex-col justify-between hover:shadow-[var(--shadow-warm)] hover:-translate-y-0.5 cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)] min-h-[130px]",
      className
    )}
  >
    <div style={{ color: textColor }} className="mb-4">
      {icon}
    </div>
    <div>
      <h4 style={{ color: textColor }} className="font-bold text-sm sm:text-base leading-snug">
        {name}
      </h4>
      <p className="text-xs opacity-75 mt-0.5" style={{ color: textColor }}>
        {count} activities
      </p>
    </div>
  </button>
);

/**
 * 5. Quote / Reflection Card
 */
export const ReflectionCard: React.FC<{
  date: string;
  moodLabel: string;
  quote: string;
  activityName: string;
  className?: string;
}> = ({ date, moodLabel, quote, activityName, className }) => (
  <div
    className={cn(
      "p-5 sm:p-6 rounded-[var(--radius-xl)] bg-[var(--paper-100)] border border-[var(--sand-400)]/70 text-left relative shadow-[var(--shadow-subtle)]",
      className
    )}
  >
    <div className="flex items-center justify-between mb-3 text-xs text-[var(--stone-600)]">
      <span>{date}</span>
      <Badge size="sm" variant="mindful">{moodLabel}</Badge>
    </div>
    <blockquote className="text-sm sm:text-base italic font-serif text-[var(--ink-950)] leading-relaxed mb-4">
      &ldquo;{quote}&rdquo;
    </blockquote>
    <div className="text-xs font-semibold text-[var(--wine-700)] flex items-center gap-1.5">
      <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
      <span>{activityName}</span>
    </div>
  </div>
);

/**
 * 6. Event Tile
 */
export const EventTile: React.FC<{
  title: string;
  dateStr: string;
  category: "music" | "social-games" | "art-craft";
  participants: number;
  onRsvp?: () => void;
  className?: string;
}> = ({ title, dateStr, category, participants, onRsvp, className }) => (
  <div
    className={cn(
      "p-5 rounded-[var(--radius-xl)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--sand-400)] shadow-[var(--shadow-subtle)] flex flex-col justify-between text-left",
      className
    )}
  >
    <div>
      <div className="flex items-center justify-between mb-2">
        <Badge size="sm" variant={category}>Community Meetup</Badge>
        <span className="text-xs text-[var(--stone-600)] flex items-center gap-1">
          <Calendar className="w-3 h-3" aria-hidden="true" /> {dateStr}
        </span>
      </div>
      <h4 className="text-base font-bold text-[var(--ink-950)] mb-1 leading-snug">{title}</h4>
      <p className="text-xs text-[var(--stone-600)] mb-4">{participants} kindred hobbyists joined</p>
    </div>
    <Button size="sm" variant="outline" onClick={onRsvp}>
      RSVP &middot; Demo
    </Button>
  </div>
);

/**
 * 7. Community Post Card
 */
export const CommunityPostCard: React.FC<{
  authorName: string;
  handle: string;
  category: "cooking" | "art-craft" | "outdoors-nature";
  content: string;
  timeAgo: string;
  likes: number;
  comments: number;
  onLike?: () => void;
  className?: string;
}> = ({ authorName, handle, category, content, timeAgo, likes, comments, onLike, className }) => (
  <div
    className={cn(
      "p-5 rounded-[var(--radius-xl)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-[var(--shadow-subtle)] text-left flex flex-col gap-3",
      className
    )}
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <Avatar name={authorName} size="sm" />
        <div>
          <h4 className="text-sm font-bold text-[var(--ink-950)] leading-tight">{authorName}</h4>
          <span className="text-xs text-[var(--stone-600)]">@{handle} &middot; {timeAgo}</span>
        </div>
      </div>
      <Badge size="sm" variant={category}>Circle</Badge>
    </div>
    <p className="text-sm text-[var(--ink-800)] leading-relaxed">{content}</p>
    <div className="flex items-center gap-4 pt-2 border-t border-[var(--border-subtle)] text-xs text-[var(--stone-600)]">
      <button
        onClick={onLike}
        className="flex items-center gap-1.5 hover:text-[var(--wine-700)] transition-colors cursor-pointer"
        aria-label="Applaud post"
      >
        <Heart className="w-3.5 h-3.5 text-[var(--rose-700)]" aria-hidden="true" />
        <span>{likes}</span>
      </button>
      <div className="flex items-center gap-1.5">
        <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
        <span>{comments} reflections</span>
      </div>
    </div>
  </div>
);

/**
 * 8. Thoughtful Empty State
 */
export const EmptyStateCard: React.FC<{
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}> = ({ title, description, actionLabel, onAction, className }) => (
  <div
    className={cn(
      "p-8 sm:p-10 rounded-[var(--radius-2xl)] border border-dashed border-[var(--sand-400)] bg-[var(--paper-100)] text-center flex flex-col items-center justify-center gap-3",
      className
    )}
  >
    <div className="w-12 h-12 rounded-full bg-[var(--rose-100)] text-[var(--wine-700)] flex items-center justify-center mb-1">
      <Bookmark className="w-6 h-6" aria-hidden="true" />
    </div>
    <h3 className="text-lg font-bold text-[var(--wine-950)]">{title}</h3>
    <p className="text-sm text-[var(--stone-600)] max-w-sm leading-relaxed">{description}</p>
    {actionLabel && (
      <Button size="sm" variant="secondary" onClick={onAction} className="mt-2">
        {actionLabel}
      </Button>
    )}
  </div>
);
