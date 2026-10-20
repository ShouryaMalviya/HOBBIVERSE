import {
  Hobby,
  CategorySlug,
  SavedHobby,
  ActivitySession,
  PlannedActivity,
  JournalEntry,
  CommunityPost,
  Group,
  Event,
  Challenge,
  Notification,
  UserProfile,
  UserPreferences,
  Comment,
} from "@/types";
import {
  SEED_HOBBIES,
  SEED_SAVED_HOBBIES,
  SEED_ACTIVITY_SESSIONS,
  SEED_PLANNED_ACTIVITIES,
  SEED_JOURNAL_ENTRIES,
  SEED_COMMUNITY_POSTS,
  SEED_COMMENTS,
  SEED_GROUPS,
  SEED_EVENTS,
  SEED_CHALLENGES,
  SEED_NOTIFICATIONS,
  SEED_PROFILE,
  SEED_PREFERENCES,
} from "./seedData";

export interface HobbyFilterParams {
  search?: string;
  category?: CategorySlug;
  difficulty?: "beginner" | "easy" | "intermediate";
  maxMinutes?: number;
  locationType?: "indoor" | "outdoor" | "flexible";
  socialType?: "solo" | "social" | "both";
  energyLevel?: "calm" | "medium" | "active";
  collection?: "try-in-15" | "creative-reset" | "hands-on-weekends" | "explore-outdoors";
  sortBy?: "recommended" | "time-asc" | "time-desc" | "name-asc";
}

export interface DemoStatePayload {
  version: number;
  savedHobbies: SavedHobby[];
  activitySessions: ActivitySession[];
  plannedActivities: PlannedActivity[];
  journalEntries: JournalEntry[];
  communityPosts: CommunityPost[];
  comments: Comment[];
  groups: Group[];
  events: Event[];
  challenges: Challenge[];
  notifications: Notification[];
  userProfile: UserProfile;
  userPreferences: UserPreferences;
  mutedUsers: string[];
  reports: Array<{ id: string; contentId: string; contentType: string; reason: string; timestamp: string }>;
}

const STORAGE_KEY = "hobbiverse_demo_state_v1";
const STATE_CHANGE_EVENT = "hobbiverse_state_change";

export interface IHobbiverseRepository {
  getHobbies(filters?: HobbyFilterParams): Promise<Hobby[]>;
  getHobbyBySlug(slug: string): Promise<Hobby | null>;
  getSavedHobbies(): Promise<SavedHobby[]>;
  isHobbySaved(hobbyId: string): Promise<boolean>;
  toggleSaveHobby(hobby: Hobby): Promise<boolean>;
  getStepCompletion(hobbyId: string): Promise<string[]>;
  toggleCompleteStep(hobbyId: string, stepId: string): Promise<string[]>;
  getActivitySessions(): Promise<ActivitySession[]>;
  logActivitySession(session: Omit<ActivitySession, "id" | "createdAt">): Promise<ActivitySession>;
  getPlannedActivities(): Promise<PlannedActivity[]>;
  createPlannedActivity(plan: Omit<PlannedActivity, "id">): Promise<PlannedActivity>;
  updatePlannedActivity(id: string, updates: Partial<Omit<PlannedActivity, "id">>): Promise<PlannedActivity | null>;
  toggleCompletePlan(id: string): Promise<boolean>;
  deletePlannedActivity(id: string): Promise<boolean>;
  getJournalEntries(): Promise<JournalEntry[]>;
  createJournalEntry(entry: Omit<JournalEntry, "id" | "createdAt" | "isPrivate">): Promise<JournalEntry>;
  updateJournalEntry(id: string, updates: Partial<Omit<JournalEntry, "id" | "isPrivate">>): Promise<JournalEntry | null>;
  deleteJournalEntry(id: string): Promise<boolean>;
  getCommunityPosts(): Promise<CommunityPost[]>;
  createCommunityPost(post: Omit<CommunityPost, "id" | "createdAt" | "likesCount" | "commentsCount">): Promise<CommunityPost>;
  toggleLikePost(postId: string): Promise<boolean>;
  getComments(postId?: string): Promise<Comment[]>;
  createComment(comment: Omit<Comment, "id" | "createdAt">): Promise<Comment>;
  getGroups(): Promise<Group[]>;
  getGroupBySlug(slug: string): Promise<Group | null>;
  toggleJoinGroup(groupId: string): Promise<boolean>;
  getEvents(): Promise<Event[]>;
  getEventBySlug(slug: string): Promise<Event | null>;
  toggleRsvpEvent(eventId: string): Promise<boolean>;
  getChallenges(): Promise<Challenge[]>;
  toggleJoinChallenge(challengeId: string): Promise<boolean>;
  progressChallenge(challengeId: string): Promise<Challenge | null>;
  reportContent(report: { contentId: string; contentType: "post" | "comment" | "user"; reason: string }): Promise<boolean>;
  toggleMuteUser(handle: string): Promise<boolean>;
  getMutedUsers(): Promise<string[]>;
  getUserPreferences(): Promise<UserPreferences>;
  saveUserPreferences(prefs: UserPreferences): Promise<void>;
  getUserProfile(): Promise<UserProfile>;
  saveUserProfile(profileUpdates: Partial<UserProfile>): Promise<UserProfile>;
  getUserByUsername(username: string): Promise<UserProfile | null>;
  getNotifications(): Promise<Notification[]>;
  markNotificationRead(id: string): Promise<void>;
  markAllNotificationsRead(): Promise<void>;
  getReports(): Promise<Array<{ id: string; contentId: string; contentType: string; reason: string; timestamp: string }>>;
  dismissReport(id: string): Promise<boolean>;
  deleteReportedContent(contentId: string, contentType: "post" | "comment"): Promise<boolean>;
  exportLocalData(): Promise<string>;
  importLocalData(jsonString: string): Promise<boolean>;
  seedSampleActivityHistory(): Promise<void>;
  resetDemoData(): Promise<void>;
}

export class LocalDemoRepository implements IHobbiverseRepository {
  private getInitialState(): DemoStatePayload {
    return {
      version: 1,
      savedHobbies: [...SEED_SAVED_HOBBIES],
      activitySessions: [...SEED_ACTIVITY_SESSIONS],
      plannedActivities: [...SEED_PLANNED_ACTIVITIES],
      journalEntries: [...SEED_JOURNAL_ENTRIES],
      communityPosts: [...SEED_COMMUNITY_POSTS],
      comments: [...SEED_COMMENTS],
      groups: [...SEED_GROUPS],
      events: [...SEED_EVENTS],
      challenges: [...SEED_CHALLENGES],
      notifications: [...SEED_NOTIFICATIONS],
      userProfile: { ...SEED_PROFILE },
      userPreferences: { ...SEED_PREFERENCES },
      mutedUsers: [],
      reports: [],
    };
  }

  private memoryState: DemoStatePayload | null = null;

  private getState(): DemoStatePayload {
    if (typeof window === "undefined") {
      if (!this.memoryState) {
        this.memoryState = this.getInitialState();
      }
      return JSON.parse(JSON.stringify(this.memoryState));
    }
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        const initial = this.getInitialState();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
        return initial;
      }
      const parsed = JSON.parse(raw);
      if (parsed.version !== 1) {
        const fresh = this.getInitialState();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
        return fresh;
      }
      return {
        ...this.getInitialState(),
        ...parsed,
        comments: parsed.comments || [...SEED_COMMENTS],
        mutedUsers: parsed.mutedUsers || [],
        reports: parsed.reports || [],
      };
    } catch {
      return this.getInitialState();
    }
  }

  private saveState(state: DemoStatePayload): void {
    if (typeof window === "undefined") {
      this.memoryState = JSON.parse(JSON.stringify(state));
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      window.dispatchEvent(new CustomEvent(STATE_CHANGE_EVENT));
    } catch (e) {
      console.warn("Hobbiverse local storage quota exceeded or unavailable:", e);
    }
  }

  async getHobbies(filters?: HobbyFilterParams): Promise<Hobby[]> {
    let result = [...SEED_HOBBIES];

    if (!filters) return result;

    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(
        (h) =>
          h.title.toLowerCase().includes(q) ||
          h.summary.toLowerCase().includes(q) ||
          h.description.toLowerCase().includes(q) ||
          h.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (filters.category) {
      result = result.filter((h) => h.category === filters.category);
    }

    if (filters.difficulty) {
      result = result.filter((h) => h.difficulty === filters.difficulty);
    }

    if (filters.maxMinutes) {
      result = result.filter((h) => h.estimatedMinutes <= (filters.maxMinutes || 180));
    }

    if (filters.locationType) {
      result = result.filter(
        (h) => h.locationType === filters.locationType || h.locationType === "flexible"
      );
    }

    if (filters.socialType) {
      result = result.filter(
        (h) => h.socialType === filters.socialType || h.socialType === "both"
      );
    }

    if (filters.energyLevel) {
      result = result.filter((h) => h.energyLevel === filters.energyLevel);
    }

    if (filters.collection) {
      result = result.filter((h) => h.editorialCollection === filters.collection);
    }

    if (filters.sortBy) {
      if (filters.sortBy === "time-asc") {
        result.sort((a, b) => a.estimatedMinutes - b.estimatedMinutes);
      } else if (filters.sortBy === "time-desc") {
        result.sort((a, b) => b.estimatedMinutes - a.estimatedMinutes);
      } else if (filters.sortBy === "name-asc") {
        result.sort((a, b) => a.title.localeCompare(b.title));
      }
    }

    return result;
  }

  async getHobbyBySlug(slug: string): Promise<Hobby | null> {
    const found = SEED_HOBBIES.find((h) => h.slug === slug);
    return found ? { ...found } : null;
  }

  async getSavedHobbies(): Promise<SavedHobby[]> {
    return this.getState().savedHobbies;
  }

  async isHobbySaved(hobbyId: string): Promise<boolean> {
    const saved = this.getState().savedHobbies;
    return saved.some((s) => s.hobbyId === hobbyId);
  }

  async toggleSaveHobby(hobby: Hobby): Promise<boolean> {
    const state = this.getState();
    const existingIndex = state.savedHobbies.findIndex((s) => s.hobbyId === hobby.id);

    if (existingIndex >= 0) {
      state.savedHobbies.splice(existingIndex, 1);
      this.saveState(state);
      return false;
    } else {
      const newSaved: SavedHobby = {
        id: `saved-${Date.now()}`,
        hobbyId: hobby.id,
        hobbySlug: hobby.slug,
        hobbyTitle: hobby.title,
        category: hobby.category,
        savedAt: new Date().toISOString().split("T")[0],
        currentStepOrder: 1,
        completedStepIds: [],
      };
      state.savedHobbies.push(newSaved);
      this.saveState(state);
      return true;
    }
  }

  async getStepCompletion(hobbyId: string): Promise<string[]> {
    const state = this.getState();
    const record = state.savedHobbies.find((s) => s.hobbyId === hobbyId);
    return record ? [...record.completedStepIds] : [];
  }

  async toggleCompleteStep(hobbyId: string, stepId: string): Promise<string[]> {
    const state = this.getState();
    let record = state.savedHobbies.find((s) => s.hobbyId === hobbyId);

    if (!record) {
      const hobby = SEED_HOBBIES.find((h) => h.id === hobbyId);
      if (!hobby) return [];
      record = {
        id: `saved-${Date.now()}`,
        hobbyId: hobby.id,
        hobbySlug: hobby.slug,
        hobbyTitle: hobby.title,
        category: hobby.category,
        savedAt: new Date().toISOString().split("T")[0],
        currentStepOrder: 1,
        completedStepIds: [stepId],
      };
      state.savedHobbies.push(record);
    } else {
      if (record.completedStepIds.includes(stepId)) {
        record.completedStepIds = record.completedStepIds.filter((id) => id !== stepId);
      } else {
        record.completedStepIds.push(stepId);
      }
    }

    this.saveState(state);
    return [...record.completedStepIds];
  }

  async getActivitySessions(): Promise<ActivitySession[]> {
    return this.getState().activitySessions;
  }

  async logActivitySession(
    session: Omit<ActivitySession, "id" | "createdAt">
  ): Promise<ActivitySession> {
    const state = this.getState();
    const created: ActivitySession = {
      ...session,
      id: `sess-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    state.activitySessions.unshift(created);
    state.userProfile.sessionsLoggedCount += 1;

    // Advance joined challenges
    if (state.challenges) {
      for (const ch of state.challenges) {
        if (ch.isJoined && !ch.isCompleted) {
          if (ch.category === session.category || ch.slug === "gentle-first-three") {
            ch.currentSessionsCount = Math.min(ch.targetSessionsCount, ch.currentSessionsCount + 1);
            if (ch.currentSessionsCount >= ch.targetSessionsCount) {
              ch.isCompleted = true;
              if (!state.notifications) state.notifications = [];
              state.notifications.unshift({
                id: `notif-milestone-${Date.now()}`,
                title: "Gentle Milestone Completed!",
                message: `You completed "${ch.title}" at your own pace!`,
                type: "milestone",
                createdAt: "Just now",
                isRead: false,
                href: "/events",
              });
            }
          }
        }
      }
    }

    this.saveState(state);
    return created;
  }

  async getPlannedActivities(): Promise<PlannedActivity[]> {
    return this.getState().plannedActivities;
  }

  async createPlannedActivity(
    plan: Omit<PlannedActivity, "id">
  ): Promise<PlannedActivity> {
    const state = this.getState();
    const created: PlannedActivity = {
      ...plan,
      id: `plan-${Date.now()}`,
    };
    state.plannedActivities.push(created);
    this.saveState(state);
    return created;
  }

  async updatePlannedActivity(
    id: string,
    updates: Partial<Omit<PlannedActivity, "id">>
  ): Promise<PlannedActivity | null> {
    const state = this.getState();
    const plan = state.plannedActivities.find((p) => p.id === id);
    if (!plan) return null;
    Object.assign(plan, updates);
    this.saveState(state);
    return plan;
  }

  async toggleCompletePlan(id: string): Promise<boolean> {
    const state = this.getState();
    const plan = state.plannedActivities.find((p) => p.id === id);
    if (!plan) return false;
    plan.isCompleted = !plan.isCompleted;

    if (plan.isCompleted) {
      const session: ActivitySession = {
        id: `sess-${Date.now()}`,
        hobbyId: plan.hobbyId,
        hobbySlug: plan.hobbySlug,
        hobbyTitle: plan.hobbyTitle,
        category: plan.category,
        date: new Date().toISOString().split("T")[0],
        durationMinutes: plan.estimatedDurationMinutes || 15,
        notes: plan.note ? `Completed scheduled session: ${plan.note}` : "Completed planned session.",
        reflectionMood: "Accomplished & Calm",
        createdAt: new Date().toISOString(),
      };
      state.activitySessions.unshift(session);
      state.userProfile.sessionsLoggedCount += 1;
    }

    this.saveState(state);
    return plan.isCompleted;
  }

  async deletePlannedActivity(id: string): Promise<boolean> {
    const state = this.getState();
    const initialLen = state.plannedActivities.length;
    state.plannedActivities = state.plannedActivities.filter((p) => p.id !== id);
    if (state.plannedActivities.length !== initialLen) {
      this.saveState(state);
      return true;
    }
    return false;
  }

  async getJournalEntries(): Promise<JournalEntry[]> {
    return this.getState().journalEntries;
  }

  async createJournalEntry(
    entry: Omit<JournalEntry, "id" | "createdAt" | "isPrivate">
  ): Promise<JournalEntry> {
    const state = this.getState();
    const created: JournalEntry = {
      ...entry,
      id: `journal-${Date.now()}`,
      isPrivate: true,
      createdAt: new Date().toISOString(),
    };
    state.journalEntries.unshift(created);
    this.saveState(state);
    return created;
  }

  async updateJournalEntry(
    id: string,
    updates: Partial<Omit<JournalEntry, "id" | "isPrivate">>
  ): Promise<JournalEntry | null> {
    const state = this.getState();
    const entry = state.journalEntries.find((j) => j.id === id);
    if (!entry) return null;
    Object.assign(entry, updates);
    this.saveState(state);
    return entry;
  }

  async deleteJournalEntry(id: string): Promise<boolean> {
    const state = this.getState();
    const initialLen = state.journalEntries.length;
    state.journalEntries = state.journalEntries.filter((j) => j.id !== id);
    if (state.journalEntries.length !== initialLen) {
      this.saveState(state);
      return true;
    }
    return false;
  }

  async getCommunityPosts(): Promise<CommunityPost[]> {
    return this.getState().communityPosts;
  }

  async createCommunityPost(
    post: Omit<CommunityPost, "id" | "createdAt" | "likesCount" | "commentsCount">
  ): Promise<CommunityPost> {
    const state = this.getState();
    const created: CommunityPost = {
      ...post,
      id: `post-${Date.now()}`,
      createdAt: "Just now",
      likesCount: 0,
      commentsCount: 0,
    };
    state.communityPosts.unshift(created);
    this.saveState(state);
    return created;
  }

  async toggleLikePost(postId: string): Promise<boolean> {
    const state = this.getState();
    const post = state.communityPosts.find((p) => p.id === postId);
    if (!post) return false;

    if (post.hasLiked) {
      post.hasLiked = false;
      post.likesCount = Math.max(0, post.likesCount - 1);
    } else {
      post.hasLiked = true;
      post.likesCount += 1;
    }
    this.saveState(state);
    return Boolean(post.hasLiked);
  }

  async getComments(postId?: string): Promise<Comment[]> {
    const all = this.getState().comments || [];
    if (!postId) return all;
    return all.filter((c) => c.postId === postId);
  }

  async createComment(comment: Omit<Comment, "id" | "createdAt">): Promise<Comment> {
    const state = this.getState();
    const created: Comment = {
      ...comment,
      id: `comm-${Date.now()}`,
      createdAt: "Just now",
    };
    if (!state.comments) state.comments = [...SEED_COMMENTS];
    state.comments.push(created);

    const post = state.communityPosts.find((p) => p.id === comment.postId);
    if (post) {
      post.commentsCount += 1;
    }

    this.saveState(state);
    return created;
  }

  async getGroups(): Promise<Group[]> {
    return this.getState().groups;
  }

  async getGroupBySlug(slug: string): Promise<Group | null> {
    const found = this.getState().groups.find((g) => g.slug === slug);
    return found ? { ...found } : null;
  }

  async toggleJoinGroup(groupId: string): Promise<boolean> {
    const state = this.getState();
    const grp = state.groups.find((g) => g.id === groupId);
    if (!grp) return false;

    grp.isJoined = !grp.isJoined;
    grp.memberCount += grp.isJoined ? 1 : -1;
    this.saveState(state);
    return Boolean(grp.isJoined);
  }

  async reportContent(report: {
    contentId: string;
    contentType: "post" | "comment" | "user";
    reason: string;
  }): Promise<boolean> {
    const state = this.getState();
    if (!state.reports) state.reports = [];
    state.reports.push({
      id: `rep-${Date.now()}`,
      contentId: report.contentId,
      contentType: report.contentType,
      reason: report.reason,
      timestamp: new Date().toISOString(),
    });
    this.saveState(state);
    return true;
  }

  async toggleMuteUser(handle: string): Promise<boolean> {
    const state = this.getState();
    if (!state.mutedUsers) state.mutedUsers = [];
    const index = state.mutedUsers.indexOf(handle);
    let isMuted: boolean;
    if (index >= 0) {
      state.mutedUsers.splice(index, 1);
      isMuted = false;
    } else {
      state.mutedUsers.push(handle);
      isMuted = true;
    }
    this.saveState(state);
    return isMuted;
  }

  async getMutedUsers(): Promise<string[]> {
    return this.getState().mutedUsers || [];
  }

  async getEvents(): Promise<Event[]> {
    return this.getState().events;
  }

  async getEventBySlug(slug: string): Promise<Event | null> {
    const found = this.getState().events.find((e) => e.slug === slug);
    return found ? { ...found } : null;
  }

  async toggleRsvpEvent(eventId: string): Promise<boolean> {
    const state = this.getState();
    const ev = state.events.find((e) => e.id === eventId);
    if (!ev) return false;

    ev.isRsvpd = !ev.isRsvpd;
    ev.participantsCount += ev.isRsvpd ? 1 : -1;
    this.saveState(state);
    return Boolean(ev.isRsvpd);
  }

  async getChallenges(): Promise<Challenge[]> {
    return this.getState().challenges || [];
  }

  async toggleJoinChallenge(challengeId: string): Promise<boolean> {
    const state = this.getState();
    if (!state.challenges) state.challenges = [...SEED_CHALLENGES];
    const ch = state.challenges.find((c) => c.id === challengeId);
    if (!ch) return false;

    ch.isJoined = !ch.isJoined;
    this.saveState(state);
    return Boolean(ch.isJoined);
  }

  async progressChallenge(challengeId: string): Promise<Challenge | null> {
    const state = this.getState();
    if (!state.challenges) state.challenges = [...SEED_CHALLENGES];
    const ch = state.challenges.find((c) => c.id === challengeId);
    if (!ch) return null;

    ch.currentSessionsCount = Math.min(ch.targetSessionsCount, ch.currentSessionsCount + 1);
    if (ch.currentSessionsCount >= ch.targetSessionsCount) {
      ch.isCompleted = true;
    }
    this.saveState(state);
    return ch;
  }

  async getUserPreferences(): Promise<UserPreferences> {
    return this.getState().userPreferences;
  }

  async saveUserPreferences(prefs: UserPreferences): Promise<void> {
    const state = this.getState();
    state.userPreferences = { ...prefs };
    this.saveState(state);
  }

  async getUserProfile(): Promise<UserProfile> {
    return this.getState().userProfile;
  }

  async saveUserProfile(profileUpdates: Partial<UserProfile>): Promise<UserProfile> {
    const state = this.getState();
    state.userProfile = { ...state.userProfile, ...profileUpdates };
    this.saveState(state);
    return state.userProfile;
  }

  async getUserByUsername(username: string): Promise<UserProfile | null> {
    const state = this.getState();
    if (state.userProfile.username === username) {
      return { ...state.userProfile };
    }
    if (username === "clara" || username === "clarabow_art") {
      return {
        id: "user-clara",
        username: "clara",
        displayName: "Clara Bow",
        bio: "Observational botanical sketcher, wild blackberry ink maker, and pressed flower archivist.",
        joinedAt: "September 2026",
        isPublic: true,
        interests: ["art-craft", "outdoors-nature"],
        completedStepsCount: 7,
        sessionsLoggedCount: 9,
      };
    }
    return null;
  }

  async getNotifications(): Promise<Notification[]> {
    return this.getState().notifications;
  }

  async markNotificationRead(id: string): Promise<void> {
    const state = this.getState();
    const notif = state.notifications.find((n) => n.id === id);
    if (notif) {
      notif.isRead = true;
      this.saveState(state);
    }
  }

  async markAllNotificationsRead(): Promise<void> {
    const state = this.getState();
    if (state.notifications) {
      state.notifications.forEach((n) => {
        n.isRead = true;
      });
      this.saveState(state);
    }
  }

  async getReports(): Promise<
    Array<{ id: string; contentId: string; contentType: string; reason: string; timestamp: string }>
  > {
    return this.getState().reports || [];
  }

  async dismissReport(id: string): Promise<boolean> {
    const state = this.getState();
    if (!state.reports) return false;
    const initialLen = state.reports.length;
    state.reports = state.reports.filter((r) => r.id !== id);
    if (state.reports.length !== initialLen) {
      this.saveState(state);
      return true;
    }
    return false;
  }

  async deleteReportedContent(
    contentId: string,
    contentType: "post" | "comment"
  ): Promise<boolean> {
    const state = this.getState();
    if (contentType === "post") {
      state.communityPosts = state.communityPosts.filter((p) => p.id !== contentId);
      state.comments = (state.comments || []).filter((c) => c.postId !== contentId);
    } else {
      state.comments = (state.comments || []).filter((c) => c.id !== contentId);
    }
    if (state.reports) {
      state.reports = state.reports.filter((r) => r.contentId !== contentId);
    }
    this.saveState(state);
    return true;
  }

  async exportLocalData(): Promise<string> {
    const state = this.getState();
    return JSON.stringify(state, null, 2);
  }

  async importLocalData(jsonString: string): Promise<boolean> {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed || typeof parsed !== "object" || parsed.version !== 1) {
        return false;
      }
      this.saveState(parsed);
      return true;
    } catch {
      return false;
    }
  }

  async seedSampleActivityHistory(): Promise<void> {
    const state = this.getState();
    const sampleSessions: ActivitySession[] = [
      {
        id: `sess-seed-${Date.now()}-1`,
        hobbyId: "hobby-1",
        hobbySlug: "botanical-watercolor",
        hobbyTitle: "Botanical Watercolor Painting",
        category: "art-craft",
        date: "2026-10-14",
        durationMinutes: 20,
        notes: "Testing sap green pigment gradients and single stroke leaf pressure.",
        reflectionMood: "Calm & Centered",
        createdAt: "2026-10-14T15:00:00Z",
      },
      {
        id: `sess-seed-${Date.now()}-2`,
        hobbyId: "hobby-2",
        hobbySlug: "sourdough-baking",
        hobbyTitle: "Artisan Sourdough Rhythm",
        category: "cooking",
        date: "2026-10-13",
        durationMinutes: 15,
        notes: "Fed starter with rye and bread flour. Doubled in 3.5 hours.",
        reflectionMood: "Grounding",
        createdAt: "2026-10-13T09:30:00Z",
      },
      {
        id: `sess-seed-${Date.now()}-3`,
        hobbyId: "hobby-3",
        hobbySlug: "fingerstyle-guitar",
        hobbyTitle: "Fingerstyle Acoustic Guitar",
        category: "music",
        date: "2026-10-12",
        durationMinutes: 25,
        notes: "Practiced thumb-index alternating bass on C and G chords.",
        reflectionMood: "Focused & Joyful",
        createdAt: "2026-10-12T19:00:00Z",
      },
    ];

    sampleSessions.forEach((s) => {
      state.activitySessions.unshift(s);
      state.userProfile.sessionsLoggedCount += 1;
    });

    this.saveState(state);
  }

  async resetDemoData(): Promise<void> {
    const initial = this.getInitialState();
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      window.dispatchEvent(new CustomEvent(STATE_CHANGE_EVENT));
    } else {
      this.memoryState = initial;
    }
  }
}

export const demoRepository = new LocalDemoRepository();
export { getActiveRepository } from "./syncEngine";
