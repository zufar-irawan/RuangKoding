import { createClient } from "@/lib/supabase/client";
import { getClientUser } from "@/utils/GetClientUser";

export interface VoteResult {
  success: boolean;
  newVoteState: boolean | null;
  voteCountChange: number;
  message: string;
  error?: string;
}

/**
 * Check if user has voted on a question
 */
export async function checkUserVote(
  questionId: number,
): Promise<boolean | null> {
  try {
    const supabase = createClient();
    const user = await getClientUser();

    if (!user?.id || !questionId) return null;

    const { data } = await supabase
      .from("quest_vote")
      .select("vote")
      .eq("user_id", user.id)
      .eq("question_id", questionId)
      .maybeSingle();

    return data ? data.vote : null;
  } catch (error) {
    console.error("Error checking user vote:", error);
    return null;
  }
}

export async function handleQuestionVote(
  questionId: number,
  voteType: boolean,
): Promise<VoteResult> {
  const supabase = createClient();

  try {
    const user = await getClientUser();

    if (!user?.id) {
      return {
        success: false,
        newVoteState: null,
        voteCountChange: 0,
        message: "Silakan login terlebih dahulu",
        error: "NOT_AUTHENTICATED",
      };
    }

    if (!questionId) {
      return {
        success: false,
        newVoteState: null,
        voteCountChange: 0,
        message: "ID pertanyaan tidak valid",
        error: "INVALID_QUESTION_ID",
      };
    }

    // Get question owner (receiver_id)
    const { data: questionData, error: questionError } = await supabase
      .from("questions")
      .select("user_id, title")
      .eq("id", questionId)
      .single();

    if (questionError) throw questionError;

    const questionOwnerId = questionData.user_id;
    const questionTitle = questionData.title;

    // Get user profile for notification content
    const { data: userData, error: userError } = await supabase
      .from("profiles")
      .select("fullname")
      .eq("id", user.id)
      .single();

    if (userError) throw userError;

    const voterName = userData.fullname || "Someone";

    // Check if user already voted
    const { data: existingVote } = await supabase
      .from("quest_vote")
      .select("*")
      .eq("user_id", user.id)
      .eq("question_id", questionId)
      .maybeSingle();

    if (existingVote) {
      // If clicking the same vote, remove it
      if (existingVote.vote === voteType) {
        const { error: deleteError } = await supabase
          .from("quest_vote")
          .delete()
          .eq("user_id", user.id)
          .eq("question_id", questionId);

        if (deleteError) throw deleteError;

        return {
          success: true,
          newVoteState: null,
          voteCountChange: voteType ? -1 : 1,
          message: "Vote dibatalkan",
        };
      } else {
        // If clicking different vote, update it
        const { error: updateError } = await supabase
          .from("quest_vote")
          .update({ vote: voteType })
          .eq("user_id", user.id)
          .eq("question_id", questionId);

        if (updateError) throw updateError;

        // Create notification for vote change (only if not voting own question)
        if (questionOwnerId !== user.id) {
          const notificationContent = voteType
            ? `${voterName} memberikan vote up pada pertanyaan "${questionTitle}"`
            : `${voterName} memberikan vote down pada pertanyaan "${questionTitle}"`;

          await supabase.from("notifications").insert({
            receiver_id: questionOwnerId,
            sender_id: user.id,
            question_id: questionId,
            answer_id: null,
            content: notificationContent,
            read: false,
          });
        }

        return {
          success: true,
          newVoteState: voteType,
          voteCountChange: voteType ? 2 : -2,
          message: voteType ? "Vote Up berhasil!" : "Vote Down berhasil!",
        };
      }
    } else {
      // Insert new vote
      const { error: insertError } = await supabase.from("quest_vote").insert({
        question_id: questionId,
        user_id: user.id,
        vote: voteType,
      });

      if (insertError) throw insertError;

      // Create notification (only if not voting own question)
      if (questionOwnerId !== user.id) {
        const notificationContent = voteType
          ? `${voterName} memberikan vote up pada pertanyaan "${questionTitle}"`
          : `${voterName} memberikan vote down pada pertanyaan "${questionTitle}"`;

        const { error: notifError } = await supabase
          .from("notifications")
          .insert({
            receiver_id: questionOwnerId,
            sender_id: user.id,
            question_id: questionId,
            answer_id: null,
            content: notificationContent,
            read: false,
          });

        if (notifError) throw notifError;
      }

      return {
        success: true,
        newVoteState: voteType,
        voteCountChange: voteType ? 1 : -1,
        message: voteType ? "Vote Up berhasil!" : "Vote Down berhasil!",
      };
    }
  } catch (error) {
    console.error("Error handling vote:", error);
    return {
      success: false,
      newVoteState: null,
      voteCountChange: 0,
      message: "Terjadi kesalahan, silakan coba lagi",
      error: error instanceof Error ? error.message : "UNKNOWN_ERROR",
    };
  }
}
