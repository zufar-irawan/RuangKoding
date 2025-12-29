"use server";

import { createClient } from "./supabase/server";

export interface DailyChallengeStatus {
  streak: number;
  hasCompletedToday: boolean;
  todayChallengeId: string | null;
}

export interface TodayChallenge {
  id: string;
  challenge: string;
  created_at: string;
}

export interface SubmitChallengeResult {
  success: boolean;
  submissionId?: string;
  error?: string;
}

/**
 * Get the user's daily challenge streak and completion status
 */
export async function getDailyChallengeStatus(): Promise<DailyChallengeStatus | null> {
  const supabase = await createClient();

  // Check if user is logged in
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  // Get today's date in UTC (only day and month)
  const nowUTC = new Date();
  const todayUTCDay = nowUTC.getUTCDate();
  const todayUTCMonth = nowUTC.getUTCMonth() + 1; // getUTCMonth() returns 0-11

  // Get all challenges
  const { data: allChallenges } = await supabase
    .from("daily_code_challenge")
    .select("id, created_at")
    .order("created_at", { ascending: false });

  // Filter challenges by UTC day and month
  const todayChallenge =
    allChallenges?.find((challenge) => {
      const challengeDate = new Date(challenge.created_at);
      const challengeUTCDay = challengeDate.getUTCDate();
      const challengeUTCMonth = challengeDate.getUTCMonth() + 1;

      return (
        challengeUTCDay === todayUTCDay && challengeUTCMonth === todayUTCMonth
      );
    }) || null;

  // Check if user has completed today's challenge
  let hasCompletedToday = false;
  if (todayChallenge) {
    const { data: userAnswer } = await supabase
      .from("daily_code_user")
      .select("id")
      .eq("user_id", user.id)
      .eq("challenge_id", todayChallenge.id)
      .maybeSingle();

    hasCompletedToday = !!userAnswer;
  }

  // Get user's streak (consecutive days)
  const { data: submissions } = await supabase
    .from("daily_code_user")
    .select("created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  let streak = 0;

  if (submissions && submissions.length > 0) {
    // Get unique dates of submissions in UTC YYYY-MM-DD format
    const uniqueDates = Array.from(
      new Set(
        submissions.map((s) => {
          const date = new Date(s.created_at);
          return `${date.getUTCFullYear()}-${String(
            date.getUTCMonth() + 1,
          ).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
        }),
      ),
    );

    const now = new Date();
    const todayStr = `${now.getUTCFullYear()}-${String(
      now.getUTCMonth() + 1,
    ).padStart(2, "0")}-${String(now.getUTCDate()).padStart(2, "0")}`;

    const yesterday = new Date(now);
    yesterday.setUTCDate(yesterday.getUTCDate() - 1);
    const yesterdayStr = `${yesterday.getUTCFullYear()}-${String(
      yesterday.getUTCMonth() + 1,
    ).padStart(2, "0")}-${String(yesterday.getUTCDate()).padStart(2, "0")}`;

    let currentCheckDate = todayStr;

    // If user hasn't submitted today, check if they submitted yesterday to keep streak alive
    if (!uniqueDates.includes(todayStr)) {
      if (uniqueDates.includes(yesterdayStr)) {
        currentCheckDate = yesterdayStr;
      } else {
        // Streak broken
        streak = 0;
      }
    }

    // If streak is potentially active (today or yesterday exists), count backwards
    if (uniqueDates.includes(currentCheckDate)) {
      while (uniqueDates.includes(currentCheckDate)) {
        streak++;
        const d = new Date(currentCheckDate);
        d.setUTCDate(d.getUTCDate() - 1);
        currentCheckDate = `${d.getUTCFullYear()}-${String(
          d.getUTCMonth() + 1,
        ).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
      }
    }
  }

  return {
    streak,
    hasCompletedToday,
    todayChallengeId: todayChallenge?.id || null,
  };
}

/**
 * Get today's challenge details
 */
export async function getTodayChallenge(): Promise<TodayChallenge | null> {
  const supabase = await createClient();

  // Check if user is logged in
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  // Get today's date in UTC (only day and month)
  const nowUTC = new Date();
  const todayUTCDay = nowUTC.getUTCDate();
  const todayUTCMonth = nowUTC.getUTCMonth() + 1;

  // Get all challenges
  const { data: allChallenges } = await supabase
    .from("daily_code_challenge")
    .select("id, challenge, created_at")
    .order("created_at", { ascending: false });

  // Filter challenges by UTC day and month
  const todayChallenge =
    allChallenges?.find((challenge) => {
      const challengeDate = new Date(challenge.created_at);
      const challengeUTCDay = challengeDate.getUTCDate();
      const challengeUTCMonth = challengeDate.getUTCMonth() + 1;

      return (
        challengeUTCDay === todayUTCDay && challengeUTCMonth === todayUTCMonth
      );
    }) || null;

  return todayChallenge;
}

/**
 * Submit user's answer for today's challenge
 */
export async function submitChallengeAnswer(
  challengeId: string,
  answer: string,
  language: string,
): Promise<SubmitChallengeResult> {
  const supabase = await createClient();

  // Check if user is logged in
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "User not authenticated" };
  }

  // Check if user already submitted for this challenge
  const { data: existingSubmission } = await supabase
    .from("daily_code_user")
    .select("id")
    .eq("user_id", user.id)
    .eq("challenge_id", challengeId)
    .maybeSingle();

  if (existingSubmission) {
    return { success: false, error: "Challenge already submitted" };
  }

  // Insert submission
  const { data: submission, error } = await supabase
    .from("daily_code_user")
    .insert({
      user_id: user.id,
      challenge_id: challengeId,
      answer: answer,
      language: language,
      is_correct: null,
      penjelasan: null,
    })
    .select("id")
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, submissionId: submission.id };
}

/**
 * Get user's submission for a challenge
 */
export async function getUserSubmission(challengeId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data } = await supabase
    .from("daily_code_user")
    .select("id, answer, language, is_correct, penjelasan, created_at")
    .eq("user_id", user.id)
    .eq("challenge_id", challengeId)
    .maybeSingle();

  return data;
}
