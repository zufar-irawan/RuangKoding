'use server'

import type { PostgrestError } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

type QuestionRow = Database["public"]["Tables"]["questions"]["Row"];
type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
type TagRow = Database["public"]["Tables"]["tags"]["Row"];
type AnswerRow = Database["public"]["Tables"]["answers"]["Row"];

type CountAgg = { count: number | null };
type CountRelation = CountAgg | CountAgg[] | null;

type ProfilePreview = Pick<ProfileRow, "id" | "fullname" | "bio" | "profile_pic">;
type AnswerProfile = Pick<ProfileRow, "id" | "fullname" | "profile_pic">;
type TagPreview = { tags: Pick<TagRow, "tag"> | null } | null;
type TagRelation = TagPreview | TagPreview[] | null;

type AnswerPreview = Pick<
    AnswerRow,
    "id" | "content" | "helpful" | "created_at"
> & {
    profiles: AnswerProfile | AnswerProfile[] | null;
};

type AnswerRelation = AnswerPreview | AnswerPreview[] | null;

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

const getQuestions = async (): Promise<SupabaseResponse<QuestionListItem[]>> => {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("questions")
        .select(`
            id,
            title,
            excerpt,
            created_at,
            profiles (
                id,
                fullname,
                bio,
                profile_pic
            ),
            quest_tags (
                tags (
                    tag
                )
            ),
            view,
            slug,
            votes:quest_vote_question_id_fkey ( count ),
            answers:answers!answers_question_id_fkey ( count )
        `)
        .order("created_at", { ascending: false });

    return { data, error }
}

const getQuestionFromID = async (id: number): Promise<SupabaseResponse<QuestionDetailItem[]>> => {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("questions")
        .select(`
            id,
            title,
            body,
            created_at,
            profiles (
                id,
                fullname,
                bio,
                profile_pic
            ),
            quest_tags (
                tags (
                    tag
                )
            ),
            view,
            slug,
            votes:quest_vote_question_id_fkey ( count ),
            answers:answers!answers_question_id_fkey (
                id,
                content,
                helpful,
                created_at,
                profiles (
                    id,
                    fullname,
                    profile_pic
                )
            )
        `)
        .order("created_at", { ascending: false })
        .eq("id", id);

    return { data, error }
}

export { getQuestions, getQuestionFromID };
export type { QuestionListItem, QuestionDetailItem, CountRelation, AnswerPreview };