"use server";

import { createClient } from "@/lib/supabase/server";
import type {
  QuestionListItem,
  QuestionDetailItem,
  SupabaseResponse,
} from "@/lib/type";
import { getUser } from "@/utils/GetUser";

const getQuestions = async (): Promise<
  SupabaseResponse<QuestionListItem[]>
> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("questions")
    .select(
      `
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
        `,
    )
    .order("created_at", { ascending: false });

  return { data, error };
};

const getQuestionFromID = async (
  id: number,
): Promise<SupabaseResponse<QuestionDetailItem[]>> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("questions")
    .select(
      `
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
                user_id,
                profiles (
                    id,
                    fullname,
                    profile_pic
                )
            )
        `,
    )
    .order("created_at", { ascending: false })
    .eq("id", id);

  return { data, error };
};

const getQuestionComments = async (id: number) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("quest_comment")
    .select(
      `
      id,
      text,
      created_at,
      reply_id,
      profiles(
       id,
       fullname,
       bio,
       profile_pic
      )
    `,
    )
    .eq("question_id", id)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

const createQuestionComment = async (
  id: number,
  text: string,
  reply?: number,
) => {
  const supabase = await createClient();

  const user = await getUser();

  if (!user?.sub) {
    throw new Error("Pengguna harus login sebelum menambahkan komentar.");
  }

  const payload = {
    question_id: id,
    user_id: user.sub,
    text,
    reply_id: reply || null,
  };

  const { data, error } = await supabase.from("quest_comment").insert(payload);

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

const deleteQuestionComment = async (commentId: number) => {
  const supabase = await createClient();

  const { error } = await supabase
    .from("quest_comment")
    .delete()
    .eq("id", commentId);

  if (error) {
    throw new Error(error.message);
  }
};

export {
  getQuestions,
  getQuestionFromID,
  getQuestionComments,
  createQuestionComment,
  deleteQuestionComment,
};
