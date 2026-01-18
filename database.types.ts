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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      answ_comment: {
        Row: {
          answer_id: number
          created_at: string
          id: number
          reply_id: number | null
          text: string
          user_id: string
        }
        Insert: {
          answer_id: number
          created_at?: string
          id?: number
          reply_id?: number | null
          text: string
          user_id?: string
        }
        Update: {
          answer_id?: number
          created_at?: string
          id?: number
          reply_id?: number | null
          text?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "answ_comment_answer_id_fkey"
            columns: ["answer_id"]
            isOneToOne: false
            referencedRelation: "answers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "answ_comment_reply_id_fkey"
            columns: ["reply_id"]
            isOneToOne: false
            referencedRelation: "answ_comment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "answ_comment_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      answ_vote: {
        Row: {
          answer_id: number
          created_at: string
          id: number
          user_id: string
          vote: boolean | null
        }
        Insert: {
          answer_id?: number
          created_at?: string
          id?: number
          user_id?: string
          vote?: boolean | null
        }
        Update: {
          answer_id?: number
          created_at?: string
          id?: number
          user_id?: string
          vote?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "answ_vote_answer_id_fkey"
            columns: ["answer_id"]
            isOneToOne: false
            referencedRelation: "answers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "answ_vote_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      answers: {
        Row: {
          content: string
          created_at: string
          helpful: boolean | null
          id: number
          question_id: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          helpful?: boolean | null
          id?: number
          question_id?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Update: {
          content?: string
          created_at?: string
          helpful?: boolean | null
          id?: number
          question_id?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "answers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      code_ai_question: {
        Row: {
          answer: string | null
          code: string
          code_id: number
          created_at: string
          firstname: string
          id: number
          options: string[]
          question: string
          user_id: string
        }
        Insert: {
          answer?: string | null
          code: string
          code_id: number
          created_at?: string
          firstname: string
          id?: number
          options: string[]
          question: string
          user_id: string
        }
        Update: {
          answer?: string | null
          code?: string
          code_id?: number
          created_at?: string
          firstname?: string
          id?: number
          options?: string[]
          question?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "code_ai_question_code_id_fkey"
            columns: ["code_id"]
            isOneToOne: false
            referencedRelation: "code_explain_request"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "code_ai_question_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      code_ai_review: {
        Row: {
          answer: string
          code: string
          code_id: number
          created_at: string
          explanation: Json
          firstname: string
          greetings: Json
          id: number
          tips: Json
          user_id: string
        }
        Insert: {
          answer: string
          code: string
          code_id: number
          created_at?: string
          explanation: Json
          firstname: string
          greetings: Json
          id?: number
          tips: Json
          user_id: string
        }
        Update: {
          answer?: string
          code?: string
          code_id?: number
          created_at?: string
          explanation?: Json
          firstname?: string
          greetings?: Json
          id?: number
          tips?: Json
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "code_ai_review_code_id_fkey"
            columns: ["code_id"]
            isOneToOne: false
            referencedRelation: "code_explain_request"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "code_ai_review_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      code_explain_request: {
        Row: {
          code: string
          created_at: string
          firstname: string
          id: number
          is_analyzed: boolean | null
          language: string
          user_id: string
        }
        Insert: {
          code: string
          created_at?: string
          firstname: string
          id?: number
          is_analyzed?: boolean | null
          language: string
          user_id: string
        }
        Update: {
          code?: string
          created_at?: string
          firstname?: string
          id?: number
          is_analyzed?: boolean | null
          language?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "code_explain_request_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      comment_likes: {
        Row: {
          created_at: string
          id: number
          reference_id: number
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          reference_id: number
          type: string
          user_id?: string
        }
        Update: {
          created_at?: string
          id?: number
          reference_id?: number
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comment_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_code_challenge: {
        Row: {
          challenge: string
          created_at: string
          id: string
        }
        Insert: {
          challenge: string
          created_at?: string
          id?: string
        }
        Update: {
          challenge?: string
          created_at?: string
          id?: string
        }
        Relationships: []
      }
      daily_code_user: {
        Row: {
          answer: string
          challenge_id: string
          created_at: string
          id: string
          is_correct: boolean | null
          language: string
          penjelasan: string | null
          user_id: string
        }
        Insert: {
          answer: string
          challenge_id: string
          created_at?: string
          id?: string
          is_correct?: boolean | null
          language: string
          penjelasan?: string | null
          user_id: string
        }
        Update: {
          answer?: string
          challenge_id?: string
          created_at?: string
          id?: string
          is_correct?: boolean | null
          language?: string
          penjelasan?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_code_user_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "daily_code_challenge"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "daily_code_user_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback: {
        Row: {
          created_at: string
          feedback: Json
          id: number
          request_id: number
          user_id: string
        }
        Insert: {
          created_at?: string
          feedback: Json
          id?: number
          request_id: number
          user_id: string
        }
        Update: {
          created_at?: string
          feedback?: Json
          id?: number
          request_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "feedback_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "request_feedback"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feedback_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback_comment: {
        Row: {
          created_at: string
          feedback_id: number
          id: number
          reply_id: number | null
          text: string
          user_id: string
        }
        Insert: {
          created_at?: string
          feedback_id: number
          id?: number
          reply_id?: number | null
          text: string
          user_id: string
        }
        Update: {
          created_at?: string
          feedback_id?: number
          id?: number
          reply_id?: number | null
          text?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "feedback_comment_feedback_id_fkey"
            columns: ["feedback_id"]
            isOneToOne: false
            referencedRelation: "feedback"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feedback_comment_reply_id_fkey"
            columns: ["reply_id"]
            isOneToOne: false
            referencedRelation: "feedback_comment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feedback_comment_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback_vote: {
        Row: {
          created_at: string
          feedback_id: number
          id: number
          user_id: string
          vote: boolean
        }
        Insert: {
          created_at?: string
          feedback_id: number
          id?: number
          user_id: string
          vote?: boolean
        }
        Update: {
          created_at?: string
          feedback_id?: number
          id?: number
          user_id?: string
          vote?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "feedback_vote_feedback_id_fkey"
            columns: ["feedback_id"]
            isOneToOne: false
            referencedRelation: "feedback"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feedback_vote_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          content: string
          created_at: string
          id: number
          read: boolean | null
          receiver_id: string
          reference_id: number | null
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: number
          read?: boolean | null
          receiver_id: string
          reference_id?: number | null
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: number
          read?: boolean | null
          receiver_id?: string
          reference_id?: number | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          bio: string | null
          created_at: string
          email: string
          firstname: string
          fullname: string
          id: string
          id_dummy: number
          lastname: string | null
          level: number | null
          motto: string | null
          profile_pic: string | null
          updated_at: string | null
          xp: number | null
        }
        Insert: {
          bio?: string | null
          created_at?: string
          email: string
          firstname: string
          fullname: string
          id?: string
          id_dummy?: number
          lastname?: string | null
          level?: number | null
          motto?: string | null
          profile_pic?: string | null
          updated_at?: string | null
          xp?: number | null
        }
        Update: {
          bio?: string | null
          created_at?: string
          email?: string
          firstname?: string
          fullname?: string
          id?: string
          id_dummy?: number
          lastname?: string | null
          level?: number | null
          motto?: string | null
          profile_pic?: string | null
          updated_at?: string | null
          xp?: number | null
        }
        Relationships: []
      }
      quest_comment: {
        Row: {
          created_at: string
          id: number
          question_id: number
          reply_id: number | null
          text: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          question_id: number
          reply_id?: number | null
          text: string
          user_id?: string
        }
        Update: {
          created_at?: string
          id?: number
          question_id?: number
          reply_id?: number | null
          text?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quest_comment_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quest_comment_reply_id_fkey"
            columns: ["reply_id"]
            isOneToOne: false
            referencedRelation: "quest_comment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quest_comment_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      quest_tags: {
        Row: {
          created_at: string
          id: number
          question_id: number
          tag_id: number
        }
        Insert: {
          created_at?: string
          id?: number
          question_id: number
          tag_id: number
        }
        Update: {
          created_at?: string
          id?: number
          question_id?: number
          tag_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "quest_tags_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quest_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      quest_vote: {
        Row: {
          created_at: string
          id: number
          question_id: number
          user_id: string
          vote: boolean
        }
        Insert: {
          created_at?: string
          id?: number
          question_id: number
          user_id?: string
          vote: boolean
        }
        Update: {
          created_at?: string
          id?: number
          question_id?: number
          user_id?: string
          vote?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "quest_vote_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quest_vote_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      questions: {
        Row: {
          accepted_answer_id: number | null
          body: Json
          closed: boolean
          created_at: string
          excerpt: string | null
          id: number
          slug: string | null
          title: string
          updated_at: string | null
          user_id: string
          view: number | null
        }
        Insert: {
          accepted_answer_id?: number | null
          body: Json
          closed?: boolean
          created_at?: string
          excerpt?: string | null
          id?: number
          slug?: string | null
          title: string
          updated_at?: string | null
          user_id?: string
          view?: number | null
        }
        Update: {
          accepted_answer_id?: number | null
          body?: Json
          closed?: boolean
          created_at?: string
          excerpt?: string | null
          id?: number
          slug?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
          view?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "questions_accepted_answer_id_fkey"
            columns: ["accepted_answer_id"]
            isOneToOne: false
            referencedRelation: "answers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      report: {
        Row: {
          created_at: string
          id: number
          reason: string
          reference: number
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          reason: string
          reference: number
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: number
          reason?: string
          reference?: number
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "report_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      request_feedback: {
        Row: {
          created_at: string
          description: Json | null
          icon_url: string | null
          id: number
          project_url: string
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: Json | null
          icon_url?: string | null
          id?: number
          project_url: string
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: Json | null
          icon_url?: string | null
          id?: number
          project_url?: string
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "request_feedback_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      request_tags: {
        Row: {
          created_at: string
          id: number
          request_id: number
          tag_id: number
        }
        Insert: {
          created_at?: string
          id?: number
          request_id: number
          tag_id: number
        }
        Update: {
          created_at?: string
          id?: number
          request_id?: number
          tag_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "request_tags_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "request_feedback"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "request_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      request_vote: {
        Row: {
          created_at: string
          id: number
          request_id: number
          user_id: string
          vote: boolean
        }
        Insert: {
          created_at?: string
          id?: number
          request_id: number
          user_id: string
          vote?: boolean
        }
        Update: {
          created_at?: string
          id?: number
          request_id?: number
          user_id?: string
          vote?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "request_vote_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "request_feedback"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "request_vote_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_quest: {
        Row: {
          created_at: string
          id: number
          question_id: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          question_id: number
          user_id?: string
        }
        Update: {
          created_at?: string
          id?: number
          question_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_quest_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_quest_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_req: {
        Row: {
          created_at: string
          id: number
          request_id: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          request_id: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: number
          request_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_req_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "request_feedback"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_req_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tags: {
        Row: {
          created_at: string
          id: number
          tag: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          tag?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          tag?: string | null
        }
        Relationships: []
      }
      user_auth_limit: {
        Row: {
          id: number
          last_auth_updated_at: string
          type: string | null
          user_id: string
        }
        Insert: {
          id?: number
          last_auth_updated_at?: string
          type?: string | null
          user_id?: string
        }
        Update: {
          id?: number
          last_auth_updated_at?: string
          type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_experience: {
        Row: {
          created_at: string
          description: string | null
          end_date: string | null
          id: number
          organization_name: string
          role: string
          start_date: string
          user_id: string
          user_id_dummy: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: number
          organization_name: string
          role: string
          start_date: string
          user_id?: string
          user_id_dummy?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: number
          organization_name?: string
          role?: string
          start_date?: string
          user_id?: string
          user_id_dummy?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_experience_user_id_dummy_fkey"
            columns: ["user_id_dummy"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id_dummy"]
          },
          {
            foreignKeyName: "user_experience_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_links: {
        Row: {
          created_at: string
          id: number
          platform: string | null
          url: string
          user_id: string
          user_id_dummy: number | null
        }
        Insert: {
          created_at?: string
          id?: number
          platform?: string | null
          url: string
          user_id: string
          user_id_dummy?: number | null
        }
        Update: {
          created_at?: string
          id?: number
          platform?: string | null
          url?: string
          user_id?: string
          user_id_dummy?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_links_user_id_dummy_fkey"
            columns: ["user_id_dummy"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id_dummy"]
          },
          {
            foreignKeyName: "user_links_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_skills: {
        Row: {
          created_at: string
          endorsed_count: number | null
          id: number
          level: string
          skill_name: string
          user_id: string
          user_id_dummy: number | null
        }
        Insert: {
          created_at?: string
          endorsed_count?: number | null
          id?: number
          level?: string
          skill_name: string
          user_id?: string
          user_id_dummy?: number | null
        }
        Update: {
          created_at?: string
          endorsed_count?: number | null
          id?: number
          level?: string
          skill_name?: string
          user_id?: string
          user_id_dummy?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_skills_user_id_dummy_fkey"
            columns: ["user_id_dummy"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id_dummy"]
          },
          {
            foreignKeyName: "user_skills_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      xp_events: {
        Row: {
          amount: number
          created_at: string
          id: string
          metadata: Json | null
          reason: string
          reference: number
          source_user_id: string
          status: string | null
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          metadata?: Json | null
          reason: string
          reference: number
          source_user_id: string
          status?: string | null
          type: string
          user_id?: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          metadata?: Json | null
          reason?: string
          reference?: number
          source_user_id?: string
          status?: string | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "xp_events_source_user_id_fkey"
            columns: ["source_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "xp_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      apply_xp_event:
        | {
            Args: { _event_id: number }
            Returns: {
              error: true
            } & "Could not choose the best candidate function between: public.apply_xp_event(_event_id => int4), public.apply_xp_event(_event_id => uuid). Try renaming the parameters or the function itself in the database so function overloading can be resolved"
          }
        | {
            Args: { _event_id: string }
            Returns: {
              error: true
            } & "Could not choose the best candidate function between: public.apply_xp_event(_event_id => int4), public.apply_xp_event(_event_id => uuid). Try renaming the parameters or the function itself in the database so function overloading can be resolved"
          }
      calculate_level: { Args: { total_xp: number }; Returns: number }
      handle_comment_notification:
        | {
            Args: {
              p_comment_id: number
              p_comment_table: string
              p_comment_text: string
              p_comment_user: number
              p_parent_id: number
              p_reply_id: number
            }
            Returns: undefined
          }
        | {
            Args: {
              p_comment_id: number
              p_comment_table: string
              p_comment_text: string
              p_comment_user: string
              p_parent_id: number
              p_reply_id: number
            }
            Returns: undefined
          }
      reject_xp_event: { Args: { _event_id: string }; Returns: undefined }
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
