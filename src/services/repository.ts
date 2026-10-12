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
} from "@/types";
import {
  SEED_HOBBIES,
  SEED_SAVED_HOBBIES,
  SEED_ACTIVITY_SESSIONS,
  SEED_PLANNED_ACTIVITIES,
  SEED_JOURNAL_ENTRIES,
  SEED_COMMUNITY_POSTS,
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
  groups: Group[];
  events: Event[];
  challenges: Challenge[];
  notifications: Notification[];
  userProfile: UserProfile;
  userPreferences: UserPreferences;
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
  deletePlannedActivity(id: string): Promise<boolean>;
  getJournalEntries(): Promise<JournalEntry[]>;
  createJournalEntry(entry: Omit<JournalEntry, "id" | "createdAt" | "isPrivate">): Promise<JournalEntry>;
  deleteJournalEntry(id: string): Promise<boolean>;
  getCommunityPosts(): Promise<CommunityPost[]>;
  createCommunityPost(post: Omit<CommunityPost, "id" | "createdAt" | "likesCount" | "commentsCount">): Promise<CommunityPost>;
  toggleLikePost(postId: string): Promise<boolean>;
  getGroups(): Promise<Group[]>;
  toggleJoinGroup(groupId: string): Promise<boolean>;
  getEvents(): Promise<Event[]>;
  toggleRsvpEvent(eventId: string): Promise<boolean>;
  getUserPreferences(): Promise<UserPreferences>;
  saveUserPreferences(prefs: UserPreferences): Promise<void>;
  getUserProfile(): Promise<UserProfile>;
  getNotifications(): Promise<Notification[]>;
  markNotificationRead(id: string): Promise<void>;
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
      groups: [...SEED_GROUPS],
      events: [...SEED_EVENTS],
      challenges: [...SEED_CHALLENGES],
      notifications: [...SEED_NOTIFICATIONS],
      userProfile: { ...SEED_PROFILE },
      userPreferences: { ...SEED_PREFERENCES },
    };
  }

  private getState(): DemoStatePayload {
    if (typeof window === "undefined") {
      return this.getInitialState();
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
      return parsed;
    } catch {
      return this.getInitialState();
    }
  }

  private saveState(state: DemoStatePayload): void {
    if (typeof window === "undefined") return;
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

  async getGroups(): Promise<Group[]> {
    return this.getState().groups;
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

  async getEvents(): Promise<Event[]> {
    return this.getState().events;
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

  async resetDemoData(): Promise<void> {
    if (typeof window !== "undefined") {
      const initial = this.getInitialState();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      window.dispatchEvent(new CustomEvent(STATE_CHANGE_EVENT));
    }
  }
}

export const demoRepository = new LocalDemoRepository();
