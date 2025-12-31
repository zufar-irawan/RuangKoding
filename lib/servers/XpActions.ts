"use server";

import { createClient } from "../supabase/server";

type props = {
  user_id: string;
  xp: number;
  reference: number;
  source_user_id: string;
};

async function acceptedAnswerXP({
  user_id,
  xp,
  reference,
  source_user_id,
}: props) {
  const supabase = await createClient();

  const { error: xpError } = await supabase.from("xp_events").insert({
    user_id,
    amount: xp,
    reason: "answer_accepted",
    type: "answer",
    reference,
    status: "pending",
    source_user_id,
  });

  if (xpError) throw new Error(xpError.message);
}

async function answerUpVoteXP({
  user_id,
  xp,
  reference,
  source_user_id,
}: props) {
  const supabase = await createClient();

  const { error } = await supabase.from("xp_events").insert({
    user_id,
    amount: xp,
    reason: "answer_upvote",
    type: "answer",
    reference,
    status: "pending",
    source_user_id,
  });

  // UNIQUE VIOLATION → XP sudah pernah dikasih
  if (error) {
    if (error.code === "23505") {
      return {
        success: true,
        applied: false, // XP tidak bertambah
        reason: "XP already granted",
      };
    }

    // error lain → baru benar-benar error
    throw new Error(error.message);
  }

  return {
    success: true,
    applied: true,
  };
}

export { acceptedAnswerXP, answerUpVoteXP };
