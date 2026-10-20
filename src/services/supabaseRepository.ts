import {
  Hobby,
  SavedHobby,
  ActivitySession,
  PlannedActivity,
  JournalEntry,
  CommunityPost,
  Comment,
  Group,
  Event,
  Challenge,
  Notification,
  UserProfile,
  UserPreferences,
  CategorySlug,
} from "@/types";
import {
  HobbyFilterParams,
  IHobbiverseRepository,
} from "./repository";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

/**
 * Remote Supabase repository implementation of IHobbiverseRepository.
 * Manages live PostgreSQL interactions with full Row Level Security (RLS) enforcement.
 */
export class SupabaseRepository implements IHobbiverseRepository {
  private get client() {
    const c = getSupabaseBrowserClient();
    if (!c) {
      throw new Error("Supabase client is not configured. Missing environment variables.");
    }
    return c;
  }

  async getHobbies(filters?: HobbyFilterParams): Promise<Hobby[]> {
    let query = this.client.from("hobbies").select(`
      *,
      steps:hobby_steps(*)
    `);

    if (filters?.category) {
      query = query.eq("category_id", filters.category);
    }
    if (filters?.difficulty) {
      query = query.eq("difficulty", filters.difficulty);
    }
    if (filters?.maxMinutes) {
      query = query.lte("estimated_minutes", filters.maxMinutes);
    }
    if (filters?.locationType) {
      query = query.eq("location_type", filters.locationType);
    }
    if (filters?.energyLevel) {
      query = query.eq("energy_level", filters.energyLevel);
    }
    if (filters?.collection) {
      query = query.eq("editorial_collection", filters.collection);
    }

    const { data, error } = await query;
    if (error || !data) {
      console.warn("Supabase getHobbies error:", error);
      return [];
    }

    let hobbies: Hobby[] = data.map((row: any) => ({
      id: row.id,
      slug: row.slug,
      title: row.title,
      category: row.category_id as CategorySlug,
      categoryName: row.category_name,
      summary: row.summary,
      description: row.description,
      firstStepPrompt: row.first_step_prompt,
      timeEstimate: row.time_estimate,
      estimatedMinutes: row.estimated_minutes,
      difficulty: row.difficulty,
      costRange: row.cost_range,
      locationType: row.location_type,
      socialType: row.social_type,
      energyLevel: row.energy_level,
      materialsNeeded: row.materials_needed || [],
      skillsPracticed: row.skills_practiced || [],
      waysToAdapt: row.ways_to_adapt || { solo: "", social: "" },
      tags: row.tags || [],
      isFeatured: row.is_featured,
      editorialCollection: row.editorial_collection,
      steps: (row.steps || [])
        .sort((a: any, b: any) => a.step_order - b.step_order)
        .map((s: any) => ({
          id: s.id,
          order: s.step_order,
          title: s.title,
          estimatedMinutes: s.estimated_minutes,
          description: s.description,
          instructions: s.instructions || [],
          suppliesNeeded: s.supplies_needed || undefined,
        })),
    }));

    if (filters?.search) {
      const q = filters.search.toLowerCase().trim();
      hobbies = hobbies.filter(
        (h) =>
          h.title.toLowerCase().includes(q) ||
          h.summary.toLowerCase().includes(q) ||
          h.description.toLowerCase().includes(q) ||
          h.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (filters?.sortBy === "time-asc") {
      hobbies.sort((a, b) => a.estimatedMinutes - b.estimatedMinutes);
    } else if (filters?.sortBy === "time-desc") {
      hobbies.sort((a, b) => b.estimatedMinutes - a.estimatedMinutes);
    } else if (filters?.sortBy === "name-asc") {
      hobbies.sort((a, b) => a.title.localeCompare(b.title));
    }

    return hobbies;
  }

  async getHobbyBySlug(slug: string): Promise<Hobby | null> {
    const hobbies = await this.getHobbies();
    return hobbies.find((h) => h.slug === slug) || null;
  }

  async getSavedHobbies(): Promise<SavedHobby[]> {
    const { data: { user } } = await this.client.auth.getUser();
    if (!user) return [];

    const { data, error } = await this.client
      .from("saved_hobbies")
      .select("*")
      .eq("user_id", user.id)
      .order("saved_at", { ascending: false });

    if (error || !data) return [];

    return data.map((row) => ({
      id: row.id,
      hobbyId: row.hobby_id,
      hobbySlug: row.hobby_slug,
      hobbyTitle: row.hobby_title,
      category: row.category as CategorySlug,
      currentStepOrder: row.current_step_order,
      completedStepIds: row.completed_step_ids || [],
      notes: row.notes || undefined,
      savedAt: row.saved_at,
    }));
  }

  async isHobbySaved(hobbyId: string): Promise<boolean> {
    const { data: { user } } = await this.client.auth.getUser();
    if (!user) return false;

    const { data } = await this.client
      .from("saved_hobbies")
      .select("id")
      .eq("user_id", user.id)
      .eq("hobby_id", hobbyId)
      .maybeSingle();

    return Boolean(data);
  }

  async toggleSaveHobby(hobby: Hobby): Promise<boolean> {
    const { data: { user } } = await this.client.auth.getUser();
    if (!user) return false;

    const isSaved = await this.isHobbySaved(hobby.id);

    if (isSaved) {
      await this.client
        .from("saved_hobbies")
        .delete()
        .eq("user_id", user.id)
        .eq("hobby_id", hobby.id);
      return false;
    } else {
      await this.client.from("saved_hobbies").insert({
        user_id: user.id,
        hobby_id: hobby.id,
        hobby_slug: hobby.slug,
        hobby_title: hobby.title,
        category: hobby.category,
        current_step_order: 1,
        completed_step_ids: [],
        saved_at: new Date().toISOString(),
      });
      return true;
    }
  }

  async getStepCompletion(hobbyId: string): Promise<string[]> {
    const { data: { user } } = await this.client.auth.getUser();
    if (!user) return [];

    const { data } = await this.client
      .from("saved_hobbies")
      .select("completed_step_ids")
      .eq("user_id", user.id)
      .eq("hobby_id", hobbyId)
      .maybeSingle();

    return data?.completed_step_ids || [];
  }

  async toggleCompleteStep(hobbyId: string, stepId: string): Promise<string[]> {
    const { data: { user } } = await this.client.auth.getUser();
    if (!user) return [];

    const current = await this.getStepCompletion(hobbyId);
    const updated = current.includes(stepId)
      ? current.filter((id) => id !== stepId)
      : [...current, stepId];

    await this.client
      .from("saved_hobbies")
      .update({ completed_step_ids: updated })
      .eq("user_id", user.id)
      .eq("hobby_id", hobbyId);

    return updated;
  }

  async getActivitySessions(): Promise<ActivitySession[]> {
    const { data: { user } } = await this.client.auth.getUser();
    if (!user) return [];

    const { data, error } = await this.client
      .from("activity_sessions")
      .select("*")
      .eq("user_id", user.id)
      .order("date", { ascending: false });

    if (error || !data) return [];

    return data.map((row) => ({
      id: row.id,
      hobbyId: row.hobby_id,
      hobbySlug: row.hobby_slug,
      hobbyTitle: row.hobby_title,
      category: row.category as CategorySlug,
      date: row.date,
      durationMinutes: row.duration_minutes,
      notes: row.notes || undefined,
      reflectionMood: row.reflection_mood || undefined,
      createdAt: row.created_at,
    }));
  }

  async logActivitySession(
    session: Omit<ActivitySession, "id" | "createdAt">
  ): Promise<ActivitySession> {
    const { data: { user } } = await this.client.auth.getUser();
    if (!user) throw new Error("Authentication required to log session to Supabase");

    const { data, error } = await this.client
      .from("activity_sessions")
      .insert({
        user_id: user.id,
        hobby_id: session.hobbyId,
        hobby_slug: session.hobbySlug,
        hobby_title: session.hobbyTitle,
        category: session.category,
        date: session.date,
        duration_minutes: session.durationMinutes,
        notes: session.notes || null,
        reflection_mood: session.reflectionMood || null,
      })
      .select()
      .single();

    if (error || !data) throw error || new Error("Failed to insert session");

    return {
      id: data.id,
      hobbyId: data.hobby_id,
      hobbySlug: data.hobby_slug,
      hobbyTitle: data.hobby_title,
      category: data.category as CategorySlug,
      date: data.date,
      durationMinutes: data.duration_minutes,
      notes: data.notes || undefined,
      reflectionMood: data.reflection_mood || undefined,
      createdAt: data.created_at,
    };
  }

  async getPlannedActivities(): Promise<PlannedActivity[]> {
    const { data: { user } } = await this.client.auth.getUser();
    if (!user) return [];

    const { data, error } = await this.client
      .from("planned_activities")
      .select("*")
      .eq("user_id", user.id)
      .order("scheduled_for", { ascending: true });

    if (error || !data) return [];

    return data.map((row) => ({
      id: row.id,
      hobbyId: row.hobby_id,
      hobbySlug: row.hobby_slug,
      hobbyTitle: row.hobby_title,
      category: row.category as CategorySlug,
      scheduledFor: row.scheduled_for,
      estimatedDurationMinutes: row.estimated_duration_minutes,
      note: row.note || undefined,
      reminderPreference: (row.reminder_preference as any) || "none",
      isCompleted: row.is_completed,
    }));
  }

  async createPlannedActivity(
    plan: Omit<PlannedActivity, "id">
  ): Promise<PlannedActivity> {
    const { data: { user } } = await this.client.auth.getUser();
    if (!user) throw new Error("Authentication required to create planned activity");

    const { data, error } = await this.client
      .from("planned_activities")
      .insert({
        user_id: user.id,
        hobby_id: plan.hobbyId,
        hobby_slug: plan.hobbySlug,
        hobby_title: plan.hobbyTitle,
        category: plan.category,
        scheduled_for: plan.scheduledFor,
        estimated_duration_minutes: plan.estimatedDurationMinutes,
        note: plan.note || null,
        reminder_preference: plan.reminderPreference || "none",
        is_completed: plan.isCompleted || false,
      })
      .select()
      .single();

    if (error || !data) throw error || new Error("Failed to create planned activity");

    return {
      id: data.id,
      hobbyId: data.hobby_id,
      hobbySlug: data.hobby_slug,
      hobbyTitle: data.hobby_title,
      category: data.category as CategorySlug,
      scheduledFor: data.scheduled_for,
      estimatedDurationMinutes: data.estimated_duration_minutes,
      note: data.note || undefined,
      reminderPreference: (data.reminder_preference as any) || "none",
      isCompleted: data.is_completed,
    };
  }

  async updatePlannedActivity(
    id: string,
    updates: Partial<Omit<PlannedActivity, "id">>
  ): Promise<PlannedActivity | null> {
    const { data, error } = await this.client
      .from("planned_activities")
      .update({
        ...(updates.scheduledFor && { scheduled_for: updates.scheduledFor }),
        ...(updates.estimatedDurationMinutes && { estimated_duration_minutes: updates.estimatedDurationMinutes }),
        ...(updates.note !== undefined && { note: updates.note }),
        ...(updates.reminderPreference && { reminder_preference: updates.reminderPreference }),
        ...(updates.isCompleted !== undefined && { is_completed: updates.isCompleted }),
      })
      .eq("id", id)
      .select()
      .single();

    if (error || !data) return null;

    return {
      id: data.id,
      hobbyId: data.hobby_id,
      hobbySlug: data.hobby_slug,
      hobbyTitle: data.hobby_title,
      category: data.category as CategorySlug,
      scheduledFor: data.scheduled_for,
      estimatedDurationMinutes: data.estimated_duration_minutes,
      note: data.note || undefined,
      reminderPreference: (data.reminder_preference as any) || "none",
      isCompleted: data.is_completed,
    };
  }

  async toggleCompletePlan(id: string): Promise<boolean> {
    const plans = await this.getPlannedActivities();
    const plan = plans.find((p) => p.id === id);
    if (!plan) return false;

    const newCompleted = !plan.isCompleted;
    await this.updatePlannedActivity(id, { isCompleted: newCompleted });
    return newCompleted;
  }

  async deletePlannedActivity(id: string): Promise<boolean> {
    const { error } = await this.client
      .from("planned_activities")
      .delete()
      .eq("id", id);
    return !error;
  }

  async getJournalEntries(): Promise<JournalEntry[]> {
    const { data: { user } } = await this.client.auth.getUser();
    if (!user) return [];

    const { data, error } = await this.client
      .from("journal_entries")
      .select("*")
      .eq("user_id", user.id)
      .order("date", { ascending: false });

    if (error || !data) return [];

    return data.map((row) => ({
      id: row.id,
      title: row.title || undefined,
      content: row.content,
      date: row.date,
      moodLabel: row.mood_label || undefined,
      hobbySlug: row.hobby_slug || undefined,
      hobbyTitle: row.hobby_title || undefined,
      isPrivate: true,
      createdAt: row.created_at,
    }));
  }

  async createJournalEntry(
    entry: Omit<JournalEntry, "id" | "createdAt" | "isPrivate">
  ): Promise<JournalEntry> {
    const { data: { user } } = await this.client.auth.getUser();
    if (!user) throw new Error("Authentication required for private reflection");

    const { data, error } = await this.client
      .from("journal_entries")
      .insert({
        user_id: user.id,
        title: entry.title || null,
        content: entry.content,
        date: entry.date,
        mood_label: entry.moodLabel || null,
        hobby_slug: entry.hobbySlug || null,
        hobby_title: entry.hobbyTitle || null,
        is_private: true,
      })
      .select()
      .single();

    if (error || !data) throw error || new Error("Failed to insert journal entry");

    return {
      id: data.id,
      title: data.title || undefined,
      content: data.content,
      date: data.date,
      moodLabel: data.mood_label || undefined,
      hobbySlug: data.hobby_slug || undefined,
      hobbyTitle: data.hobby_title || undefined,
      isPrivate: true,
      createdAt: data.created_at,
    };
  }

  async updateJournalEntry(
    id: string,
    updates: Partial<Omit<JournalEntry, "id" | "isPrivate">>
  ): Promise<JournalEntry | null> {
    const { data, error } = await this.client
      .from("journal_entries")
      .update({
        ...(updates.title !== undefined && { title: updates.title }),
        ...(updates.content && { content: updates.content }),
        ...(updates.date && { date: updates.date }),
        ...(updates.moodLabel !== undefined && { mood_label: updates.moodLabel }),
        ...(updates.hobbySlug !== undefined && { hobby_slug: updates.hobbySlug }),
        ...(updates.hobbyTitle !== undefined && { hobby_title: updates.hobbyTitle }),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error || !data) return null;

    return {
      id: data.id,
      title: data.title || undefined,
      content: data.content,
      date: data.date,
      moodLabel: data.mood_label || undefined,
      hobbySlug: data.hobby_slug || undefined,
      hobbyTitle: data.hobby_title || undefined,
      isPrivate: true,
      createdAt: data.created_at,
    };
  }

  async deleteJournalEntry(id: string): Promise<boolean> {
    const { error } = await this.client
      .from("journal_entries")
      .delete()
      .eq("id", id);
    return !error;
  }

  async getCommunityPosts(): Promise<CommunityPost[]> {
    const { data, error } = await this.client
      .from("community_posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data) return [];

    return data.map((row) => ({
      id: row.id,
      authorId: row.author_id,
      authorName: row.author_name,
      authorHandle: row.author_handle,
      authorAvatar: row.author_avatar || undefined,
      hobbySlug: row.hobby_slug || undefined,
      hobbyTitle: row.hobby_title || undefined,
      category: row.category as CategorySlug,
      content: row.content,
      likesCount: row.likes_count,
      commentsCount: row.comments_count,
      createdAt: row.created_at,
    }));
  }

  async createCommunityPost(
    post: Omit<CommunityPost, "id" | "createdAt" | "likesCount" | "commentsCount">
  ): Promise<CommunityPost> {
    const { data: { user } } = await this.client.auth.getUser();
    if (!user) throw new Error("Authentication required to share community post");

    const { data, error } = await this.client
      .from("community_posts")
      .insert({
        author_id: user.id,
        author_name: post.authorName,
        author_handle: post.authorHandle,
        author_avatar: post.authorAvatar || null,
        hobby_slug: post.hobbySlug || null,
        hobby_title: post.hobbyTitle || null,
        category: post.category,
        content: post.content,
      })
      .select()
      .single();

    if (error || !data) throw error || new Error("Failed to insert community post");

    return {
      id: data.id,
      authorId: data.author_id,
      authorName: data.author_name,
      authorHandle: data.author_handle,
      authorAvatar: data.author_avatar || undefined,
      hobbySlug: data.hobby_slug || undefined,
      hobbyTitle: data.hobby_title || undefined,
      category: data.category as CategorySlug,
      content: data.content,
      likesCount: data.likes_count,
      commentsCount: data.comments_count,
      createdAt: data.created_at,
    };
  }

  async toggleLikePost(postId: string): Promise<boolean> {
    const { data: { user } } = await this.client.auth.getUser();
    if (!user) return false;

    const { data: existing } = await this.client
      .from("post_likes")
      .select("post_id")
      .eq("post_id", postId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (existing) {
      await this.client
        .from("post_likes")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", user.id);
      return false;
    } else {
      await this.client.from("post_likes").insert({
        post_id: postId,
        user_id: user.id,
      });
      return true;
    }
  }

  async getComments(postId?: string): Promise<Comment[]> {
    let query = this.client.from("comments").select("*").order("created_at", { ascending: true });
    if (postId) {
      query = query.eq("post_id", postId);
    }
    const { data, error } = await query;
    if (error || !data) return [];

    return data.map((row) => ({
      id: row.id,
      postId: row.post_id,
      authorName: row.author_name,
      authorHandle: row.author_handle,
      content: row.content,
      createdAt: row.created_at,
    }));
  }

  async createComment(comment: Omit<Comment, "id" | "createdAt">): Promise<Comment> {
    const { data: { user } } = await this.client.auth.getUser();
    if (!user) throw new Error("Authentication required to comment");

    const { data, error } = await this.client
      .from("comments")
      .insert({
        post_id: comment.postId,
        author_id: user.id,
        author_name: comment.authorName,
        author_handle: comment.authorHandle,
        content: comment.content,
      })
      .select()
      .single();

    if (error || !data) throw error || new Error("Failed to insert comment");

    return {
      id: data.id,
      postId: data.post_id,
      authorName: data.author_name,
      authorHandle: data.author_handle,
      content: data.content,
      createdAt: data.created_at,
    };
  }

  async getGroups(): Promise<Group[]> {
    const { data, error } = await this.client.from("groups").select("*").order("name");
    if (error || !data) return [];

    return data.map((row) => ({
      id: row.id,
      slug: row.slug,
      name: row.name,
      description: row.description,
      category: row.category as CategorySlug,
      memberCount: row.member_count,
      guidelines: row.guidelines || [],
    }));
  }

  async getGroupBySlug(slug: string): Promise<Group | null> {
    const groups = await this.getGroups();
    return groups.find((g) => g.slug === slug) || null;
  }

  async toggleJoinGroup(groupId: string): Promise<boolean> {
    const { data: { user } } = await this.client.auth.getUser();
    if (!user) return false;

    const { data: existing } = await this.client
      .from("group_members")
      .select("group_id")
      .eq("group_id", groupId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (existing) {
      await this.client
        .from("group_members")
        .delete()
        .eq("group_id", groupId)
        .eq("user_id", user.id);
      return false;
    } else {
      await this.client.from("group_members").insert({
        group_id: groupId,
        user_id: user.id,
      });
      return true;
    }
  }

  async getEvents(): Promise<Event[]> {
    const { data, error } = await this.client.from("events").select("*").order("scheduled_date");
    if (error || !data) return [];

    return data.map((row) => ({
      id: row.id,
      slug: row.slug,
      title: row.title,
      description: row.description,
      category: row.category as CategorySlug,
      scheduledDate: row.scheduled_date,
      timeLabel: row.time_label,
      format: (row.format as any) || "online",
      participantsCount: row.participants_count,
      participationPrompt: row.participation_prompt,
    }));
  }

  async getEventBySlug(slug: string): Promise<Event | null> {
    const events = await this.getEvents();
    return events.find((e) => e.slug === slug) || null;
  }

  async toggleRsvpEvent(eventId: string): Promise<boolean> {
    const { data: { user } } = await this.client.auth.getUser();
    if (!user) return false;

    const { data: existing } = await this.client
      .from("event_rsvps")
      .select("event_id")
      .eq("event_id", eventId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (existing) {
      await this.client
        .from("event_rsvps")
        .delete()
        .eq("event_id", eventId)
        .eq("user_id", user.id);
      return false;
    } else {
      await this.client.from("event_rsvps").insert({
        event_id: eventId,
        user_id: user.id,
      });
      return true;
    }
  }

  async getChallenges(): Promise<Challenge[]> {
    const { data, error } = await this.client.from("challenges").select("*");
    if (error || !data) return [];

    return data.map((row) => ({
      id: row.id,
      slug: row.slug,
      title: row.title,
      description: row.description,
      category: row.category as CategorySlug,
      durationDays: row.duration_days,
      targetSessionsCount: row.target_sessions_count,
      currentSessionsCount: 0,
      isJoined: false,
      isCompleted: false,
    }));
  }

  async toggleJoinChallenge(challengeId: string): Promise<boolean> {
    const { data: { user } } = await this.client.auth.getUser();
    if (!user) return false;

    const { data: existing } = await this.client
      .from("user_challenges")
      .select("is_joined")
      .eq("challenge_id", challengeId)
      .eq("user_id", user.id)
      .maybeSingle();

    const newJoined = !existing?.is_joined;

    await this.client.from("user_challenges").upsert({
      user_id: user.id,
      challenge_id: challengeId,
      is_joined: newJoined,
      updated_at: new Date().toISOString(),
    });

    return newJoined;
  }

  async progressChallenge(challengeId: string): Promise<Challenge | null> {
    const challenges = await this.getChallenges();
    const ch = challenges.find((c) => c.id === challengeId);
    if (!ch) return null;

    const { data: { user } } = await this.client.auth.getUser();
    if (!user) return ch;

    const { data: existing } = await this.client
      .from("user_challenges")
      .select("current_sessions_count")
      .eq("challenge_id", challengeId)
      .eq("user_id", user.id)
      .maybeSingle();

    const currentCount = (existing?.current_sessions_count || 0) + 1;
    const isCompleted = currentCount >= ch.targetSessionsCount;

    await this.client.from("user_challenges").upsert({
      user_id: user.id,
      challenge_id: challengeId,
      current_sessions_count: currentCount,
      is_completed: isCompleted,
      updated_at: new Date().toISOString(),
    });

    return {
      ...ch,
      currentSessionsCount: currentCount,
      isCompleted,
    };
  }

  async reportContent(report: {
    contentId: string;
    contentType: "post" | "comment" | "user";
    reason: string;
  }): Promise<boolean> {
    const { data: { user } } = await this.client.auth.getUser();

    const { error } = await this.client.from("reports").insert({
      reporter_id: user?.id || null,
      content_id: report.contentId,
      content_type: report.contentType,
      reason: report.reason,
    });

    return !error;
  }

  async toggleMuteUser(handle: string): Promise<boolean> {
    const { data: { user } } = await this.client.auth.getUser();
    if (!user) return false;

    const { data: existing } = await this.client
      .from("muted_users")
      .select("muted_handle")
      .eq("user_id", user.id)
      .eq("muted_handle", handle)
      .maybeSingle();

    if (existing) {
      await this.client
        .from("muted_users")
        .delete()
        .eq("user_id", user.id)
        .eq("muted_handle", handle);
      return false;
    } else {
      await this.client.from("muted_users").insert({
        user_id: user.id,
        muted_handle: handle,
      });
      return true;
    }
  }

  async getMutedUsers(): Promise<string[]> {
    const { data: { user } } = await this.client.auth.getUser();
    if (!user) return [];

    const { data } = await this.client
      .from("muted_users")
      .select("muted_handle")
      .eq("user_id", user.id);

    return data?.map((m) => m.muted_handle) || [];
  }

  async getUserPreferences(): Promise<UserPreferences> {
    const { data: { user } } = await this.client.auth.getUser();
    if (!user) {
      return {
        interests: ["art-craft", "cooking", "music"],
        availableTimeMinutes: 20,
        preferredPace: "gentle",
        budgetComfort: "minimal",
        soloSocialPreference: "both",
        energyPreference: "calm",
      };
    }

    const { data } = await this.client
      .from("user_preferences")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!data) {
      return {
        interests: ["art-craft", "cooking", "music"],
        availableTimeMinutes: 20,
        preferredPace: "gentle",
        budgetComfort: "minimal",
        soloSocialPreference: "both",
        energyPreference: "calm",
      };
    }

    return {
      interests: (data.interests || []) as CategorySlug[],
      availableTimeMinutes: data.available_time_minutes,
      preferredPace: (data.preferred_pace as any) || "gentle",
      budgetComfort: (data.budget_comfort as any) || "minimal",
      soloSocialPreference: (data.solo_social_preference as any) || "both",
      energyPreference: (data.energy_preference as any) || "calm",
      reduceMotion: data.reduce_motion,
    };
  }

  async saveUserPreferences(prefs: UserPreferences): Promise<void> {
    const { data: { user } } = await this.client.auth.getUser();
    if (!user) return;

    await this.client.from("user_preferences").upsert({
      user_id: user.id,
      interests: prefs.interests,
      available_time_minutes: prefs.availableTimeMinutes,
      preferred_pace: prefs.preferredPace,
      budget_comfort: prefs.budgetComfort,
      solo_social_preference: prefs.soloSocialPreference,
      energy_preference: prefs.energyPreference,
      reduce_motion: prefs.reduceMotion || false,
      updated_at: new Date().toISOString(),
    });
  }

  async getUserProfile(): Promise<UserProfile> {
    const { data: { user } } = await this.client.auth.getUser();
    if (!user) {
      return {
        id: "demo-user",
        username: "atelier_apprentice",
        displayName: "Atelier Apprentice",
        bio: "Exploring gentle beginnings in water, sourdough, and acoustic strings.",
        joinedAt: "October 2026",
        isPublic: true,
        interests: ["art-craft", "cooking", "music"],
        completedStepsCount: 4,
        sessionsLoggedCount: 3,
      };
    }

    const { data } = await this.client
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (!data) {
      return {
        id: user.id,
        username: user.email?.split("@")[0] || "member",
        displayName: user.user_metadata?.full_name || "Atelier Member",
        joinedAt: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
        isPublic: true,
        interests: ["art-craft"],
        completedStepsCount: 0,
        sessionsLoggedCount: 0,
      };
    }

    return {
      id: data.id,
      username: data.username,
      displayName: data.display_name,
      bio: data.bio || undefined,
      avatarUrl: data.avatar_url || undefined,
      joinedAt: new Date(data.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" }),
      isPublic: data.is_public,
      interests: (data.interests || []) as CategorySlug[],
      completedStepsCount: data.completed_steps_count,
      sessionsLoggedCount: data.sessions_logged_count,
    };
  }

  async saveUserProfile(profileUpdates: Partial<UserProfile>): Promise<UserProfile> {
    const { data: { user } } = await this.client.auth.getUser();
    if (!user) throw new Error("Authentication required to update profile");

    const { data, error } = await this.client
      .from("profiles")
      .update({
        ...(profileUpdates.displayName && { display_name: profileUpdates.displayName }),
        ...(profileUpdates.bio !== undefined && { bio: profileUpdates.bio }),
        ...(profileUpdates.avatarUrl !== undefined && { avatar_url: profileUpdates.avatarUrl }),
        ...(profileUpdates.isPublic !== undefined && { is_public: profileUpdates.isPublic }),
        ...(profileUpdates.interests && { interests: profileUpdates.interests }),
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)
      .select()
      .single();

    if (error || !data) throw error || new Error("Failed to update profile");

    return this.getUserProfile();
  }

  async getUserByUsername(username: string): Promise<UserProfile | null> {
    const { data } = await this.client
      .from("profiles")
      .select("*")
      .eq("username", username)
      .maybeSingle();

    if (!data) return null;

    return {
      id: data.id,
      username: data.username,
      displayName: data.display_name,
      bio: data.bio || undefined,
      avatarUrl: data.avatar_url || undefined,
      joinedAt: new Date(data.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" }),
      isPublic: data.is_public,
      interests: (data.interests || []) as CategorySlug[],
      completedStepsCount: data.completed_steps_count,
      sessionsLoggedCount: data.sessions_logged_count,
    };
  }

  async getNotifications(): Promise<Notification[]> {
    const { data: { user } } = await this.client.auth.getUser();
    if (!user) return [];

    const { data } = await this.client
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    return (data || []).map((n) => ({
      id: n.id,
      title: n.title,
      message: n.message,
      type: n.type as any,
      isRead: n.is_read,
      href: n.href || undefined,
      createdAt: n.created_at,
    }));
  }

  async markNotificationRead(id: string): Promise<void> {
    await this.client.from("notifications").update({ is_read: true }).eq("id", id);
  }

  async markAllNotificationsRead(): Promise<void> {
    const { data: { user } } = await this.client.auth.getUser();
    if (!user) return;
    await this.client.from("notifications").update({ is_read: true }).eq("user_id", user.id);
  }

  async getReports(): Promise<Array<{ id: string; contentId: string; contentType: string; reason: string; timestamp: string }>> {
    const { data } = await this.client.from("reports").select("*").order("created_at", { ascending: false });
    return (data || []).map((r) => ({
      id: r.id,
      contentId: r.content_id,
      contentType: r.content_type,
      reason: r.reason,
      timestamp: r.created_at,
    }));
  }

  async dismissReport(id: string): Promise<boolean> {
    const { error } = await this.client.from("reports").delete().eq("id", id);
    return !error;
  }

  async deleteReportedContent(contentId: string, contentType: "post" | "comment"): Promise<boolean> {
    if (contentType === "post") {
      const { error } = await this.client.from("community_posts").delete().eq("id", contentId);
      return !error;
    } else {
      const { error } = await this.client.from("comments").delete().eq("id", contentId);
      return !error;
    }
  }

  async exportLocalData(): Promise<string> {
    throw new Error("Export is managed via LocalDemoRepository or Supabase administration CLI.");
  }

  async importLocalData(): Promise<boolean> {
    throw new Error("Import is managed via LocalDemoRepository or Supabase administration CLI.");
  }

  async seedSampleActivityHistory(): Promise<void> {
    // No-op on remote database
  }

  async resetDemoData(): Promise<void> {
    // No-op on remote database
  }
}
