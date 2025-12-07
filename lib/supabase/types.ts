export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5";
  };
  public: {
    Tables: {
      ai_review: {
        Row: {
          code_logic: number;
          code_neat: number;
          code_security: number;
          content: string;
          created_at: string;
          id: number;
          overall_perform: number;
          submission_id: number;
        };
        Insert: {
          code_logic: number;
          code_neat: number;
          code_security: number;
          content: string;
          created_at?: string;
          id?: number;
          overall_perform: number;
          submission_id: number;
        };
        Update: {
          code_logic?: number;
          code_neat?: number;
          code_security?: number;
          content?: string;
          created_at?: string;
          id?: number;
          overall_perform?: number;
          submission_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "ai_review_submission_id_fkey";
            columns: ["submission_id"];
            isOneToOne: false;
            referencedRelation: "code_submission";
            referencedColumns: ["id"];
          },
        ];
      };
      answ_comment: {
        Row: {
          answer_id: number;
          created_at: string;
          id: number;
          reply_id: number | null;
          text: string;
          user_id: string;
        };
        Insert: {
          answer_id: number;
          created_at?: string;
          id?: number;
          reply_id?: number | null;
          text: string;
          user_id?: string;
        };
        Update: {
          answer_id?: number;
          created_at?: string;
          id?: number;
          reply_id?: number | null;
          text?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "answ_comment_answer_id_fkey";
            columns: ["answer_id"];
            isOneToOne: false;
            referencedRelation: "answers";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "answ_comment_reply_id_fkey";
            columns: ["reply_id"];
            isOneToOne: false;
            referencedRelation: "answ_comment";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "answ_comment_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      answ_vote: {
        Row: {
          answer_id: number;
          created_at: string;
          user_id: string;
        };
        Insert: {
          answer_id?: number;
          created_at?: string;
          user_id?: string;
        };
        Update: {
          answer_id?: number;
          created_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "answ_vote_answer_id_fkey";
            columns: ["answer_id"];
            isOneToOne: true;
            referencedRelation: "answers";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "answ_vote_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      answers: {
        Row: {
          content: string;
          created_at: string;
          helpful: boolean | null;
          id: number;
          question_id: number | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          content: string;
          created_at?: string;
          helpful?: boolean | null;
          id?: number;
          question_id?: number | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Update: {
          content?: string;
          created_at?: string;
          helpful?: boolean | null;
          id?: number;
          question_id?: number | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "answers_question_id_fkey";
            columns: ["question_id"];
            isOneToOne: false;
            referencedRelation: "questions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "answers_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      blogs: {
        Row: {
          body: Json;
          cover_url: string | null;
          created_at: string;
          id: number;
          reads_count: number | null;
          title: string;
          user_id: string;
          views: number | null;
        };
        Insert: {
          body: Json;
          cover_url?: string | null;
          created_at?: string;
          id?: number;
          reads_count?: number | null;
          title: string;
          user_id?: string;
          views?: number | null;
        };
        Update: {
          body?: Json;
          cover_url?: string | null;
          created_at?: string;
          id?: number;
          reads_count?: number | null;
          title?: string;
          user_id?: string;
          views?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "blogs_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      blogs_comment: {
        Row: {
          blog_id: number;
          created_at: string;
          id: number;
          reply_id: number | null;
          text: string;
          user_id: string;
        };
        Insert: {
          blog_id: number;
          created_at?: string;
          id?: number;
          reply_id?: number | null;
          text: string;
          user_id?: string;
        };
        Update: {
          blog_id?: number;
          created_at?: string;
          id?: number;
          reply_id?: number | null;
          text?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "blogs_comment_blog_id_fkey";
            columns: ["blog_id"];
            isOneToOne: false;
            referencedRelation: "blogs";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "blogs_comment_reply_id_fkey";
            columns: ["reply_id"];
            isOneToOne: false;
            referencedRelation: "blogs_comment";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "blogs_comment_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      code_submission: {
        Row: {
          code: string;
          created_at: string;
          id: number;
          language: string;
          user_id: string;
        };
        Insert: {
          code: string;
          created_at?: string;
          id?: number;
          language: string;
          user_id?: string;
        };
        Update: {
          code?: string;
          created_at?: string;
          id?: number;
          language?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "code_submission_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          bio: string | null;
          created_at: string;
          email: string;
          firstname: string;
          fullname: string;
          id: string;
          lastname: string | null;
          level: number | null;
          motto: string | null;
          phone: string | null;
          profile_pic: string | null;
          updated_at: string | null;
          xp: number | null;
        };
        Insert: {
          bio?: string | null;
          created_at?: string;
          email: string;
          firstname: string;
          fullname: string;
          id?: string;
          lastname?: string | null;
          level?: number | null;
          motto?: string | null;
          phone?: string | null;
          profile_pic?: string | null;
          updated_at?: string | null;
          xp?: number | null;
        };
        Update: {
          bio?: string | null;
          created_at?: string;
          email?: string;
          firstname?: string;
          fullname?: string;
          id?: string;
          lastname?: string | null;
          level?: number | null;
          motto?: string | null;
          phone?: string | null;
          profile_pic?: string | null;
          updated_at?: string | null;
          xp?: number | null;
        };
        Relationships: [];
      };
      quest_comment: {
        Row: {
          created_at: string;
          id: number;
          question_id: number;
          reply_id: number | null;
          text: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: number;
          question_id: number;
          reply_id?: number | null;
          text: string;
          user_id?: string;
        };
        Update: {
          created_at?: string;
          id?: number;
          question_id?: number;
          reply_id?: number | null;
          text?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "quest_comment_question_id_fkey";
            columns: ["question_id"];
            isOneToOne: false;
            referencedRelation: "questions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "quest_comment_reply_id_fkey";
            columns: ["reply_id"];
            isOneToOne: false;
            referencedRelation: "quest_comment";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "quest_comment_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      quest_tags: {
        Row: {
          created_at: string;
          id: number;
          question_id: number;
          tag_id: number;
        };
        Insert: {
          created_at?: string;
          id?: number;
          question_id: number;
          tag_id: number;
        };
        Update: {
          created_at?: string;
          id?: number;
          question_id?: number;
          tag_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "quest_tags_question_id_fkey";
            columns: ["question_id"];
            isOneToOne: false;
            referencedRelation: "questions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "quest_tags_tag_id_fkey";
            columns: ["tag_id"];
            isOneToOne: false;
            referencedRelation: "tags";
            referencedColumns: ["id"];
          },
        ];
      };
      quest_vote: {
        Row: {
          created_at: string;
          question_id: number;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          question_id: number;
          user_id?: string;
        };
        Update: {
          created_at?: string;
          question_id?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "quest_vote_question_id_fkey";
            columns: ["question_id"];
            isOneToOne: true;
            referencedRelation: "questions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "quest_vote_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      questions: {
        Row: {
          accepted_answer_id: number | null;
          body: Json;
          closed: boolean;
          created_at: string;
          excerpt: string | null;
          id: number;
          slug: string | null;
          title: string;
          updated_at: string | null;
          user_id: string;
          view: number | null;
        };
        Insert: {
          accepted_answer_id?: number | null;
          body: Json;
          closed?: boolean;
          created_at?: string;
          excerpt?: string | null;
          id?: number;
          slug?: string | null;
          title: string;
          updated_at?: string | null;
          user_id?: string;
          view?: number | null;
        };
        Update: {
          accepted_answer_id?: number | null;
          body?: Json;
          closed?: boolean;
          created_at?: string;
          excerpt?: string | null;
          id?: number;
          slug?: string | null;
          title?: string;
          updated_at?: string | null;
          user_id?: string;
          view?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "questions_accepted_answer_id_fkey";
            columns: ["accepted_answer_id"];
            isOneToOne: false;
            referencedRelation: "answers";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "questions_user_id_fkey1";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      review_comment: {
        Row: {
          created_at: string;
          id: number;
          reply_id: number | null;
          review_id: number;
          text: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id: number;
          reply_id?: number | null;
          review_id: number;
          text: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: number;
          reply_id?: number | null;
          review_id?: number;
          text?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "review_comment_reply_id_fkey";
            columns: ["reply_id"];
            isOneToOne: false;
            referencedRelation: "review_comment";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "review_comment_review_id_fkey";
            columns: ["review_id"];
            isOneToOne: false;
            referencedRelation: "ai_review";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "review_comment_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      review_verified: {
        Row: {
          created_at: string;
          reviews_id: number;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          reviews_id?: number;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          reviews_id?: number;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "review_verified_reviews_id_fkey";
            columns: ["reviews_id"];
            isOneToOne: true;
            referencedRelation: "ai_review";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "review_verified_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      tags: {
        Row: {
          created_at: string;
          id: number;
          tag: string | null;
        };
        Insert: {
          created_at?: string;
          id?: number;
          tag?: string | null;
        };
        Update: {
          created_at?: string;
          id?: number;
          tag?: string | null;
        };
        Relationships: [];
      };
      user_experience: {
        Row: {
          created_at: string;
          description: string | null;
          end_date: string | null;
          organization_name: string;
          role: string;
          start_date: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          end_date?: string | null;
          organization_name: string;
          role: string;
          start_date: string;
          user_id?: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          end_date?: string | null;
          organization_name?: string;
          role?: string;
          start_date?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_experience_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      user_links: {
        Row: {
          created_at: string;
          platform: string | null;
          url: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          platform?: string | null;
          url: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          platform?: string | null;
          url?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_links_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      user_skills: {
        Row: {
          created_at: string;
          endorsed_count: number | null;
          level: string;
          skill_name: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          endorsed_count?: number | null;
          level?: string;
          skill_name: string;
          user_id?: string;
        };
        Update: {
          created_at?: string;
          endorsed_count?: number | null;
          level?: string;
          skill_name?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_skills_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
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
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
