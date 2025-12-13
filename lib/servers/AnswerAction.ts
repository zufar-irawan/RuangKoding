"use server";

import { createClient } from "../supabase/server";
import { answerUpVoteXP } from "./XpActions";

export async function answerUpVote(
  answer_id: number,
  user_id: string,
  answer_user_id: string,
) {
  const supabase = await createClient();

  // Check if user already voted
  const { data: existingVote } = await supabase
    .from("answ_vote")
    .select("*")
    .eq("answer_id", answer_id)
    .eq("user_id", user_id)
    .eq("vote", true)
    .single();

  if (existingVote) {
    throw new Error("You have already voted on this answer");
  }

  // Check if user is voting their own answer
  if (user_id === answer_user_id) {
    throw new Error("You cannot vote on your own answer");
  }

  const { error } = await supabase.from("answ_vote").insert({
    answer_id,
    user_id,
    vote: true,
  });

  if (error) {
    throw new Error(error.message);
  }

  await answerUpVoteXP({
    user_id: answer_user_id,
    xp: 20,
    reference: answer_id,
  });
}

export async function answerDownVote(
  answer_id: number,
  user_id: string,
  answer_user_id: string,
) {
  const supabase = await createClient();

  // Check if user already voted
  const { data: existingVote } = await supabase
    .from("answ_vote")
    .select("*")
    .eq("answer_id", answer_id)
    .eq("user_id", user_id)
    .eq("vote", false)
    .single();

  if (existingVote) {
    throw new Error("You have already voted on this answer");
  }

  // Check if user is voting their own answer
  if (user_id === answer_user_id) {
    throw new Error("You cannot vote on your own answer");
  }

  const { error } = await supabase.from("answ_vote").insert({
    answer_id,
    user_id,
    vote: false,
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function isAnswerUpVoted(answer_id: number, user_id: string) {
  const supabase = await createClient();

  const { data } = await supabase
    .from("answ_vote")
    .select("*")
    .eq("answer_id", answer_id)
    .eq("user_id", user_id)
    .eq("vote", true)
    .single();

  return !!data;
}

export async function isAnswerDownVoted(answer_id: number, user_id: string) {
  const supabase = await createClient();

  const { data } = await supabase
    .from("answ_vote")
    .select("*")
    .eq("answer_id", answer_id)
    .eq("user_id", user_id)
    .eq("vote", false)
    .single();

  return !!data;
}

export async function updateAnswerUpVote(
  answer_id: number,
  user_id: string,
  answer_user_id: string,
) {
  const supabase = await createClient();

  // Check if user is voting their own answer
  if (user_id === answer_user_id) {
    throw new Error("You cannot vote on your own answer");
  }

  // Update existing upvote to downvote
  const { error } = await supabase
    .from("answ_vote")
    .update({
      vote: false,
    })
    .eq("answer_id", answer_id)
    .eq("user_id", user_id)
    .eq("vote", true);

  if (error) {
    throw new Error(error.message);
  }
}

export async function updateAnswerDownVote(
  answer_id: number,
  user_id: string,
  answer_user_id: string,
) {
  const supabase = await createClient();

  // Check if user is voting their own answer
  if (user_id === answer_user_id) {
    throw new Error("You cannot vote on your own answer");
  }

  // Update existing downvote to upvote
  const { error } = await supabase
    .from("answ_vote")
    .update({
      vote: true,
    })
    .eq("answer_id", answer_id)
    .eq("user_id", user_id)
    .eq("vote", false);

  if (error) {
    throw new Error(error.message);
  }

  await answerUpVoteXP({
    user_id: answer_user_id,
    xp: 20,
    reference: answer_id,
  });
}

export async function getAnswerVoteCount(answer_id: number): Promise<string> {
  const supabase = await createClient();

  const { count: voteUp, error: voteUpError } = await supabase
    .from("answ_vote")
    .select("*", { count: "exact", head: true })
    .eq("answer_id", answer_id)
    .eq("vote", true);

  if (voteUpError) {
    return "0";
  }

  const { count: voteDown, error: voteDownError } = await supabase
    .from("answ_vote")
    .select("*", { count: "exact", head: true })
    .eq("answer_id", answer_id)
    .eq("vote", false);

  if (voteDownError) {
    return "0";
  }

  if (voteUp || voteDown) {
    if ((voteUp || 0) > (voteDown || 0)) {
      return `${(voteUp || 0) - (voteDown || 0)}`;
    } else if ((voteUp || 0) < (voteDown || 0)) {
      return `-${(voteDown || 0) - (voteUp || 0)}`;
    } else {
      return "0";
    }
  } else {
    return "0";
  }
}
