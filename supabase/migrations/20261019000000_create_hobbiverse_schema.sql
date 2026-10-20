-- ============================================================================
-- HOBBIVERSE: CORE RELATIONAL SCHEMA MIGRATION
-- Migration: 20261019000000_create_hobbiverse_schema.sql
-- Description: Creates all domain tables, constraints, foreign keys, and indexes.
-- ============================================================================

-- 1. Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Categories
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  accent_family TEXT NOT NULL,
  activity_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Profiles (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  is_public BOOLEAN DEFAULT true,
  interests TEXT[] DEFAULT '{}',
  completed_steps_count INT DEFAULT 0,
  sessions_logged_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. User Preferences
CREATE TABLE IF NOT EXISTS public.user_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  interests TEXT[] DEFAULT '{}',
  available_time_minutes INT DEFAULT 20,
  preferred_pace TEXT DEFAULT 'gentle',
  budget_comfort TEXT DEFAULT 'minimal',
  solo_social_preference TEXT DEFAULT 'both',
  energy_preference TEXT DEFAULT 'calm',
  reduce_motion BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Hobbies
CREATE TABLE IF NOT EXISTS public.hobbies (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category_id TEXT NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
  category_name TEXT NOT NULL,
  summary TEXT NOT NULL,
  description TEXT NOT NULL,
  first_step_prompt TEXT NOT NULL,
  time_estimate TEXT NOT NULL,
  estimated_minutes INT NOT NULL,
  difficulty TEXT DEFAULT 'beginner',
  cost_range TEXT NOT NULL,
  location_type TEXT DEFAULT 'flexible',
  social_type TEXT DEFAULT 'both',
  energy_level TEXT DEFAULT 'calm',
  materials_needed TEXT[] DEFAULT '{}',
  skills_practiced TEXT[] DEFAULT '{}',
  ways_to_adapt JSONB DEFAULT '{"solo": "", "social": ""}'::jsonb,
  tags TEXT[] DEFAULT '{}',
  is_featured BOOLEAN DEFAULT false,
  editorial_collection TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Hobby Learning Steps
CREATE TABLE IF NOT EXISTS public.hobby_steps (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  hobby_id TEXT NOT NULL REFERENCES public.hobbies(id) ON DELETE CASCADE,
  step_order INT NOT NULL,
  title TEXT NOT NULL,
  estimated_minutes INT DEFAULT 15,
  description TEXT NOT NULL,
  instructions TEXT[] NOT NULL,
  supplies_needed TEXT[],
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(hobby_id, step_order)
);

-- 7. Saved Hobbies (User Bookshelf)
CREATE TABLE IF NOT EXISTS public.saved_hobbies (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  hobby_id TEXT NOT NULL REFERENCES public.hobbies(id) ON DELETE CASCADE,
  hobby_slug TEXT NOT NULL,
  hobby_title TEXT NOT NULL,
  category TEXT NOT NULL,
  current_step_order INT DEFAULT 1,
  completed_step_ids TEXT[] DEFAULT '{}',
  notes TEXT,
  saved_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, hobby_id)
);

-- 8. Activity Sessions (Logged Participation)
CREATE TABLE IF NOT EXISTS public.activity_sessions (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  hobby_id TEXT NOT NULL,
  hobby_slug TEXT NOT NULL,
  hobby_title TEXT NOT NULL,
  category TEXT NOT NULL,
  date DATE NOT NULL,
  duration_minutes INT NOT NULL,
  notes TEXT,
  reflection_mood TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 9. Planned Activities (Intentional Routine)
CREATE TABLE IF NOT EXISTS public.planned_activities (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  hobby_id TEXT NOT NULL,
  hobby_slug TEXT NOT NULL,
  hobby_title TEXT NOT NULL,
  category TEXT NOT NULL,
  scheduled_for TIMESTAMPTZ NOT NULL,
  estimated_duration_minutes INT DEFAULT 15,
  note TEXT,
  reminder_preference TEXT DEFAULT 'none',
  is_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 10. Private Journal Entries (Confidential Client Isolation)
CREATE TABLE IF NOT EXISTS public.journal_entries (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT,
  content TEXT NOT NULL,
  date DATE NOT NULL,
  mood_label TEXT,
  hobby_slug TEXT,
  hobby_title TEXT,
  is_private BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 11. Community Discussion Posts
CREATE TABLE IF NOT EXISTS public.community_posts (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_handle TEXT NOT NULL,
  author_avatar TEXT,
  hobby_slug TEXT,
  hobby_title TEXT,
  category TEXT NOT NULL,
  content TEXT NOT NULL,
  likes_count INT DEFAULT 0,
  comments_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 12. Discussion Comments
CREATE TABLE IF NOT EXISTS public.comments (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  post_id TEXT NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_handle TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 13. Post Likes (Toggle Tracking)
CREATE TABLE IF NOT EXISTS public.post_likes (
  post_id TEXT NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY(post_id, user_id)
);

-- 14. Kindred Circles / Groups
CREATE TABLE IF NOT EXISTS public.groups (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  member_count INT DEFAULT 0,
  guidelines TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 15. Group Memberships
CREATE TABLE IF NOT EXISTS public.group_members (
  group_id TEXT NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY(group_id, user_id)
);

-- 16. Atelier Events & Gatherings
CREATE TABLE IF NOT EXISTS public.events (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  scheduled_date TEXT NOT NULL,
  time_label TEXT NOT NULL,
  format TEXT DEFAULT 'online',
  participants_count INT DEFAULT 0,
  participation_prompt TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 17. Event RSVPs
CREATE TABLE IF NOT EXISTS public.event_rsvps (
  event_id TEXT NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY(event_id, user_id)
);

-- 18. Gentle Anti-Streak Challenges
CREATE TABLE IF NOT EXISTS public.challenges (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  duration_days INT NOT NULL,
  target_sessions_count INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 19. User Challenge Enrollment & Progress
CREATE TABLE IF NOT EXISTS public.user_challenges (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  challenge_id TEXT NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  current_sessions_count INT DEFAULT 0,
  is_joined BOOLEAN DEFAULT false,
  is_completed BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY(user_id, challenge_id)
);

-- 20. Member Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'welcome',
  is_read BOOLEAN DEFAULT false,
  href TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 21. Content Moderation Reports
CREATE TABLE IF NOT EXISTS public.reports (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  reporter_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  content_id TEXT NOT NULL,
  content_type TEXT NOT NULL,
  reason TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 22. Muted Community Handles
CREATE TABLE IF NOT EXISTS public.muted_users (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  muted_handle TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY(user_id, muted_handle)
);

-- 23. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_hobbies_category ON public.hobbies(category_id);
CREATE INDEX IF NOT EXISTS idx_hobbies_slug ON public.hobbies(slug);
CREATE INDEX IF NOT EXISTS idx_hobby_steps_hobby_id ON public.hobby_steps(hobby_id);
CREATE INDEX IF NOT EXISTS idx_saved_hobbies_user ON public.saved_hobbies(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_sessions_user ON public.activity_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_planned_activities_user ON public.planned_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_journal_entries_user ON public.journal_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_created ON public.community_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON public.comments(post_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON public.notifications(user_id) WHERE is_read = false;
