import type { Database } from "@/lib/supabase/types";
import type { PostgrestError } from "@supabase/supabase-js";
import { Timestamp } from "next/dist/server/lib/cache-handlers/types";

type QuestionRow = Database["public"]["Tables"]["questions"]["Row"];
type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
type TagRow = Database["public"]["Tables"]["tags"]["Row"];
type AnswerRow = Database["public"]["Tables"]["answers"]["Row"];

type CountAgg = { count: number | null };
type CountRelation = CountAgg | CountAgg[] | null;

type ProfilePreview = Pick<
  ProfileRow,
  "id" | "fullname" | "bio" | "profile_pic" | "id_dummy"
>;
type AnswerProfile = Pick<ProfileRow, "id" | "fullname" | "profile_pic" | "id_dummy">;
type TagPreview = { tags: Pick<TagRow, "tag"> | null } | null;
type TagRelation = TagPreview | TagPreview[] | null;

type AnswerPreview = Pick<
  AnswerRow,
  "id" | "content" | "helpful" | "created_at" | "user_id"
> & {
  profiles: AnswerProfile | AnswerProfile[] | null;
};

type AnswerRelation = AnswerPreview | AnswerPreview[] | null;

type AnswerWithHTML = AnswerPreview & {
  html: string;
};

type QuestionListFields = Pick<
  QuestionRow,
  "id" | "title" | "excerpt" | "created_at" | "view" | "slug"
>;

type QuestionDetailFields = Pick<
  QuestionRow,
  "id" | "user_id" | "title" | "body" | "created_at" | "view" | "slug"
>;

type QuestionListItem = QuestionListFields & {
  profiles: ProfilePreview | ProfilePreview[] | null;
  quest_tags: TagRelation;
  votes: CountRelation;
  answers: CountRelation;
};

type QuestionDetailItem = QuestionDetailFields & {
  profiles: ProfilePreview | ProfilePreview[] | null;
  quest_tags: TagRelation;
  votes: CountRelation;
  answers: AnswerRelation;
};

type SupabaseResponse<T> = {
  data: T | null;
  error: PostgrestError | null;
};

type AnswerComment = Database["public"]["Tables"]["answ_comment"]["Row"];

type AnswerCommentItem = Pick<
  AnswerComment,
  "id" | "text" | "created_at" | "reply_id"
> & {
  profiles: ProfilePreview | ProfilePreview[] | null;
};

type TagsType = {
  id: number;
  tag: string;
  created_at: Timestamp;
};

type FeedbackListItem = {
  id: number;
  title: string;
  description: unknown;
  project_url: string;
  icon_url: string | null;
  user_id: string;
  created_at: string;
  profiles: {
    id: string;
    fullname: string;
    bio: string | null;
    profile_pic: string | null;
  } | null;
  voteScore?: number;
};

export type {
  QuestionListItem,
  QuestionDetailItem,
  CountRelation,
  AnswerPreview,
  AnswerWithHTML,
  AnswerComment,
  AnswerCommentItem,
  ProfilePreview,
  SupabaseResponse,
  TagsType,
  FeedbackListItem,
};
