-- ============================================================================
-- HOBBIVERSE: ROW LEVEL SECURITY (RLS) POLICIES
-- Migration: 20261019000001_row_level_security.sql
-- Description: Enforces strict data ownership, non-diagnostic privacy isolation
-- for journal reflections, and public read-access for open atelier catalogues.
-- ============================================================================

-- 1. Enable RLS on all tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hobbies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hobby_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_hobbies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.planned_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.muted_users ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- 2. PUBLIC CATALOGUES (Read-only for all, write restricted to service-role/admin)
-- ----------------------------------------------------------------------------

-- Categories: Public read
CREATE POLICY "Categories are readable by everyone"
  ON public.categories FOR SELECT
  USING (true);

-- Hobbies: Public read
CREATE POLICY "Hobbies are readable by everyone"
  ON public.hobbies FOR SELECT
  USING (true);

-- Hobby Steps: Public read
CREATE POLICY "Hobby steps are readable by everyone"
  ON public.hobby_steps FOR SELECT
  USING (true);

-- Groups: Public read
CREATE POLICY "Groups are readable by everyone"
  ON public.groups FOR SELECT
  USING (true);

-- Events: Public read
CREATE POLICY "Events are readable by everyone"
  ON public.events FOR SELECT
  USING (true);

-- Challenges: Public read
CREATE POLICY "Challenges are readable by everyone"
  ON public.challenges FOR SELECT
  USING (true);

-- ----------------------------------------------------------------------------
-- 3. PROFILES & PREFERENCES
-- ----------------------------------------------------------------------------

-- Profiles: Public can view public profiles; user can always view own profile
CREATE POLICY "Public profiles are readable by everyone"
  ON public.profiles FOR SELECT
  USING (is_public = true OR auth.uid() = id);

CREATE POLICY "Users can create their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Preferences: Strictly private to user
CREATE POLICY "Users have full access to their own preferences"
  ON public.user_preferences FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- 4. PRIVATE REFLECTIONS (MANDATORY CONFIDENTIAL ISOLATION)
-- ----------------------------------------------------------------------------
-- Core ethical constraint: Private journal reflections are strictly personal.
-- There is NO public access, NO group sharing, and NO community visibility.

CREATE POLICY "Users have exclusive access to their own private reflections"
  ON public.journal_entries FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- 5. USER ROUTINES & PROGRESSION
-- ----------------------------------------------------------------------------

-- Saved Hobbies (Bookshelf)
CREATE POLICY "Users have full access to their saved bookshelf"
  ON public.saved_hobbies FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Activity Sessions
CREATE POLICY "Users have full access to their own activity sessions"
  ON public.activity_sessions FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Planned Activities
CREATE POLICY "Users have full access to their scheduled plans"
  ON public.planned_activities FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Challenge Participation
CREATE POLICY "Users have full access to their own challenge progress"
  ON public.user_challenges FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Notifications
CREATE POLICY "Users can only read and manage their own notifications"
  ON public.notifications FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Muted Users
CREATE POLICY "Users can view and update their own mute list"
  ON public.muted_users FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- 6. COMMUNITY & INTERACTIONS
-- ----------------------------------------------------------------------------

-- Community Posts
CREATE POLICY "Community posts are viewable by everyone"
  ON public.community_posts FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create community posts"
  ON public.community_posts FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update their own posts"
  ON public.community_posts FOR UPDATE
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can delete their own posts"
  ON public.community_posts FOR DELETE
  USING (auth.uid() = author_id);

-- Comments
CREATE POLICY "Comments are viewable by everyone"
  ON public.comments FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can post comments"
  ON public.comments FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update or delete their comments"
  ON public.comments FOR UPDATE
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can delete their comments"
  ON public.comments FOR DELETE
  USING (auth.uid() = author_id);

-- Likes
CREATE POLICY "Post likes are viewable by everyone"
  ON public.post_likes FOR SELECT
  USING (true);

CREATE POLICY "Users can manage their own likes"
  ON public.post_likes FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Group Members
CREATE POLICY "Group memberships are viewable by everyone"
  ON public.group_members FOR SELECT
  USING (true);

CREATE POLICY "Users can manage their own group memberships"
  ON public.group_members FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Event RSVPs
CREATE POLICY "Event RSVPs are viewable by everyone"
  ON public.event_rsvps FOR SELECT
  USING (true);

CREATE POLICY "Users can manage their own RSVPs"
  ON public.event_rsvps FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Moderation Reports
CREATE POLICY "Authenticated users can submit moderation reports"
  ON public.reports FOR INSERT
  WITH CHECK (auth.uid() = reporter_id OR reporter_id IS NULL);

CREATE POLICY "Reporters can view their own filed reports"
  ON public.reports FOR SELECT
  USING (auth.uid() = reporter_id);
