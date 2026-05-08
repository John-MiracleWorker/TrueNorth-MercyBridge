export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      admin_audit_log: {
        Row: {
          action: string
          created_at: string
          details: string | null
          id: string
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          details?: string | null
          id?: string
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          details?: string | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_bible_studies: {
        Row: {
          content: string
          created_at: string | null
          current_day: number | null
          id: string
          personalization_context: Json | null
          reflection_questions: string[] | null
          scripture_reference: string
          scripture_text: string
          study_type: string | null
          title: string
          total_days: number | null
          user_id: string | null
          user_notes: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          current_day?: number | null
          id?: string
          personalization_context?: Json | null
          reflection_questions?: string[] | null
          scripture_reference: string
          scripture_text: string
          study_type?: string | null
          title: string
          total_days?: number | null
          user_id?: string | null
          user_notes?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          current_day?: number | null
          id?: string
          personalization_context?: Json | null
          reflection_questions?: string[] | null
          scripture_reference?: string
          scripture_text?: string
          study_type?: string | null
          title?: string
          total_days?: number | null
          user_id?: string | null
          user_notes?: string | null
        }
        Relationships: []
      }
      ai_bible_study_days: {
        Row: {
          content: string
          created_at: string | null
          day_number: number
          id: string
          is_generated: boolean | null
          reflection_questions: string[] | null
          scripture_reference: string
          scripture_text: string
          study_id: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          day_number: number
          id?: string
          is_generated?: boolean | null
          reflection_questions?: string[] | null
          scripture_reference: string
          scripture_text: string
          study_id?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          day_number?: number
          id?: string
          is_generated?: boolean | null
          reflection_questions?: string[] | null
          scripture_reference?: string
          scripture_text?: string
          study_id?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_bible_study_days_study_id_fkey"
            columns: ["study_id"]
            isOneToOne: false
            referencedRelation: "ai_bible_studies"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_devotional_interactions: {
        Row: {
          ai_feedback: string | null
          created_at: string | null
          devotional_id: string | null
          id: string
          interaction_type: string
          prompt: string
          user_id: string | null
          user_response: string | null
        }
        Insert: {
          ai_feedback?: string | null
          created_at?: string | null
          devotional_id?: string | null
          id?: string
          interaction_type: string
          prompt: string
          user_id?: string | null
          user_response?: string | null
        }
        Update: {
          ai_feedback?: string | null
          created_at?: string | null
          devotional_id?: string | null
          id?: string
          interaction_type?: string
          prompt?: string
          user_id?: string | null
          user_response?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_devotional_interactions_devotional_id_fkey"
            columns: ["devotional_id"]
            isOneToOne: false
            referencedRelation: "ai_devotionals"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_devotionals: {
        Row: {
          content: string
          created_at: string | null
          id: string
          personalization_context: Json | null
          reflection_questions: string[] | null
          scripture_reference: string
          scripture_text: string
          title: string
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          personalization_context?: Json | null
          reflection_questions?: string[] | null
          scripture_reference: string
          scripture_text: string
          title: string
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          personalization_context?: Json | null
          reflection_questions?: string[] | null
          scripture_reference?: string
          scripture_text?: string
          title?: string
          user_id?: string | null
        }
        Relationships: []
      }
      ai_podcast_episodes: {
        Row: {
          artwork_url: string | null
          bible_reference: string
          created_at: string | null
          custom_voice_prompt: string | null
          description: string | null
          duration_minutes: number | null
          full_audio_mime_type: string | null
          full_audio_url: string | null
          id: string
          multi_speaker: boolean | null
          speaker_voices: Json | null
          status: string | null
          style: string | null
          title: string
          translation: string | null
          updated_at: string | null
          user_id: string
          voice: string | null
          voice_style: string | null
        }
        Insert: {
          artwork_url?: string | null
          bible_reference: string
          created_at?: string | null
          custom_voice_prompt?: string | null
          description?: string | null
          duration_minutes?: number | null
          full_audio_mime_type?: string | null
          full_audio_url?: string | null
          id?: string
          multi_speaker?: boolean | null
          speaker_voices?: Json | null
          status?: string | null
          style?: string | null
          title: string
          translation?: string | null
          updated_at?: string | null
          user_id: string
          voice?: string | null
          voice_style?: string | null
        }
        Update: {
          artwork_url?: string | null
          bible_reference?: string
          created_at?: string | null
          custom_voice_prompt?: string | null
          description?: string | null
          duration_minutes?: number | null
          full_audio_mime_type?: string | null
          full_audio_url?: string | null
          id?: string
          multi_speaker?: boolean | null
          speaker_voices?: Json | null
          status?: string | null
          style?: string | null
          title?: string
          translation?: string | null
          updated_at?: string | null
          user_id?: string
          voice?: string | null
          voice_style?: string | null
        }
        Relationships: []
      }
      ai_podcast_segments: {
        Row: {
          approx_duration_seconds: number | null
          audio_mime_type: string | null
          audio_url: string | null
          created_at: string | null
          episode_id: string | null
          id: string
          segment_order: number
          speaker: string | null
          text: string
          title: string
        }
        Insert: {
          approx_duration_seconds?: number | null
          audio_mime_type?: string | null
          audio_url?: string | null
          created_at?: string | null
          episode_id?: string | null
          id?: string
          segment_order: number
          speaker?: string | null
          text: string
          title: string
        }
        Update: {
          approx_duration_seconds?: number | null
          audio_mime_type?: string | null
          audio_url?: string | null
          created_at?: string | null
          episode_id?: string | null
          id?: string
          segment_order?: number
          speaker?: string | null
          text?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_podcast_segments_episode_id_fkey"
            columns: ["episode_id"]
            isOneToOne: false
            referencedRelation: "ai_podcast_episodes"
            referencedColumns: ["id"]
          },
        ]
      }
      app_config: {
        Row: {
          created_at: string
          key: string
          updated_at: string
          value: string
        }
        Insert: {
          created_at?: string
          key: string
          updated_at?: string
          value: string
        }
        Update: {
          created_at?: string
          key?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      bible_book_analysis: {
        Row: {
          ai_context: Json | null
          authorship: string | null
          book_name: string
          created_at: string | null
          historical_context: string | null
          id: string
          key_verses: string[] | null
          literary_genre: string | null
          major_themes: string[] | null
          outline: string | null
          overview: string
          updated_at: string | null
        }
        Insert: {
          ai_context?: Json | null
          authorship?: string | null
          book_name: string
          created_at?: string | null
          historical_context?: string | null
          id?: string
          key_verses?: string[] | null
          literary_genre?: string | null
          major_themes?: string[] | null
          outline?: string | null
          overview: string
          updated_at?: string | null
        }
        Update: {
          ai_context?: Json | null
          authorship?: string | null
          book_name?: string
          created_at?: string | null
          historical_context?: string | null
          id?: string
          key_verses?: string[] | null
          literary_genre?: string | null
          major_themes?: string[] | null
          outline?: string | null
          overview?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      bible_chapter_analysis: {
        Row: {
          ai_context: Json | null
          book_name: string
          chapter_number: number
          character_studies: string | null
          connections_to_other_chapters: string | null
          created_at: string | null
          id: string
          key_points: string[] | null
          main_teaching: string | null
          practical_application: string | null
          structure: string | null
          summary: string
          updated_at: string | null
        }
        Insert: {
          ai_context?: Json | null
          book_name: string
          chapter_number: number
          character_studies?: string | null
          connections_to_other_chapters?: string | null
          created_at?: string | null
          id?: string
          key_points?: string[] | null
          main_teaching?: string | null
          practical_application?: string | null
          structure?: string | null
          summary: string
          updated_at?: string | null
        }
        Update: {
          ai_context?: Json | null
          book_name?: string
          chapter_number?: number
          character_studies?: string | null
          connections_to_other_chapters?: string | null
          created_at?: string | null
          id?: string
          key_points?: string[] | null
          main_teaching?: string | null
          practical_application?: string | null
          structure?: string | null
          summary?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      bible_cross_references: {
        Row: {
          connection_type: string
          created_at: string | null
          description: string | null
          id: string
          source_book: string
          source_chapter: number | null
          source_verse: number | null
          target_book: string
          target_chapter: number | null
          target_verse: number | null
        }
        Insert: {
          connection_type: string
          created_at?: string | null
          description?: string | null
          id?: string
          source_book: string
          source_chapter?: number | null
          source_verse?: number | null
          target_book: string
          target_chapter?: number | null
          target_verse?: number | null
        }
        Update: {
          connection_type?: string
          created_at?: string | null
          description?: string | null
          id?: string
          source_book?: string
          source_chapter?: number | null
          source_verse?: number | null
          target_book?: string
          target_chapter?: number | null
          target_verse?: number | null
        }
        Relationships: []
      }
      bible_discussion_messages: {
        Row: {
          created_at: string
          hidden_reason: string | null
          id: string
          is_hidden: boolean
          message: string
          thread_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          hidden_reason?: string | null
          id?: string
          is_hidden?: boolean
          message: string
          thread_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          hidden_reason?: string | null
          id?: string
          is_hidden?: boolean
          message?: string
          thread_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      bible_discussion_threads: {
        Row: {
          book_name: string
          chapter_number: number | null
          created_at: string
          created_by: string
          description: string | null
          hidden_reason: string | null
          id: string
          is_hidden: boolean
          is_pinned: boolean | null
          tags: string[] | null
          title: string
          updated_at: string
          verse_number: number | null
        }
        Insert: {
          book_name: string
          chapter_number?: number | null
          created_at?: string
          created_by: string
          description?: string | null
          hidden_reason?: string | null
          id?: string
          is_hidden?: boolean
          is_pinned?: boolean | null
          tags?: string[] | null
          title: string
          updated_at?: string
          verse_number?: number | null
        }
        Update: {
          book_name?: string
          chapter_number?: number | null
          created_at?: string
          created_by?: string
          description?: string | null
          hidden_reason?: string | null
          id?: string
          is_hidden?: boolean
          is_pinned?: boolean | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          verse_number?: number | null
        }
        Relationships: []
      }
      bible_reading_plans: {
        Row: {
          created_at: string | null
          description: string
          duration_days: number
          id: string
          is_active: boolean | null
          is_premium: boolean | null
          theme: string | null
          title: string
        }
        Insert: {
          created_at?: string | null
          description: string
          duration_days: number
          id?: string
          is_active?: boolean | null
          is_premium?: boolean | null
          theme?: string | null
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string
          duration_days?: number
          id?: string
          is_active?: boolean | null
          is_premium?: boolean | null
          theme?: string | null
          title?: string
        }
        Relationships: []
      }
      bible_study_interactions: {
        Row: {
          ai_feedback: string | null
          created_at: string | null
          day_number: number | null
          id: string
          interaction_type: string
          prompt: string
          question_index: number | null
          study_id: string | null
          user_id: string | null
          user_response: string | null
        }
        Insert: {
          ai_feedback?: string | null
          created_at?: string | null
          day_number?: number | null
          id?: string
          interaction_type: string
          prompt: string
          question_index?: number | null
          study_id?: string | null
          user_id?: string | null
          user_response?: string | null
        }
        Update: {
          ai_feedback?: string | null
          created_at?: string | null
          day_number?: number | null
          id?: string
          interaction_type?: string
          prompt?: string
          question_index?: number | null
          study_id?: string | null
          user_id?: string | null
          user_response?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bible_study_interactions_study_id_fkey"
            columns: ["study_id"]
            isOneToOne: false
            referencedRelation: "ai_bible_studies"
            referencedColumns: ["id"]
          },
        ]
      }
      bible_study_notes: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_favorite: boolean | null
          scripture_reference: string
          tags: string[] | null
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_favorite?: boolean | null
          scripture_reference: string
          tags?: string[] | null
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_favorite?: boolean | null
          scripture_reference?: string
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author_id: string
          content: string
          created_at: string
          excerpt: string | null
          featured_image_url: string | null
          id: string
          meta_description: string | null
          publish_date: string | null
          published: boolean
          slug: string
          tags: string[] | null
          title: string
          updated_at: string
          view_count: number | null
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          meta_description?: string | null
          publish_date?: string | null
          published?: boolean
          slug: string
          tags?: string[] | null
          title: string
          updated_at?: string
          view_count?: number | null
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          meta_description?: string | null
          publish_date?: string | null
          published?: boolean
          slug?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
          view_count?: number | null
        }
        Relationships: []
      }
      challenge_participants: {
        Row: {
          challenge_id: string
          completed: boolean | null
          completed_at: string | null
          current_progress: number | null
          id: string
          joined_at: string | null
          user_id: string
        }
        Insert: {
          challenge_id: string
          completed?: boolean | null
          completed_at?: string | null
          current_progress?: number | null
          id?: string
          joined_at?: string | null
          user_id: string
        }
        Update: {
          challenge_id?: string
          completed?: boolean | null
          completed_at?: string | null
          current_progress?: number | null
          id?: string
          joined_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "challenge_participants_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "community_challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          role: string
          thread_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          role: string
          thread_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          role?: string
          thread_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "chat_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_threads: {
        Row: {
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      community_announcements: {
        Row: {
          community_id: string
          content: string
          created_at: string | null
          created_by: string
          hidden_reason: string | null
          id: string
          is_hidden: boolean
          title: string
          updated_at: string | null
        }
        Insert: {
          community_id: string
          content: string
          created_at?: string | null
          created_by: string
          hidden_reason?: string | null
          id?: string
          is_hidden?: boolean
          title: string
          updated_at?: string | null
        }
        Update: {
          community_id?: string
          content?: string
          created_at?: string | null
          created_by?: string
          hidden_reason?: string | null
          id?: string
          is_hidden?: boolean
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_announcements_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "faith_communities"
            referencedColumns: ["id"]
          },
        ]
      }
      community_challenges: {
        Row: {
          challenge_type: string | null
          community_id: string
          created_at: string | null
          created_by: string
          description: string | null
          end_date: string | null
          hidden_reason: string | null
          id: string
          is_hidden: boolean
          name: string
          start_date: string | null
          target_value: number | null
          updated_at: string | null
        }
        Insert: {
          challenge_type?: string | null
          community_id: string
          created_at?: string | null
          created_by: string
          description?: string | null
          end_date?: string | null
          hidden_reason?: string | null
          id?: string
          is_hidden?: boolean
          name: string
          start_date?: string | null
          target_value?: number | null
          updated_at?: string | null
        }
        Update: {
          challenge_type?: string | null
          community_id?: string
          created_at?: string | null
          created_by?: string
          description?: string | null
          end_date?: string | null
          hidden_reason?: string | null
          id?: string
          is_hidden?: boolean
          name?: string
          start_date?: string | null
          target_value?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_challenges_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "faith_communities"
            referencedColumns: ["id"]
          },
        ]
      }
      community_discussion_messages: {
        Row: {
          created_at: string
          hidden_reason: string | null
          id: string
          is_edited: boolean | null
          is_hidden: boolean
          message: string
          reply_to_id: string | null
          thread_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          hidden_reason?: string | null
          id?: string
          is_edited?: boolean | null
          is_hidden?: boolean
          message: string
          reply_to_id?: string | null
          thread_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          hidden_reason?: string | null
          id?: string
          is_edited?: boolean | null
          is_hidden?: boolean
          message?: string
          reply_to_id?: string | null
          thread_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_discussion_messages_reply_to_id_fkey"
            columns: ["reply_to_id"]
            isOneToOne: false
            referencedRelation: "community_discussion_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_discussion_messages_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "community_discussion_threads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_discussion_messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      community_discussion_threads: {
        Row: {
          community_id: string | null
          created_at: string
          created_by: string | null
          hidden_reason: string | null
          id: string
          is_hidden: boolean
          title: string
        }
        Insert: {
          community_id?: string | null
          created_at?: string
          created_by?: string | null
          hidden_reason?: string | null
          id?: string
          is_hidden?: boolean
          title: string
        }
        Update: {
          community_id?: string | null
          created_at?: string
          created_by?: string | null
          hidden_reason?: string | null
          id?: string
          is_hidden?: boolean
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_discussion_threads_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "faith_communities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_discussion_threads_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      community_invites: {
        Row: {
          community_id: string
          created_at: string
          id: string
          invited_user_id: string
          inviter_user_id: string
          responded_at: string | null
          status: string
        }
        Insert: {
          community_id: string
          created_at?: string
          id?: string
          invited_user_id: string
          inviter_user_id: string
          responded_at?: string | null
          status?: string
        }
        Update: {
          community_id?: string
          created_at?: string
          id?: string
          invited_user_id?: string
          inviter_user_id?: string
          responded_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_invites_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "faith_communities"
            referencedColumns: ["id"]
          },
        ]
      }
      community_members: {
        Row: {
          community_id: string
          id: string
          joined_at: string | null
          role: string | null
          user_id: string
        }
        Insert: {
          community_id: string
          id?: string
          joined_at?: string | null
          role?: string | null
          user_id: string
        }
        Update: {
          community_id?: string
          id?: string
          joined_at?: string | null
          role?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_members_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "faith_communities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_community_members_profile"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      community_messages: {
        Row: {
          community_id: string
          content: string
          created_at: string | null
          hidden_reason: string | null
          id: string
          is_hidden: boolean
          user_id: string
        }
        Insert: {
          community_id: string
          content: string
          created_at?: string | null
          hidden_reason?: string | null
          id?: string
          is_hidden?: boolean
          user_id: string
        }
        Update: {
          community_id?: string
          content?: string
          created_at?: string | null
          hidden_reason?: string | null
          id?: string
          is_hidden?: boolean
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_messages_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "faith_communities"
            referencedColumns: ["id"]
          },
        ]
      }
      community_moderation_flags: {
        Row: {
          action_notes: string | null
          action_type: string | null
          appeal_id: string | null
          categories: string[]
          community_id: string | null
          confidence: number | null
          content_id: string
          content_text: string
          content_type: string
          flagged_at: string
          id: string
          metadata: Json
          model: string | null
          rationale: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          severity: number | null
          status: string
          thread_id: string | null
          user_display_name: string | null
          user_id: string | null
        }
        Insert: {
          action_notes?: string | null
          action_type?: string | null
          appeal_id?: string | null
          categories?: string[]
          community_id?: string | null
          confidence?: number | null
          content_id: string
          content_text: string
          content_type: string
          flagged_at?: string
          id?: string
          metadata?: Json
          model?: string | null
          rationale?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          severity?: number | null
          status?: string
          thread_id?: string | null
          user_display_name?: string | null
          user_id?: string | null
        }
        Update: {
          action_notes?: string | null
          action_type?: string | null
          appeal_id?: string | null
          categories?: string[]
          community_id?: string | null
          confidence?: number | null
          content_id?: string
          content_text?: string
          content_type?: string
          flagged_at?: string
          id?: string
          metadata?: Json
          model?: string | null
          rationale?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          severity?: number | null
          status?: string
          thread_id?: string | null
          user_display_name?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_moderation_flags_appeal_id_fkey"
            columns: ["appeal_id"]
            isOneToOne: false
            referencedRelation: "moderation_appeals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_moderation_flags_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "faith_communities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_moderation_flags_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "community_discussion_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      community_moderation_queue: {
        Row: {
          attempts: number
          community_id: string | null
          content_id: string
          content_type: string
          created_at: string
          flag_id: string | null
          id: string
          last_error: string | null
          processed_at: string | null
          status: string
          thread_id: string | null
        }
        Insert: {
          attempts?: number
          community_id?: string | null
          content_id: string
          content_type: string
          created_at?: string
          flag_id?: string | null
          id?: string
          last_error?: string | null
          processed_at?: string | null
          status?: string
          thread_id?: string | null
        }
        Update: {
          attempts?: number
          community_id?: string | null
          content_id?: string
          content_type?: string
          created_at?: string
          flag_id?: string | null
          id?: string
          last_error?: string | null
          processed_at?: string | null
          status?: string
          thread_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_moderation_queue_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "faith_communities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_moderation_queue_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "community_discussion_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      community_prayer_circles: {
        Row: {
          community_id: string
          created_at: string | null
          created_by: string
          description: string | null
          hidden_reason: string | null
          id: string
          is_hidden: boolean
          is_private: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          community_id: string
          created_at?: string | null
          created_by: string
          description?: string | null
          hidden_reason?: string | null
          id?: string
          is_hidden?: boolean
          is_private?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          community_id?: string
          created_at?: string | null
          created_by?: string
          description?: string | null
          hidden_reason?: string | null
          id?: string
          is_hidden?: boolean
          is_private?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_prayer_circles_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "faith_communities"
            referencedColumns: ["id"]
          },
        ]
      }
      community_prayer_interactions: {
        Row: {
          id: string
          prayed_at: string | null
          prayer_id: string
          user_id: string
        }
        Insert: {
          id?: string
          prayed_at?: string | null
          prayer_id: string
          user_id: string
        }
        Update: {
          id?: string
          prayed_at?: string | null
          prayer_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_prayer_interactions_prayer_id_fkey"
            columns: ["prayer_id"]
            isOneToOne: false
            referencedRelation: "community_prayer_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      community_prayer_requests: {
        Row: {
          answered_date: string | null
          answered_notes: string | null
          circle_id: string | null
          community_id: string
          created_at: string | null
          description: string
          hidden_reason: string | null
          id: string
          is_anonymous: boolean | null
          is_answered: boolean | null
          is_hidden: boolean
          prayer_count: number | null
          tags: string[] | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          answered_date?: string | null
          answered_notes?: string | null
          circle_id?: string | null
          community_id: string
          created_at?: string | null
          description: string
          hidden_reason?: string | null
          id?: string
          is_anonymous?: boolean | null
          is_answered?: boolean | null
          is_hidden?: boolean
          prayer_count?: number | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          answered_date?: string | null
          answered_notes?: string | null
          circle_id?: string | null
          community_id?: string
          created_at?: string | null
          description?: string
          hidden_reason?: string | null
          id?: string
          is_anonymous?: boolean | null
          is_answered?: boolean | null
          is_hidden?: boolean
          prayer_count?: number | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_prayer_requests_circle_id_fkey"
            columns: ["circle_id"]
            isOneToOne: false
            referencedRelation: "community_prayer_circles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_prayer_requests_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "faith_communities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_community_prayer_requests_profile"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      community_reading_plans: {
        Row: {
          community_id: string
          created_at: string | null
          created_by: string
          description: string | null
          end_date: string | null
          hidden_reason: string | null
          id: string
          is_hidden: boolean
          name: string
          reading_plan_id: string | null
          start_date: string | null
          updated_at: string | null
        }
        Insert: {
          community_id: string
          created_at?: string | null
          created_by: string
          description?: string | null
          end_date?: string | null
          hidden_reason?: string | null
          id?: string
          is_hidden?: boolean
          name: string
          reading_plan_id?: string | null
          start_date?: string | null
          updated_at?: string | null
        }
        Update: {
          community_id?: string
          created_at?: string | null
          created_by?: string
          description?: string | null
          end_date?: string | null
          hidden_reason?: string | null
          id?: string
          is_hidden?: boolean
          name?: string
          reading_plan_id?: string | null
          start_date?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_reading_plans_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "faith_communities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_reading_plans_reading_plan_id_fkey"
            columns: ["reading_plan_id"]
            isOneToOne: false
            referencedRelation: "custom_reading_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      content_recommendations: {
        Row: {
          content_id: string | null
          content_type: string
          created_at: string | null
          description: string
          id: string
          is_saved: boolean | null
          is_viewed: boolean | null
          relevance_score: number | null
          title: string
          user_id: string | null
        }
        Insert: {
          content_id?: string | null
          content_type: string
          created_at?: string | null
          description: string
          id?: string
          is_saved?: boolean | null
          is_viewed?: boolean | null
          relevance_score?: number | null
          title: string
          user_id?: string | null
        }
        Update: {
          content_id?: string | null
          content_type?: string
          created_at?: string | null
          description?: string
          id?: string
          is_saved?: boolean | null
          is_viewed?: boolean | null
          relevance_score?: number | null
          title?: string
          user_id?: string | null
        }
        Relationships: []
      }
      context_snapshots: {
        Row: {
          created_at: string | null
          id: string
          snapshot_data: Json
          trigger_event: string | null
          user_id: string
          version: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          snapshot_data: Json
          trigger_event?: string | null
          user_id: string
          version?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          snapshot_data?: Json
          trigger_event?: string | null
          user_id?: string
          version?: number | null
        }
        Relationships: []
      }
      conversation_messages: {
        Row: {
          ai_observations: Json | null
          content: string
          created_at: string | null
          emotional_tone: Json | null
          follow_up_questions: Json | null
          id: string
          message_id: string
          message_order: number
          reflection_prompts: Json | null
          role: string
          session_id: string
          spiritual_themes: Json | null
          user_id: string
        }
        Insert: {
          ai_observations?: Json | null
          content: string
          created_at?: string | null
          emotional_tone?: Json | null
          follow_up_questions?: Json | null
          id?: string
          message_id: string
          message_order: number
          reflection_prompts?: Json | null
          role: string
          session_id: string
          spiritual_themes?: Json | null
          user_id: string
        }
        Update: {
          ai_observations?: Json | null
          content?: string
          created_at?: string | null
          emotional_tone?: Json | null
          follow_up_questions?: Json | null
          id?: string
          message_id?: string
          message_order?: number
          reflection_prompts?: Json | null
          role?: string
          session_id?: string
          spiritual_themes?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      conversation_patterns: {
        Row: {
          confidence_score: number | null
          created_at: string | null
          first_observed: string | null
          frequency: number | null
          id: string
          is_active: boolean | null
          last_observed: string | null
          pattern_description: string
          pattern_type: string
          session_id: string | null
          spiritual_significance: string | null
          suggested_action: string | null
          user_id: string
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string | null
          first_observed?: string | null
          frequency?: number | null
          id?: string
          is_active?: boolean | null
          last_observed?: string | null
          pattern_description: string
          pattern_type: string
          session_id?: string | null
          spiritual_significance?: string | null
          suggested_action?: string | null
          user_id: string
        }
        Update: {
          confidence_score?: number | null
          created_at?: string | null
          first_observed?: string | null
          frequency?: number | null
          id?: string
          is_active?: boolean | null
          last_observed?: string | null
          pattern_description?: string
          pattern_type?: string
          session_id?: string | null
          spiritual_significance?: string | null
          suggested_action?: string | null
          user_id?: string
        }
        Relationships: []
      }
      conversation_sessions: {
        Row: {
          analysis_data: Json | null
          auto_journal_candidate: Json | null
          created_at: string | null
          id: string
          is_active: boolean | null
          progress_metrics: Json | null
          session_data: Json
          session_id: string
          session_quality: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          analysis_data?: Json | null
          auto_journal_candidate?: Json | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          progress_metrics?: Json | null
          session_data: Json
          session_id: string
          session_quality?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          analysis_data?: Json | null
          auto_journal_candidate?: Json | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          progress_metrics?: Json | null
          session_data?: Json
          session_id?: string
          session_quality?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      conversation_threads: {
        Row: {
          ai_assumptions: Json | null
          archived: boolean | null
          created_at: string | null
          follow_up_questions: string[] | null
          id: string
          key_insights: Json | null
          last_updated: string | null
          resolved_topics: string[] | null
          thread_id: string
          topic: string | null
          user_corrections: Json | null
          user_id: string
        }
        Insert: {
          ai_assumptions?: Json | null
          archived?: boolean | null
          created_at?: string | null
          follow_up_questions?: string[] | null
          id?: string
          key_insights?: Json | null
          last_updated?: string | null
          resolved_topics?: string[] | null
          thread_id: string
          topic?: string | null
          user_corrections?: Json | null
          user_id: string
        }
        Update: {
          ai_assumptions?: Json | null
          archived?: boolean | null
          created_at?: string | null
          follow_up_questions?: string[] | null
          id?: string
          key_insights?: Json | null
          last_updated?: string | null
          resolved_topics?: string[] | null
          thread_id?: string
          topic?: string | null
          user_corrections?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      custom_daily_readings: {
        Row: {
          created_at: string | null
          cross_references: string[] | null
          cultural_background: string | null
          day_number: number
          description: string
          historical_context: string | null
          id: string
          key_themes: string[] | null
          memory_verse: string | null
          original_language_notes: string | null
          personal_challenges: string[] | null
          personalized_insight: string | null
          plan_id: string
          practical_applications: string[] | null
          prayer_prompt: string | null
          progressive_study_notes: string | null
          reflection_questions: string[] | null
          scripture_reference: string
          scripture_text: string | null
          study_depth: string | null
          theological_insights: string | null
          title: string
        }
        Insert: {
          created_at?: string | null
          cross_references?: string[] | null
          cultural_background?: string | null
          day_number: number
          description: string
          historical_context?: string | null
          id?: string
          key_themes?: string[] | null
          memory_verse?: string | null
          original_language_notes?: string | null
          personal_challenges?: string[] | null
          personalized_insight?: string | null
          plan_id: string
          practical_applications?: string[] | null
          prayer_prompt?: string | null
          progressive_study_notes?: string | null
          reflection_questions?: string[] | null
          scripture_reference: string
          scripture_text?: string | null
          study_depth?: string | null
          theological_insights?: string | null
          title: string
        }
        Update: {
          created_at?: string | null
          cross_references?: string[] | null
          cultural_background?: string | null
          day_number?: number
          description?: string
          historical_context?: string | null
          id?: string
          key_themes?: string[] | null
          memory_verse?: string | null
          original_language_notes?: string | null
          personal_challenges?: string[] | null
          personalized_insight?: string | null
          plan_id?: string
          practical_applications?: string[] | null
          prayer_prompt?: string | null
          progressive_study_notes?: string | null
          reflection_questions?: string[] | null
          scripture_reference?: string
          scripture_text?: string | null
          study_depth?: string | null
          theological_insights?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "custom_daily_readings_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "custom_reading_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      custom_reading_plans: {
        Row: {
          content_richness_level: number | null
          created_at: string | null
          description: string
          difficulty: string
          duration_days: number
          focus: string
          id: string
          is_active: boolean | null
          personalization_context: Json | null
          study_depth: string | null
          title: string
          topic: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content_richness_level?: number | null
          created_at?: string | null
          description: string
          difficulty: string
          duration_days: number
          focus: string
          id?: string
          is_active?: boolean | null
          personalization_context?: Json | null
          study_depth?: string | null
          title: string
          topic: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content_richness_level?: number | null
          created_at?: string | null
          description?: string
          difficulty?: string
          duration_days?: number
          focus?: string
          id?: string
          is_active?: boolean | null
          personalization_context?: Json | null
          study_depth?: string | null
          title?: string
          topic?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      custom_reading_resources: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          metadata: Json | null
          reading_id: string
          resource_type: string
          title: string
          url: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          reading_id: string
          resource_type: string
          title: string
          url?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          reading_id?: string
          resource_type?: string
          title?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "custom_reading_resources_reading_id_fkey"
            columns: ["reading_id"]
            isOneToOne: false
            referencedRelation: "custom_daily_readings"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_devotionals: {
        Row: {
          author: string | null
          content: string
          created_at: string | null
          id: string
          publish_date: string | null
          scripture_reference: string
          scripture_text: string
          tags: string[] | null
          title: string
        }
        Insert: {
          author?: string | null
          content: string
          created_at?: string | null
          id?: string
          publish_date?: string | null
          scripture_reference: string
          scripture_text: string
          tags?: string[] | null
          title: string
        }
        Update: {
          author?: string | null
          content?: string
          created_at?: string | null
          id?: string
          publish_date?: string | null
          scripture_reference?: string
          scripture_text?: string
          tags?: string[] | null
          title?: string
        }
        Relationships: []
      }
      emotional_progress: {
        Row: {
          created_at: string | null
          emotion: string
          id: string
          intensity: number
          message_id: string | null
          session_id: string | null
          spiritual_connection: string | null
          timestamp: string | null
          trigger_context: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          emotion: string
          id?: string
          intensity: number
          message_id?: string | null
          session_id?: string | null
          spiritual_connection?: string | null
          timestamp?: string | null
          trigger_context?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          emotion?: string
          id?: string
          intensity?: number
          message_id?: string | null
          session_id?: string | null
          spiritual_connection?: string | null
          timestamp?: string | null
          trigger_context?: string | null
          user_id?: string
        }
        Relationships: []
      }
      faith_communities: {
        Row: {
          created_at: string | null
          created_by: string
          description: string | null
          hidden_reason: string | null
          id: string
          image_url: string | null
          is_hidden: boolean
          is_private: boolean | null
          join_code: string | null
          member_limit: number | null
          metadata: Json | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          description?: string | null
          hidden_reason?: string | null
          id?: string
          image_url?: string | null
          is_hidden?: boolean
          is_private?: boolean | null
          join_code?: string | null
          member_limit?: number | null
          metadata?: Json | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          description?: string | null
          hidden_reason?: string | null
          id?: string
          image_url?: string | null
          is_hidden?: boolean
          is_private?: boolean | null
          join_code?: string | null
          member_limit?: number | null
          metadata?: Json | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      goal_milestones: {
        Row: {
          completed_at: string | null
          created_at: string | null
          description: string | null
          goal_id: string | null
          id: string
          is_completed: boolean | null
          target_date: string | null
          title: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          goal_id?: string | null
          id?: string
          is_completed?: boolean | null
          target_date?: string | null
          title: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          goal_id?: string | null
          id?: string
          is_completed?: boolean | null
          target_date?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "goal_milestones_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "spiritual_goals"
            referencedColumns: ["id"]
          },
        ]
      }
      goal_reflections: {
        Row: {
          ai_feedback: string | null
          content: string
          created_at: string | null
          goal_id: string | null
          id: string
        }
        Insert: {
          ai_feedback?: string | null
          content: string
          created_at?: string | null
          goal_id?: string | null
          id?: string
        }
        Update: {
          ai_feedback?: string | null
          content?: string
          created_at?: string | null
          goal_id?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "goal_reflections_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "spiritual_goals"
            referencedColumns: ["id"]
          },
        ]
      }
      habit_completions: {
        Row: {
          completed_at: string
          created_at: string | null
          habit_id: string
          id: string
          user_id: string
        }
        Insert: {
          completed_at?: string
          created_at?: string | null
          habit_id: string
          id?: string
          user_id: string
        }
        Update: {
          completed_at?: string
          created_at?: string | null
          habit_id?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      habit_logs: {
        Row: {
          amount: number | null
          completed_date: string | null
          created_at: string | null
          habit_id: string | null
          id: string
          notes: string | null
          user_id: string | null
        }
        Insert: {
          amount?: number | null
          completed_date?: string | null
          created_at?: string | null
          habit_id?: string | null
          id?: string
          notes?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number | null
          completed_date?: string | null
          created_at?: string | null
          habit_id?: string | null
          id?: string
          notes?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "habit_logs_habit_id_fkey"
            columns: ["habit_id"]
            isOneToOne: false
            referencedRelation: "spiritual_habits"
            referencedColumns: ["id"]
          },
        ]
      }
      journal_entries: {
        Row: {
          action_steps: Json | null
          ai_reflections: Json | null
          analysis: Json | null
          biblical_connections: Json | null
          celebration_moments: string[] | null
          content: string
          conversation_analysis: Json | null
          conversation_quality: string | null
          conversation_session_id: string | null
          conversation_summary: string | null
          conversation_transcript: Json | null
          created_at: string | null
          emotional_insights: string | null
          emotional_journey: Json | null
          entry_type: string | null
          follow_up_topics: Json | null
          gratitude_moments: Json | null
          growth_areas: Json | null
          growth_moments: string[] | null
          id: string
          key_insights: Json | null
          mood_score: number | null
          next_session_reminders: Json | null
          personal_patterns: string[] | null
          prayer_focus: string[] | null
          prayer_requests: Json | null
          prompt: string | null
          reflection_questions: string[] | null
          related_scripture: string | null
          scripture_references: string[] | null
          source_thread_id: string | null
          spiritual_health_score: number | null
          spiritual_score: number | null
          spiritual_themes: Json | null
          spiritual_trajectory: string | null
          summary: string | null
          tags: string[] | null
          title: string | null
          updated_at: string | null
          user_id: string
          wisdom_extracted: string[] | null
        }
        Insert: {
          action_steps?: Json | null
          ai_reflections?: Json | null
          analysis?: Json | null
          biblical_connections?: Json | null
          celebration_moments?: string[] | null
          content: string
          conversation_analysis?: Json | null
          conversation_quality?: string | null
          conversation_session_id?: string | null
          conversation_summary?: string | null
          conversation_transcript?: Json | null
          created_at?: string | null
          emotional_insights?: string | null
          emotional_journey?: Json | null
          entry_type?: string | null
          follow_up_topics?: Json | null
          gratitude_moments?: Json | null
          growth_areas?: Json | null
          growth_moments?: string[] | null
          id?: string
          key_insights?: Json | null
          mood_score?: number | null
          next_session_reminders?: Json | null
          personal_patterns?: string[] | null
          prayer_focus?: string[] | null
          prayer_requests?: Json | null
          prompt?: string | null
          reflection_questions?: string[] | null
          related_scripture?: string | null
          scripture_references?: string[] | null
          source_thread_id?: string | null
          spiritual_health_score?: number | null
          spiritual_score?: number | null
          spiritual_themes?: Json | null
          spiritual_trajectory?: string | null
          summary?: string | null
          tags?: string[] | null
          title?: string | null
          updated_at?: string | null
          user_id: string
          wisdom_extracted?: string[] | null
        }
        Update: {
          action_steps?: Json | null
          ai_reflections?: Json | null
          analysis?: Json | null
          biblical_connections?: Json | null
          celebration_moments?: string[] | null
          content?: string
          conversation_analysis?: Json | null
          conversation_quality?: string | null
          conversation_session_id?: string | null
          conversation_summary?: string | null
          conversation_transcript?: Json | null
          created_at?: string | null
          emotional_insights?: string | null
          emotional_journey?: Json | null
          entry_type?: string | null
          follow_up_topics?: Json | null
          gratitude_moments?: Json | null
          growth_areas?: Json | null
          growth_moments?: string[] | null
          id?: string
          key_insights?: Json | null
          mood_score?: number | null
          next_session_reminders?: Json | null
          personal_patterns?: string[] | null
          prayer_focus?: string[] | null
          prayer_requests?: Json | null
          prompt?: string | null
          reflection_questions?: string[] | null
          related_scripture?: string | null
          scripture_references?: string[] | null
          source_thread_id?: string | null
          spiritual_health_score?: number | null
          spiritual_score?: number | null
          spiritual_themes?: Json | null
          spiritual_trajectory?: string | null
          summary?: string | null
          tags?: string[] | null
          title?: string | null
          updated_at?: string | null
          user_id?: string
          wisdom_extracted?: string[] | null
        }
        Relationships: []
      }
      live_chat_messages: {
        Row: {
          id: number
          inserted_at: string
          message: string
          provider: string | null
          room_name: string | null
          stream_key: string | null
          stream_url: string | null
          user_id: string
          user_name: string
        }
        Insert: {
          id?: number
          inserted_at?: string
          message: string
          provider?: string | null
          room_name?: string | null
          stream_key?: string | null
          stream_url?: string | null
          user_id: string
          user_name: string
        }
        Update: {
          id?: number
          inserted_at?: string
          message?: string
          provider?: string | null
          room_name?: string | null
          stream_key?: string | null
          stream_url?: string | null
          user_id?: string
          user_name?: string
        }
        Relationships: []
      }
      moderation_admin_digest_queue: {
        Row: {
          categories: string[]
          content_type: string | null
          created_at: string
          flag_id: string | null
          id: string
          processed_at: string | null
          severity: number | null
        }
        Insert: {
          categories?: string[]
          content_type?: string | null
          created_at?: string
          flag_id?: string | null
          id?: string
          processed_at?: string | null
          severity?: number | null
        }
        Update: {
          categories?: string[]
          content_type?: string | null
          created_at?: string
          flag_id?: string | null
          id?: string
          processed_at?: string | null
          severity?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "moderation_admin_digest_queue_flag_id_fkey"
            columns: ["flag_id"]
            isOneToOne: true
            referencedRelation: "community_moderation_flags"
            referencedColumns: ["id"]
          },
        ]
      }
      moderation_appeals: {
        Row: {
          appeal_type: string
          created_at: string
          flag_id: string | null
          id: string
          message: string
          review_notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          subject: string
          updated_at: string
          user_id: string
        }
        Insert: {
          appeal_type: string
          created_at?: string
          flag_id?: string | null
          id?: string
          message: string
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          subject: string
          updated_at?: string
          user_id: string
        }
        Update: {
          appeal_type?: string
          created_at?: string
          flag_id?: string | null
          id?: string
          message?: string
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          subject?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "moderation_appeals_flag_id_fkey"
            columns: ["flag_id"]
            isOneToOne: false
            referencedRelation: "community_moderation_flags"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "moderation_appeals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      monitored_channels: {
        Row: {
          channel_id: string
          channel_name: string | null
          created_at: string | null
          created_by: string | null
          id: string
          is_active: boolean | null
          last_checked_at: string | null
          last_processed_at: string | null
          last_video_id: string | null
          platform: string
        }
        Insert: {
          channel_id: string
          channel_name?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          last_checked_at?: string | null
          last_processed_at?: string | null
          last_video_id?: string | null
          platform?: string
        }
        Update: {
          channel_id?: string
          channel_name?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          last_checked_at?: string | null
          last_processed_at?: string | null
          last_video_id?: string | null
          platform?: string
        }
        Relationships: []
      }
      mood_entries: {
        Row: {
          bible_reading: boolean | null
          church_attendance: boolean | null
          created_at: string | null
          entry_date: string | null
          id: string
          mood_score: number
          notes: string | null
          prayer_time: boolean | null
          spiritual_score: number
          user_id: string | null
        }
        Insert: {
          bible_reading?: boolean | null
          church_attendance?: boolean | null
          created_at?: string | null
          entry_date?: string | null
          id?: string
          mood_score: number
          notes?: string | null
          prayer_time?: boolean | null
          spiritual_score: number
          user_id?: string | null
        }
        Update: {
          bible_reading?: boolean | null
          church_attendance?: boolean | null
          created_at?: string | null
          entry_date?: string | null
          id?: string
          mood_score?: number
          notes?: string | null
          prayer_time?: boolean | null
          spiritual_score?: number
          user_id?: string | null
        }
        Relationships: []
      }
      mood_logs: {
        Row: {
          ai_response: Json | null
          created_at: string
          id: string
          mood: string
          note: string | null
          user_id: string
        }
        Insert: {
          ai_response?: Json | null
          created_at?: string
          id?: string
          mood: string
          note?: string | null
          user_id: string
        }
        Update: {
          ai_response?: Json | null
          created_at?: string
          id?: string
          mood?: string
          note?: string | null
          user_id?: string
        }
        Relationships: []
      }
      notification_schedules: {
        Row: {
          created_at: string
          days_of_week: number[]
          delivery_time: string
          description: string | null
          frequency: string
          id: string
          is_active: boolean
          last_triggered_at: string | null
          message_template: string | null
          metadata: Json
          name: string
          next_trigger_at: string | null
          notification_type: string
          timezone: string
          title_template: string | null
          updated_at: string
          use_ai_personalization: boolean
          user_id: string
        }
        Insert: {
          created_at?: string
          days_of_week?: number[]
          delivery_time?: string
          description?: string | null
          frequency?: string
          id?: string
          is_active?: boolean
          last_triggered_at?: string | null
          message_template?: string | null
          metadata?: Json
          name: string
          next_trigger_at?: string | null
          notification_type: string
          timezone?: string
          title_template?: string | null
          updated_at?: string
          use_ai_personalization?: boolean
          user_id: string
        }
        Update: {
          created_at?: string
          days_of_week?: number[]
          delivery_time?: string
          description?: string | null
          frequency?: string
          id?: string
          is_active?: boolean
          last_triggered_at?: string | null
          message_template?: string | null
          metadata?: Json
          name?: string
          next_trigger_at?: string | null
          notification_type?: string
          timezone?: string
          title_template?: string | null
          updated_at?: string
          use_ai_personalization?: boolean
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          action_link: string | null
          created_at: string | null
          data: Json | null
          delivered_at: string | null
          delivery_attempts: number | null
          delivery_error: string | null
          delivery_status: string | null
          expires_at: string | null
          id: string
          is_read: boolean | null
          message: string
          notification_type: string
          priority: string | null
          read_at: string | null
          template_key: string
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          action_link?: string | null
          created_at?: string | null
          data?: Json | null
          delivered_at?: string | null
          delivery_attempts?: number | null
          delivery_error?: string | null
          delivery_status?: string | null
          expires_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          notification_type?: string
          priority?: string | null
          read_at?: string | null
          template_key: string
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          action_link?: string | null
          created_at?: string | null
          data?: Json | null
          delivered_at?: string | null
          delivery_attempts?: number | null
          delivery_error?: string | null
          delivery_status?: string | null
          expires_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          notification_type?: string
          priority?: string | null
          read_at?: string | null
          template_key?: string
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      plan_daily_readings: {
        Row: {
          day_number: number
          description: string
          id: string
          plan_id: string | null
          prayer_journal_friendly: boolean | null
          prayer_prompt: string | null
          reflection_questions: string[] | null
          scripture_reference: string
          title: string
        }
        Insert: {
          day_number: number
          description: string
          id?: string
          plan_id?: string | null
          prayer_journal_friendly?: boolean | null
          prayer_prompt?: string | null
          reflection_questions?: string[] | null
          scripture_reference: string
          title: string
        }
        Update: {
          day_number?: number
          description?: string
          id?: string
          plan_id?: string | null
          prayer_journal_friendly?: boolean | null
          prayer_prompt?: string | null
          reflection_questions?: string[] | null
          scripture_reference?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "plan_daily_readings_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "bible_reading_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      prayer_circle_members: {
        Row: {
          circle_id: string
          id: string
          joined_at: string | null
          role: string | null
          user_id: string
        }
        Insert: {
          circle_id: string
          id?: string
          joined_at?: string | null
          role?: string | null
          user_id: string
        }
        Update: {
          circle_id?: string
          id?: string
          joined_at?: string | null
          role?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "prayer_circle_members_circle_id_fkey"
            columns: ["circle_id"]
            isOneToOne: false
            referencedRelation: "community_prayer_circles"
            referencedColumns: ["id"]
          },
        ]
      }
      prayer_interactions: {
        Row: {
          id: string
          prayed_at: string | null
          prayer_id: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          prayed_at?: string | null
          prayer_id?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          prayed_at?: string | null
          prayer_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prayer_interactions_prayer_id_fkey"
            columns: ["prayer_id"]
            isOneToOne: false
            referencedRelation: "prayer_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      prayer_requests: {
        Row: {
          answered_date: string | null
          answered_notes: string | null
          created_at: string | null
          description: string
          id: string
          is_answered: boolean | null
          prayer_count: number | null
          shared: boolean | null
          tags: string[] | null
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          answered_date?: string | null
          answered_notes?: string | null
          created_at?: string | null
          description: string
          id?: string
          is_answered?: boolean | null
          prayer_count?: number | null
          shared?: boolean | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          answered_date?: string | null
          answered_notes?: string | null
          created_at?: string | null
          description?: string
          id?: string
          is_answered?: boolean | null
          prayer_count?: number | null
          shared?: boolean | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          banned_at: string | null
          banned_by: string | null
          banned_reason: string | null
          bio: string | null
          created_at: string | null
          dev_simulate_pro: boolean | null
          display_name: string | null
          first_name: string | null
          id: string
          is_admin: boolean | null
          is_banned: boolean
          last_active: string | null
          last_name: string | null
          notification_preferences: Json | null
          profile_image_url: string | null
          timezone: string | null
          updated_at: string | null
        }
        Insert: {
          banned_at?: string | null
          banned_by?: string | null
          banned_reason?: string | null
          bio?: string | null
          created_at?: string | null
          dev_simulate_pro?: boolean | null
          display_name?: string | null
          first_name?: string | null
          id: string
          is_admin?: boolean | null
          is_banned?: boolean
          last_active?: string | null
          last_name?: string | null
          notification_preferences?: Json | null
          profile_image_url?: string | null
          timezone?: string | null
          updated_at?: string | null
        }
        Update: {
          banned_at?: string | null
          banned_by?: string | null
          banned_reason?: string | null
          bio?: string | null
          created_at?: string | null
          dev_simulate_pro?: boolean | null
          display_name?: string | null
          first_name?: string | null
          id?: string
          is_admin?: boolean | null
          is_banned?: boolean
          last_active?: string | null
          last_name?: string | null
          notification_preferences?: Json | null
          profile_image_url?: string | null
          timezone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      push_subscriptions: {
        Row: {
          created_at: string | null
          endpoint: string
          id: string
          subscription_json: Json
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          endpoint: string
          id?: string
          subscription_json: Json
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          endpoint?: string
          id?: string
          subscription_json?: Json
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      reading_plan_ai_context: {
        Row: {
          context_data: Json
          created_at: string | null
          day_number: number
          id: string
          plan_id: string
          updated_at: string | null
        }
        Insert: {
          context_data?: Json
          created_at?: string | null
          day_number: number
          id?: string
          plan_id: string
          updated_at?: string | null
        }
        Update: {
          context_data?: Json
          created_at?: string | null
          day_number?: number
          id?: string
          plan_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reading_plan_ai_context_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "custom_reading_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      reading_plan_notes: {
        Row: {
          created_at: string
          day_number: number
          id: string
          notes: string
          plan_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          day_number: number
          id?: string
          notes: string
          plan_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          day_number?: number
          id?: string
          notes?: string
          plan_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      reading_reflections: {
        Row: {
          ai_feedback: string | null
          created_at: string | null
          day_number: number
          id: string
          plan_id: string | null
          reflection_text: string
          user_id: string | null
        }
        Insert: {
          ai_feedback?: string | null
          created_at?: string | null
          day_number: number
          id?: string
          plan_id?: string | null
          reflection_text: string
          user_id?: string | null
        }
        Update: {
          ai_feedback?: string | null
          created_at?: string | null
          day_number?: number
          id?: string
          plan_id?: string | null
          reflection_text?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reading_reflections_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "bible_reading_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      scripture_achievements: {
        Row: {
          category: string
          code: string
          created_at: string | null
          description: string
          icon: string
          id: string
          name: string
          points_reward: number | null
          rarity: string | null
          unlock_criteria: Json
        }
        Insert: {
          category: string
          code: string
          created_at?: string | null
          description: string
          icon: string
          id?: string
          name: string
          points_reward?: number | null
          rarity?: string | null
          unlock_criteria: Json
        }
        Update: {
          category?: string
          code?: string
          created_at?: string | null
          description?: string
          icon?: string
          id?: string
          name?: string
          points_reward?: number | null
          rarity?: string | null
          unlock_criteria?: Json
        }
        Relationships: []
      }
      scripture_challenges: {
        Row: {
          challenge_type: string
          created_at: string | null
          description: string
          end_date: string
          id: string
          is_active: boolean | null
          points_reward: number | null
          start_date: string
          target_criteria: Json
          title: string
        }
        Insert: {
          challenge_type: string
          created_at?: string | null
          description: string
          end_date: string
          id?: string
          is_active?: boolean | null
          points_reward?: number | null
          start_date: string
          target_criteria: Json
          title: string
        }
        Update: {
          challenge_type?: string
          created_at?: string | null
          description?: string
          end_date?: string
          id?: string
          is_active?: boolean | null
          points_reward?: number | null
          start_date?: string
          target_criteria?: Json
          title?: string
        }
        Relationships: []
      }
      scripture_reads: {
        Row: {
          book: string
          chapter: number | null
          created_at: string
          id: string
          read_at: string
          user_id: string
          verse_end: number | null
          verse_start: number | null
        }
        Insert: {
          book: string
          chapter?: number | null
          created_at?: string
          id?: string
          read_at?: string
          user_id: string
          verse_end?: number | null
          verse_start?: number | null
        }
        Update: {
          book?: string
          chapter?: number | null
          created_at?: string
          id?: string
          read_at?: string
          user_id?: string
          verse_end?: number | null
          verse_start?: number | null
        }
        Relationships: []
      }
      scripture_memory: {
        Row: {
          created_at: string | null
          favorite: boolean | null
          id: string
          last_practiced: string | null
          mastery_score: number | null
          memorized_level: number | null
          next_review: string | null
          notes: string | null
          practice_count: number | null
          tags: string[] | null
          translation: string | null
          user_id: string | null
          verse_reference: string
          verse_text: string
        }
        Insert: {
          created_at?: string | null
          favorite?: boolean | null
          id?: string
          last_practiced?: string | null
          mastery_score?: number | null
          memorized_level?: number | null
          next_review?: string | null
          notes?: string | null
          practice_count?: number | null
          tags?: string[] | null
          translation?: string | null
          user_id?: string | null
          verse_reference: string
          verse_text: string
        }
        Update: {
          created_at?: string | null
          favorite?: boolean | null
          id?: string
          last_practiced?: string | null
          mastery_score?: number | null
          memorized_level?: number | null
          next_review?: string | null
          notes?: string | null
          practice_count?: number | null
          tags?: string[] | null
          translation?: string | null
          user_id?: string | null
          verse_reference?: string
          verse_text?: string
        }
        Relationships: []
      }
      scripture_practice_sessions: {
        Row: {
          accuracy_score: number | null
          completed: boolean | null
          created_at: string | null
          id: string
          mistakes_made: number | null
          points_earned: number | null
          practice_type: string
          scripture_memory_id: string | null
          time_spent: number | null
          user_id: string | null
        }
        Insert: {
          accuracy_score?: number | null
          completed?: boolean | null
          created_at?: string | null
          id?: string
          mistakes_made?: number | null
          points_earned?: number | null
          practice_type: string
          scripture_memory_id?: string | null
          time_spent?: number | null
          user_id?: string | null
        }
        Update: {
          accuracy_score?: number | null
          completed?: boolean | null
          created_at?: string | null
          id?: string
          mistakes_made?: number | null
          points_earned?: number | null
          practice_type?: string
          scripture_memory_id?: string | null
          time_spent?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scripture_practice_sessions_scripture_memory_id_fkey"
            columns: ["scripture_memory_id"]
            isOneToOne: false
            referencedRelation: "scripture_memory"
            referencedColumns: ["id"]
          },
        ]
      }
      security_audit_log: {
        Row: {
          action: string
          created_at: string | null
          error_message: string | null
          id: string
          ip_address: unknown
          resource_id: string | null
          resource_type: string | null
          success: boolean | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          error_message?: string | null
          id?: string
          ip_address?: unknown
          resource_id?: string | null
          resource_type?: string | null
          success?: boolean | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          error_message?: string | null
          id?: string
          ip_address?: unknown
          resource_id?: string | null
          resource_type?: string | null
          success?: boolean | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      sermon_bookmarks: {
        Row: {
          created_at: string | null
          id: string
          label: string | null
          session_id: string
          timestamp_ms: number
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          label?: string | null
          session_id: string
          timestamp_ms: number
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          label?: string | null
          session_id?: string
          timestamp_ms?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sermon_bookmarks_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sermon_follow_along_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      sermon_follow_along_sessions: {
        Row: {
          ai_summary: string | null
          audio_url: string | null
          created_at: string | null
          detected_verses: Json | null
          duration_seconds: number | null
          ended_at: string | null
          id: string
          started_at: string
          themes: Json | null
          title: string | null
          transcript: Json | null
          translation: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          ai_summary?: string | null
          audio_url?: string | null
          created_at?: string | null
          detected_verses?: Json | null
          duration_seconds?: number | null
          ended_at?: string | null
          id?: string
          started_at?: string
          themes?: Json | null
          title?: string | null
          transcript?: Json | null
          translation?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          ai_summary?: string | null
          audio_url?: string | null
          created_at?: string | null
          detected_verses?: Json | null
          duration_seconds?: number | null
          ended_at?: string | null
          id?: string
          started_at?: string
          themes?: Json | null
          title?: string | null
          transcript?: Json | null
          translation?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      sermon_insights: {
        Row: {
          content: string
          created_at: string | null
          id: string
          session_id: string
          timestamp_ms: number
          type: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          session_id: string
          timestamp_ms: number
          type: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          session_id?: string
          timestamp_ms?: number
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "sermon_insights_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sermon_follow_along_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      sermon_notes: {
        Row: {
          content: string
          created_at: string | null
          id: string
          session_id: string
          timestamp_ms: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          session_id: string
          timestamp_ms: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          session_id?: string
          timestamp_ms?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sermon_notes_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sermon_follow_along_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      sermon_summaries: {
        Row: {
          ai_context: Json | null
          application_to_faith: string | null
          audio_url: string | null
          biblical_characters: string[] | null
          biblical_themes: string[] | null
          created_at: string | null
          description: string | null
          follow_up_questions: string[] | null
          highlights: Json | null
          historical_context: string | null
          id: string
          key_points: string[] | null
          sermon_date: string | null
          storage_file_path: string | null
          summary_text: string | null
          title: string
          transcription_text: string | null
          user_id: string
          video_url: string | null
        }
        Insert: {
          ai_context?: Json | null
          application_to_faith?: string | null
          audio_url?: string | null
          biblical_characters?: string[] | null
          biblical_themes?: string[] | null
          created_at?: string | null
          description?: string | null
          follow_up_questions?: string[] | null
          highlights?: Json | null
          historical_context?: string | null
          id?: string
          key_points?: string[] | null
          sermon_date?: string | null
          storage_file_path?: string | null
          summary_text?: string | null
          title: string
          transcription_text?: string | null
          user_id: string
          video_url?: string | null
        }
        Update: {
          ai_context?: Json | null
          application_to_faith?: string | null
          audio_url?: string | null
          biblical_characters?: string[] | null
          biblical_themes?: string[] | null
          created_at?: string | null
          description?: string | null
          follow_up_questions?: string[] | null
          highlights?: Json | null
          historical_context?: string | null
          id?: string
          key_points?: string[] | null
          sermon_date?: string | null
          storage_file_path?: string | null
          summary_text?: string | null
          title?: string
          transcription_text?: string | null
          user_id?: string
          video_url?: string | null
        }
        Relationships: []
      }
      sermon_transcription_jobs: {
        Row: {
          audio_url: string
          created_at: string | null
          id: string
          result_text: string | null
          sermon_id: string
          status: string
        }
        Insert: {
          audio_url: string
          created_at?: string | null
          id?: string
          result_text?: string | null
          sermon_id: string
          status?: string
        }
        Update: {
          audio_url?: string
          created_at?: string | null
          id?: string
          result_text?: string | null
          sermon_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "sermon_transcription_jobs_sermon_id_fkey"
            columns: ["sermon_id"]
            isOneToOne: false
            referencedRelation: "sermon_summaries"
            referencedColumns: ["id"]
          },
        ]
      }
      spiritual_goals: {
        Row: {
          ai_context: Json | null
          category: string
          created_at: string | null
          description: string | null
          id: string
          is_ai_generated: boolean | null
          progress: number | null
          status: string
          target_date: string | null
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          ai_context?: Json | null
          category: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_ai_generated?: boolean | null
          progress?: number | null
          status?: string
          target_date?: string | null
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          ai_context?: Json | null
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_ai_generated?: boolean | null
          progress?: number | null
          status?: string
          target_date?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      spiritual_habits: {
        Row: {
          ai_context: Json | null
          created_at: string | null
          description: string | null
          goal_amount: number | null
          goal_frequency: string
          habit_name: string
          id: string
          instructions: string | null
          is_active: boolean | null
          scripture_reference: string | null
          suggested_time: string | null
          streak_current: number | null
          streak_longest: number | null
          user_id: string | null
        }
        Insert: {
          ai_context?: Json | null
          created_at?: string | null
          description?: string | null
          goal_amount?: number | null
          goal_frequency: string
          habit_name: string
          id?: string
          instructions?: string | null
          is_active?: boolean | null
          scripture_reference?: string | null
          suggested_time?: string | null
          streak_current?: number | null
          streak_longest?: number | null
          user_id?: string | null
        }
        Update: {
          ai_context?: Json | null
          created_at?: string | null
          description?: string | null
          goal_amount?: number | null
          goal_frequency?: string
          habit_name?: string
          id?: string
          instructions?: string | null
          is_active?: boolean | null
          scripture_reference?: string | null
          suggested_time?: string | null
          streak_current?: number | null
          streak_longest?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      spiritual_themes: {
        Row: {
          action_items: Json | null
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          prayer_points: Json | null
          related_verses: Json | null
          theme_name: string
        }
        Insert: {
          action_items?: Json | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          prayer_points?: Json | null
          related_verses?: Json | null
          theme_name: string
        }
        Update: {
          action_items?: Json | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          prayer_points?: Json | null
          related_verses?: Json | null
          theme_name?: string
        }
        Relationships: []
      }
      testimonies: {
        Row: {
          after_completed: boolean | null
          after_content: string | null
          after_conversation: Json | null
          before_completed: boolean | null
          before_content: string | null
          before_conversation: Json | null
          community_id: string | null
          completed_at: string | null
          created_at: string | null
          current_step: number | null
          full_testimony: string | null
          hidden_reason: string | null
          id: string
          is_completed: boolean | null
          is_hidden: boolean
          is_published: boolean | null
          share_with_community: boolean | null
          title: string | null
          turning_point_completed: boolean | null
          turning_point_content: string | null
          turning_point_conversation: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          after_completed?: boolean | null
          after_content?: string | null
          after_conversation?: Json | null
          before_completed?: boolean | null
          before_content?: string | null
          before_conversation?: Json | null
          community_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          current_step?: number | null
          full_testimony?: string | null
          hidden_reason?: string | null
          id?: string
          is_completed?: boolean | null
          is_hidden?: boolean
          is_published?: boolean | null
          share_with_community?: boolean | null
          title?: string | null
          turning_point_completed?: boolean | null
          turning_point_content?: string | null
          turning_point_conversation?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          after_completed?: boolean | null
          after_content?: string | null
          after_conversation?: Json | null
          before_completed?: boolean | null
          before_content?: string | null
          before_conversation?: Json | null
          community_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          current_step?: number | null
          full_testimony?: string | null
          hidden_reason?: string | null
          id?: string
          is_completed?: boolean | null
          is_hidden?: boolean
          is_published?: boolean | null
          share_with_community?: boolean | null
          title?: string | null
          turning_point_completed?: boolean | null
          turning_point_content?: string | null
          turning_point_conversation?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "testimonies_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "faith_communities"
            referencedColumns: ["id"]
          },
        ]
      }
      therapeutic_interactions: {
        Row: {
          ai_observation: string | null
          created_at: string | null
          effectiveness_score: number | null
          follow_up_needed: boolean | null
          id: string
          interaction_type: string
          question_asked: string | null
          session_id: string | null
          therapeutic_technique: string | null
          user_id: string
          user_response: string | null
        }
        Insert: {
          ai_observation?: string | null
          created_at?: string | null
          effectiveness_score?: number | null
          follow_up_needed?: boolean | null
          id?: string
          interaction_type: string
          question_asked?: string | null
          session_id?: string | null
          therapeutic_technique?: string | null
          user_id: string
          user_response?: string | null
        }
        Update: {
          ai_observation?: string | null
          created_at?: string | null
          effectiveness_score?: number | null
          follow_up_needed?: boolean | null
          id?: string
          interaction_type?: string
          question_asked?: string | null
          session_id?: string | null
          therapeutic_technique?: string | null
          user_id?: string
          user_response?: string | null
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_id: string | null
          earned_at: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          achievement_id?: string | null
          earned_at?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          achievement_id?: string | null
          earned_at?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "scripture_achievements"
            referencedColumns: ["id"]
          },
        ]
      }
      user_ai_feedback: {
        Row: {
          additional_context: string | null
          ai_feature: string | null
          context_type: string | null
          corrected_value: string | null
          created_at: string | null
          feedback_type: string
          id: string
          message_id: string | null
          original_value: string | null
          processed: boolean | null
          processed_at: string | null
          user_id: string
        }
        Insert: {
          additional_context?: string | null
          ai_feature?: string | null
          context_type?: string | null
          corrected_value?: string | null
          created_at?: string | null
          feedback_type: string
          id?: string
          message_id?: string | null
          original_value?: string | null
          processed?: boolean | null
          processed_at?: string | null
          user_id: string
        }
        Update: {
          additional_context?: string | null
          ai_feature?: string | null
          context_type?: string | null
          corrected_value?: string | null
          created_at?: string | null
          feedback_type?: string
          id?: string
          message_id?: string | null
          original_value?: string | null
          processed?: boolean | null
          processed_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_bible_study_progress: {
        Row: {
          completed_days: number[] | null
          current_day: number | null
          id: string
          is_completed: boolean | null
          last_accessed: string | null
          started_at: string | null
          study_id: string | null
          user_id: string
        }
        Insert: {
          completed_days?: number[] | null
          current_day?: number | null
          id?: string
          is_completed?: boolean | null
          last_accessed?: string | null
          started_at?: string | null
          study_id?: string | null
          user_id: string
        }
        Update: {
          completed_days?: number[] | null
          current_day?: number | null
          id?: string
          is_completed?: boolean | null
          last_accessed?: string | null
          started_at?: string | null
          study_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_bible_study_progress_study_id_fkey"
            columns: ["study_id"]
            isOneToOne: false
            referencedRelation: "ai_bible_studies"
            referencedColumns: ["id"]
          },
        ]
      }
      user_challenge_progress: {
        Row: {
          challenge_id: string | null
          completed: boolean | null
          completed_at: string | null
          created_at: string | null
          current_progress: number | null
          id: string
          user_id: string | null
        }
        Insert: {
          challenge_id?: string | null
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          current_progress?: number | null
          id?: string
          user_id?: string | null
        }
        Update: {
          challenge_id?: string | null
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          current_progress?: number | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_challenge_progress_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "scripture_challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      user_community_reading_progress: {
        Row: {
          community_reading_plan_id: string
          completion_date: string | null
          created_at: string
          current_day: number
          id: string
          is_completed: boolean
          last_completed_date: string | null
          start_date: string
          updated_at: string
          user_id: string
        }
        Insert: {
          community_reading_plan_id: string
          completion_date?: string | null
          created_at?: string
          current_day?: number
          id?: string
          is_completed?: boolean
          last_completed_date?: string | null
          start_date?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          community_reading_plan_id?: string
          completion_date?: string | null
          created_at?: string
          current_day?: number
          id?: string
          is_completed?: boolean
          last_completed_date?: string | null
          start_date?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_custom_reading_progress: {
        Row: {
          completion_date: string | null
          created_at: string
          current_day: number
          id: string
          is_completed: boolean
          last_completed_date: string | null
          plan_id: string
          start_date: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completion_date?: string | null
          created_at?: string
          current_day?: number
          id?: string
          is_completed?: boolean
          last_completed_date?: string | null
          plan_id: string
          start_date?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completion_date?: string | null
          created_at?: string
          current_day?: number
          id?: string
          is_completed?: boolean
          last_completed_date?: string | null
          plan_id?: string
          start_date?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_custom_reading_progress_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "custom_reading_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      user_devotional_progress: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          created_at: string | null
          devotional_id: string | null
          favorite: boolean | null
          id: string
          notes: string | null
          user_id: string | null
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          devotional_id?: string | null
          favorite?: boolean | null
          id?: string
          notes?: string | null
          user_id?: string | null
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          devotional_id?: string | null
          favorite?: boolean | null
          id?: string
          notes?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_devotional_progress_devotional_id_fkey"
            columns: ["devotional_id"]
            isOneToOne: false
            referencedRelation: "daily_devotionals"
            referencedColumns: ["id"]
          },
        ]
      }
      user_insights_cache: {
        Row: {
          analytics_data: Json
          generated_at: string
          insights: Json
          time_range: string
          user_id: string
        }
        Insert: {
          analytics_data: Json
          generated_at?: string
          insights: Json
          time_range: string
          user_id: string
        }
        Update: {
          analytics_data?: Json
          generated_at?: string
          insights?: Json
          time_range?: string
          user_id?: string
        }
        Relationships: []
      }
      user_notification_preferences: {
        Row: {
          created_at: string
          email_enabled: boolean
          frequency_preferences: Json
          id: string
          notifications_enabled: boolean
          push_enabled: boolean
          quiet_hours_enabled: boolean
          quiet_hours_end: string | null
          quiet_hours_start: string | null
          sms_enabled: boolean
          timezone: string
          type_preferences: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email_enabled?: boolean
          frequency_preferences?: Json
          id?: string
          notifications_enabled?: boolean
          push_enabled?: boolean
          quiet_hours_enabled?: boolean
          quiet_hours_end?: string | null
          quiet_hours_start?: string | null
          sms_enabled?: boolean
          timezone?: string
          type_preferences?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email_enabled?: boolean
          frequency_preferences?: Json
          id?: string
          notifications_enabled?: boolean
          push_enabled?: boolean
          quiet_hours_enabled?: boolean
          quiet_hours_end?: string | null
          quiet_hours_start?: string | null
          sms_enabled?: boolean
          timezone?: string
          type_preferences?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          ai_context_last_updated: string | null
          ai_preferences: Json | null
          created_at: string | null
          id: string
          notification_preferences: Json | null
          theme: string | null
          updated_at: string | null
          verse_translation: string | null
        }
        Insert: {
          ai_context_last_updated?: string | null
          ai_preferences?: Json | null
          created_at?: string | null
          id: string
          notification_preferences?: Json | null
          theme?: string | null
          updated_at?: string | null
          verse_translation?: string | null
        }
        Update: {
          ai_context_last_updated?: string | null
          ai_preferences?: Json | null
          created_at?: string | null
          id?: string
          notification_preferences?: Json | null
          theme?: string | null
          updated_at?: string | null
          verse_translation?: string | null
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          is_admin: boolean | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id: string
          is_admin?: boolean | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          is_admin?: boolean | null
        }
        Relationships: []
      }
      user_push_subscriptions: {
        Row: {
          created_at: string | null
          device_type: string | null
          fcm_token: string | null
          id: string
          platform: string | null
          subscription_json: Json | null
          updated_at: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          device_type?: string | null
          fcm_token?: string | null
          id?: string
          platform?: string | null
          subscription_json?: Json | null
          updated_at?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          device_type?: string | null
          fcm_token?: string | null
          id?: string
          platform?: string | null
          subscription_json?: Json | null
          updated_at?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_reading_progress: {
        Row: {
          completion_date: string | null
          created_at: string | null
          current_day: number | null
          id: string
          is_completed: boolean | null
          last_completed_date: string | null
          plan_id: string | null
          start_date: string | null
          user_id: string | null
        }
        Insert: {
          completion_date?: string | null
          created_at?: string | null
          current_day?: number | null
          id?: string
          is_completed?: boolean | null
          last_completed_date?: string | null
          plan_id?: string | null
          start_date?: string | null
          user_id?: string | null
        }
        Update: {
          completion_date?: string | null
          created_at?: string | null
          current_day?: number | null
          id?: string
          is_completed?: boolean | null
          last_completed_date?: string | null
          plan_id?: string | null
          start_date?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_reading_progress_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "bible_reading_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          role: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      user_scripture_stats: {
        Row: {
          achievements_count: number | null
          created_at: string | null
          current_level: number | null
          current_streak: number | null
          experience_points: number | null
          id: string
          last_practice_date: string | null
          longest_streak: number | null
          total_points: number | null
          total_practice_time: number | null
          updated_at: string | null
          user_id: string | null
          verses_memorized: number | null
        }
        Insert: {
          achievements_count?: number | null
          created_at?: string | null
          current_level?: number | null
          current_streak?: number | null
          experience_points?: number | null
          id?: string
          last_practice_date?: string | null
          longest_streak?: number | null
          total_points?: number | null
          total_practice_time?: number | null
          updated_at?: string | null
          user_id?: string | null
          verses_memorized?: number | null
        }
        Update: {
          achievements_count?: number | null
          created_at?: string | null
          current_level?: number | null
          current_streak?: number | null
          experience_points?: number | null
          id?: string
          last_practice_date?: string | null
          longest_streak?: number | null
          total_points?: number | null
          total_practice_time?: number | null
          updated_at?: string | null
          user_id?: string | null
          verses_memorized?: number | null
        }
        Relationships: []
      }
      verse_notes: {
        Row: {
          book: string
          chapter: number
          content: string
          created_at: string | null
          id: string
          updated_at: string | null
          user_id: string
          verse: number
          verse_reference: string
        }
        Insert: {
          book: string
          chapter: number
          content: string
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id: string
          verse: number
          verse_reference: string
        }
        Update: {
          book?: string
          chapter?: number
          content?: string
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string
          verse?: number
          verse_reference?: string
        }
        Relationships: []
      }
      voice_usage_logs: {
        Row: {
          characters: number
          created_at: string | null
          id: string
          model_id: string
          user_id: string | null
          voice_id: string
        }
        Insert: {
          characters: number
          created_at?: string | null
          id?: string
          model_id: string
          user_id?: string | null
          voice_id: string
        }
        Update: {
          characters?: number
          created_at?: string | null
          id?: string
          model_id?: string
          user_id?: string | null
          voice_id?: string
        }
        Relationships: []
      }
      whisper_usage_logs: {
        Row: {
          created_at: string | null
          duration_seconds: number
          id: string
          model: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          duration_seconds: number
          id?: string
          model: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          duration_seconds?: number
          id?: string
          model?: string
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      scripture_leaderboard: {
        Row: {
          achievements_count: number | null
          current_level: number | null
          display_name: string | null
          longest_streak: number | null
          rank: number | null
          total_points: number | null
          user_id: string | null
          verses_memorized: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      advance_bible_study_day: {
        Args: { p_study_id: string; p_user_id: string }
        Returns: boolean
      }
      calculate_level: { Args: { exp_points: number }; Returns: number }
      calculate_next_notification_trigger: {
        Args: {
          p_after?: string
          p_days_of_week: number[]
          p_delivery_time: string
          p_timezone: string
        }
        Returns: string
      }
      check_community_admin: {
        Args: { p_community_id: string; p_user_id: string }
        Returns: boolean
      }
      check_community_membership: {
        Args: { p_community_id: string; p_user_id: string }
        Returns: boolean
      }
      check_prayer_request_membership: {
        Args: { check_prayer_id: string; check_user_id: string }
        Returns: boolean
      }
      cleanup_old_conversation_sessions: { Args: never; Returns: undefined }
      complete_reading_day: {
        Args: { p_day_number: number; p_plan_id: string; p_user_id: string }
        Returns: boolean
      }
      create_default_notification_schedules: {
        Args: { p_user_id: string }
        Returns: undefined
      }
      create_notification_from_schedule: {
        Args: { p_schedule_id: string }
        Returns: string
      }
      create_test_pro_subscription: {
        Args: { user_id_param: string }
        Returns: undefined
      }
      execute_sql_query: { Args: { query_text: string }; Returns: Json }
      generate_blog_slug: { Args: { title_text: string }; Returns: string }
      get_community_member_counts: {
        Args: { community_ids: string[] }
        Returns: {
          community_id: string
          count: number
        }[]
      }
      get_community_role: {
        Args: { check_community_id: string; check_user_id: string }
        Returns: string
      }
      get_conversation_analytics: {
        Args: { p_days?: number; p_user_id: string }
        Returns: {
          avg_session_length: number
          breakthrough_sessions: number
          emotional_progress_score: number
          spiritual_themes_count: number
          total_messages: number
          total_sessions: number
        }[]
      }
      get_cron_secret: { Args: never; Returns: string }
      get_database_stats: { Args: never; Returns: Json }
      get_moderation_user_summary: {
        Args: { p_user_ids: string[]; p_window_days?: number }
        Returns: {
          last_flagged_at: string
          recent_dismissed: number
          recent_flags: number
          recent_removed: number
          recommended_action: string
          score: number
          total_dismissed: number
          total_flags: number
          total_removed: number
          user_id: string
          window_days: number
        }[]
      }
      get_my_community_ids: {
        Args: { p_user_id: string }
        Returns: {
          community_id: string
        }[]
      }
      get_spiritual_stats: {
        Args: { end_date: string; start_date: string }
        Returns: Json
      }
      get_table_columns: {
        Args: { table_name: string }
        Returns: {
          column_name: string
        }[]
      }
      get_tables: {
        Args: never
        Returns: {
          table_name: string
        }[]
      }
      increment_prayer_count: {
        Args: { prayer_id: string }
        Returns: {
          answered_date: string | null
          answered_notes: string | null
          created_at: string | null
          description: string
          id: string
          is_answered: boolean | null
          prayer_count: number | null
          shared: boolean | null
          tags: string[] | null
          title: string
          updated_at: string | null
          user_id: string | null
        }
        SetofOptions: {
          from: "*"
          to: "prayer_requests"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      is_admin: { Args: never; Returns: boolean }
      log_security_event: {
        Args: {
          p_action: string
          p_error_message?: string
          p_resource_id?: string
          p_resource_type?: string
          p_success?: boolean
        }
        Returns: undefined
      }
      set_user_admin_flag: {
        Args: { new_is_admin: boolean; reason?: string; target_user: string }
        Returns: {
          id: string
          is_admin: boolean
          updated_at: string
        }[]
      }
      toggle_test_pro_subscriptions: {
        Args: { enabled: boolean }
        Returns: undefined
      }
      update_user_scripture_stats: {
        Args: {
          p_points_earned?: number
          p_practice_completed?: boolean
          p_user_id: string
          p_verse_memorized?: boolean
        }
        Returns: undefined
      }
      upsert_moderation_queue: {
        Args: {
          p_community_id: string
          p_content_id: string
          p_content_type: string
          p_thread_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
