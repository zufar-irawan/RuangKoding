"use server";

import { createClient } from "../supabase/server";

type props = {
  user_id: string;
  xp: number;
  reference: number;
};

async function acceptedAnswerXP({ user_id, xp, reference }: props) {
  const supabase = await createClient();

  const { error: xpError } = await supabase.from("xp_events").insert({
    user_id,
    amount: xp,
    reason: "answer_accepted",
    type: "answer",
    reference,
  });

  if (xpError) throw new Error(xpError.message);
}

async function answerUpVoteXP({ user_id, xp, reference }: props) {
  const supabase = await createClient();

  const { error: xpError } = await supabase.from("xp_events").insert({
    user_id,
    amount: xp,
    reason: "answer_upvote",
    type: "answer",
    reference,
    status: "pending",
  });

  if (xpError) throw new Error(xpError.message);
}

export { acceptedAnswerXP, answerUpVoteXP };
