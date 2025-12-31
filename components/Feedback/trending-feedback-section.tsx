import { createClient } from "@/lib/supabase/server";
import type { FeedbackListItem } from "@/lib/type";

export default async function TrendingFeedbackSection(): Promise<{
  data: FeedbackListItem[];
  error: Error | null;
}> {
  try {
    const supabase = await createClient();

    // Calculate date range for daily period (last 24 hours)
    const now = new Date();
    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - 1);

    // Get feedback requests from last 24 hours
    const { data: feedbackRequests, error: fetchError } = await supabase
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
          profile_pic,
          id_dummy
        )
      `,
      )
      .gte("created_at", startDate.toISOString())
      .order("created_at", { ascending: false })
      .limit(50);

    if (fetchError) {
      console.error("Error fetching feedback requests:", fetchError);
      return {
        data: [],
        error: fetchError,
      };
    }

    // Get vote counts for each feedback request
    const requestsWithVotes = await Promise.all(
      (feedbackRequests || []).map(async (req) => {
        const { data: votes } = await supabase
          .from("request_vote")
          .select("vote")
          .eq("request_id", req.id);

        const upvotes = votes?.filter((v) => v.vote === true).length || 0;
        const downvotes = votes?.filter((v) => v.vote === false).length || 0;
        const voteScore = upvotes - downvotes;

        return {
          ...req,
          voteScore,
        };
      }),
    );

    // Sort by vote score (descending) and take top 10
    const sortedRequests = requestsWithVotes
      .sort((a, b) => b.voteScore - a.voteScore)
      .slice(0, 10);

    return {
      data: sortedRequests,
      error: null,
    };
  } catch (error) {
    console.error("Unexpected error in TrendingFeedbackSection:", error);
    return {
      data: [],
      error: error as Error,
    };
  }
}
