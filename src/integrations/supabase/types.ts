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
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
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
          topic: string | null
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
          topic?: string | null
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
          topic?: string | null
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
      bible_chat_conversations: {
        Row: {
          created_at: string | null
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      bible_chat_messages: {
        Row: {
          content: string
          context_book: string | null
          context_chapter: number | null
          context_verses: number[] | null
          conversation_id: string
          created_at: string | null
          id: string
          role: string
          scripture_references: Json | null
        }
        Insert: {
          content: string
          context_book?: string | null
          context_chapter?: number | null
          context_verses?: number[] | null
          conversation_id: string
          created_at?: string | null
          id?: string
          role: string
          scripture_references?: Json | null
        }
        Update: {
          content?: string
          context_book?: string | null
          context_chapter?: number | null
          context_verses?: number[] | null
          conversation_id?: string
          created_at?: string | null
          id?: string
          role?: string
          scripture_references?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "bible_chat_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "bible_chat_conversations"
            referencedColumns: ["id"]
          },
        ]
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
      bible_cross_refs: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          relationship_type: string
          source_verse_id: string
          strength: number | null
          target_verse_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          relationship_type?: string
          source_verse_id: string
          strength?: number | null
          target_verse_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          relationship_type?: string
          source_verse_id?: string
          strength?: number | null
          target_verse_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bible_cross_refs_source_verse_id_fkey"
            columns: ["source_verse_id"]
            isOneToOne: false
            referencedRelation: "bible_verse_embeddings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bible_cross_refs_target_verse_id_fkey"
            columns: ["target_verse_id"]
            isOneToOne: false
            referencedRelation: "bible_verse_embeddings"
            referencedColumns: ["id"]
          },
        ]
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
      bible_people: {
        Row: {
          created_at: string | null
          description: string | null
          display_name: string | null
          era: string | null
          id: string
          is_divine: boolean | null
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_name?: string | null
          era?: string | null
          id?: string
          is_divine?: boolean | null
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_name?: string | null
          era?: string | null
          id?: string
          is_divine?: boolean | null
          name?: string
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
      bible_themes: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          display_name: string | null
          id: string
          name: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          display_name?: string | null
          id?: string
          name: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          display_name?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      bible_verse_embeddings: {
        Row: {
          book: string
          chapter: number
          created_at: string | null
          embedding: string | null
          id: string
          text: string
          translation: string | null
          updated_at: string | null
          verse: number
          verse_ref: string | null
        }
        Insert: {
          book: string
          chapter: number
          created_at?: string | null
          embedding?: string | null
          id?: string
          text: string
          translation?: string | null
          updated_at?: string | null
          verse: number
          verse_ref?: string | null
        }
        Update: {
          book?: string
          chapter?: number
          created_at?: string | null
          embedding?: string | null
          id?: string
          text?: string
          translation?: string | null
          updated_at?: string | null
          verse?: number
          verse_ref?: string | null
        }
        Relationships: []
      }
      bible_verse_people: {
        Row: {
          created_at: string | null
          id: string
          person_id: string
          role: string | null
          verse_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          person_id: string
          role?: string | null
          verse_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          person_id?: string
          role?: string | null
          verse_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bible_verse_people_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "bible_people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bible_verse_people_verse_id_fkey"
            columns: ["verse_id"]
            isOneToOne: false
            referencedRelation: "bible_verse_embeddings"
            referencedColumns: ["id"]
          },
        ]
      }
      bible_verse_themes: {
        Row: {
          created_at: string | null
          id: string
          relevance_score: number | null
          theme_id: string
          verse_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          relevance_score?: number | null
          theme_id: string
          verse_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          relevance_score?: number | null
          theme_id?: string
          verse_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bible_verse_themes_theme_id_fkey"
            columns: ["theme_id"]
            isOneToOne: false
            referencedRelation: "bible_themes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bible_verse_themes_verse_id_fkey"
            columns: ["verse_id"]
            isOneToOne: false
            referencedRelation: "bible_verse_embeddings"
            referencedColumns: ["id"]
          },
        ]
      }
      bills: {
        Row: {
          account_number_last4: string | null
          amount: number
          amount_raised: number
          category: Database["public"]["Enums"]["bill_category_enum"]
          created_at: string
          creditor_account_number: string | null
          creditor_name: string | null
          document_ocr_text: string | null
          document_url: string | null
          due_date: string | null
          grace_score: number
          id: string
          is_anonymous: boolean
          location_zip: string | null
          status: Database["public"]["Enums"]["bill_status_enum"]
          story: string | null
          updated_at: string
          urgency: Database["public"]["Enums"]["urgency_level_enum"]
          user_id: string
          vetting_status: Database["public"]["Enums"]["vetting_status_enum"]
        }
        Insert: {
          account_number_last4?: string | null
          amount: number
          amount_raised?: number
          category: Database["public"]["Enums"]["bill_category_enum"]
          created_at?: string
          creditor_account_number?: string | null
          creditor_name?: string | null
          document_ocr_text?: string | null
          document_url?: string | null
          due_date?: string | null
          grace_score?: number
          id?: string
          is_anonymous?: boolean
          location_zip?: string | null
          status?: Database["public"]["Enums"]["bill_status_enum"]
          story?: string | null
          updated_at?: string
          urgency?: Database["public"]["Enums"]["urgency_level_enum"]
          user_id: string
          vetting_status?: Database["public"]["Enums"]["vetting_status_enum"]
        }
        Update: {
          account_number_last4?: string | null
          amount?: number
          amount_raised?: number
          category?: Database["public"]["Enums"]["bill_category_enum"]
          created_at?: string
          creditor_account_number?: string | null
          creditor_name?: string | null
          document_ocr_text?: string | null
          document_url?: string | null
          due_date?: string | null
          grace_score?: number
          id?: string
          is_anonymous?: boolean
          location_zip?: string | null
          status?: Database["public"]["Enums"]["bill_status_enum"]
          story?: string | null
          updated_at?: string
          urgency?: Database["public"]["Enums"]["urgency_level_enum"]
          user_id?: string
          vetting_status?: Database["public"]["Enums"]["vetting_status_enum"]
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
      church_memberships: {
        Row: {
          church_id: string
          created_at: string
          id: string
          is_verified: boolean
          joined_at: string
          role: Database["public"]["Enums"]["church_membership_role_enum"]
          user_id: string
        }
        Insert: {
          church_id: string
          created_at?: string
          id?: string
          is_verified?: boolean
          joined_at?: string
          role?: Database["public"]["Enums"]["church_membership_role_enum"]
          user_id: string
        }
        Update: {
          church_id?: string
          created_at?: string
          id?: string
          is_verified?: boolean
          joined_at?: string
          role?: Database["public"]["Enums"]["church_membership_role_enum"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "church_memberships_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
        ]
      }
      churches: {
        Row: {
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          description: string | null
          id: string
          is_verified: boolean
          location: string | null
          logo_url: string | null
          name: string
          pastor_name: string | null
          slug: string
          updated_at: string
          verified_at: string | null
          website: string | null
        }
        Insert: {
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_verified?: boolean
          location?: string | null
          logo_url?: string | null
          name: string
          pastor_name?: string | null
          slug: string
          updated_at?: string
          verified_at?: string | null
          website?: string | null
        }
        Update: {
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_verified?: boolean
          location?: string | null
          logo_url?: string | null
          name?: string
          pastor_name?: string | null
          slug?: string
          updated_at?: string
          verified_at?: string | null
          website?: string | null
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
            referencedRelation: "notification_activity_summary"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "community_discussion_messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_discussion_messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_quota_status"
            referencedColumns: ["user_id"]
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
            referencedRelation: "notification_activity_summary"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "community_discussion_threads_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_discussion_threads_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_quota_status"
            referencedColumns: ["user_id"]
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
            referencedRelation: "notification_activity_summary"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_community_members_profile"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_community_members_profile"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_quota_status"
            referencedColumns: ["user_id"]
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
            referencedRelation: "notification_activity_summary"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_community_prayer_requests_profile"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_community_prayer_requests_profile"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_quota_status"
            referencedColumns: ["user_id"]
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
          recommendation_context: Json | null
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
          recommendation_context?: Json | null
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
          recommendation_context?: Json | null
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
      counseling_sessions: {
        Row: {
          bill_id: string | null
          counselor_user_id: string | null
          created_at: string
          duration_minutes: number | null
          homework_assigned: Json
          id: string
          next_session_date: string | null
          recipient_user_id: string
          session_date: string
          session_notes: string | null
          status: Database["public"]["Enums"]["session_status_enum"]
          updated_at: string
        }
        Insert: {
          bill_id?: string | null
          counselor_user_id?: string | null
          created_at?: string
          duration_minutes?: number | null
          homework_assigned?: Json
          id?: string
          next_session_date?: string | null
          recipient_user_id: string
          session_date: string
          session_notes?: string | null
          status?: Database["public"]["Enums"]["session_status_enum"]
          updated_at?: string
        }
        Update: {
          bill_id?: string | null
          counselor_user_id?: string | null
          created_at?: string
          duration_minutes?: number | null
          homework_assigned?: Json
          id?: string
          next_session_date?: string | null
          recipient_user_id?: string
          session_date?: string
          session_notes?: string | null
          status?: Database["public"]["Enums"]["session_status_enum"]
          updated_at?: string
        }
        Relationships: []
      }
      creditors: {
        Row: {
          address: string | null
          category: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          payment_method: Database["public"]["Enums"]["creditor_payment_method_enum"]
          phone: string | null
          stripe_connect_account_id: string | null
          tax_id: string | null
          updated_at: string
          verification_status: Database["public"]["Enums"]["creditor_verification_status_enum"]
        }
        Insert: {
          address?: string | null
          category?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          payment_method?: Database["public"]["Enums"]["creditor_payment_method_enum"]
          phone?: string | null
          stripe_connect_account_id?: string | null
          tax_id?: string | null
          updated_at?: string
          verification_status?: Database["public"]["Enums"]["creditor_verification_status_enum"]
        }
        Update: {
          address?: string | null
          category?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          payment_method?: Database["public"]["Enums"]["creditor_payment_method_enum"]
          phone?: string | null
          stripe_connect_account_id?: string | null
          tax_id?: string | null
          updated_at?: string
          verification_status?: Database["public"]["Enums"]["creditor_verification_status_enum"]
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
      donations: {
        Row: {
          amount: number
          bill_id: string
          created_at: string
          donor_covered_fees: boolean
          donor_user_id: string | null
          gift_note: string | null
          id: string
          platform_fee: number
          status: Database["public"]["Enums"]["donation_status_enum"]
          stripe_fee: number | null
          stripe_payment_intent_id: string | null
          stripe_transfer_id: string | null
          tax_receipt_issued_at: string | null
          tax_receipt_url: string | null
        }
        Insert: {
          amount: number
          bill_id: string
          created_at?: string
          donor_covered_fees?: boolean
          donor_user_id?: string | null
          gift_note?: string | null
          id?: string
          platform_fee?: number
          status?: Database["public"]["Enums"]["donation_status_enum"]
          stripe_fee?: number | null
          stripe_payment_intent_id?: string | null
          stripe_transfer_id?: string | null
          tax_receipt_issued_at?: string | null
          tax_receipt_url?: string | null
        }
        Update: {
          amount?: number
          bill_id?: string
          created_at?: string
          donor_covered_fees?: boolean
          donor_user_id?: string | null
          gift_note?: string | null
          id?: string
          platform_fee?: number
          status?: Database["public"]["Enums"]["donation_status_enum"]
          stripe_fee?: number | null
          stripe_payment_intent_id?: string | null
          stripe_transfer_id?: string | null
          tax_receipt_issued_at?: string | null
          tax_receipt_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "donations_bill_id_fkey"
            columns: ["bill_id"]
            isOneToOne: false
            referencedRelation: "bills"
            referencedColumns: ["id"]
          },
        ]
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
      gracebill_prayer_requests: {
        Row: {
          category: Database["public"]["Enums"]["prayer_category_enum"]
          content: string
          created_at: string
          id: string
          is_anonymous: boolean
          prayer_count: number
          title: string
          user_id: string | null
        }
        Insert: {
          category: Database["public"]["Enums"]["prayer_category_enum"]
          content: string
          created_at?: string
          id?: string
          is_anonymous?: boolean
          prayer_count?: number
          title: string
          user_id?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["prayer_category_enum"]
          content?: string
          created_at?: string
          id?: string
          is_anonymous?: boolean
          prayer_count?: number
          title?: string
          user_id?: string | null
        }
        Relationships: []
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
          entry_source: string
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
          source_metadata: Json | null
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
          entry_source?: string
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
          source_metadata?: Json | null
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
          entry_source?: string
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
          source_metadata?: Json | null
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
          user_id: string
          user_name: string
        }
        Insert: {
          id?: number
          inserted_at?: string
          message: string
          user_id: string
          user_name: string
        }
        Update: {
          id?: number
          inserted_at?: string
          message?: string
          user_id?: string
          user_name?: string
        }
        Relationships: []
      }
      mercybridge_admin_reviews: {
        Row: {
          action: Database["public"]["Enums"]["review_action"]
          checklist: Json | null
          created_at: string | null
          decision_reason: string | null
          id: string
          need_id: string
          new_status: Database["public"]["Enums"]["need_status"]
          notes: string | null
          previous_status: Database["public"]["Enums"]["need_status"] | null
          public_summary_approved: string | null
          reviewer_id: string
        }
        Insert: {
          action: Database["public"]["Enums"]["review_action"]
          checklist?: Json | null
          created_at?: string | null
          decision_reason?: string | null
          id?: string
          need_id: string
          new_status: Database["public"]["Enums"]["need_status"]
          notes?: string | null
          previous_status?: Database["public"]["Enums"]["need_status"] | null
          public_summary_approved?: string | null
          reviewer_id: string
        }
        Update: {
          action?: Database["public"]["Enums"]["review_action"]
          checklist?: Json | null
          created_at?: string | null
          decision_reason?: string | null
          id?: string
          need_id?: string
          new_status?: Database["public"]["Enums"]["need_status"]
          notes?: string | null
          previous_status?: Database["public"]["Enums"]["need_status"] | null
          public_summary_approved?: string | null
          reviewer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mercybridge_admin_reviews_need_id_fkey"
            columns: ["need_id"]
            isOneToOne: false
            referencedRelation: "mercybridge_needs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mercybridge_admin_reviews_need_id_fkey"
            columns: ["need_id"]
            isOneToOne: false
            referencedRelation: "mercybridge_public_needs"
            referencedColumns: ["id"]
          },
        ]
      }
      mercybridge_audit_logs: {
        Row: {
          action: string
          actor_id: string
          created_at: string | null
          details: Json | null
          id: string
          target_id: string
          target_type: string
        }
        Insert: {
          action: string
          actor_id: string
          created_at?: string | null
          details?: Json | null
          id?: string
          target_id: string
          target_type: string
        }
        Update: {
          action?: string
          actor_id?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          target_id?: string
          target_type?: string
        }
        Relationships: []
      }
      mercybridge_contributions: {
        Row: {
          admin_review_notes: string | null
          admin_reviewed_at: string | null
          admin_reviewed_by: string | null
          ai_confidence_score: number | null
          ai_review_queue_reason: string | null
          ai_verification_result: Json | null
          ai_verification_status: string | null
          ai_verified_at: string | null
          amount: number
          confirmation_number: string | null
          created_at: string | null
          fiscal_sponsor_id: string | null
          gift_note: string | null
          id: string
          is_anonymous: boolean
          submission_idempotency_key: string | null
          need_id: string
          payment_method: string
          proof_notes: string | null
          proof_storage_path: string | null
          proof_url: string | null
          rejection_reason: string | null
          sponsor_ack_direct_pay: boolean | null
          sponsor_ack_mercybridge_no_custody: boolean | null
          sponsor_ack_no_reversal_guarantee: boolean | null
          sponsor_ack_not_tax_deductible: boolean | null
          sponsor_disclosure_acknowledged_at: string | null
          sponsor_disclosure_version: string | null
          sponsor_id: string | null
          status: Database["public"]["Enums"]["contribution_status"]
          stripe_payment_intent_id: string | null
          updated_at: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          admin_review_notes?: string | null
          admin_reviewed_at?: string | null
          admin_reviewed_by?: string | null
          ai_confidence_score?: number | null
          ai_review_queue_reason?: string | null
          ai_verification_result?: Json | null
          ai_verification_status?: string | null
          ai_verified_at?: string | null
          amount: number
          confirmation_number?: string | null
          created_at?: string | null
          fiscal_sponsor_id?: string | null
          gift_note?: string | null
          id?: string
          is_anonymous?: boolean
          submission_idempotency_key?: string | null
          need_id: string
          payment_method?: string
          proof_notes?: string | null
          proof_storage_path?: string | null
          proof_url?: string | null
          rejection_reason?: string | null
          sponsor_ack_direct_pay?: boolean | null
          sponsor_ack_mercybridge_no_custody?: boolean | null
          sponsor_ack_no_reversal_guarantee?: boolean | null
          sponsor_ack_not_tax_deductible?: boolean | null
          sponsor_disclosure_acknowledged_at?: string | null
          sponsor_disclosure_version?: string | null
          sponsor_id?: string | null
          status?: Database["public"]["Enums"]["contribution_status"]
          stripe_payment_intent_id?: string | null
          updated_at?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          admin_review_notes?: string | null
          admin_reviewed_at?: string | null
          admin_reviewed_by?: string | null
          ai_confidence_score?: number | null
          ai_review_queue_reason?: string | null
          ai_verification_result?: Json | null
          ai_verification_status?: string | null
          ai_verified_at?: string | null
          amount?: number
          confirmation_number?: string | null
          created_at?: string | null
          fiscal_sponsor_id?: string | null
          gift_note?: string | null
          id?: string
          is_anonymous?: boolean
          submission_idempotency_key?: string | null
          need_id?: string
          payment_method?: string
          proof_notes?: string | null
          proof_storage_path?: string | null
          proof_url?: string | null
          rejection_reason?: string | null
          sponsor_ack_direct_pay?: boolean | null
          sponsor_ack_mercybridge_no_custody?: boolean | null
          sponsor_ack_no_reversal_guarantee?: boolean | null
          sponsor_ack_not_tax_deductible?: boolean | null
          sponsor_disclosure_acknowledged_at?: string | null
          sponsor_disclosure_version?: string | null
          sponsor_id?: string | null
          status?: Database["public"]["Enums"]["contribution_status"]
          stripe_payment_intent_id?: string | null
          updated_at?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mercybridge_contributions_need_id_fkey"
            columns: ["need_id"]
            isOneToOne: false
            referencedRelation: "mercybridge_needs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mercybridge_contributions_need_id_fkey"
            columns: ["need_id"]
            isOneToOne: false
            referencedRelation: "mercybridge_public_needs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mercybridge_contributions_sponsor_id_fkey"
            columns: ["sponsor_id"]
            isOneToOne: false
            referencedRelation: "notification_activity_summary"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "mercybridge_contributions_sponsor_id_fkey"
            columns: ["sponsor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mercybridge_contributions_sponsor_id_fkey"
            columns: ["sponsor_id"]
            isOneToOne: false
            referencedRelation: "user_quota_status"
            referencedColumns: ["user_id"]
          },
        ]
      }
      mercybridge_messages: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean
          message: string
          need_id: string
          recipient_id: string
          sender_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean
          message: string
          need_id: string
          recipient_id: string
          sender_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean
          message?: string
          need_id?: string
          recipient_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mercybridge_messages_need_id_fkey"
            columns: ["need_id"]
            isOneToOne: false
            referencedRelation: "mercybridge_needs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mercybridge_messages_need_id_fkey"
            columns: ["need_id"]
            isOneToOne: false
            referencedRelation: "mercybridge_public_needs"
            referencedColumns: ["id"]
          },
        ]
      }
      mercybridge_need_ai_screenings: {
        Row: {
          created_at: string
          id: string
          need_id: string
          result: Json | null
          score: number | null
          screened_at: string
          screening_status: string
        }
        Insert: {
          created_at?: string
          id?: string
          need_id: string
          result?: Json | null
          score?: number | null
          screened_at?: string
          screening_status: string
        }
        Update: {
          created_at?: string
          id?: string
          need_id?: string
          result?: Json | null
          score?: number | null
          screened_at?: string
          screening_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "mercybridge_need_ai_screenings_need_id_fkey"
            columns: ["need_id"]
            isOneToOne: false
            referencedRelation: "mercybridge_needs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mercybridge_need_ai_screenings_need_id_fkey"
            columns: ["need_id"]
            isOneToOne: false
            referencedRelation: "mercybridge_public_needs"
            referencedColumns: ["id"]
          },
        ]
      }
      mercybridge_need_documents: {
        Row: {
          created_at: string | null
          document_type: string
          extracted_fields: Json | null
          extraction_confidence: number | null
          extraction_status: Database["public"]["Enums"]["mercybridge_document_extraction_status"]
          id: string
          need_id: string
          purged_at: string | null
          retention_until: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          safe_summary: Json | null
          storage_path: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          document_type?: string
          extracted_fields?: Json | null
          extraction_confidence?: number | null
          extraction_status?: Database["public"]["Enums"]["mercybridge_document_extraction_status"]
          id?: string
          need_id: string
          purged_at?: string | null
          retention_until?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          safe_summary?: Json | null
          storage_path: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          document_type?: string
          extracted_fields?: Json | null
          extraction_confidence?: number | null
          extraction_status?: Database["public"]["Enums"]["mercybridge_document_extraction_status"]
          id?: string
          need_id?: string
          purged_at?: string | null
          retention_until?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          safe_summary?: Json | null
          storage_path?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mercybridge_need_documents_need_id_fkey"
            columns: ["need_id"]
            isOneToOne: false
            referencedRelation: "mercybridge_needs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mercybridge_need_documents_need_id_fkey"
            columns: ["need_id"]
            isOneToOne: false
            referencedRelation: "mercybridge_public_needs"
            referencedColumns: ["id"]
          },
        ]
      }
      mercybridge_needs: {
        Row: {
          ai_screening_status: string | null
          amount_funded: number
          amount_remaining: number | null
          amount_requested: number
          approved_at: string | null
          bill_amount: number
          biller_name: string
          category: Database["public"]["Enums"]["need_category"]
          created_at: string | null
          document_storage_paths: Json | null
          document_summary_retained: string | null
          document_urls: Json | null
          due_date: string | null
          funded_at: string | null
          hardship_attestation: boolean | null
          hardship_document_purged_at: string | null
          hardship_document_retention_until: string | null
          hardship_document_storage_paths: Json | null
          hardship_document_urls: Json | null
          hardship_proof_type: string | null
          hardship_summary_private: string
          hardship_summary_public: string | null
          id: string
          paid_at: string | null
          payee_id: string | null
          payee_match_confidence: number | null
          payee_match_status: Database["public"]["Enums"]["mercybridge_payee_match_status"]
          payee_review_notes: string | null
          payee_risk_score: number | null
          payment_confirmation_note: string | null
          payment_instructions_public: string | null
          payment_proof_url: string | null
          private_payment_details: string | null
          public_location: string | null
          purge_status: string | null
          raw_document_purged_at: string | null
          raw_document_retention_until: string | null
          rejected_at: string | null
          rejection_reason: string | null
          requester_consent_ai_review: boolean | null
          requester_consent_human_review: boolean | null
          requester_consent_no_guarantee: boolean | null
          requester_consent_temp_storage: boolean | null
          requester_disclosure_acknowledged_at: string | null
          requester_disclosure_version: string | null
          requester_id: string
          review_notes: string | null
          reviewer_id: string | null
          status: Database["public"]["Enums"]["need_status"]
          submitted_at: string | null
          title: string
          updated_at: string | null
          urgency_level: Database["public"]["Enums"]["urgency_level"]
          verification_level: Database["public"]["Enums"]["verification_level"]
        }
        Insert: {
          ai_screening_status?: string | null
          amount_funded?: number
          amount_remaining?: number | null
          amount_requested: number
          approved_at?: string | null
          bill_amount: number
          biller_name: string
          category: Database["public"]["Enums"]["need_category"]
          created_at?: string | null
          document_storage_paths?: Json | null
          document_summary_retained?: string | null
          document_urls?: Json | null
          due_date?: string | null
          funded_at?: string | null
          hardship_attestation?: boolean | null
          hardship_document_purged_at?: string | null
          hardship_document_retention_until?: string | null
          hardship_document_storage_paths?: Json | null
          hardship_document_urls?: Json | null
          hardship_proof_type?: string | null
          hardship_summary_private: string
          hardship_summary_public?: string | null
          id?: string
          paid_at?: string | null
          payee_id?: string | null
          payee_match_confidence?: number | null
          payee_match_status?: Database["public"]["Enums"]["mercybridge_payee_match_status"]
          payee_review_notes?: string | null
          payee_risk_score?: number | null
          payment_confirmation_note?: string | null
          payment_instructions_public?: string | null
          payment_proof_url?: string | null
          private_payment_details?: string | null
          public_location?: string | null
          purge_status?: string | null
          raw_document_purged_at?: string | null
          raw_document_retention_until?: string | null
          rejected_at?: string | null
          rejection_reason?: string | null
          requester_consent_ai_review?: boolean | null
          requester_consent_human_review?: boolean | null
          requester_consent_no_guarantee?: boolean | null
          requester_consent_temp_storage?: boolean | null
          requester_disclosure_acknowledged_at?: string | null
          requester_disclosure_version?: string | null
          requester_id: string
          review_notes?: string | null
          reviewer_id?: string | null
          status?: Database["public"]["Enums"]["need_status"]
          submitted_at?: string | null
          title: string
          updated_at?: string | null
          urgency_level?: Database["public"]["Enums"]["urgency_level"]
          verification_level?: Database["public"]["Enums"]["verification_level"]
        }
        Update: {
          ai_screening_status?: string | null
          amount_funded?: number
          amount_remaining?: number | null
          amount_requested?: number
          approved_at?: string | null
          bill_amount?: number
          biller_name?: string
          category?: Database["public"]["Enums"]["need_category"]
          created_at?: string | null
          document_storage_paths?: Json | null
          document_summary_retained?: string | null
          document_urls?: Json | null
          due_date?: string | null
          funded_at?: string | null
          hardship_attestation?: boolean | null
          hardship_document_purged_at?: string | null
          hardship_document_retention_until?: string | null
          hardship_document_storage_paths?: Json | null
          hardship_document_urls?: Json | null
          hardship_proof_type?: string | null
          hardship_summary_private?: string
          hardship_summary_public?: string | null
          id?: string
          paid_at?: string | null
          payee_id?: string | null
          payee_match_confidence?: number | null
          payee_match_status?: Database["public"]["Enums"]["mercybridge_payee_match_status"]
          payee_review_notes?: string | null
          payee_risk_score?: number | null
          payment_confirmation_note?: string | null
          payment_instructions_public?: string | null
          payment_proof_url?: string | null
          private_payment_details?: string | null
          public_location?: string | null
          purge_status?: string | null
          raw_document_purged_at?: string | null
          raw_document_retention_until?: string | null
          rejected_at?: string | null
          rejection_reason?: string | null
          requester_consent_ai_review?: boolean | null
          requester_consent_human_review?: boolean | null
          requester_consent_no_guarantee?: boolean | null
          requester_consent_temp_storage?: boolean | null
          requester_disclosure_acknowledged_at?: string | null
          requester_disclosure_version?: string | null
          requester_id?: string
          review_notes?: string | null
          reviewer_id?: string | null
          status?: Database["public"]["Enums"]["need_status"]
          submitted_at?: string | null
          title?: string
          updated_at?: string | null
          urgency_level?: Database["public"]["Enums"]["urgency_level"]
          verification_level?: Database["public"]["Enums"]["verification_level"]
        }
        Relationships: [
          {
            foreignKeyName: "mercybridge_needs_payee_id_fkey"
            columns: ["payee_id"]
            isOneToOne: false
            referencedRelation: "mercybridge_payees"
            referencedColumns: ["id"]
          },
        ]
      }
      mercybridge_payee_aliases: {
        Row: {
          alias_text: string
          confidence: number
          created_at: string | null
          id: string
          normalized_alias: string
          payee_id: string
          source: string
        }
        Insert: {
          alias_text: string
          confidence?: number
          created_at?: string | null
          id?: string
          normalized_alias: string
          payee_id: string
          source?: string
        }
        Update: {
          alias_text?: string
          confidence?: number
          created_at?: string | null
          id?: string
          normalized_alias?: string
          payee_id?: string
          source?: string
        }
        Relationships: [
          {
            foreignKeyName: "mercybridge_payee_aliases_payee_id_fkey"
            columns: ["payee_id"]
            isOneToOne: false
            referencedRelation: "mercybridge_payees"
            referencedColumns: ["id"]
          },
        ]
      }
      mercybridge_payee_payment_methods: {
        Row: {
          ach_details_encrypted: string | null
          check_payable_to: string | null
          created_at: string | null
          id: string
          last_successful_payment_at: string | null
          mailing_address: Json | null
          method_type: string
          notes: string | null
          payee_id: string
          payment_url: string | null
          phone: string | null
          phone_payment_allowed: boolean
          requires_account_number: boolean
          requires_invoice_number: boolean
          status: string
          updated_at: string | null
        }
        Insert: {
          ach_details_encrypted?: string | null
          check_payable_to?: string | null
          created_at?: string | null
          id?: string
          last_successful_payment_at?: string | null
          mailing_address?: Json | null
          method_type: string
          notes?: string | null
          payee_id: string
          payment_url?: string | null
          phone?: string | null
          phone_payment_allowed?: boolean
          requires_account_number?: boolean
          requires_invoice_number?: boolean
          status?: string
          updated_at?: string | null
        }
        Update: {
          ach_details_encrypted?: string | null
          check_payable_to?: string | null
          created_at?: string | null
          id?: string
          last_successful_payment_at?: string | null
          mailing_address?: Json | null
          method_type?: string
          notes?: string | null
          payee_id?: string
          payment_url?: string | null
          phone?: string | null
          phone_payment_allowed?: boolean
          requires_account_number?: boolean
          requires_invoice_number?: boolean
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mercybridge_payee_payment_methods_payee_id_fkey"
            columns: ["payee_id"]
            isOneToOne: false
            referencedRelation: "mercybridge_payees"
            referencedColumns: ["id"]
          },
        ]
      }
      mercybridge_payee_verifications: {
        Row: {
          created_at: string | null
          evidence: Json | null
          id: string
          need_id: string | null
          notes: string | null
          payee_id: string
          result: string
          reviewer_id: string | null
          verification_type: string
        }
        Insert: {
          created_at?: string | null
          evidence?: Json | null
          id?: string
          need_id?: string | null
          notes?: string | null
          payee_id: string
          result: string
          reviewer_id?: string | null
          verification_type: string
        }
        Update: {
          created_at?: string | null
          evidence?: Json | null
          id?: string
          need_id?: string | null
          notes?: string | null
          payee_id?: string
          result?: string
          reviewer_id?: string | null
          verification_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "mercybridge_payee_verifications_need_id_fkey"
            columns: ["need_id"]
            isOneToOne: false
            referencedRelation: "mercybridge_needs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mercybridge_payee_verifications_need_id_fkey"
            columns: ["need_id"]
            isOneToOne: false
            referencedRelation: "mercybridge_public_needs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mercybridge_payee_verifications_payee_id_fkey"
            columns: ["payee_id"]
            isOneToOne: false
            referencedRelation: "mercybridge_payees"
            referencedColumns: ["id"]
          },
        ]
      }
      mercybridge_payees: {
        Row: {
          address: Json | null
          category: Database["public"]["Enums"]["mercybridge_payee_category"]
          created_at: string | null
          created_by: string | null
          display_name: string
          ein_or_tax_id_encrypted: string | null
          id: string
          last_verified_at: string | null
          legal_name: string
          normalized_name: string
          phone: string | null
          risk_score: number
          suspended_at: string | null
          suspension_reason: string | null
          trust_score: number
          updated_at: string | null
          verification_level: number
          verification_status: Database["public"]["Enums"]["mercybridge_payee_verification_status"]
          website: string | null
        }
        Insert: {
          address?: Json | null
          category?: Database["public"]["Enums"]["mercybridge_payee_category"]
          created_at?: string | null
          created_by?: string | null
          display_name: string
          ein_or_tax_id_encrypted?: string | null
          id?: string
          last_verified_at?: string | null
          legal_name: string
          normalized_name: string
          phone?: string | null
          risk_score?: number
          suspended_at?: string | null
          suspension_reason?: string | null
          trust_score?: number
          updated_at?: string | null
          verification_level?: number
          verification_status?: Database["public"]["Enums"]["mercybridge_payee_verification_status"]
          website?: string | null
        }
        Update: {
          address?: Json | null
          category?: Database["public"]["Enums"]["mercybridge_payee_category"]
          created_at?: string | null
          created_by?: string | null
          display_name?: string
          ein_or_tax_id_encrypted?: string | null
          id?: string
          last_verified_at?: string | null
          legal_name?: string
          normalized_name?: string
          phone?: string | null
          risk_score?: number
          suspended_at?: string | null
          suspension_reason?: string | null
          trust_score?: number
          updated_at?: string | null
          verification_level?: number
          verification_status?: Database["public"]["Enums"]["mercybridge_payee_verification_status"]
          website?: string | null
        }
        Relationships: []
      }
      mercybridge_payment_attempts: {
        Row: {
          amount: number
          confirmation_number: string | null
          created_at: string | null
          failed_reason: string | null
          id: string
          method: string
          need_id: string
          paid_at: string | null
          payee_id: string | null
          payment_method_id: string | null
          receipt_storage_path: string | null
          reviewer_id: string | null
          settled_at: string | null
          status: Database["public"]["Enums"]["mercybridge_payment_attempt_status"]
          updated_at: string | null
        }
        Insert: {
          amount: number
          confirmation_number?: string | null
          created_at?: string | null
          failed_reason?: string | null
          id?: string
          method: string
          need_id: string
          paid_at?: string | null
          payee_id?: string | null
          payment_method_id?: string | null
          receipt_storage_path?: string | null
          reviewer_id?: string | null
          settled_at?: string | null
          status?: Database["public"]["Enums"]["mercybridge_payment_attempt_status"]
          updated_at?: string | null
        }
        Update: {
          amount?: number
          confirmation_number?: string | null
          created_at?: string | null
          failed_reason?: string | null
          id?: string
          method?: string
          need_id?: string
          paid_at?: string | null
          payee_id?: string | null
          payment_method_id?: string | null
          receipt_storage_path?: string | null
          reviewer_id?: string | null
          settled_at?: string | null
          status?: Database["public"]["Enums"]["mercybridge_payment_attempt_status"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mercybridge_payment_attempts_need_id_fkey"
            columns: ["need_id"]
            isOneToOne: false
            referencedRelation: "mercybridge_needs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mercybridge_payment_attempts_need_id_fkey"
            columns: ["need_id"]
            isOneToOne: false
            referencedRelation: "mercybridge_public_needs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mercybridge_payment_attempts_payee_id_fkey"
            columns: ["payee_id"]
            isOneToOne: false
            referencedRelation: "mercybridge_payees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mercybridge_payment_attempts_payment_method_id_fkey"
            columns: ["payment_method_id"]
            isOneToOne: false
            referencedRelation: "mercybridge_payee_payment_methods"
            referencedColumns: ["id"]
          },
        ]
      }
      mercybridge_risk_flags: {
        Row: {
          created_at: string | null
          evidence: Json | null
          flag_type: string
          id: string
          message: string
          need_id: string | null
          payee_id: string | null
          requester_id: string | null
          resolved_at: string | null
          resolved_by: string | null
          severity: Database["public"]["Enums"]["mercybridge_risk_severity"]
        }
        Insert: {
          created_at?: string | null
          evidence?: Json | null
          flag_type: string
          id?: string
          message: string
          need_id?: string | null
          payee_id?: string | null
          requester_id?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: Database["public"]["Enums"]["mercybridge_risk_severity"]
        }
        Update: {
          created_at?: string | null
          evidence?: Json | null
          flag_type?: string
          id?: string
          message?: string
          need_id?: string | null
          payee_id?: string | null
          requester_id?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: Database["public"]["Enums"]["mercybridge_risk_severity"]
        }
        Relationships: [
          {
            foreignKeyName: "mercybridge_risk_flags_need_id_fkey"
            columns: ["need_id"]
            isOneToOne: false
            referencedRelation: "mercybridge_needs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mercybridge_risk_flags_need_id_fkey"
            columns: ["need_id"]
            isOneToOne: false
            referencedRelation: "mercybridge_public_needs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mercybridge_risk_flags_payee_id_fkey"
            columns: ["payee_id"]
            isOneToOne: false
            referencedRelation: "mercybridge_payees"
            referencedColumns: ["id"]
          },
        ]
      }
      mercybridge_status_updates: {
        Row: {
          created_at: string | null
          id: string
          message: string
          need_id: string
          type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          need_id: string
          type?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          need_id?: string
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mercybridge_status_updates_need_id_fkey"
            columns: ["need_id"]
            isOneToOne: false
            referencedRelation: "mercybridge_needs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mercybridge_status_updates_need_id_fkey"
            columns: ["need_id"]
            isOneToOne: false
            referencedRelation: "mercybridge_public_needs"
            referencedColumns: ["id"]
          },
        ]
      }
      mercybridge_stewardship_plans: {
        Row: {
          created_at: string | null
          creditor_scripts: Json | null
          disclaimer: string | null
          encouragement: string | null
          financial_summary: string
          generated_at: string | null
          hardship_budget_suggestions: string | null
          id: string
          need_id: string | null
          next_step: string | null
          requester_id: string
          scripture_references: Json | null
          seven_day_plan: Json | null
          urgency_ranking: Json | null
        }
        Insert: {
          created_at?: string | null
          creditor_scripts?: Json | null
          disclaimer?: string | null
          encouragement?: string | null
          financial_summary: string
          generated_at?: string | null
          hardship_budget_suggestions?: string | null
          id?: string
          need_id?: string | null
          next_step?: string | null
          requester_id: string
          scripture_references?: Json | null
          seven_day_plan?: Json | null
          urgency_ranking?: Json | null
        }
        Update: {
          created_at?: string | null
          creditor_scripts?: Json | null
          disclaimer?: string | null
          encouragement?: string | null
          financial_summary?: string
          generated_at?: string | null
          hardship_budget_suggestions?: string | null
          id?: string
          need_id?: string | null
          next_step?: string | null
          requester_id?: string
          scripture_references?: Json | null
          seven_day_plan?: Json | null
          urgency_ranking?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "mercybridge_stewardship_plans_need_id_fkey"
            columns: ["need_id"]
            isOneToOne: false
            referencedRelation: "mercybridge_needs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mercybridge_stewardship_plans_need_id_fkey"
            columns: ["need_id"]
            isOneToOne: false
            referencedRelation: "mercybridge_public_needs"
            referencedColumns: ["id"]
          },
        ]
      }
      mercybridge_stewardship_tasks: {
        Row: {
          completed_at: string | null
          created_at: string | null
          description: string | null
          due_date: string | null
          id: string
          plan_id: string
          status: Database["public"]["Enums"]["task_status"]
          title: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          plan_id: string
          status?: Database["public"]["Enums"]["task_status"]
          title: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          plan_id?: string
          status?: Database["public"]["Enums"]["task_status"]
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "mercybridge_stewardship_tasks_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "mercybridge_stewardship_plans"
            referencedColumns: ["id"]
          },
        ]
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
            referencedRelation: "notification_activity_summary"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "moderation_appeals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "moderation_appeals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_quota_status"
            referencedColumns: ["user_id"]
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
          emotions: Json | null
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
          emotions?: Json | null
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
          emotions?: Json | null
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
          channel: string | null
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
          metadata: Json | null
          notification_type: string
          priority: string | null
          read_at: string | null
          schedule_id: string | null
          scheduled_for: string | null
          template_key: string
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          action_link?: string | null
          channel?: string | null
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
          metadata?: Json | null
          notification_type?: string
          priority?: string | null
          read_at?: string | null
          schedule_id?: string | null
          scheduled_for?: string | null
          template_key: string
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          action_link?: string | null
          channel?: string | null
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
          metadata?: Json | null
          notification_type?: string
          priority?: string | null
          read_at?: string | null
          schedule_id?: string | null
          scheduled_for?: string | null
          template_key?: string
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      payment_events: {
        Row: {
          created_at: string
          event_type: string
          id: string
          object_id: string | null
          payload: string | null
          processed: boolean
          stripe_event_id: string
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          object_id?: string | null
          payload?: string | null
          processed?: boolean
          stripe_event_id: string
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          object_id?: string | null
          payload?: string | null
          processed?: boolean
          stripe_event_id?: string
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
      podcast_generation_jobs: {
        Row: {
          completed_at: string | null
          created_at: string | null
          episode_id: string
          error_message: string | null
          id: string
          lock_until: string | null
          payload: Json
          started_at: string | null
          status: string
          user_id: string
          worker_id: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          episode_id: string
          error_message?: string | null
          id?: string
          lock_until?: string | null
          payload: Json
          started_at?: string | null
          status?: string
          user_id: string
          worker_id?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          episode_id?: string
          error_message?: string | null
          id?: string
          lock_until?: string | null
          payload?: Json
          started_at?: string | null
          status?: string
          user_id?: string
          worker_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "podcast_generation_jobs_episode_id_fkey"
            columns: ["episode_id"]
            isOneToOne: false
            referencedRelation: "ai_podcast_episodes"
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
          last_prayed_at: string | null
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
          last_prayed_at?: string | null
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
          last_prayed_at?: string | null
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
          church_id: string | null
          created_at: string | null
          dev_simulate_pro: boolean | null
          display_name: string | null
          first_name: string | null
          gracebill_role: string | null
          id: string
          is_admin: boolean | null
          is_anonymous_sponsor: boolean | null
          is_banned: boolean
          kyc_verified: boolean
          last_active: string | null
          last_name: string | null
          mercybridge_role: string | null
          needs_helped_count: number | null
          needs_profile_rebuild: boolean | null
          notification_preferences: Json | null
          prayer_streak: number | null
          prayer_streak_updated_at: string | null
          profile_image_url: string | null
          profile_rebuild_requested_at: string | null
          stripe_customer_id: string | null
          timezone: string | null
          total_contributed: number | null
          updated_at: string | null
        }
        Insert: {
          banned_at?: string | null
          banned_by?: string | null
          banned_reason?: string | null
          bio?: string | null
          church_id?: string | null
          created_at?: string | null
          dev_simulate_pro?: boolean | null
          display_name?: string | null
          first_name?: string | null
          gracebill_role?: string | null
          id: string
          is_admin?: boolean | null
          is_anonymous_sponsor?: boolean | null
          is_banned?: boolean
          kyc_verified?: boolean
          last_active?: string | null
          last_name?: string | null
          mercybridge_role?: string | null
          needs_helped_count?: number | null
          needs_profile_rebuild?: boolean | null
          notification_preferences?: Json | null
          prayer_streak?: number | null
          prayer_streak_updated_at?: string | null
          profile_image_url?: string | null
          profile_rebuild_requested_at?: string | null
          stripe_customer_id?: string | null
          timezone?: string | null
          total_contributed?: number | null
          updated_at?: string | null
        }
        Update: {
          banned_at?: string | null
          banned_by?: string | null
          banned_reason?: string | null
          bio?: string | null
          church_id?: string | null
          created_at?: string | null
          dev_simulate_pro?: boolean | null
          display_name?: string | null
          first_name?: string | null
          gracebill_role?: string | null
          id?: string
          is_admin?: boolean | null
          is_anonymous_sponsor?: boolean | null
          is_banned?: boolean
          kyc_verified?: boolean
          last_active?: string | null
          last_name?: string | null
          mercybridge_role?: string | null
          needs_helped_count?: number | null
          needs_profile_rebuild?: boolean | null
          notification_preferences?: Json | null
          prayer_streak?: number | null
          prayer_streak_updated_at?: string | null
          profile_image_url?: string | null
          profile_rebuild_requested_at?: string | null
          stripe_customer_id?: string | null
          timezone?: string | null
          total_contributed?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
        ]
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
      scripture_memory_packs: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          id: string
          is_public: boolean
          name: string
          pack_type: string
          topic: string | null
          updated_at: string
          user_id: string
          verse_count: number
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean
          name: string
          pack_type?: string
          topic?: string | null
          updated_at?: string
          user_id: string
          verse_count?: number
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean
          name?: string
          pack_type?: string
          topic?: string | null
          updated_at?: string
          user_id?: string
          verse_count?: number
        }
        Relationships: []
      }
      scripture_memory_reviews: {
        Row: {
          accuracy_score: number | null
          created_at: string
          device_type: string | null
          id: string
          pack_id: string | null
          recall_quality: number
          recording_duration_seconds: number | null
          recording_url: string | null
          review_mode: string
          spoken_text: string | null
          time_spent_seconds: number
          user_id: string
          verse_id: string
        }
        Insert: {
          accuracy_score?: number | null
          created_at?: string
          device_type?: string | null
          id?: string
          pack_id?: string | null
          recall_quality: number
          recording_duration_seconds?: number | null
          recording_url?: string | null
          review_mode?: string
          spoken_text?: string | null
          time_spent_seconds?: number
          user_id: string
          verse_id: string
        }
        Update: {
          accuracy_score?: number | null
          created_at?: string
          device_type?: string | null
          id?: string
          pack_id?: string | null
          recall_quality?: number
          recording_duration_seconds?: number | null
          recording_url?: string | null
          review_mode?: string
          spoken_text?: string | null
          time_spent_seconds?: number
          user_id?: string
          verse_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "scripture_memory_reviews_pack_id_fkey"
            columns: ["pack_id"]
            isOneToOne: false
            referencedRelation: "scripture_memory_packs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scripture_memory_reviews_verse_id_fkey"
            columns: ["verse_id"]
            isOneToOne: false
            referencedRelation: "scripture_memory_verses"
            referencedColumns: ["id"]
          },
        ]
      }
      scripture_memory_stats: {
        Row: {
          active_verses: number
          current_streak: number
          last_review_at: string | null
          longest_streak: number
          mastered_verses: number
          total_practice_seconds: number
          total_reviews: number
          total_verses: number
          updated_at: string
          user_id: string
        }
        Insert: {
          active_verses?: number
          current_streak?: number
          last_review_at?: string | null
          longest_streak?: number
          mastered_verses?: number
          total_practice_seconds?: number
          total_reviews?: number
          total_verses?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          active_verses?: number
          current_streak?: number
          last_review_at?: string | null
          longest_streak?: number
          mastered_verses?: number
          total_practice_seconds?: number
          total_reviews?: number
          total_verses?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      scripture_memory_verses: {
        Row: {
          audio_generated_at: string | null
          audio_url: string | null
          correct_count: number
          created_at: string
          ease_factor: number
          id: string
          interval_days: number
          last_reviewed_at: string | null
          mastery_level: string
          next_review_at: string
          notes: string | null
          pack_id: string | null
          review_count: number
          tags: string[] | null
          translation: string
          updated_at: string
          user_id: string
          verse_reference: string
          verse_text: string
        }
        Insert: {
          audio_generated_at?: string | null
          audio_url?: string | null
          correct_count?: number
          created_at?: string
          ease_factor?: number
          id?: string
          interval_days?: number
          last_reviewed_at?: string | null
          mastery_level?: string
          next_review_at?: string
          notes?: string | null
          pack_id?: string | null
          review_count?: number
          tags?: string[] | null
          translation?: string
          updated_at?: string
          user_id: string
          verse_reference: string
          verse_text: string
        }
        Update: {
          audio_generated_at?: string | null
          audio_url?: string | null
          correct_count?: number
          created_at?: string
          ease_factor?: number
          id?: string
          interval_days?: number
          last_reviewed_at?: string | null
          mastery_level?: string
          next_review_at?: string
          notes?: string | null
          pack_id?: string | null
          review_count?: number
          tags?: string[] | null
          translation?: string
          updated_at?: string
          user_id?: string
          verse_reference?: string
          verse_text?: string
        }
        Relationships: [
          {
            foreignKeyName: "scripture_memory_verses_pack_id_fkey"
            columns: ["pack_id"]
            isOneToOne: false
            referencedRelation: "scripture_memory_packs"
            referencedColumns: ["id"]
          },
        ]
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
      sermon_artifacts: {
        Row: {
          artifact_type: string
          content: Json
          created_at: string
          id: string
          metadata: Json | null
          sermon_id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          artifact_type: string
          content: Json
          created_at?: string
          id?: string
          metadata?: Json | null
          sermon_id: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          artifact_type?: string
          content?: Json
          created_at?: string
          id?: string
          metadata?: Json | null
          sermon_id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sermon_artifacts_sermon_id_fkey"
            columns: ["sermon_id"]
            isOneToOne: false
            referencedRelation: "sermon_summaries"
            referencedColumns: ["id"]
          },
        ]
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
      sermon_processing_jobs: {
        Row: {
          completed_at: string | null
          created_at: string
          error_message: string | null
          gemini_model_used: string | null
          id: string
          input_audio_url: string | null
          input_date: string | null
          input_speaker: string | null
          input_title: string | null
          input_transcript: string | null
          input_video_url: string | null
          lock_until: string | null
          output_action_steps: Json | null
          output_applications: Json | null
          output_key_scriptures: Json | null
          output_main_points: Json | null
          output_prayer_guide: string | null
          output_raw_response: string | null
          output_reflection_questions: Json | null
          output_summary: string | null
          output_tags: Json | null
          processing_time_ms: number | null
          sermon_id: string | null
          started_at: string | null
          status: string
          user_id: string
          worker_id: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          gemini_model_used?: string | null
          id?: string
          input_audio_url?: string | null
          input_date?: string | null
          input_speaker?: string | null
          input_title?: string | null
          input_transcript?: string | null
          input_video_url?: string | null
          lock_until?: string | null
          output_action_steps?: Json | null
          output_applications?: Json | null
          output_key_scriptures?: Json | null
          output_main_points?: Json | null
          output_prayer_guide?: string | null
          output_raw_response?: string | null
          output_reflection_questions?: Json | null
          output_summary?: string | null
          output_tags?: Json | null
          processing_time_ms?: number | null
          sermon_id?: string | null
          started_at?: string | null
          status?: string
          user_id: string
          worker_id?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          gemini_model_used?: string | null
          id?: string
          input_audio_url?: string | null
          input_date?: string | null
          input_speaker?: string | null
          input_title?: string | null
          input_transcript?: string | null
          input_video_url?: string | null
          lock_until?: string | null
          output_action_steps?: Json | null
          output_applications?: Json | null
          output_key_scriptures?: Json | null
          output_main_points?: Json | null
          output_prayer_guide?: string | null
          output_raw_response?: string | null
          output_reflection_questions?: Json | null
          output_summary?: string | null
          output_tags?: Json | null
          processing_time_ms?: number | null
          sermon_id?: string | null
          started_at?: string | null
          status?: string
          user_id?: string
          worker_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sermon_processing_jobs_sermon_id_fkey"
            columns: ["sermon_id"]
            isOneToOne: false
            referencedRelation: "sermon_summaries"
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
          streak_current: number | null
          streak_longest: number | null
          suggested_time: string | null
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
          streak_current?: number | null
          streak_longest?: number | null
          suggested_time?: string | null
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
          streak_current?: number | null
          streak_longest?: number | null
          suggested_time?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      spiritual_memory_edges: {
        Row: {
          created_at: string
          id: string
          metadata: Json | null
          rationale: string | null
          relation: string
          source_node_id: string
          strength: number
          target_node_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          metadata?: Json | null
          rationale?: string | null
          relation: string
          source_node_id: string
          strength?: number
          target_node_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          metadata?: Json | null
          rationale?: string | null
          relation?: string
          source_node_id?: string
          strength?: number
          target_node_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "spiritual_memory_edges_source_node_id_fkey"
            columns: ["source_node_id"]
            isOneToOne: false
            referencedRelation: "spiritual_memory_nodes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "spiritual_memory_edges_target_node_id_fkey"
            columns: ["target_node_id"]
            isOneToOne: false
            referencedRelation: "spiritual_memory_nodes"
            referencedColumns: ["id"]
          },
        ]
      }
      spiritual_memory_nodes: {
        Row: {
          created_at: string
          detail: string | null
          id: string
          label: string
          last_seen_at: string | null
          metadata: Json | null
          node_type: string
          source_count: number
          updated_at: string
          user_id: string
          weight: number
        }
        Insert: {
          created_at?: string
          detail?: string | null
          id?: string
          label: string
          last_seen_at?: string | null
          metadata?: Json | null
          node_type: string
          source_count?: number
          updated_at?: string
          user_id: string
          weight?: number
        }
        Update: {
          created_at?: string
          detail?: string | null
          id?: string
          label?: string
          last_seen_at?: string | null
          metadata?: Json | null
          node_type?: string
          source_count?: number
          updated_at?: string
          user_id?: string
          weight?: number
        }
        Relationships: []
      }
      spiritual_pattern_summaries: {
        Row: {
          category: string
          created_at: string
          id: string
          label: string
          metadata: Json | null
          strength: number
          summary: string | null
          supporting_signals: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          label: string
          metadata?: Json | null
          strength?: number
          summary?: string | null
          supporting_signals?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          label?: string
          metadata?: Json | null
          strength?: number
          summary?: string | null
          supporting_signals?: string[] | null
          updated_at?: string
          user_id?: string
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
      spiritual_timeline_events: {
        Row: {
          created_at: string
          event_type: string
          id: string
          metadata: Json | null
          occurred_at: string
          source_id: string | null
          source_table: string | null
          summary: string | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          metadata?: Json | null
          occurred_at: string
          source_id?: string | null
          source_table?: string | null
          summary?: string | null
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          metadata?: Json | null
          occurred_at?: string
          source_id?: string | null
          source_table?: string | null
          summary?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      stewardship_progress: {
        Row: {
          budget_plan: Json
          completion_percentage: number
          counseling_sessions_attended: number
          created_at: string
          debt_snowball_data: Json
          grace_score_history: Json
          id: string
          module_data: Json
          module_name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          budget_plan?: Json
          completion_percentage?: number
          counseling_sessions_attended?: number
          created_at?: string
          debt_snowball_data?: Json
          grace_score_history?: Json
          id?: string
          module_data?: Json
          module_name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          budget_plan?: Json
          completion_percentage?: number
          counseling_sessions_attended?: number
          created_at?: string
          debt_snowball_data?: Json
          grace_score_history?: Json
          id?: string
          module_data?: Json
          module_name?: string
          updated_at?: string
          user_id?: string
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
          feedback_signal: string | null
          feedback_type: string
          id: string
          memory_item_id: string | null
          message_id: string | null
          original_value: string | null
          processed: boolean | null
          processed_at: string | null
          response_axis: string | null
          source_metadata: Json | null
          user_id: string
        }
        Insert: {
          additional_context?: string | null
          ai_feature?: string | null
          context_type?: string | null
          corrected_value?: string | null
          created_at?: string | null
          feedback_signal?: string | null
          feedback_type: string
          id?: string
          memory_item_id?: string | null
          message_id?: string | null
          original_value?: string | null
          processed?: boolean | null
          processed_at?: string | null
          response_axis?: string | null
          source_metadata?: Json | null
          user_id: string
        }
        Update: {
          additional_context?: string | null
          ai_feature?: string | null
          context_type?: string | null
          corrected_value?: string | null
          created_at?: string | null
          feedback_signal?: string | null
          feedback_type?: string
          id?: string
          memory_item_id?: string | null
          message_id?: string | null
          original_value?: string | null
          processed?: boolean | null
          processed_at?: string | null
          response_axis?: string | null
          source_metadata?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_ai_feedback_memory_item_id_fkey"
            columns: ["memory_item_id"]
            isOneToOne: false
            referencedRelation: "user_memory_items"
            referencedColumns: ["id"]
          },
        ]
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
      user_daily_quota: {
        Row: {
          llm_calls_used: number
          max_llm_calls: number
          quota_date: string
          user_id: string
        }
        Insert: {
          llm_calls_used?: number
          max_llm_calls?: number
          quota_date?: string
          user_id: string
        }
        Update: {
          llm_calls_used?: number
          max_llm_calls?: number
          quota_date?: string
          user_id?: string
        }
        Relationships: []
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
      user_memory_items: {
        Row: {
          attributes: Json
          confidence: number
          created_at: string
          decay_expires_at: string | null
          first_observed_at: string
          id: string
          item_key: string
          kind: string
          last_observed_at: string
          source_count: number
          source_refs: Json
          status: string
          summary: string
          updated_at: string
          user_control: Json
          user_id: string
        }
        Insert: {
          attributes?: Json
          confidence?: number
          created_at?: string
          decay_expires_at?: string | null
          first_observed_at?: string
          id?: string
          item_key: string
          kind: string
          last_observed_at?: string
          source_count?: number
          source_refs?: Json
          status?: string
          summary: string
          updated_at?: string
          user_control?: Json
          user_id: string
        }
        Update: {
          attributes?: Json
          confidence?: number
          created_at?: string
          decay_expires_at?: string | null
          first_observed_at?: string
          id?: string
          item_key?: string
          kind?: string
          last_observed_at?: string
          source_count?: number
          source_refs?: Json
          status?: string
          summary?: string
          updated_at?: string
          user_control?: Json
          user_id?: string
        }
        Relationships: []
      }
      user_memory_observations: {
        Row: {
          attributes: Json
          confidence: number
          created_at: string
          id: string
          item_key: string
          kind: string
          observation_key: string
          observed_at: string
          source_metadata: Json
          source_ref: string | null
          source_type: string
          summary: string
          user_id: string
        }
        Insert: {
          attributes?: Json
          confidence?: number
          created_at?: string
          id?: string
          item_key: string
          kind: string
          observation_key: string
          observed_at?: string
          source_metadata?: Json
          source_ref?: string | null
          source_type: string
          summary: string
          user_id: string
        }
        Update: {
          attributes?: Json
          confidence?: number
          created_at?: string
          id?: string
          item_key?: string
          kind?: string
          observation_key?: string
          observed_at?: string
          source_metadata?: Json
          source_ref?: string | null
          source_type?: string
          summary?: string
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
      user_personality_state: {
        Row: {
          context_version: number
          core_voice: Json
          created_at: string
          current_stance: string
          last_refreshed_at: string
          memory_digest: Json
          present_state: Json
          response_style: Json
          stable_profile: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          context_version?: number
          core_voice?: Json
          created_at?: string
          current_stance?: string
          last_refreshed_at?: string
          memory_digest?: Json
          present_state?: Json
          response_style?: Json
          stable_profile?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          context_version?: number
          core_voice?: Json
          created_at?: string
          current_stance?: string
          last_refreshed_at?: string
          memory_digest?: Json
          present_state?: Json
          response_style?: Json
          stable_profile?: Json
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
      user_tts_daily_quota: {
        Row: {
          calls_used: number
          max_calls: number
          quota_date: string
          tts_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          calls_used?: number
          max_calls: number
          quota_date: string
          tts_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          calls_used?: number
          max_calls?: number
          quota_date?: string
          tts_type?: string
          updated_at?: string
          user_id?: string
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
      vetting_results: {
        Row: {
          ai_model_version: string | null
          ai_reasoning: string | null
          bill_id: string
          created_at: string
          final_decision:
            | Database["public"]["Enums"]["vetting_decision_enum"]
            | null
          human_review_required: boolean
          id: string
          income_to_bill_ratio: number | null
          manipulation_flags: Json
          narrative_consistency_score: number | null
          ocr_confidence: number | null
          ocr_extracted_data: Json
          reviewed_at: string | null
          reviewer_id: string | null
          severity_classification:
            | Database["public"]["Enums"]["severity_classification_enum"]
            | null
        }
        Insert: {
          ai_model_version?: string | null
          ai_reasoning?: string | null
          bill_id: string
          created_at?: string
          final_decision?:
            | Database["public"]["Enums"]["vetting_decision_enum"]
            | null
          human_review_required?: boolean
          id?: string
          income_to_bill_ratio?: number | null
          manipulation_flags?: Json
          narrative_consistency_score?: number | null
          ocr_confidence?: number | null
          ocr_extracted_data?: Json
          reviewed_at?: string | null
          reviewer_id?: string | null
          severity_classification?:
            | Database["public"]["Enums"]["severity_classification_enum"]
            | null
        }
        Update: {
          ai_model_version?: string | null
          ai_reasoning?: string | null
          bill_id?: string
          created_at?: string
          final_decision?:
            | Database["public"]["Enums"]["vetting_decision_enum"]
            | null
          human_review_required?: boolean
          id?: string
          income_to_bill_ratio?: number | null
          manipulation_flags?: Json
          narrative_consistency_score?: number | null
          ocr_confidence?: number | null
          ocr_extracted_data?: Json
          reviewed_at?: string | null
          reviewer_id?: string | null
          severity_classification?:
            | Database["public"]["Enums"]["severity_classification_enum"]
            | null
        }
        Relationships: [
          {
            foreignKeyName: "vetting_results_bill_id_fkey"
            columns: ["bill_id"]
            isOneToOne: true
            referencedRelation: "bills"
            referencedColumns: ["id"]
          },
        ]
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
      welcome_emails_sent: {
        Row: {
          clicked: boolean | null
          created_at: string | null
          email: string
          email_type: string | null
          id: string
          opened: boolean | null
          replied: boolean | null
          sent_at: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          clicked?: boolean | null
          created_at?: string | null
          email: string
          email_type?: string | null
          id?: string
          opened?: boolean | null
          replied?: boolean | null
          sent_at?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          clicked?: boolean | null
          created_at?: string | null
          email?: string
          email_type?: string | null
          id?: string
          opened?: boolean | null
          replied?: boolean | null
          sent_at?: string | null
          updated_at?: string | null
          user_id?: string | null
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
      mercybridge_public_needs: {
        Row: {
          amount_funded: number | null
          amount_remaining: number | null
          amount_requested: number | null
          bill_amount: number | null
          biller_name: string | null
          category: Database["public"]["Enums"]["need_category"] | null
          due_date: string | null
          hardship_summary_public: string | null
          id: string | null
          payment_instructions_public: string | null
          public_location: string | null
          requester_id: string | null
          status: Database["public"]["Enums"]["need_status"] | null
          submitted_at: string | null
          title: string | null
          urgency_level: Database["public"]["Enums"]["urgency_level"] | null
          verification_level:
            | Database["public"]["Enums"]["verification_level"]
            | null
        }
        Insert: {
          amount_funded?: number | null
          amount_remaining?: number | null
          amount_requested?: number | null
          bill_amount?: number | null
          biller_name?: string | null
          category?: Database["public"]["Enums"]["need_category"] | null
          due_date?: string | null
          hardship_summary_public?: string | null
          id?: string | null
          payment_instructions_public?: string | null
          public_location?: string | null
          requester_id?: never
          status?: Database["public"]["Enums"]["need_status"] | null
          submitted_at?: string | null
          title?: string | null
          urgency_level?: Database["public"]["Enums"]["urgency_level"] | null
          verification_level?:
            | Database["public"]["Enums"]["verification_level"]
            | null
        }
        Update: {
          amount_funded?: number | null
          amount_remaining?: number | null
          amount_requested?: number | null
          bill_amount?: number | null
          biller_name?: string | null
          category?: Database["public"]["Enums"]["need_category"] | null
          due_date?: string | null
          hardship_summary_public?: string | null
          id?: string | null
          payment_instructions_public?: string | null
          public_location?: string | null
          requester_id?: never
          status?: Database["public"]["Enums"]["need_status"] | null
          submitted_at?: string | null
          title?: string | null
          urgency_level?: Database["public"]["Enums"]["urgency_level"] | null
          verification_level?:
            | Database["public"]["Enums"]["verification_level"]
            | null
        }
        Relationships: []
      }
      notification_activity_summary: {
        Row: {
          active_schedules: number | null
          first_name: string | null
          last_notification_at: string | null
          last_schedule_triggered_at: string | null
          read_notifications: number | null
          total_notifications: number | null
          total_schedules: number | null
          user_id: string | null
        }
        Relationships: []
      }
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
      user_quota_status: {
        Row: {
          created_at: string | null
          dev_simulate_pro: boolean | null
          display_name: string | null
          total_voice_chars_used: number | null
          total_whisper_seconds_used: number | null
          user_id: string | null
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
      calculate_next_review: {
        Args: {
          current_interval: number
          ease_factor: number
          recall_quality: number
        }
        Returns: {
          new_ease_factor: number
          new_interval: number
          new_mastery_level: string
        }[]
      }
      check_and_increment_quota: {
        Args: { p_max_calls?: number; p_user_id: string }
        Returns: {
          allowed: boolean
          remaining: number
          used: number
        }[]
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
      claim_tts_daily_quota: {
        Args: { p_max_calls: number; p_tts_type: string; p_user_id: string }
        Returns: {
          allowed: boolean
          remaining: number
          used: number
        }[]
      }
      cleanup_old_conversation_sessions: { Args: never; Returns: undefined }
      clear_profile_rebuild_flag: {
        Args: { p_user_id: string }
        Returns: undefined
      }
      complete_reading_day: {
        Args: { p_day_number: number; p_plan_id: string; p_user_id: string }
        Returns: boolean
      }
      create_default_notification_schedules: {
        Args: { p_user_id: string }
        Returns: undefined
      }
      create_test_pro_subscription: {
        Args: { user_id_param: string }
        Returns: undefined
      }
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
      get_people_mentions: {
        Args: { p_limit?: number; p_person_name: string }
        Returns: {
          book: string
          chapter: number
          id: string
          person_name: string
          role: string
          text: string
          verse: number
          verse_ref: string
        }[]
      }
      get_public_profiles: {
        Args: { p_user_ids: string[] }
        Returns: {
          display_name: string
          first_name: string
          id: string
          profile_image_url: string
        }[]
      }
      get_related_verses: {
        Args: { p_limit?: number; p_verse_id: string }
        Returns: {
          book: string
          chapter: number
          description: string
          id: string
          relationship_type: string
          strength: number
          text: string
          verse: number
          verse_ref: string
        }[]
      }
      get_spiritual_stats: {
        Args: { end_date: string; start_date: string }
        Returns: Json
      }
      get_verse_context: { Args: { p_verse_id: string }; Returns: Json }
      get_verse_people: {
        Args: { p_verse_id: string }
        Returns: {
          display_name: string
          era: string
          person_id: string
          person_name: string
          role: string
        }[]
      }
      get_verse_themes: {
        Args: { p_verse_id: string }
        Returns: {
          category: string
          display_name: string
          relevance_score: number
          theme_id: string
          theme_name: string
        }[]
      }
      get_verses_by_theme: {
        Args: { p_limit?: number; p_theme_name: string }
        Returns: {
          book: string
          chapter: number
          id: string
          relevance_score: number
          text: string
          theme_name: string
          verse: number
          verse_ref: string
        }[]
      }
      get_verses_within_hops: {
        Args: { p_limit?: number; p_max_hops?: number; p_verse_id: string }
        Returns: {
          book: string
          chapter: number
          hop_distance: number
          id: string
          path_relationships: string[]
          text: string
          verse: number
          verse_ref: string
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
          last_prayed_at: string | null
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
      is_mercybridge_admin: { Args: never; Returns: boolean }
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
      mark_mercybridge_message_read: {
        Args: { message_id: string }
        Returns: undefined
      }
      mercybridge_find_payee_matches: {
        Args: { query_text: string; result_limit?: number }
        Returns: {
          category: Database["public"]["Enums"]["mercybridge_payee_category"]
          confidence: number
          display_name: string
          legal_name: string
          matched_alias: string
          payee_id: string
          risk_score: number
          trust_score: number
          verification_level: number
          verification_status: Database["public"]["Enums"]["mercybridge_payee_verification_status"]
        }[]
      }
      mercybridge_mark_need_paid: {
        Args: {
          p_confirmation_note: string
          p_need_id: string
          p_payment_proof_path?: string
        }
        Returns: {
          ai_screening_status: string | null
          amount_funded: number
          amount_remaining: number | null
          amount_requested: number
          approved_at: string | null
          bill_amount: number
          biller_name: string
          category: Database["public"]["Enums"]["need_category"]
          created_at: string | null
          document_storage_paths: Json | null
          document_summary_retained: string | null
          document_urls: Json | null
          due_date: string | null
          funded_at: string | null
          hardship_attestation: boolean | null
          hardship_document_purged_at: string | null
          hardship_document_retention_until: string | null
          hardship_document_storage_paths: Json | null
          hardship_document_urls: Json | null
          hardship_proof_type: string | null
          hardship_summary_private: string
          hardship_summary_public: string | null
          id: string
          paid_at: string | null
          payee_id: string | null
          payee_match_confidence: number | null
          payee_match_status: Database["public"]["Enums"]["mercybridge_payee_match_status"]
          payee_review_notes: string | null
          payee_risk_score: number | null
          payment_confirmation_note: string | null
          payment_instructions_public: string | null
          payment_proof_url: string | null
          private_payment_details: string | null
          public_location: string | null
          purge_status: string | null
          raw_document_purged_at: string | null
          raw_document_retention_until: string | null
          rejected_at: string | null
          rejection_reason: string | null
          requester_consent_ai_review: boolean | null
          requester_consent_human_review: boolean | null
          requester_consent_no_guarantee: boolean | null
          requester_consent_temp_storage: boolean | null
          requester_disclosure_acknowledged_at: string | null
          requester_disclosure_version: string | null
          requester_id: string
          review_notes: string | null
          reviewer_id: string | null
          status: Database["public"]["Enums"]["need_status"]
          submitted_at: string | null
          title: string
          updated_at: string | null
          urgency_level: Database["public"]["Enums"]["urgency_level"]
          verification_level: Database["public"]["Enums"]["verification_level"]
        }
        SetofOptions: {
          from: "*"
          to: "mercybridge_needs"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      mercybridge_mark_paid: {
        Args: { p_amount: number; p_need_id: string; p_payment_method?: string }
        Returns: {
          amount_paid: number
          amount_remaining: number
          contribution_id: string
          need_id: string
          status: Database["public"]["Enums"]["need_status"]
        }[]
      }
      mercybridge_normalize_text: { Args: { input: string }; Returns: string }
      mercybridge_recalculate_payee_trust: {
        Args: { target_payee_id: string }
        Returns: undefined
      }
      mercybridge_review_need: {
        Args: {
          p_action: Database["public"]["Enums"]["review_action"]
          p_checklist?: Json
          p_decision_reason?: string
          p_need_id: string
          p_notes?: string
          p_public_summary?: string
          p_rejection_reason?: string
          p_verification_level?: Database["public"]["Enums"]["verification_level"]
        }
        Returns: {
          ai_screening_status: string | null
          amount_funded: number
          amount_remaining: number | null
          amount_requested: number
          approved_at: string | null
          bill_amount: number
          biller_name: string
          category: Database["public"]["Enums"]["need_category"]
          created_at: string | null
          document_storage_paths: Json | null
          document_summary_retained: string | null
          document_urls: Json | null
          due_date: string | null
          funded_at: string | null
          hardship_attestation: boolean | null
          hardship_document_purged_at: string | null
          hardship_document_retention_until: string | null
          hardship_document_storage_paths: Json | null
          hardship_document_urls: Json | null
          hardship_proof_type: string | null
          hardship_summary_private: string
          hardship_summary_public: string | null
          id: string
          paid_at: string | null
          payee_id: string | null
          payee_match_confidence: number | null
          payee_match_status: Database["public"]["Enums"]["mercybridge_payee_match_status"]
          payee_review_notes: string | null
          payee_risk_score: number | null
          payment_confirmation_note: string | null
          payment_instructions_public: string | null
          payment_proof_url: string | null
          private_payment_details: string | null
          public_location: string | null
          purge_status: string | null
          raw_document_purged_at: string | null
          raw_document_retention_until: string | null
          rejected_at: string | null
          rejection_reason: string | null
          requester_consent_ai_review: boolean | null
          requester_consent_human_review: boolean | null
          requester_consent_no_guarantee: boolean | null
          requester_consent_temp_storage: boolean | null
          requester_disclosure_acknowledged_at: string | null
          requester_disclosure_version: string | null
          requester_id: string
          review_notes: string | null
          reviewer_id: string | null
          status: Database["public"]["Enums"]["need_status"]
          submitted_at: string | null
          title: string
          updated_at: string | null
          urgency_level: Database["public"]["Enums"]["urgency_level"]
          verification_level: Database["public"]["Enums"]["verification_level"]
        }
        SetofOptions: {
          from: "*"
          to: "mercybridge_needs"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      mercybridge_set_need_payee_match: {
        Args: {
          p_confidence?: number | null
          p_match_status: Database["public"]["Enums"]["mercybridge_payee_match_status"]
          p_need_id: string
          p_payee_id: string | null
        }
        Returns: {
          ai_screening_status: string | null
          amount_funded: number
          amount_remaining: number | null
          amount_requested: number
          approved_at: string | null
          bill_amount: number
          biller_name: string
          category: Database["public"]["Enums"]["need_category"]
          created_at: string | null
          document_storage_paths: Json | null
          document_summary_retained: string | null
          document_urls: Json | null
          due_date: string | null
          funded_at: string | null
          hardship_attestation: boolean | null
          hardship_document_purged_at: string | null
          hardship_document_retention_until: string | null
          hardship_document_storage_paths: Json | null
          hardship_document_urls: Json | null
          hardship_proof_type: string | null
          hardship_summary_private: string
          hardship_summary_public: string | null
          id: string
          paid_at: string | null
          payee_id: string | null
          payee_match_confidence: number | null
          payee_match_status: Database["public"]["Enums"]["mercybridge_payee_match_status"]
          payee_review_notes: string | null
          payee_risk_score: number | null
          payment_confirmation_note: string | null
          payment_instructions_public: string | null
          payment_proof_url: string | null
          private_payment_details: string | null
          public_location: string | null
          purge_status: string | null
          raw_document_purged_at: string | null
          raw_document_retention_until: string | null
          rejected_at: string | null
          rejection_reason: string | null
          requester_consent_ai_review: boolean | null
          requester_consent_human_review: boolean | null
          requester_consent_no_guarantee: boolean | null
          requester_consent_temp_storage: boolean | null
          requester_disclosure_acknowledged_at: string | null
          requester_disclosure_version: string | null
          requester_id: string
          review_notes: string | null
          reviewer_id: string | null
          status: Database["public"]["Enums"]["need_status"]
          submitted_at: string | null
          title: string
          updated_at: string | null
          urgency_level: Database["public"]["Enums"]["urgency_level"]
          verification_level: Database["public"]["Enums"]["verification_level"]
        }
        SetofOptions: {
          from: "*"
          to: "mercybridge_needs"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      mercybridge_create_need: {
        Args: {
          p_document_paths?: string[]
          p_hardship_paths?: string[]
          p_idempotency_key: string
          p_payload: Json
        }
        Returns: Json
      }
      mercybridge_get_need_private_documents: {
        Args: { p_need_id: string }
        Returns: Json
      }
      mercybridge_submit_additional_documents: {
        Args: {
          p_document_paths: string[]
          p_hardship_paths: string[]
          p_need_id: string
        }
        Returns: {
          ai_screening_status: string | null
          amount_funded: number
          amount_remaining: number | null
          amount_requested: number
          approved_at: string | null
          bill_amount: number
          biller_name: string
          category: Database["public"]["Enums"]["need_category"]
          created_at: string | null
          document_storage_paths: Json | null
          document_summary_retained: string | null
          document_urls: Json | null
          due_date: string | null
          funded_at: string | null
          hardship_attestation: boolean | null
          hardship_document_purged_at: string | null
          hardship_document_retention_until: string | null
          hardship_document_storage_paths: Json | null
          hardship_document_urls: Json | null
          hardship_proof_type: string | null
          hardship_summary_private: string
          hardship_summary_public: string | null
          id: string
          paid_at: string | null
          payee_id: string | null
          payee_match_confidence: number | null
          payee_match_status: Database["public"]["Enums"]["mercybridge_payee_match_status"]
          payee_review_notes: string | null
          payee_risk_score: number | null
          payment_confirmation_note: string | null
          payment_instructions_public: string | null
          payment_proof_url: string | null
          private_payment_details: string | null
          public_location: string | null
          purge_status: string | null
          raw_document_purged_at: string | null
          raw_document_retention_until: string | null
          rejected_at: string | null
          rejection_reason: string | null
          requester_consent_ai_review: boolean | null
          requester_consent_human_review: boolean | null
          requester_consent_no_guarantee: boolean | null
          requester_consent_temp_storage: boolean | null
          requester_disclosure_acknowledged_at: string | null
          requester_disclosure_version: string | null
          requester_id: string
          review_notes: string | null
          reviewer_id: string | null
          status: Database["public"]["Enums"]["need_status"]
          submitted_at: string | null
          title: string
          updated_at: string | null
          urgency_level: Database["public"]["Enums"]["urgency_level"]
          verification_level: Database["public"]["Enums"]["verification_level"]
        }
        SetofOptions: {
          from: "*"
          to: "mercybridge_needs"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      reset_user_quota: {
        Args: { new_max_calls?: number; target_user_id: string }
        Returns: undefined
      }
      search_bible_with_graph: {
        Args: {
          p_graph_hops?: number
          p_graph_weight?: number
          p_limit?: number
          p_query_embedding: string
          p_similarity_weight?: number
        }
        Returns: {
          book: string
          chapter: number
          combined_score: number
          graph_score: number
          id: string
          similarity_score: number
          source: string
          text: string
          verse: number
          verse_ref: string
        }[]
      }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
      update_scripture_memory_stats: {
        Args: { p_user_id: string }
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
      update_verse_after_review: {
        Args: {
          p_recall_quality: number
          p_time_spent: number
          p_verse_id: string
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
      upsert_verse_embedding: {
        Args: {
          p_book: string
          p_chapter: number
          p_embedding: string
          p_text: string
          p_translation?: string
          p_verse: number
        }
        Returns: string
      }
      verify_contribution: {
        Args: { action: string; contribution_id: string; reason?: string }
        Returns: {
          admin_review_notes: string | null
          admin_reviewed_at: string | null
          admin_reviewed_by: string | null
          ai_confidence_score: number | null
          ai_review_queue_reason: string | null
          ai_verification_result: Json | null
          ai_verification_status: string | null
          ai_verified_at: string | null
          amount: number
          confirmation_number: string | null
          created_at: string | null
          fiscal_sponsor_id: string | null
          gift_note: string | null
          id: string
          is_anonymous: boolean
          need_id: string
          payment_method: string
          proof_notes: string | null
          proof_storage_path: string | null
          proof_url: string | null
          rejection_reason: string | null
          sponsor_ack_direct_pay: boolean | null
          sponsor_ack_mercybridge_no_custody: boolean | null
          sponsor_ack_no_reversal_guarantee: boolean | null
          sponsor_ack_not_tax_deductible: boolean | null
          sponsor_disclosure_acknowledged_at: string | null
          sponsor_disclosure_version: string | null
          sponsor_id: string | null
          status: Database["public"]["Enums"]["contribution_status"]
          stripe_payment_intent_id: string | null
          updated_at: string | null
          verified_at: string | null
          verified_by: string | null
        }
        SetofOptions: {
          from: "*"
          to: "mercybridge_contributions"
          isOneToOne: true
          isSetofReturn: false
        }
      }
    }
    Enums: {
      bill_category_enum:
        | "medical"
        | "housing"
        | "utilities"
        | "transportation"
        | "education"
        | "food"
        | "other"
      bill_status_enum: "active" | "funded" | "expired" | "paid"
      church_membership_role_enum: "member" | "deacon" | "admin"
      contribution_status: "pending" | "completed" | "refunded" | "failed"
      creditor_payment_method_enum: "stripe_transfer" | "check" | "ach"
      creditor_verification_status_enum: "pending" | "verified" | "rejected"
      donation_status_enum: "pending" | "completed" | "refunded" | "failed"
      mercybridge_document_extraction_status:
        | "pending"
        | "processing"
        | "completed"
        | "failed"
        | "reviewed"
      mercybridge_payee_category:
        | "utility"
        | "rent_landlord"
        | "property_manager"
        | "medical"
        | "dental"
        | "auto_repair"
        | "insurance"
        | "childcare"
        | "school"
        | "church_partner"
        | "government_fee"
        | "telecom"
        | "other"
      mercybridge_payee_match_status:
        | "not_checked"
        | "matched"
        | "possible_match"
        | "new_payee_pending"
        | "no_match"
        | "rejected"
      mercybridge_payee_verification_status:
        | "unverified"
        | "pending_review"
        | "limited_verified"
        | "verified"
        | "trusted"
        | "suspended"
        | "rejected"
      mercybridge_payment_attempt_status:
        | "pending"
        | "initiated"
        | "paid"
        | "confirmed"
        | "settled"
        | "failed"
        | "reversed"
        | "cancelled"
      mercybridge_risk_severity: "low" | "medium" | "high" | "critical"
      need_category:
        | "utilities"
        | "rent_housing"
        | "medical"
        | "transportation"
        | "childcare"
        | "food"
        | "other_essentials"
      need_status:
        | "draft"
        | "submitted"
        | "more_info_needed"
        | "approved"
        | "partially_funded"
        | "funded"
        | "payment_pending"
        | "paid"
        | "rejected"
        | "cancelled"
        | "archived"
      prayer_category_enum:
        | "financial"
        | "health"
        | "employment"
        | "family"
        | "other"
      review_action: "approved" | "rejected" | "more_info" | "escalated"
      session_status_enum: "scheduled" | "completed" | "cancelled" | "no_show"
      severity_classification_enum: "emergency" | "chronic" | "lifestyle"
      task_status: "pending" | "in_progress" | "completed" | "skipped"
      urgency_level: "critical" | "high" | "medium" | "low"
      urgency_level_enum: "critical" | "high" | "medium" | "low"
      verification_level:
        | "level_1_document"
        | "level_2_identity"
        | "level_3_hardship"
        | "level_4_community"
      vetting_decision_enum:
        | "auto_approved"
        | "human_approved"
        | "rejected"
        | "flagged"
      vetting_status_enum:
        | "pending"
        | "approved"
        | "rejected"
        | "human_review"
        | "live"
        | "funded"
        | "paid"
        | "expired"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      bill_category_enum: [
        "medical",
        "housing",
        "utilities",
        "transportation",
        "education",
        "food",
        "other",
      ],
      bill_status_enum: ["active", "funded", "expired", "paid"],
      church_membership_role_enum: ["member", "deacon", "admin"],
      contribution_status: ["pending", "completed", "refunded", "failed"],
      creditor_payment_method_enum: ["stripe_transfer", "check", "ach"],
      creditor_verification_status_enum: ["pending", "verified", "rejected"],
      donation_status_enum: ["pending", "completed", "refunded", "failed"],
      mercybridge_document_extraction_status: [
        "pending",
        "processing",
        "completed",
        "failed",
        "reviewed",
      ],
      mercybridge_payee_category: [
        "utility",
        "rent_landlord",
        "property_manager",
        "medical",
        "dental",
        "auto_repair",
        "insurance",
        "childcare",
        "school",
        "church_partner",
        "government_fee",
        "telecom",
        "other",
      ],
      mercybridge_payee_match_status: [
        "not_checked",
        "matched",
        "possible_match",
        "new_payee_pending",
        "no_match",
        "rejected",
      ],
      mercybridge_payee_verification_status: [
        "unverified",
        "pending_review",
        "limited_verified",
        "verified",
        "trusted",
        "suspended",
        "rejected",
      ],
      mercybridge_payment_attempt_status: [
        "pending",
        "initiated",
        "paid",
        "confirmed",
        "settled",
        "failed",
        "reversed",
        "cancelled",
      ],
      mercybridge_risk_severity: ["low", "medium", "high", "critical"],
      need_category: [
        "utilities",
        "rent_housing",
        "medical",
        "transportation",
        "childcare",
        "food",
        "other_essentials",
      ],
      need_status: [
        "draft",
        "submitted",
        "more_info_needed",
        "approved",
        "partially_funded",
        "funded",
        "payment_pending",
        "paid",
        "rejected",
        "cancelled",
        "archived",
      ],
      prayer_category_enum: [
        "financial",
        "health",
        "employment",
        "family",
        "other",
      ],
      review_action: ["approved", "rejected", "more_info", "escalated"],
      session_status_enum: ["scheduled", "completed", "cancelled", "no_show"],
      severity_classification_enum: ["emergency", "chronic", "lifestyle"],
      task_status: ["pending", "in_progress", "completed", "skipped"],
      urgency_level: ["critical", "high", "medium", "low"],
      urgency_level_enum: ["critical", "high", "medium", "low"],
      verification_level: [
        "level_1_document",
        "level_2_identity",
        "level_3_hardship",
        "level_4_community",
      ],
      vetting_decision_enum: [
        "auto_approved",
        "human_approved",
        "rejected",
        "flagged",
      ],
      vetting_status_enum: [
        "pending",
        "approved",
        "rejected",
        "human_review",
        "live",
        "funded",
        "paid",
        "expired",
      ],
    },
  },
} as const
