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

const getSavedQuestions = async (userId: string) => {
  const supabase = await createClient();

  // Get saved question IDs
  const { data: savedData, error: savedError } = await supabase
    .from("saved_quest")
    .select("question_id, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (savedError) {
    console.error("Error fetching saved questions:", savedError);
    return [];
  }

  if (!savedData || savedData.length === 0) {
    return [];
  }

  const questionIds = savedData.map((item) => item.question_id);

  // Get full question data
  const { data: questions, error: questionsError } = await supabase
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
    .in("id", questionIds)
    .order("created_at", { ascending: false });

  if (questionsError) {
    console.error("Error fetching questions:", questionsError);
    return [];
  }

  if (!questions || questions.length === 0) {
    return [];
  }

  return questions;
};

const getQuestionsFromUserID = async (user_id: string) => {
  const supabase = await createClient();

  const { data: questions, error: questionsError } = await supabase
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
    .eq("user_id", user_id)
    .order("created_at", { ascending: false });

  if (questionsError) {
    console.error("Error fetching questions:", questionsError);
    return [];
  }

  if (!questions || questions.length === 0) {
    return [];
  }

  return questions;
};

const incrementQuestionView = async (questionId: number) => {
  const supabase = await createClient();

  // console.log("Question ID: ", questionId);

  // Get current view count
  const { data: currentData } = await supabase
    .from("questions")
    .select("view")
    .eq("id", questionId)
    .single();

  // console.log("Current view count:", currentData?.view);

  const currentView = currentData?.view ?? 0;

  // Update with incremented value
  const { error } = await supabase
    .from("questions")
    .update({ view: currentView + 1 })
    .eq("id", questionId);

  if (error) {
    console.error("Error incrementing question view:", error);
  }
};

export {
  getQuestions,
  getQuestionFromID,
  getQuestionComments,
  createQuestionComment,
  deleteQuestionComment,
  getSavedQuestions,
  getQuestionsFromUserID,
  incrementQuestionView,
};
