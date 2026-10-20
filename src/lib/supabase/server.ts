import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Database } from "./database.types";

/**
 * Returns a server-side Supabase client for Server Components, Route Handlers,
 * or migration scripts.
 * 
 * Uses SUPABASE_SERVICE_ROLE_KEY if present for administrative tasks,
 * or NEXT_PUBLIC_SUPABASE_ANON_KEY for standard server queries.
 * 
 * Returns null if Supabase environment variables are missing.
 */
export function getSupabaseServerClient(): SupabaseClient<Database> | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return null;
  if (url.includes("your-project.supabase.co") || key.includes("your-anon-key")) {
    return null;
  }

  return createClient<Database>(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
