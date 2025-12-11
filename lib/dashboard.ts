"use server";

import { createClient } from "@/lib/supabase/server";

export type DashboardStats = {
  totalAnswers: number;
  totalHelpfulAnswers: number;
  totalQuestionUpvotes: number;
  totalQuestionsAsked: number;
  monthlyAnswers: MonthlyAnswerData[];
};

export type MonthlyAnswerData = {
  month: string;
  count: number;
};

export async function getDashboardStats(
  userId: string,
): Promise<DashboardStats> {
  const supabase = await createClient();

  // Fetch total answers by user
  const { data: answersData, error: answersError } = await supabase
    .from("answers")
    .select("id, helpful, created_at")
    .eq("user_id", userId);

  if (answersError) {
    console.error("Error fetching answers:", answersError);
    throw answersError;
  }

  const totalAnswers = answersData?.length || 0;
  const totalHelpfulAnswers =
    answersData?.filter((answer) => answer.helpful === true).length || 0;

  // Fetch total questions asked by user
  const { count: totalQuestionsAsked, error: questionsError } = await supabase
    .from("questions")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  if (questionsError) {
    console.error("Error fetching questions count:", questionsError);
    throw questionsError;
  }

  // Fetch total upvotes on user's questions
  const { data: userQuestions, error: userQuestionsError } = await supabase
    .from("questions")
    .select("id")
    .eq("user_id", userId);

  if (userQuestionsError) {
    console.error("Error fetching user questions:", userQuestionsError);
    throw userQuestionsError;
  }

  let totalQuestionUpvotes = 0;
  if (userQuestions && userQuestions.length > 0) {
    const questionIds = userQuestions.map((q) => q.id);

    const { count: upvotesCount, error: votesError } = await supabase
      .from("quest_vote")
      .select("*", { count: "exact", head: true })
      .in("question_id", questionIds);

    if (votesError) {
      console.error("Error fetching question votes:", votesError);
    } else {
      totalQuestionUpvotes = upvotesCount || 0;
    }
  }

  // Calculate monthly answers for the past 12 months
  const monthlyAnswers = calculateMonthlyAnswers(answersData || []);

  return {
    totalAnswers,
    totalHelpfulAnswers,
    totalQuestionUpvotes,
    totalQuestionsAsked: totalQuestionsAsked || 0,
    monthlyAnswers,
  };
}

function calculateMonthlyAnswers(
  answers: { created_at: string }[],
): MonthlyAnswerData[] {
  const now = new Date();
  const monthsData: MonthlyAnswerData[] = [];
  const monthKeyMap = new Map<string, number>();

  // Generate last 12 months
  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const monthLabel = date.toLocaleDateString("id-ID", {
      month: "short",
      year: "numeric",
    });

    monthKeyMap.set(monthKey, monthsData.length);
    monthsData.push({
      month: monthLabel,
      count: 0,
    });
  }

  // Count answers per month
  answers.forEach((answer) => {
    const answerDate = new Date(answer.created_at);
    const answerMonthKey = `${answerDate.getFullYear()}-${String(answerDate.getMonth() + 1).padStart(2, "0")}`;

    const monthIndex = monthKeyMap.get(answerMonthKey);
    if (monthIndex !== undefined) {
      monthsData[monthIndex].count++;
    }
  });

  return monthsData;
}
