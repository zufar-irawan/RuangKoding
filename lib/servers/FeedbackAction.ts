"use server";

import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/utils/GetUser";
import type { Json } from "@/lib/supabase/types";

export type FeedbackDetailItem = {
  id: number;
  request_id: number;
  user_id: string;
  feedback: Json;
  created_at: string;
  profiles: {
    id: string;
    fullname: string;
    bio: string | null;
    profile_pic: string | null;
  } | null;
};

export type RequestDetailItem = {
  id: number;
  title: string;
  description: Json | null;
  project_url: string;
  icon_url: string | null;
  user_id: string;
  created_at: string;
  profiles: {
    id: string;
    fullname: string;
    bio: string | null;
    profile_pic: string | null;
  } | null;
};

// Get request detail by ID
export async function getRequestById(requestId: number) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("request_feedback")
    .select(
      `
      id,
      title,
      description,
      project_url,
      icon_url,
      user_id,
      created_at,
      profiles (
        id,
        fullname,
        bio,
        profile_pic
      )
    `,
    )
    .eq("id", requestId)
    .single();

  if (error) {
    console.error("Error fetching request:", error);
    return null;
  }

  return data as RequestDetailItem;
}

// Get all feedbacks for a request
export async function getFeedbacksByRequestId(requestId: number) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("feedback")
    .select(
      `
      id,
      request_id,
      user_id,
      feedback,
      created_at,
      profiles (
        id,
        fullname,
        bio,
        profile_pic
      )
    `,
    )
    .eq("request_id", requestId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching feedbacks:", error);
    return [];
  }

  return data as FeedbackDetailItem[];
}

// Create new feedback
export async function createFeedback(requestId: number, feedbackContent: Json) {
  const supabase = await createClient();
  const user = await getUser();

  if (!user?.sub) {
    throw new Error("Pengguna harus login sebelum menambahkan feedback.");
  }

  const { data, error } = await supabase
    .from("feedback")
    .insert({
      request_id: requestId,
      user_id: user.sub,
      feedback: feedbackContent,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating feedback:", error);
    throw new Error("Gagal menambahkan feedback.");
  }

  return data;
}

// Get feedback comments
export async function getFeedbackComments(feedbackId: number) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("feedback_comment")
    .select(
      `
      id,
      text,
      created_at,
      reply_id,
      user_id,
      profiles (
        id,
        fullname,
        bio,
        profile_pic
      )
    `,
    )
    .eq("feedback_id", feedbackId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching feedback comments:", error);
    throw new Error(error.message);
  }

  return data;
}

// Create feedback comment
export async function createFeedbackComment(
  feedbackId: number,
  text: string,
  replyId?: number,
) {
  const supabase = await createClient();
  const user = await getUser();

  if (!user?.sub) {
    throw new Error("Pengguna harus login sebelum menambahkan komentar.");
  }

  const payload = {
    feedback_id: feedbackId,
    user_id: user.sub,
    text,
    reply_id: replyId || null,
  };

  const { data, error } = await supabase
    .from("feedback_comment")
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.error("Error creating feedback comment:", error);
    throw new Error(error.message);
  }

  return data;
}

// Delete feedback comment
export async function deleteFeedbackComment(commentId: number) {
  const supabase = await createClient();
  const user = await getUser();

  if (!user?.sub) {
    throw new Error("Pengguna harus login.");
  }

  // Check if user owns the comment
  const { data: comment } = await supabase
    .from("feedback_comment")
    .select("user_id")
    .eq("id", commentId)
    .single();

  if (comment?.user_id !== user.sub) {
    throw new Error("Anda tidak memiliki izin untuk menghapus komentar ini.");
  }

  const { error } = await supabase
    .from("feedback_comment")
    .delete()
    .eq("id", commentId);

  if (error) {
    console.error("Error deleting feedback comment:", error);
    throw new Error(error.message);
  }
}

// Delete feedback
export async function deleteFeedback(feedbackId: number) {
  const supabase = await createClient();
  const user = await getUser();

  if (!user?.sub) {
    throw new Error("Pengguna harus login.");
  }

  // Check if user owns the feedback
  const { data: feedback } = await supabase
    .from("feedback")
    .select("user_id")
    .eq("id", feedbackId)
    .single();

  if (feedback?.user_id !== user.sub) {
    throw new Error("Anda tidak memiliki izin untuk menghapus feedback ini.");
  }

  const { error } = await supabase
    .from("feedback")
    .delete()
    .eq("id", feedbackId);

  if (error) {
    console.error("Error deleting feedback:", error);
    throw new Error(error.message);
  }
}

// Check user's vote on feedback
export async function checkUserFeedbackVote(feedbackId: number) {
  const supabase = await createClient();
  const user = await getUser();

  if (!user?.sub) {
    return null;
  }

  const { data, error } = await supabase
    .from("feedback_vote")
    .select("vote")
    .eq("feedback_id", feedbackId)
    .eq("user_id", user.sub)
    .single();

  if (error) {
    return null;
  }

  return data?.vote ?? null;
}

// Handle feedback vote
export async function handleFeedbackVote(
  feedbackId: number,
  voteType: boolean,
) {
  const supabase = await createClient();
  const user = await getUser();

  if (!user?.sub) {
    throw new Error("Pengguna harus login untuk melakukan voting.");
  }

  // Check existing vote
  const { data: existingVote } = await supabase
    .from("feedback_vote")
    .select("id, vote")
    .eq("feedback_id", feedbackId)
    .eq("user_id", user.sub)
    .single();

  if (existingVote) {
    if (existingVote.vote === voteType) {
      // Remove vote if clicking the same button
      const { error } = await supabase
        .from("feedback_vote")
        .delete()
        .eq("id", existingVote.id);

      if (error) {
        throw new Error("Gagal menghapus vote.");
      }

      return { success: true, newVoteState: null };
    } else {
      // Update vote if clicking different button
      const { error } = await supabase
        .from("feedback_vote")
        .update({ vote: voteType })
        .eq("id", existingVote.id);

      if (error) {
        throw new Error("Gagal mengubah vote.");
      }

      return { success: true, newVoteState: voteType };
    }
  } else {
    // Create new vote
    const { error } = await supabase.from("feedback_vote").insert({
      feedback_id: feedbackId,
      user_id: user.sub,
      vote: voteType,
    });

    if (error) {
      throw new Error("Gagal menambahkan vote.");
    }

    return { success: true, newVoteState: voteType };
  }
}

// Get feedback vote count
export async function getFeedbackVoteCount(feedbackId: number) {
  const supabase = await createClient();

  const { data: upvotes } = await supabase
    .from("feedback_vote")
    .select("id", { count: "exact" })
    .eq("feedback_id", feedbackId)
    .eq("vote", true);

  const { data: downvotes } = await supabase
    .from("feedback_vote")
    .select("id", { count: "exact" })
    .eq("feedback_id", feedbackId)
    .eq("vote", false);

  const upvoteCount = upvotes?.length || 0;
  const downvoteCount = downvotes?.length || 0;

  return upvoteCount - downvoteCount;
}

// Check user's vote on request
export async function checkUserRequestVote(requestId: number) {
  const supabase = await createClient();
  const user = await getUser();

  if (!user?.sub) {
    return null;
  }

  const { data, error } = await supabase
    .from("request_vote")
    .select("vote")
    .eq("request_id", requestId)
    .eq("user_id", user.sub)
    .single();

  if (error) {
    return null;
  }

  return data?.vote ?? null;
}

// Handle request vote
export async function handleRequestVote(requestId: number, voteType: boolean) {
  const supabase = await createClient();
  const user = await getUser();

  if (!user?.sub) {
    throw new Error("Pengguna harus login untuk melakukan voting.");
  }

  // Check existing vote
  const { data: existingVote } = await supabase
    .from("request_vote")
    .select("id, vote")
    .eq("request_id", requestId)
    .eq("user_id", user.sub)
    .single();

  if (existingVote) {
    if (existingVote.vote === voteType) {
      // Remove vote if clicking the same button
      const { error } = await supabase
        .from("request_vote")
        .delete()
        .eq("id", existingVote.id);

      if (error) {
        throw new Error("Gagal menghapus vote.");
      }

      return { success: true, newVoteState: null };
    } else {
      // Update vote if clicking different button
      const { error } = await supabase
        .from("request_vote")
        .update({ vote: voteType })
        .eq("id", existingVote.id);

      if (error) {
        throw new Error("Gagal mengubah vote.");
      }

      return { success: true, newVoteState: voteType };
    }
  } else {
    // Create new vote
    const { error } = await supabase.from("request_vote").insert({
      request_id: requestId,
      user_id: user.sub,
      vote: voteType,
    });

    if (error) {
      throw new Error("Gagal menambahkan vote.");
    }

    return { success: true, newVoteState: voteType };
  }
}

// Get request vote count
export async function getRequestVoteCount(requestId: number) {
  const supabase = await createClient();

  const { data: upvotes } = await supabase
    .from("request_vote")
    .select("id", { count: "exact" })
    .eq("request_id", requestId)
    .eq("vote", true);

  const { data: downvotes } = await supabase
    .from("request_vote")
    .select("id", { count: "exact" })
    .eq("request_id", requestId)
    .eq("vote", false);

  const upvoteCount = upvotes?.length || 0;
  const downvoteCount = downvotes?.length || 0;

  return upvoteCount - downvoteCount;
}

// Check if user has saved/bookmarked a request
export async function checkRequestBookmarkStatus(requestId: number) {
  const supabase = await createClient();
  const user = await getUser();

  if (!user?.sub) {
    return false;
  }

  const { data, error } = await supabase
    .from("saved_req")
    .select("id")
    .eq("request_id", requestId)
    .eq("user_id", user.sub)
    .single();

  if (error) {
    return false;
  }

  return !!data;
}

// Toggle request bookmark (save/unsave)
export async function toggleRequestBookmark(
  requestId: number,
  currentlySaved: boolean,
) {
  const supabase = await createClient();
  const user = await getUser();

  if (!user?.sub) {
    throw new Error("Pengguna harus login untuk menyimpan request.");
  }

  if (currentlySaved) {
    // Remove bookmark
    const { error } = await supabase
      .from("saved_req")
      .delete()
      .eq("request_id", requestId)
      .eq("user_id", user.sub);

    if (error) {
      throw new Error("Gagal menghapus bookmark.");
    }

    return {
      success: true,
      isSaved: false,
      message: "Request berhasil dihapus dari tersimpan",
    };
  } else {
    // Add bookmark
    const { error } = await supabase.from("saved_req").insert({
      request_id: requestId,
      user_id: user.sub,
    });

    if (error) {
      throw new Error("Gagal menyimpan request.");
    }

    return {
      success: true,
      isSaved: true,
      message: "Request berhasil disimpan",
    };
  }
}
