import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import { CheckCircle, Eye, MessageSquare } from "lucide-react";

import type { QuestionListItem, CountRelation } from "@/lib/type";

interface PostCardProps {
  question: QuestionListItem;
}

type TagRelation = QuestionListItem["quest_tags"];

function getCountValue(relation: CountRelation | undefined): number {
  if (!relation) {
    return 0;
  }

  if (Array.isArray(relation)) {
    return relation[0]?.count ?? 0;
  }

  return relation.count ?? 0;
}

function normalizeTags(relation: TagRelation): { tag: string | null }[] {
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

export default function PostCard({ question }: PostCardProps) {
  const createdAtLabel = formatDistanceToNow(new Date(question.created_at), {
    addSuffix: true,
    locale: id,
  });

  const userProfile = Array.isArray(question.profiles)
    ? question.profiles[0]
    : question.profiles;

  const flattenedTags = normalizeTags(question.quest_tags)
    .map((tag) => tag.tag)
    .filter(Boolean);

  const slug = question.slug;
  const questionId = question.id;

  const answerCount = getCountValue(question.answers);
  const votesCount = getCountValue(question.votes);

  return (
    <div className="border-b border-border last:border-b-0 py-4 hover:bg-accent/5 transition-colors">
      <div className="flex flex-col gap-3">
        {/* User Profile - Top */}
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
          <span>ditanya {createdAtLabel}</span>
        </div>

        {/* Question Title */}
        <Link
          href={`/question/${slug}-${questionId}`}
          className="text-lg font-semibold text-primary hover:text-primary/80 transition-colors leading-snug"
        >
          {question.title}
        </Link>

        {/* Question Excerpt */}
        <p className="text-sm text-foreground/80 line-clamp-2 leading-relaxed">
          {question.excerpt}
        </p>

        {/* Tags */}
        <div className="flex gap-2 items-center flex-wrap">
          {flattenedTags.length === 0 ? (
            <span className="text-xs text-muted-foreground">Belum ada tag</span>
          ) : (
            flattenedTags.map((tag) => (
              <Link
                href={"#"}
                key={tag}
                className="px-2 py-1 bg-accent text-accent-foreground rounded text-xs hover:bg-accent/80 transition-colors"
              >
                {tag}
              </Link>
            ))
          )}
        </div>

        {/* Stats - Bottom */}
        <div className="flex gap-6 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <CheckCircle
              size={14}
              className={
                answerCount > 0 ? "text-green-600" : "text-muted-foreground"
              }
            />
            <span
              className={answerCount > 0 ? "text-green-600 font-medium" : ""}
            >
              {answerCount} Answers
            </span>
          </div>

          <div className="flex items-center gap-1">
            <MessageSquare size={14} />
            <span>{votesCount} Votes</span>
          </div>

          <div className="flex items-center gap-1">
            <Eye size={14} />
            <span>{question.view} Views</span>
          </div>
        </div>
      </div>
    </div>
  );
}
