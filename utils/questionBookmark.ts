import { createClient } from "@/lib/supabase/client";
import { getClientUser } from "@/utils/GetClientUser";

export interface BookmarkResult {
  success: boolean;
  isBookmarked: boolean;
  message: string;
  error?: string;
}

/**
 * Check if user has bookmarked a question
 */
export async function checkBookmarkStatus(
  questionId: number
): Promise<boolean> {
  try {
    const supabase = createClient();
    const user = await getClientUser();

    if (!user?.id || !questionId) return false;

    const { data } = await supabase
      .from("saved_quest")
      .select("*")
      .eq("user_id", user.id)
      .eq("question_id", questionId);

    return !!(data && data.length > 0);
  } catch (error) {
    console.error("Error checking bookmark status:", error);
    return false;
  }
}

/**
 * Toggle bookmark for a question
 */
export async function toggleQuestionBookmark(
  questionId: number,
  isCurrentlyBookmarked: boolean
): Promise<BookmarkResult> {
  const supabase = createClient();

  try {
    const user = await getClientUser();

    if (!user?.id) {
      return {
        success: false,
        isBookmarked: isCurrentlyBookmarked,
        message: "Silakan login terlebih dahulu",
        error: "NOT_AUTHENTICATED",
      };
    }

    if (!questionId) {
      return {
        success: false,
        isBookmarked: isCurrentlyBookmarked,
        message: "ID pertanyaan tidak valid",
        error: "INVALID_QUESTION_ID",
      };
    }

    if (isCurrentlyBookmarked) {
      // Remove bookmark
      const { error } = await supabase
        .from("saved_quest")
        .delete()
        .eq("user_id", user.id)
        .eq("question_id", questionId);

      if (error) throw error;

      return {
        success: true,
        isBookmarked: false,
        message: "Bookmark dihapus",
      };
    } else {
      // Add bookmark
      const payload = {
        user_id: user.id,
        question_id: questionId,
      };

      const { error } = await supabase.from("saved_quest").insert(payload);

      if (error) {
        if (error.code === "23505") {
          return {
            success: true,
            isBookmarked: true,
            message: "Pertanyaan sudah tersimpan",
          };
        } else {
          throw error;
        }
      }

      return {
        success: true,
        isBookmarked: true,
        message: "Berhasil menyimpan pertanyaan",
      };
    }
  } catch (error) {
    console.error("Error handling bookmark:", error);
    return {
      success: false,
      isBookmarked: isCurrentlyBookmarked,
      message: "Terjadi kesalahan, silakan coba lagi",
      error: error instanceof Error ? error.message : "UNKNOWN_ERROR",
    };
  }
}
