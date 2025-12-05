"use client";

import { Button } from "../ui/button";
import { Trash2, ChevronDown, ChevronUp } from "lucide-react";
import type { AnswerCommentItem } from "@/lib/questions";
import { useState } from "react";
import Image from "next/image";
import { id } from "date-fns/locale";
import { formatDistanceToNow } from "date-fns";

type Props = {
  replies: AnswerCommentItem[];
  currentUser: { id: string } | null;
  answerId: number;
  onDeleteAction: (commentId: number) => Promise<void>;
};

export default function CommentReplies({
  replies,
  currentUser,
  onDeleteAction,
}: Props) {
  const [isCommentExpanded, setIsCommentExpanded] = useState(false);

  if (replies.length === 0) return null;

  return (
    <div className="ml-[52px]">
      {/* Toggle Button */}
      <Button
        variant="ghost"
        className="font-semibold text-primary hover:bg-primary/10 mb-3"
        onClick={() => setIsCommentExpanded(!isCommentExpanded)}
      >
        {isCommentExpanded ? (
          <ChevronUp size={14} />
        ) : (
          <ChevronDown size={14} />
        )}
        {isCommentExpanded ? "Sembunyikan" : "Tampilkan"} {replies.length}{" "}
        balasan
      </Button>

      {/* Replies List */}
      {isCommentExpanded && (
        <div className="space-y-4 border-l-2 border-muted pl-4">
          {replies.map((reply) => {
            const replyProfile = Array.isArray(reply.profiles)
              ? (reply.profiles[0] ?? null)
              : reply.profiles;

            return (
              <div key={reply.id} className="flex gap-3">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  {replyProfile?.profile_pic ? (
                    <Image
                      src={replyProfile.profile_pic}
                      alt={replyProfile.fullname}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground">
                      {replyProfile?.fullname.charAt(0).toUpperCase() ?? "U"}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Header */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm">
                      {replyProfile?.fullname ?? "Pengguna"}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {formatDistanceToNow(new Date(reply.created_at), {
                        addSuffix: true,
                        locale: id,
                      })}
                    </span>
                    {currentUser && replyProfile?.id === currentUser.id && (
                      <Button
                        type="button"
                        variant={"ghost"}
                        onClick={() => onDeleteAction(reply.id)}
                        className="h-6 w-6 p-0 ml-auto"
                      >
                        <Trash2 size={14} />
                      </Button>
                    )}
                  </div>

                  {/* Reply Text */}
                  <p className="mt-1 text-sm text-foreground leading-relaxed">
                    {reply.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
