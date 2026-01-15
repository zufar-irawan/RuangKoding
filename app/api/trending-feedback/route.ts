import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const period = (searchParams.get("period") || "daily") as
      | "daily"
      | "monthly"
      | "yearly";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    // Validate period
    if (!["daily", "monthly", "yearly"].includes(period)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid period. Must be 'daily', 'monthly', or 'yearly'",
        },
        { status: 400 },
      );
    }

    // Validate page and limit
    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid page or limit parameters",
        },
        { status: 400 },
      );
    }

    const supabase = await createClient();

    // Calculate date range based on period
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case "daily":
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 1);
        break;
      case "monthly":
        startDate = new Date(now);
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case "yearly":
        startDate = new Date(now);
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
    }

    // Get trending feedback requests with vote counts
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
      .order("created_at", { ascending: false });

    if (fetchError) {
      console.error("Error fetching feedback requests:", fetchError);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to fetch feedback requests",
          details: fetchError.message || "Unknown error",
        },
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
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

    // Sort by vote score (descending)
    const sortedRequests = requestsWithVotes.sort(
      (a, b) => b.voteScore - a.voteScore,
    );

    // Calculate pagination
    const totalCount = sortedRequests.length;
    const totalPages = Math.ceil(totalCount / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedRequests = sortedRequests.slice(startIndex, endIndex);

    return NextResponse.json(
      {
        success: true,
        data: paginatedRequests,
        totalPages,
        currentPage: page,
        period,
        totalCount,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    console.error("Unexpected error in trending-feedback API:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        details: errorMessage,
      },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
}
