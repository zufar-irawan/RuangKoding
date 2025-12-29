import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import { FileText, ThumbsUp, MessageSquare } from "lucide-react";
import Image from "next/image";

import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";

type RequestTagsRelation = {
  tag_id: number;
  tags: {
    id: number;
    tag: string | null;
  } | {
    id: number;
    tag: string | null;
  }[];
} | {
  tag_id: number;
  tags: {
    id: number;
    tag: string | null;
  } | {
    id: number;
    tag: string | null;
  }[];
}[];

interface FeedbackRequestCardProps {
  request: {
    id: number;
    title: string;
    description: unknown;
    project_url: string;
    icon_url: string | null;
    created_at: string;
    user_id: string;
    profiles: {
      fullname: string;
    } | null;
    vote_count?: number;
    feedback_count?: number;
    request_tags?: RequestTagsRelation;
  };
}

function normalizeRequestTags(
  relation: RequestTagsRelation | undefined,
): { tag: string | null }[] {
  if (!relation) return [];

  const list = Array.isArray(relation) ? relation : [relation];

  return list.flatMap((item) => {
    if (!item || !item.tags) return [];
    const tags = item.tags;

    if (Array.isArray(tags)) {
      return tags.map((tag) => ({ tag: tag?.tag ?? null }));
    }

    return [{ tag: tags.tag ?? null }];
  });
}

export default function FeedbackRequestCard({
  request,
}: FeedbackRequestCardProps) {
  const createdAtLabel = formatDistanceToNow(new Date(request.created_at), {
    addSuffix: true,
    locale: id,
  });

  const userProfile = request.profiles;

  const flattenedTags = normalizeRequestTags(request.request_tags)
    .map((tag) => tag.tag)
    .filter(Boolean);

  return (
    <Card className="hover:shadow-lg transition-shadow mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {userProfile ? (
            <>
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-secondary/80 text-xs font-semibold text-secondary-foreground">
                {userProfile.fullname.charAt(0).toUpperCase()}
              </span>
              <span className="font-medium text-foreground">
                {userProfile.fullname}
              </span>
            </>
          ) : (
            <span>Pengguna tidak diketahui</span>
          )}
          <span>•</span>
          <span>{createdAtLabel}</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-start gap-3">
          {request.icon_url ? (
            <div className="flex-shrink-0">
              <Image
                src={request.icon_url}
                alt={request.title}
                width={48}
                height={48}
                className="rounded-lg object-cover"
              />
            </div>
          ) : (
            <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 bg-secondary rounded-lg">
              <FileText size={24} className="text-foreground" />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <Link
              href={`/lautan-feedback/${request.id}`}
              className="text-base font-semibold text-foreground hover:text-primary transition-colors line-clamp-2 leading-snug"
            >
              {request.title}
            </Link>

            <Link
              href={request.project_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary hover:underline mt-1 inline-block truncate max-w-full"
            >
              {request.project_url}
            </Link>

            {/* Tags */}
            <div className="flex gap-2 items-center flex-wrap mt-2">
              {flattenedTags.length === 0 ? (
                <span className="text-xs text-muted-foreground">Belum ada tag</span>
              ) : (
                flattenedTags.map((tag) => (
                  <Link
                    href="#"
                    key={tag}
                    className="px-2 py-1 bg-accent text-accent-foreground rounded text-xs hover:bg-accent/80 transition-colors"
                  >
                    {tag}
                  </Link>
                ))
              )}
            </div>

            {/* Vote and Feedback Counts */}
            <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <ThumbsUp size={14} />
                <span>{request.vote_count ?? 0}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare size={14} />
                <span>{request.feedback_count ?? 0}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
