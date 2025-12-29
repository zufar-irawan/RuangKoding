import { NextRequest, NextResponse } from "next/server";
import { getFilteredFeedbackRequests } from "@/lib/servers/FeedbackRequestAction";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tagId = searchParams.get("tagId");

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

    const result = await getFilteredFeedbackRequests(tagIdNum);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.message || "Failed to fetch filtered feedback requests",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data || [],
      filters: {
        tagId: tagIdNum || null,
      },
    });
  } catch (error) {
    console.error("Unexpected error in filtered-feedback-requests API:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 },
    );
  }
}

