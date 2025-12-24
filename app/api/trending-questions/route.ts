import { NextRequest, NextResponse } from "next/server";
import {
  getTrendingQuestions,
  getTrendingQuestionsCount,
} from "@/lib/questions";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const period = (searchParams.get("period") || "weekly") as
      | "daily"
      | "weekly"
      | "monthly";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    // Validate period
    if (!["daily", "weekly", "monthly"].includes(period)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid period. Must be 'daily', 'weekly', or 'monthly'",
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

    const { data, error } = await getTrendingQuestions(period, page, limit);

    if (error) {
      console.error("Error fetching trending questions:", error);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to fetch trending questions",
        },
        { status: 500 },
      );
    }

    // Get total count and calculate total pages
    const totalCount = await getTrendingQuestionsCount(period);
    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      success: true,
      data: data || [],
      totalPages,
      currentPage: page,
      period,
    });
  } catch (error) {
    console.error("Unexpected error in trending-questions API:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 },
    );
  }
}
