/**
 * Hobbiverse Typed Domain Models
 * Single source of truth for application contracts and repository schemas.
 */

export type CategorySlug =
  | "art-craft"
  | "outdoors-nature"
  | "music"
  | "cooking"
  | "movement"
  | "mindful"
  | "reading-writing"
  | "social-games";

export interface BaseEntity {
  id: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface HobbyCategory {
  id: CategorySlug;
  name: string;
  description: string;
  accentFamily: CategorySlug;
  activityCount: number;
}

export interface LearningStep {
  id: string;
  order: number;
  title: string;
  estimatedMinutes: number;
  description: string;
  instructions: string[];
  suppliesNeeded?: string[];
  isCompleted?: boolean;
}

export interface Hobby extends BaseEntity {
  slug: string;
  title: string;
  category: CategorySlug;
  categoryName: string;
  summary: string;
  description: string;
  firstStepPrompt: string;
  timeEstimate: string;
  estimatedMinutes: number;
  difficulty: "beginner" | "easy" | "intermediate";
  costRange: string;
  locationType: "indoor" | "outdoor" | "flexible";
  socialType: "solo" | "social" | "both";
  energyLevel: "calm" | "medium" | "active";
  materialsNeeded: string[];
  skillsPracticed: string[];
  waysToAdapt: {
    solo: string;
    social: string;
  };
  steps: LearningStep[];
  tags: string[];
  isFeatured?: boolean;
  editorialCollection?: "try-in-15" | "creative-reset" | "hands-on-weekends" | "explore-outdoors";
}

export interface UserPreferences {
  interests: CategorySlug[];
  availableTimeMinutes: number;
  preferredPace: "gentle" | "steady" | "flexible";
  budgetComfort: "minimal" | "moderate" | "flexible";
  soloSocialPreference: "solo" | "social" | "both";
  energyPreference: "calm" | "medium" | "active";
  reduceMotion?: boolean;
}

export interface UserProfile extends BaseEntity {
  username: string;
  displayName: string;
  bio?: string;
  avatarUrl?: string;
  joinedAt: string;
  isPublic: boolean;
  interests: CategorySlug[];
  completedStepsCount: number;
  sessionsLoggedCount: number;
}

export interface SavedHobby extends BaseEntity {
  hobbyId: string;
  hobbySlug: string;
  hobbyTitle: string;
  category: CategorySlug;
  savedAt: string;
  currentStepOrder: number;
  completedStepIds: string[];
  notes?: string;
}

export interface ActivitySession extends BaseEntity {
  hobbyId: string;
  hobbySlug: string;
  hobbyTitle: string;
  category: CategorySlug;
  date: string;
  durationMinutes: number;
  notes?: string;
  reflectionMood?: string;
}

export interface PlannedActivity extends BaseEntity {
  hobbyId: string;
  hobbySlug: string;
  hobbyTitle: string;
  category: CategorySlug;
  scheduledFor: string;
  estimatedDurationMinutes: number;
  note?: string;
  reminderPreference?: "none" | "gentle-prompt";
  isCompleted: boolean;
}

export interface JournalEntry extends BaseEntity {
  title?: string;
  content: string;
  date: string;
  moodLabel?: string;
  hobbySlug?: string;
  hobbyTitle?: string;
  isPrivate: true; // Strictly private by design
}

export interface CommunityPost extends BaseEntity {
  authorId: string;
  authorName: string;
  authorHandle: string;
  authorAvatar?: string;
  hobbySlug?: string;
  hobbyTitle?: string;
  category: CategorySlug;
  content: string;
  createdAt: string;
  likesCount: number;
  hasLiked?: boolean;
  commentsCount: number;
}

export interface Comment extends BaseEntity {
  postId: string;
  authorName: string;
  authorHandle: string;
  content: string;
  createdAt: string;
}

export interface Group extends BaseEntity {
  slug: string;
  name: string;
  description: string;
  category: CategorySlug;
  memberCount: number;
  isJoined?: boolean;
  guidelines: string[];
}

export interface Event extends BaseEntity {
  slug: string;
  title: string;
  description: string;
  category: CategorySlug;
  scheduledDate: string;
  timeLabel: string;
  format: "online" | "local-studio";
  participantsCount: number;
  isRsvpd?: boolean;
  participationPrompt: string;
}

export interface Challenge extends BaseEntity {
  slug: string;
  title: string;
  description: string;
  category: CategorySlug;
  durationDays: number;
  targetSessionsCount: number;
  currentSessionsCount: number;
  isJoined: boolean;
  isCompleted: boolean;
}

export interface Notification extends BaseEntity {
  title: string;
  message: string;
  type: "milestone" | "reminder" | "community" | "welcome";
  createdAt: string;
  isRead: boolean;
  href?: string;
}

export interface Achievement extends BaseEntity {
  slug: string;
  title: string;
  description: string;
  iconName: string;
  category: CategorySlug;
  unlockedAt?: string;
  isUnlocked: boolean;
}
