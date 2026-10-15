"use client";

import * as React from "react";
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
  const [comments, setComments] = React.useState<Comment[]>([]);
  const [mutedUsers, setMutedUsers] = React.useState<string[]>([]);
  const [groups, setGroups] = React.useState<Group[]>([]);
  const [events, setEvents] = React.useState<Event[]>([]);
  const [challenges, setChallenges] = React.useState<Challenge[]>([]);
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
      commList,
      mutedList,
      grps,
      evts,
      chals,
      notifs,
      prefs,
      prof,
    ] = await Promise.all([
      demoRepository.getSavedHobbies(),
      demoRepository.getActivitySessions(),
      demoRepository.getPlannedActivities(),
      demoRepository.getJournalEntries(),
      demoRepository.getCommunityPosts(),
      demoRepository.getComments(),
      demoRepository.getMutedUsers(),
      demoRepository.getGroups(),
      demoRepository.getEvents(),
      demoRepository.getChallenges(),
      demoRepository.getNotifications(),
      demoRepository.getUserPreferences(),
      demoRepository.getUserProfile(),
    ]);

    setSavedHobbies(saved);
    setSessions(sess);
    setPlans(pl);
    setJournalEntries(journal);
    setCommunityPosts(posts);
    setComments(commList);
    setMutedUsers(mutedList);
    setGroups(grps);
    setEvents(evts);
    setChallenges(chals);
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

  const updatePlan = async (id: string, updates: Partial<Omit<PlannedActivity, "id">>) => {
    const updated = await demoRepository.updatePlannedActivity(id, updates);
    await refreshAll();
    return updated;
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

  const updateJournalEntry = async (id: string, updates: Partial<Omit<JournalEntry, "id" | "isPrivate">>) => {
    const updated = await demoRepository.updateJournalEntry(id, updates);
    await refreshAll();
    return updated;
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

  const createComment = async (comment: Omit<Comment, "id" | "createdAt">) => {
    const created = await demoRepository.createComment(comment);
    await refreshAll();
    return created;
  };

  const reportContent = async (report: {
    contentId: string;
    contentType: "post" | "comment" | "user";
    reason: string;
  }) => {
    const ok = await demoRepository.reportContent(report);
    await refreshAll();
    return ok;
  };

  const toggleMuteUser = async (handle: string) => {
    const isMuted = await demoRepository.toggleMuteUser(handle);
    await refreshAll();
    return isMuted;
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

  const toggleJoinChallenge = async (challengeId: string) => {
    const joined = await demoRepository.toggleJoinChallenge(challengeId);
    await refreshAll();
    return joined;
  };

  const saveUserProfile = async (profileUpdates: Partial<UserProfile>) => {
    const updated = await demoRepository.saveUserProfile(profileUpdates);
    await refreshAll();
    return updated;
  };

  const saveUserPreferences = async (prefs: UserPreferences) => {
    await demoRepository.saveUserPreferences(prefs);
    await refreshAll();
  };

  const markNotificationRead = async (id: string) => {
    await demoRepository.markNotificationRead(id);
    await refreshAll();
  };

  const markAllNotificationsRead = async () => {
    await demoRepository.markAllNotificationsRead();
    await refreshAll();
  };

  const exportLocalData = async () => {
    return demoRepository.exportLocalData();
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
    comments,
    mutedUsers,
    groups,
    events,
    challenges,
    notifications,
    preferences,
    profile,
    // Actions
    toggleSaveHobby,
    toggleCompleteStep,
    logSession,
    createPlan,
    updatePlan,
    toggleCompletePlan,
    deletePlan,
    createJournalEntry,
    updateJournalEntry,
    deleteJournalEntry,
    createCommunityPost,
    toggleLikePost,
    createComment,
    reportContent,
    toggleMuteUser,
    toggleJoinGroup,
    toggleRsvpEvent,
    toggleJoinChallenge,
    saveUserProfile,
    saveUserPreferences,
    markNotificationRead,
    markAllNotificationsRead,
    exportLocalData,
    resetDemo,
    refreshAll,
  };
}
