export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          name: string;
          description: string;
          accent_family: string;
          activity_count: number;
          created_at: string;
        };
        Insert: {
          id: string;
          name: string;
          description: string;
          accent_family: string;
          activity_count?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          accent_family?: string;
          activity_count?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          username: string;
          display_name: string;
          bio: string | null;
          avatar_url: string | null;
          is_public: boolean;
          interests: string[];
          completed_steps_count: number;
          sessions_logged_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          display_name: string;
          bio?: string | null;
          avatar_url?: string | null;
          is_public?: boolean;
          interests?: string[];
          completed_steps_count?: number;
          sessions_logged_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          display_name?: string;
          bio?: string | null;
          avatar_url?: string | null;
          is_public?: boolean;
          interests?: string[];
          completed_steps_count?: number;
          sessions_logged_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      user_preferences: {
        Row: {
          user_id: string;
          interests: string[];
          available_time_minutes: number;
          preferred_pace: string;
          budget_comfort: string;
          solo_social_preference: string;
          energy_preference: string;
          reduce_motion: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          interests?: string[];
          available_time_minutes?: number;
          preferred_pace?: string;
          budget_comfort?: string;
          solo_social_preference?: string;
          energy_preference?: string;
          reduce_motion?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          interests?: string[];
          available_time_minutes?: number;
          preferred_pace?: string;
          budget_comfort?: string;
          solo_social_preference?: string;
          energy_preference?: string;
          reduce_motion?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      hobbies: {
        Row: {
          id: string;
          slug: string;
          title: string;
          category_id: string;
          category_name: string;
          summary: string;
          description: string;
          first_step_prompt: string;
          time_estimate: string;
          estimated_minutes: number;
          difficulty: string;
          cost_range: string;
          location_type: string;
          social_type: string;
          energy_level: string;
          materials_needed: string[];
          skills_practiced: string[];
          ways_to_adapt: Json;
          tags: string[];
          is_featured: boolean;
          editorial_collection: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          category_id: string;
          category_name: string;
          summary: string;
          description: string;
          first_step_prompt: string;
          time_estimate: string;
          estimated_minutes: number;
          difficulty?: string;
          cost_range: string;
          location_type?: string;
          social_type?: string;
          energy_level?: string;
          materials_needed?: string[];
          skills_practiced?: string[];
          ways_to_adapt?: Json;
          tags?: string[];
          is_featured?: boolean;
          editorial_collection?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          category_id?: string;
          category_name?: string;
          summary?: string;
          description?: string;
          first_step_prompt?: string;
          time_estimate?: string;
          estimated_minutes?: number;
          difficulty?: string;
          cost_range?: string;
          location_type?: string;
          social_type?: string;
          energy_level?: string;
          materials_needed?: string[];
          skills_practiced?: string[];
          ways_to_adapt?: Json;
          tags?: string[];
          is_featured?: boolean;
          editorial_collection?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      hobby_steps: {
        Row: {
          id: string;
          hobby_id: string;
          step_order: number;
          title: string;
          estimated_minutes: number;
          description: string;
          instructions: string[];
          supplies_needed: string[] | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          hobby_id: string;
          step_order: number;
          title: string;
          estimated_minutes?: number;
          description: string;
          instructions: string[];
          supplies_needed?: string[] | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          hobby_id?: string;
          step_order?: number;
          title?: string;
          estimated_minutes?: number;
          description?: string;
          instructions?: string[];
          supplies_needed?: string[] | null;
          created_at?: string;
        };
        Relationships: [];
      };
      saved_hobbies: {
        Row: {
          id: string;
          user_id: string;
          hobby_id: string;
          hobby_slug: string;
          hobby_title: string;
          category: string;
          current_step_order: number;
          completed_step_ids: string[];
          notes: string | null;
          saved_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          hobby_id: string;
          hobby_slug: string;
          hobby_title: string;
          category: string;
          current_step_order?: number;
          completed_step_ids?: string[];
          notes?: string | null;
          saved_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          hobby_id?: string;
          hobby_slug?: string;
          hobby_title?: string;
          category?: string;
          current_step_order?: number;
          completed_step_ids?: string[];
          notes?: string | null;
          saved_at?: string;
        };
        Relationships: [];
      };
      activity_sessions: {
        Row: {
          id: string;
          user_id: string;
          hobby_id: string;
          hobby_slug: string;
          hobby_title: string;
          category: string;
          date: string;
          duration_minutes: number;
          notes: string | null;
          reflection_mood: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          hobby_id: string;
          hobby_slug: string;
          hobby_title: string;
          category: string;
          date: string;
          duration_minutes: number;
          notes?: string | null;
          reflection_mood?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          hobby_id?: string;
          hobby_slug?: string;
          hobby_title?: string;
          category?: string;
          date?: string;
          duration_minutes?: number;
          notes?: string | null;
          reflection_mood?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      planned_activities: {
        Row: {
          id: string;
          user_id: string;
          hobby_id: string;
          hobby_slug: string;
          hobby_title: string;
          category: string;
          scheduled_for: string;
          estimated_duration_minutes: number;
          note: string | null;
          reminder_preference: string;
          is_completed: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          hobby_id: string;
          hobby_slug: string;
          hobby_title: string;
          category: string;
          scheduled_for: string;
          estimated_duration_minutes?: number;
          note?: string | null;
          reminder_preference?: string;
          is_completed?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          hobby_id?: string;
          hobby_slug?: string;
          hobby_title?: string;
          category?: string;
          scheduled_for?: string;
          estimated_duration_minutes?: number;
          note?: string | null;
          reminder_preference?: string;
          is_completed?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      journal_entries: {
        Row: {
          id: string;
          user_id: string;
          title: string | null;
          content: string;
          date: string;
          mood_label: string | null;
          hobby_slug: string | null;
          hobby_title: string | null;
          is_private: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title?: string | null;
          content: string;
          date: string;
          mood_label?: string | null;
          hobby_slug?: string | null;
          hobby_title?: string | null;
          is_private?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string | null;
          content?: string;
          date?: string;
          mood_label?: string | null;
          hobby_slug?: string | null;
          hobby_title?: string | null;
          is_private?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      community_posts: {
        Row: {
          id: string;
          author_id: string;
          author_name: string;
          author_handle: string;
          author_avatar: string | null;
          hobby_slug: string | null;
          hobby_title: string | null;
          category: string;
          content: string;
          likes_count: number;
          comments_count: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          author_id: string;
          author_name: string;
          author_handle: string;
          author_avatar?: string | null;
          hobby_slug?: string | null;
          hobby_title?: string | null;
          category: string;
          content: string;
          likes_count?: number;
          comments_count?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          author_id?: string;
          author_name?: string;
          author_handle?: string;
          author_avatar?: string | null;
          hobby_slug?: string | null;
          hobby_title?: string | null;
          category?: string;
          content?: string;
          likes_count?: number;
          comments_count?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      comments: {
        Row: {
          id: string;
          post_id: string;
          author_id: string;
          author_name: string;
          author_handle: string;
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          author_id: string;
          author_name: string;
          author_handle: string;
          content: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          post_id?: string;
          author_id?: string;
          author_name?: string;
          author_handle?: string;
          content?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      post_likes: {
        Row: {
          post_id: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          post_id: string;
          user_id: string;
          created_at?: string;
        };
        Update: {
          post_id?: string;
          user_id?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      groups: {
        Row: {
          id: string;
          slug: string;
          name: string;
          description: string;
          category: string;
          member_count: number;
          guidelines: string[];
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          description: string;
          category: string;
          member_count?: number;
          guidelines?: string[];
          created_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          description?: string;
          category?: string;
          member_count?: number;
          guidelines?: string[];
          created_at?: string;
        };
        Relationships: [];
      };
      group_members: {
        Row: {
          group_id: string;
          user_id: string;
          joined_at: string;
        };
        Insert: {
          group_id: string;
          user_id: string;
          joined_at?: string;
        };
        Update: {
          group_id?: string;
          user_id?: string;
          joined_at?: string;
        };
        Relationships: [];
      };
      events: {
        Row: {
          id: string;
          slug: string;
          title: string;
          description: string;
          category: string;
          scheduled_date: string;
          time_label: string;
          format: string;
          participants_count: number;
          participation_prompt: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          description: string;
          category: string;
          scheduled_date: string;
          time_label: string;
          format?: string;
          participants_count?: number;
          participation_prompt: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          description?: string;
          category?: string;
          scheduled_date?: string;
          time_label?: string;
          format?: string;
          participants_count?: number;
          participation_prompt?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      event_rsvps: {
        Row: {
          event_id: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          event_id: string;
          user_id: string;
          created_at?: string;
        };
        Update: {
          event_id?: string;
          user_id?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      challenges: {
        Row: {
          id: string;
          slug: string;
          title: string;
          description: string;
          category: string;
          duration_days: number;
          target_sessions_count: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          description: string;
          category: string;
          duration_days: number;
          target_sessions_count: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          description?: string;
          category?: string;
          duration_days?: number;
          target_sessions_count?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      user_challenges: {
        Row: {
          user_id: string;
          challenge_id: string;
          current_sessions_count: number;
          is_joined: boolean;
          is_completed: boolean;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          challenge_id: string;
          current_sessions_count?: number;
          is_joined?: boolean;
          is_completed?: boolean;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          challenge_id?: string;
          current_sessions_count?: number;
          is_joined?: boolean;
          is_completed?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          message: string;
          type: string;
          is_read: boolean;
          href: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          message: string;
          type?: string;
          is_read?: boolean;
          href?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          message?: string;
          type?: string;
          is_read?: boolean;
          href?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      reports: {
        Row: {
          id: string;
          reporter_id: string | null;
          content_id: string;
          content_type: string;
          reason: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          reporter_id?: string | null;
          content_id: string;
          content_type: string;
          reason: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          reporter_id?: string | null;
          content_id?: string;
          content_type?: string;
          reason?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      muted_users: {
        Row: {
          user_id: string;
          muted_handle: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          muted_handle: string;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          muted_handle?: string;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
