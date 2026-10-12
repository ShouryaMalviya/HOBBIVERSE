"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { UserProfile } from "@/types";
import { SEED_PROFILE } from "./seedData";

export interface AuthSession {
  user: UserProfile;
  isDemo: boolean;
  provider: "demo" | "supabase";
  token?: string;
}

const SESSION_STORAGE_KEY = "hobbiverse_auth_session_v1";

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://your-project.supabase.co"
  );
}

export function getStoredSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) {
      // Default to demo session
      return {
        user: SEED_PROFILE,
        isDemo: true,
        provider: "demo",
      };
    }
    return JSON.parse(raw);
  } catch {
    return {
      user: SEED_PROFILE,
      isDemo: true,
      provider: "demo",
    };
  }
}

const defaultDemoSession: AuthSession = {
  user: SEED_PROFILE,
  isDemo: true,
  provider: "demo",
};

let cachedSession: AuthSession | null = null;
let lastRawSession: string | null = null;

function subscribeAuth(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("hobbiverse_auth_change", callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("hobbiverse_auth_change", callback);
    window.removeEventListener("storage", callback);
  };
}

function getAuthSnapshot(): AuthSession {
  if (typeof window === "undefined") return defaultDemoSession;
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (raw === lastRawSession && cachedSession !== null) {
      return cachedSession;
    }
    lastRawSession = raw;
    if (!raw) {
      cachedSession = defaultDemoSession;
      return cachedSession;
    }
    cachedSession = JSON.parse(raw);
    return cachedSession!;
  } catch {
    cachedSession = defaultDemoSession;
    return cachedSession;
  }
}

function getServerSnapshot(): AuthSession {
  return defaultDemoSession;
}

export function saveStoredSession(session: AuthSession | null): void {
  if (typeof window === "undefined") return;
  if (!session) {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    lastRawSession = null;
    cachedSession = defaultDemoSession;
  } else {
    const stringified = JSON.stringify(session);
    localStorage.setItem(SESSION_STORAGE_KEY, stringified);
    lastRawSession = stringified;
    cachedSession = session;
  }
  window.dispatchEvent(new CustomEvent("hobbiverse_auth_change"));
}

export function useAuth() {
  const router = useRouter();
  const session = React.useSyncExternalStore(subscribeAuth, getAuthSnapshot, getServerSnapshot);

  const signInDemo = (email?: string, name?: string) => {
    const newSession: AuthSession = {
      user: {
        ...SEED_PROFILE,
        displayName: name || SEED_PROFILE.displayName,
        username: (name || "demo-user").toLowerCase().replace(/\s+/g, "-"),
      },
      isDemo: true,
      provider: "demo",
    };
    saveStoredSession(newSession);
    return newSession;
  };

  const signOut = () => {
    saveStoredSession(null);
    router.push("/");
  };

  return {
    session,
    user: session?.user || null,
    isDemo: session?.isDemo ?? true,
    isConfigured: isSupabaseConfigured(),
    isLoading: false,
    signInDemo,
    signOut,
  };
}
