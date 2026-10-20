import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Database } from "./database.types";

let browserClient: SupabaseClient<Database> | null = null;

/**
 * Checks whether valid Supabase credentials have been configured in environment variables.
 * Returns false if credentials are missing or default placeholder templates.
 */
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) return false;
  if (url.includes("your-project.supabase.co") || anonKey.includes("your-anon-key")) {
    return false;
  }
  return true;
}

/**
 * Returns a cached singleton instance of the browser Supabase client.
 * Returns null if Supabase credentials are not configured, signaling
 * the application to use the LocalDemoRepository fallback gracefully.
 */
export function getSupabaseBrowserClient(): SupabaseClient<Database> | null {
  if (!isSupabaseConfigured()) {
    return null;
  }

  if (!browserClient) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    browserClient = createClient<Database>(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }

  return browserClient;
}
