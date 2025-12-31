import { ThumbsUp, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import Image from "next/image";

import {
  getRequestById,
  getFeedbacksByRequestId,
  getRequestVoteCount,
} from "@/lib/servers/FeedbackAction";
import { parseLexicalBodyToHTML } from "@/lib/lexical/lexical-parser";

import RequestVote from "@/components/Feedback/request-vote";
import FeedbackSection from "@/components/Feedback/feedback-section";
import Link from "next/link";

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
        : null,
    ),
  }));

  const descriptionHTML = parseLexicalBodyToHTML(
    typeof request.description === "string" ||
      typeof request.description === "object"
      ? (request.description as string | Record<string, unknown>)
      : null,
  );

  return (
    <div className="flex flex-col gap-3 md:gap-4">
      <div className="flex items-start gap-3 md:gap-4">
        {request.icon_url && (
          <div className="relative w-12 h-12 md:w-16 md:h-16 rounded-lg overflow-hidden border border-foreground/10 shrink-0">
            <Image
              src={request.icon_url}
              alt={request.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary break-words">
            {request.title}
          </h1>
          <a
            href={request.project_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs md:text-sm text-blue-600 hover:underline mt-1 md:mt-2 inline-block break-all"
          >
            {request.project_url}
          </a>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
        {profile && (
          <Link href={`/${profile.fullname.toLowerCase().replace(/\s/g, "-")}-${profile.id_dummy}`} className="flex group items-center gap-2">
            {profile.profile_pic ? (
              <Image
                src={profile.profile_pic}
                alt={profile.fullname}
                width={24}
                height={24}
                className="rounded-full h-7 w-7 md:h-8 md:w-8"
              />
            ) : (
              <div className="flex h-7 w-7 md:h-8 md:w-8 lg:w-9 lg:h-9 items-center justify-center rounded-full bg-secondary text-xs md:text-sm lg:text-md font-semibold text-secondary-foreground">
                {profile.fullname.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="group-hover:text-primary">{profile.fullname}</span>
          </Link>
        )}
        <span>•</span>
        <span>{createdAtLabel}</span>
      </div>

      <div className="flex gap-4 md:gap-8 text-xs md:text-sm mt-2">
        <span className="text-muted-foreground">
          <MessageSquare className="inline mr-1" size={14} />
          {feedbacks.length} Feedback
        </span>

        <span className="text-muted-foreground">
          <ThumbsUp className="inline mr-1" size={14} />
          {voteCount} Vote
        </span>
      </div>

      {descriptionHTML && (
        <div className="max-w-none overflow-hidden">
          <article
            className="w-full mx-auto py-3 md:py-4 prose prose-sm md:prose-base max-w-none"
            dangerouslySetInnerHTML={{ __html: descriptionHTML }}
          />
        </div>
      )}

      <div className="flex flex-col w-full gap-6 md:gap-8 mt-6 md:mt-10">
        <RequestVote
          requestId={request.id}
          initialVoteCount={voteCount}
          requestTitle={request.title}
          requestSlug={`${request.id}`}
          requestUserId={request.user_id}
        />

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
