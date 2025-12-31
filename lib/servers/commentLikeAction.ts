"use server";

import { createClient } from "@/lib/supabase/server";

type CommentType = "answ_comment" | "quest_comment" | "feedback_comment";

interface LikeCommentResult {
  success: boolean;
  liked: boolean;
  likesCount: number;
  error?: string;
}

interface CommentLikesData {
  liked: boolean;
  likesCount: number;
}

/**
 * Toggle like on a comment
 * @param commentId - ID of the comment to like/unlike
 * @param commentType - Type of comment ("answ_comment" or "quest_comment")
 * @returns Result object with success status, liked state, and likes count
 */
export async function toggleCommentLike(
  commentId: number,
  commentType: CommentType,
): Promise<LikeCommentResult> {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      liked: false,
      likesCount: 0,
      error: "Anda harus login untuk menyukai komentar",
    };
  }

  try {
    // Check if user already liked this comment
    const { data: existingLike, error: checkError } = await supabase
      .from("comment_likes")
      .select("id")
      .eq("reference_id", commentId)
      .eq("type", commentType)
      .eq("user_id", user.id)
      .maybeSingle();

    if (checkError) {
      console.error("Error checking existing like:", checkError);
      return {
        success: false,
        liked: false,
        likesCount: 0,
        error: "Gagal memeriksa status like",
      };
    }

    if (existingLike) {
      // Unlike: Delete the existing like
      const { error: deleteError } = await supabase
        .from("comment_likes")
        .delete()
        .eq("id", existingLike.id);

      if (deleteError) {
        console.error("Error deleting like:", deleteError);
        return {
          success: false,
          liked: true,
          likesCount: 0,
          error: "Gagal menghapus like",
        };
      }

      // Get updated count
      const { count } = await supabase
        .from("comment_likes")
        .select("*", { count: "exact", head: true })
        .eq("reference_id", commentId)
        .eq("type", commentType);

      return {
        success: true,
        liked: false,
        likesCount: count ?? 0,
      };
    } else {
      // Like: Insert new like
      const { error: insertError } = await supabase
        .from("comment_likes")
        .insert({
          reference_id: commentId,
          type: commentType,
          user_id: user.id,
        });

      if (insertError) {
        console.error("Error inserting like:", insertError);
        return {
          success: false,
          liked: false,
          likesCount: 0,
          error: "Gagal menambahkan like",
        };
      }

      // Get updated count
      const { count } = await supabase
        .from("comment_likes")
        .select("*", { count: "exact", head: true })
        .eq("reference_id", commentId)
        .eq("type", commentType);

      return {
        success: true,
        liked: true,
        likesCount: count ?? 0,
      };
    }
  } catch (error) {
    console.error("Unexpected error in toggleCommentLike:", error);
    return {
      success: false,
      liked: false,
      likesCount: 0,
      error: "Terjadi kesalahan yang tidak terduga",
    };
  }
}

/**
 * Check if user has liked a specific comment
 * @param commentId - ID of the comment
 * @param commentType - Type of comment ("answ_comment" or "quest_comment")
 * @returns Boolean indicating if user has liked the comment
 */
export async function hasUserLikedComment(
  commentId: number,
  commentType: CommentType,
): Promise<boolean> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return false;
  }

  try {
    const { data, error } = await supabase
      .from("comment_likes")
      .select("id")
      .eq("reference_id", commentId)
      .eq("type", commentType)
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      console.error("Error checking if user liked comment:", error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error("Unexpected error in hasUserLikedComment:", error);
    return false;
  }
}

/**
 * Get likes count for a specific comment
 * @param commentId - ID of the comment
 * @param commentType - Type of comment ("answ_comment" or "quest_comment")
 * @returns Number of likes
 */
export async function getCommentLikesCount(
  commentId: number,
  commentType: CommentType,
): Promise<number> {
  const supabase = await createClient();

  try {
    const { count, error } = await supabase
      .from("comment_likes")
      .select("*", { count: "exact", head: true })
      .eq("reference_id", commentId)
      .eq("type", commentType);

    if (error) {
      console.error("Error getting comment likes count:", error);
      return 0;
    }

    return count ?? 0;
  } catch (error) {
    console.error("Unexpected error in getCommentLikesCount:", error);
    return 0;
  }
}

/**
 * Get likes data for multiple comments at once
 * @param commentIds - Array of comment IDs
 * @param commentType - Type of comments ("answ_comment" or "quest_comment")
 * @returns Map of comment IDs to their likes data (liked status and count)
 */
export async function getCommentsLikesData(
  commentIds: number[],
  commentType: CommentType,
): Promise<Map<number, CommentLikesData>> {
  const supabase = await createClient();
  const result = new Map<number, CommentLikesData>();

  if (commentIds.length === 0) {
    return result;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  try {
    // Get all likes for these comments
    const { data: allLikes, error } = await supabase
      .from("comment_likes")
      .select("reference_id, user_id")
      .in("reference_id", commentIds)
      .eq("type", commentType);

    if (error) {
      console.error("Error getting comments likes data:", error);
      return result;
    }

    // Process the data
    commentIds.forEach((commentId) => {
      const commentLikes = allLikes?.filter(
        (like) => like.reference_id === commentId,
      ) ?? [];
      const liked = user
        ? commentLikes.some((like) => like.user_id === user.id)
        : false;
      const likesCount = commentLikes.length;

      result.set(commentId, { liked, likesCount });
    });

    return result;
  } catch (error) {
    console.error("Unexpected error in getCommentsLikesData:", error);
    return result;
  }
}
