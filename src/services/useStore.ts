"use client";

import * as React from "react";
import {
  Hobby,
  SavedHobby,
  ActivitySession,
  PlannedActivity,
  JournalEntry,
  CommunityPost,
  Group,
  Event,
  Notification,
  UserPreferences,
  UserProfile,
} from "@/types";
import { demoRepository } from "./repository";

export function useHobbiverseStore() {
  const [isHydrated, setIsHydrated] = React.useState(false);
  const [savedHobbies, setSavedHobbies] = React.useState<SavedHobby[]>([]);
  const [sessions, setSessions] = React.useState<ActivitySession[]>([]);
  const [plans, setPlans] = React.useState<PlannedActivity[]>([]);
  const [journalEntries, setJournalEntries] = React.useState<JournalEntry[]>([]);
  const [communityPosts, setCommunityPosts] = React.useState<CommunityPost[]>([]);
  const [groups, setGroups] = React.useState<Group[]>([]);
  const [events, setEvents] = React.useState<Event[]>([]);
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [preferences, setPreferences] = React.useState<UserPreferences | null>(null);
  const [profile, setProfile] = React.useState<UserProfile | null>(null);

  const refreshAll = React.useCallback(async () => {
    const [
      saved,
      sess,
      pl,
      journal,
      posts,
      grps,
      evts,
      notifs,
      prefs,
      prof,
    ] = await Promise.all([
      demoRepository.getSavedHobbies(),
      demoRepository.getActivitySessions(),
      demoRepository.getPlannedActivities(),
      demoRepository.getJournalEntries(),
      demoRepository.getCommunityPosts(),
      demoRepository.getGroups(),
      demoRepository.getEvents(),
      demoRepository.getNotifications(),
      demoRepository.getUserPreferences(),
      demoRepository.getUserProfile(),
    ]);

    setSavedHobbies(saved);
    setSessions(sess);
    setPlans(pl);
    setJournalEntries(journal);
    setCommunityPosts(posts);
    setGroups(grps);
    setEvents(evts);
    setNotifications(notifs);
    setPreferences(prefs);
    setProfile(prof);
  }, []);

  React.useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      refreshAll().then(() => setIsHydrated(true));
    });

    const handleStateChange = () => {
      refreshAll();
    };

    window.addEventListener("hobbiverse_state_change", handleStateChange);
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("hobbiverse_state_change", handleStateChange);
    };
  }, [refreshAll]);

  const toggleSaveHobby = async (hobby: Hobby) => {
    const isNowSaved = await demoRepository.toggleSaveHobby(hobby);
    await refreshAll();
    return isNowSaved;
  };

  const toggleCompleteStep = async (hobbyId: string, stepId: string) => {
    const completed = await demoRepository.toggleCompleteStep(hobbyId, stepId);
    await refreshAll();
    return completed;
  };

  const logSession = async (session: Omit<ActivitySession, "id" | "createdAt">) => {
    const created = await demoRepository.logActivitySession(session);
    await refreshAll();
    return created;
  };

  const createPlan = async (plan: Omit<PlannedActivity, "id">) => {
    const created = await demoRepository.createPlannedActivity(plan);
    await refreshAll();
    return created;
  };

  const toggleCompletePlan = async (id: string) => {
    const res = await demoRepository.toggleCompletePlan(id);
    await refreshAll();
    return res;
  };

  const deletePlan = async (id: string) => {
    const ok = await demoRepository.deletePlannedActivity(id);
    await refreshAll();
    return ok;
  };

  const createJournalEntry = async (entry: Omit<JournalEntry, "id" | "createdAt" | "isPrivate">) => {
    const created = await demoRepository.createJournalEntry(entry);
    await refreshAll();
    return created;
  };

  const deleteJournalEntry = async (id: string) => {
    const ok = await demoRepository.deleteJournalEntry(id);
    await refreshAll();
    return ok;
  };

  const createCommunityPost = async (post: Omit<CommunityPost, "id" | "createdAt" | "likesCount" | "commentsCount">) => {
    const created = await demoRepository.createCommunityPost(post);
    await refreshAll();
    return created;
  };

  const toggleLikePost = async (postId: string) => {
    const liked = await demoRepository.toggleLikePost(postId);
    await refreshAll();
    return liked;
  };

  const toggleJoinGroup = async (groupId: string) => {
    const joined = await demoRepository.toggleJoinGroup(groupId);
    await refreshAll();
    return joined;
  };

  const toggleRsvpEvent = async (eventId: string) => {
    const rsvpd = await demoRepository.toggleRsvpEvent(eventId);
    await refreshAll();
    return rsvpd;
  };

  const resetDemo = async () => {
    await demoRepository.resetDemoData();
    await refreshAll();
  };

  return {
    isHydrated,
    savedHobbies,
    sessions,
    plans,
    journalEntries,
    communityPosts,
    groups,
    events,
    notifications,
    preferences,
    profile,
    // Actions
    toggleSaveHobby,
    toggleCompleteStep,
    logSession,
    createPlan,
    toggleCompletePlan,
    deletePlan,
    createJournalEntry,
    deleteJournalEntry,
    createCommunityPost,
    toggleLikePost,
    toggleJoinGroup,
    toggleRsvpEvent,
    resetDemo,
    refreshAll,
  };
}
