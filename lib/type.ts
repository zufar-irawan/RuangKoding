import type { Database } from "@/lib/supabase/types";
import type { PostgrestError } from "@supabase/supabase-js";

type QuestionRow = Database["public"]["Tables"]["questions"]["Row"];
type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
type TagRow = Database["public"]["Tables"]["tags"]["Row"];
type AnswerRow = Database["public"]["Tables"]["answers"]["Row"];

type CountAgg = { count: number | null };
type CountRelation = CountAgg | CountAgg[] | null;

type ProfilePreview = Pick<
  ProfileRow,
  "id" | "fullname" | "bio" | "profile_pic"
>;
type AnswerProfile = Pick<ProfileRow, "id" | "fullname" | "profile_pic">;
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
  "id" | "title" | "body" | "created_at" | "view" | "slug"
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
};
