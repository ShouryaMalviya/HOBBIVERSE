import { isSupabaseConfigured, getSupabaseBrowserClient } from "@/lib/supabase/client";
import { demoRepository, IHobbiverseRepository } from "./repository";
import { SupabaseRepository } from "./supabaseRepository";

export interface SyncResult {
  success: boolean;
  syncedSavedHobbies: number;
  syncedSessions: number;
  syncedPlans: number;
  syncedJournal: number;
  errors: string[];
}

let activeRepositoryInstance: IHobbiverseRepository | null = null;

/**
 * Returns the currently active repository for the application runtime.
 * Automatically chooses SupabaseRepository if valid Supabase credentials
 * are configured, otherwise falls back seamlessly to LocalDemoRepository.
 */
export function getActiveRepository(): IHobbiverseRepository {
  if (activeRepositoryInstance) {
    return activeRepositoryInstance;
  }

  if (isSupabaseConfigured()) {
    activeRepositoryInstance = new SupabaseRepository();
  } else {
    activeRepositoryInstance = demoRepository;
  }

  return activeRepositoryInstance;
}

/**
 * Checks whether remote Supabase sync is available for the current user session.
 */
export async function isSyncAvailable(): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  const client = getSupabaseBrowserClient();
  if (!client) return false;

  const { data: { user } } = await client.auth.getUser();
  return Boolean(user);
}

/**
 * Migrates local sandbox data (saved hobbies, activity sessions, private reflections,
 * and routine plans) into the user's remote Supabase account upon initial authentication.
 */
export async function syncLocalToSupabase(): Promise<SyncResult> {
  const result: SyncResult = {
    success: true,
    syncedSavedHobbies: 0,
    syncedSessions: 0,
    syncedPlans: 0,
    syncedJournal: 0,
    errors: [],
  };

  if (!isSupabaseConfigured()) {
    result.success = false;
    result.errors.push("Supabase is not configured in environment variables.");
    return result;
  }

  const client = getSupabaseBrowserClient();
  if (!client) {
    result.success = false;
    result.errors.push("Failed to initialize Supabase client.");
    return result;
  }

  const { data: { user } } = await client.auth.getUser();
  if (!user) {
    result.success = false;
    result.errors.push("User must be authenticated to sync local data to remote Supabase.");
    return result;
  }

  try {
    // 1. Sync Saved Hobbies
    const saved = await demoRepository.getSavedHobbies();
    for (const sh of saved) {
      const { error } = await client.from("saved_hobbies").upsert({
        user_id: user.id,
        hobby_id: sh.hobbyId,
        hobby_slug: sh.hobbySlug,
        hobby_title: sh.hobbyTitle,
        category: sh.category,
        current_step_order: sh.currentStepOrder,
        completed_step_ids: sh.completedStepIds,
        notes: sh.notes || null,
        saved_at: sh.savedAt,
      }, { onConflict: "user_id,hobby_id" });

      if (error) {
        result.errors.push(`Saved hobby sync error (${sh.hobbyTitle}): ${error.message}`);
      } else {
        result.syncedSavedHobbies++;
      }
    }

    // 2. Sync Activity Sessions
    const sessions = await demoRepository.getActivitySessions();
    for (const sess of sessions) {
      const { error } = await client.from("activity_sessions").insert({
        user_id: user.id,
        hobby_id: sess.hobbyId,
        hobby_slug: sess.hobbySlug,
        hobby_title: sess.hobbyTitle,
        category: sess.category,
        date: sess.date,
        duration_minutes: sess.durationMinutes,
        notes: sess.notes || null,
        reflection_mood: sess.reflectionMood || null,
      });

      if (error) {
        result.errors.push(`Session sync error: ${error.message}`);
      } else {
        result.syncedSessions++;
      }
    }

    // 3. Sync Planned Activities
    const plans = await demoRepository.getPlannedActivities();
    for (const plan of plans) {
      const { error } = await client.from("planned_activities").insert({
        user_id: user.id,
        hobby_id: plan.hobbyId,
        hobby_slug: plan.hobbySlug,
        hobby_title: plan.hobbyTitle,
        category: plan.category,
        scheduled_for: plan.scheduledFor,
        estimated_duration_minutes: plan.estimatedDurationMinutes,
        note: plan.note || null,
        reminder_preference: plan.reminderPreference || "none",
        is_completed: plan.isCompleted,
      });

      if (error) {
        result.errors.push(`Plan sync error: ${error.message}`);
      } else {
        result.syncedPlans++;
      }
    }

    // 4. Sync Private Journal Entries (strictly isolated to auth.uid())
    const entries = await demoRepository.getJournalEntries();
    for (const entry of entries) {
      const { error } = await client.from("journal_entries").insert({
        user_id: user.id,
        title: entry.title || null,
        content: entry.content,
        date: entry.date,
        mood_label: entry.moodLabel || null,
        hobby_slug: entry.hobbySlug || null,
        hobby_title: entry.hobbyTitle || null,
        is_private: true,
      });

      if (error) {
        result.errors.push(`Private journal sync error: ${error.message}`);
      } else {
        result.syncedJournal++;
      }
    }
  } catch (err: any) {
    result.success = false;
    result.errors.push(`Unexpected sync failure: ${err?.message || String(err)}`);
  }

  if (result.errors.length > 0) {
    result.success = false;
  }

  return result;
}
