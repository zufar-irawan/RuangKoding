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
            user_id,
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

const getTrendingQuestions = async (
  period: "daily" | "weekly" | "monthly" = "weekly",
  page: number = 1,
  limit: number = 10,
): Promise<SupabaseResponse<QuestionListItem[]>> => {
  const supabase = await createClient();

  // Calculate date range based on period
  const now = new Date();
  const startDate = new Date();

  switch (period) {
    case "daily":
      startDate.setDate(now.getDate() - 1);
      break;
    case "weekly":
      startDate.setDate(now.getDate() - 7);
      break;
    case "monthly":
      startDate.setMonth(now.getMonth() - 1);
      break;
  }

  const offset = (page - 1) * limit;

  // Get questions with vote counts within the date range
  const { data: questionsData, error: questionsError } = await supabase
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
            slug
        `,
    )
    .gte("created_at", startDate.toISOString())
    .order("created_at", { ascending: false });

  if (questionsError) {
    return { data: null, error: questionsError };
  }

  if (!questionsData || questionsData.length === 0) {
    return { data: [], error: null };
  }

  // Get vote counts and answer counts for each question
  const questionIds = questionsData.map((q) => q.id);

  const { data: votesData } = await supabase
    .from("quest_vote")
    .select("question_id, vote")
    .in("question_id", questionIds)
    .eq("vote", true);

  const { data: answersData } = await supabase
    .from("answers")
    .select("question_id")
    .in("question_id", questionIds);

  // Calculate net votes for each question
  const votesByQuestion: Record<number, number> = {};
  votesData?.forEach((vote) => {
    if (vote.question_id) {
      votesByQuestion[vote.question_id] =
        (votesByQuestion[vote.question_id] || 0) + 1;
    }
  });

  const answersByQuestion: Record<number, number> = {};
  answersData?.forEach((answer) => {
    if (answer.question_id) {
      answersByQuestion[answer.question_id] =
        (answersByQuestion[answer.question_id] || 0) + 1;
    }
  });

  // Add vote and answer counts to questions and sort by votes
  const questionsWithVotes = questionsData.map((question) => ({
    ...question,
    votes: [{ count: votesByQuestion[question.id] || 0 }],
    answers: [{ count: answersByQuestion[question.id] || 0 }],
  }));

  // Sort by vote count descending
  questionsWithVotes.sort((a, b) => {
    const aVotes = a.votes[0]?.count || 0;
    const bVotes = b.votes[0]?.count || 0;
    return bVotes - aVotes;
  });

  // Apply pagination
  const paginatedQuestions = questionsWithVotes.slice(offset, offset + limit);

  return { data: paginatedQuestions, error: null };
};

const getTrendingQuestionsCount = async (
  period: "daily" | "weekly" | "monthly" = "weekly",
): Promise<number> => {
  const supabase = await createClient();

  // Calculate date range based on period
  const now = new Date();
  const startDate = new Date();

  switch (period) {
    case "daily":
      startDate.setDate(now.getDate() - 1);
      break;
    case "weekly":
      startDate.setDate(now.getDate() - 7);
      break;
    case "monthly":
      startDate.setMonth(now.getMonth() - 1);
      break;
  }

  const { count } = await supabase
    .from("questions")
    .select("*", { count: "exact", head: true })
    .gte("created_at", startDate.toISOString());

  return count || 0;
};

const getAllTags = async () => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("tags")
    .select("id, tag")
    .order("tag", { ascending: true });

  if (error) {
    console.error("Error fetching tags:", error);
    return [];
  }

  return data || [];
};

const getFilteredQuestions = async (
  tagId?: number,
  unanswered: boolean = false,
  searchQuery?: string,
): Promise<SupabaseResponse<QuestionListItem[]>> => {
  const supabase = await createClient();

  let query = supabase.from("questions").select(
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
                    id,
                    tag
                )
            ),
            view,
            slug,
            votes:quest_vote_question_id_fkey ( count ),
            answers:answers!answers_question_id_fkey ( count )
        `,
  );

  if (searchQuery) {
    query = query.ilike("title", `%${searchQuery}%`);
  }

  query = query.order("created_at", { ascending: false });

  // If tagId is provided, we need to filter by tag
  // We'll do this after fetching since we need to check nested relations
  const { data, error } = await query;

  if (error) {
    return { data: null, error };
  }

  if (!data) {
    return { data: [], error: null };
  }

  let filteredData = data;

  // Filter by tag if tagId is provided
  if (tagId) {
    filteredData = data.filter((question) => {
      const tags = question.quest_tags;
      if (!tags) return false;

      const tagList = Array.isArray(tags) ? tags : [tags];
      return tagList.some((tagRelation) => {
        const tag = tagRelation.tags;
        if (Array.isArray(tag)) {
          return tag.some((t) => t?.id === tagId);
        }
        return tag?.id === tagId;
      });
    });
  }

  // Filter unanswered questions
  if (unanswered) {
    filteredData = filteredData.filter((question) => {
      if (!question.answers) return true;

      const answers = question.answers;
      const answerCount = Array.isArray(answers) ? (answers[0]?.count ?? 0) : 0;
      return answerCount === 0;
    });
  }

  return { data: filteredData, error: null };
};

const searchQuestions = async (
  queryText: string,
  limit: number = 5,
): Promise<SupabaseResponse<QuestionListItem[]>> => {
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
    .ilike("title", `%${queryText}%`)
    .order("created_at", { ascending: false })
    .limit(limit);

  return { data, error };
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
  getTrendingQuestions,
  getTrendingQuestionsCount,
  getAllTags,
  getFilteredQuestions,
  searchQuestions,
};
