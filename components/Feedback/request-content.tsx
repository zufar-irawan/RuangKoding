import { Eye, ThumbsUp, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import Image from "next/image";

import {
  getRequestById,
  getFeedbacksByRequestId,
  getRequestVoteCount,
} from "@/lib/servers/FeedbackAction";
import { parseLexicalBodyToHTML } from "@/lib/lexical/lexical-parser";

import FeedbackBody from "@/components/Feedback/feedback-body";
import RequestVote from "@/components/Feedback/request-vote";
import FeedbackSection from "@/components/Feedback/feedback-section";

type RequestContentProps = {
  requestId: number;
};

export default async function RequestContent({
  requestId,
}: RequestContentProps) {
  // Fetch request data
  const request = await getRequestById(requestId);
  const feedbacks = await getFeedbacksByRequestId(requestId);
  const voteCount = await getRequestVoteCount(requestId);

  if (!request) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-muted-foreground">Request tidak ditemukan.</p>
      </div>
    );
  }

  const profile = request.profiles;

  const createdAtLabel = request.created_at
    ? format(new Date(request.created_at), "d MMMM yyyy", { locale: id })
    : "";

  const feedbacksWithHTML = feedbacks.map((feedback) => ({
    ...feedback,
    html: parseLexicalBodyToHTML(
      typeof feedback.feedback === "string" ||
        typeof feedback.feedback === "object"
        ? (feedback.feedback as string | Record<string, unknown>)
        : null
    ),
  }));

  const descriptionHTML = parseLexicalBodyToHTML(
    typeof request.description === "string" ||
      typeof request.description === "object"
      ? (request.description as string | Record<string, unknown>)
      : null
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start gap-4">
        {request.icon_url && (
          <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-foreground/10 shrink-0">
            <Image
              src={request.icon_url}
              alt={request.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div className="flex-1">
          <h1 className="text-4xl font-bold text-primary">{request.title}</h1>
          <a
            href={request.project_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:underline mt-2 inline-block"
          >
            {request.project_url}
          </a>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {profile && (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-secondary-foreground">
              {profile.fullname.charAt(0).toUpperCase()}
            </div>
            <span>{profile.fullname}</span>
          </div>
        )}
        <span>•</span>
        <span>{createdAtLabel}</span>
      </div>

      <div className="flex gap-8 text-sm mt-2">
        <span className="text-muted-foreground">
          <MessageSquare className="inline mr-1" size={16} />
          {feedbacks.length} Feedback
        </span>

        <span className="text-muted-foreground">
          <ThumbsUp className="inline mr-1" size={16} />
          {voteCount} Vote
        </span>
      </div>

      {descriptionHTML && (
        <div className="max-w-none">
          <article
            className="w-full mx-auto py-4"
            dangerouslySetInnerHTML={{ __html: descriptionHTML }}
          />
        </div>
      )}

      <div className="flex flex-col w-full gap-8 mt-10">
        <RequestVote requestId={request.id} initialVoteCount={voteCount} />

        <div className="flex border border-foreground/10 w-full"></div>

        <FeedbackSection
          feedbacks={feedbacksWithHTML}
          requestId={request.id}
          requestUserId={request.user_id}
        />
      </div>
    </div>
  );
}
