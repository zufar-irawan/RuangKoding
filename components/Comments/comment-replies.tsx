"use client";

import { Button } from "../ui/button";
import { Trash2, ChevronDown, ChevronUp, ThumbsUp } from "lucide-react";
import type { AnswerCommentItem } from "@/lib/type";
import { useState } from "react";
import Image from "next/image";
import { id } from "date-fns/locale";
import { formatDistanceToNow } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import Link from "next/link";

type Props = {
  replies: AnswerCommentItem[];
  currentUser?: string;
  onDeleteAction: (commentId: number) => Promise<void>;
  likesData: Map<number, { liked: boolean; likesCount: number }>;
  onToggleLikeAction: (commentId: number) => void;
  likingComments: Set<number>;
};

export default function CommentReplies({
  replies,
  currentUser,
  onDeleteAction,
  likesData,
  onToggleLikeAction,
  likingComments,
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
                <Link href={`/${replyProfile?.fullname?.toLowerCase().replace(" ", "-")}-${replyProfile?.id_dummy}`} className="flex-shrink-0">
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
                </Link>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <Link href={`/${replyProfile?.fullname?.toLowerCase().replace(" ", "-")}-${replyProfile?.id_dummy}`} className="font-semibold text-sm hover:text-primary">
                      {replyProfile?.fullname ?? "Pengguna"}
                    </Link>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground text-xs">
                        {formatDistanceToNow(new Date(reply.created_at), {
                          addSuffix: true,
                          locale: id,
                        })}
                      </span>
                      {currentUser && replyProfile?.id === currentUser && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              type="button"
                              variant={"destructive"}
                              className="h-10 w-10 flex justify-start p-0 hover:w-40 transition-[width] duration-300 ease-in-out group overflow-hidden"
                            >
                              <div className="flex items-center space-x-2 px-3">
                                <Trash2 size={20} className="shrink-0" />
                                <span className="translate-x-1 opacity-0 transition-all duration-300 ease-in-out whitespace-nowrap group-hover:translate-x-0 group-hover:opacity-100">
                                  Hapus komentar
                                </span>
                              </div>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Kamu yakin ga nih?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Kalau kamu hapus jawaban ini, kamu tidak bisa
                                mengembalikannya lagi loh. Pastikan kamu udah
                                mikir sebelum menghapusnya.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Batal</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => onDeleteAction(reply.id)}
                              >
                                Ya, Hapus!
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </div>

                  {/* Reply Text */}
                  <p className="mt-1 text-sm text-foreground leading-relaxed">
                    {reply.text}
                  </p>

                  {/* Like Button */}
                  <div className="mt-2">
                    <button
                      type="button"
                      onClick={() => onToggleLikeAction(reply.id)}
                      disabled={likingComments.has(reply.id)}
                      className={`
                        group relative flex items-center gap-2 px-3 py-2 rounded-xl
                        font-semibold transition-all duration-300 ease-out
                        ${likesData.get(reply.id)?.liked
                          ? "bg-primary/10 hover:bg-primary/20 text-primary"
                          : "bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground"
                        }
                        ${likingComments.has(reply.id) ? "opacity-50 cursor-not-allowed" : "hover:scale-105 active:scale-95"}
                        disabled:pointer-events-none
                      `}
                    >
                      <ThumbsUp
                        size={16}
                        className={`
                          transition-all duration-300 ease-out
                          ${likesData.get(reply.id)?.liked
                            ? "fill-primary stroke-primary scale-110"
                            : "group-hover:scale-110"
                          }
                          ${likingComments.has(reply.id) ? "animate-pulse" : ""}
                        `}
                      />
                      <span className="text-sm font-bold min-w-[16px] text-center">
                        {likesData.get(reply.id)?.likesCount ?? 0}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
