import { NextRequest, NextResponse } from "next/server";
import { getFilteredQuestions } from "@/lib/questions";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tagId = searchParams.get("tagId");
    const unanswered = searchParams.get("unanswered") === "true";

    const tagIdNum = tagId ? parseInt(tagId) : undefined;

    // Validate tagId if provided
    if (tagId && (isNaN(tagIdNum!) || tagIdNum! < 1)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid tag ID",
        },
        { status: 400 },
      );
    }

    const { data, error } = await getFilteredQuestions(tagIdNum, unanswered);

    if (error) {
      console.error("Error fetching filtered questions:", error);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to fetch filtered questions",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      data: data || [],
      filters: {
        tagId: tagIdNum || null,
        unanswered,
      },
    });
  } catch (error) {
    console.error("Unexpected error in filtered-questions API:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 },
    );
  }
}
