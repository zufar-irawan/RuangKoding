"use client";

import { useEffect, useState } from "react";
import {
  MessageSquare,
  Loader2,
  Trash2,
  Reply,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Image from "next/image";

import type { AnswerCommentItem, AnswerWithHTML } from "@/lib/questions";
import { createComment, getComments, deleteComment } from "@/lib/answers";
import { Button } from "../ui/button";
import { getClientUser } from "@/utils/GetClientUser";
import CommentReplies from "./comment-replies";
import CommentTextarea from "./comment-textarea";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

type Props = {
  answer: AnswerWithHTML;
};

export default function CommentForm({ answer }: Props) {
  const [isComment, setIsComment] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [comments, setComments] = useState<AnswerCommentItem[]>([]);
  const [isLoadingFetch, setIsLoadingFetch] = useState(false);
  const [isLoadingCreate, setIsLoadingCreate] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ id: string } | null>(null);

  const [commentText, setCommentText] = useState("");
  const [replyText, setReplyText] = useState("");

  const fetchComments = async (id: number) => {
    setIsLoadingFetch(true);

    try {
      const result = await getComments(id);

      setComments(result ?? []);
    } finally {
      setIsLoadingFetch(false);
    }
  };

  useEffect(() => {
    fetchComments(answer.id);

    const fetchUser = async () => {
      const user = await getClientUser();
      setCurrentUser(user);
    };

    fetchUser();
  }, [answer.id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoadingCreate(true);

    try {
      await createComment(answer.id, commentText);

      await fetchComments(answer.id);

      setCommentText("");
      setIsOpen(false);
    } catch (error) {
      console.error("Gagal membuat komentar:", error);
    } finally {
      setIsLoadingCreate(false);
    }
  };

  const handleReplySubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    commentId: number,
  ) => {
    e.preventDefault();

    setIsLoadingCreate(true);

    try {
      await createComment(answer.id, replyText, commentId);

      await fetchComments(answer.id);

      setReplyText("");
      setReplyingTo(null);
    } catch (error) {
      console.error("Gagal membuat reply:", error);
    } finally {
      setIsLoadingCreate(false);
    }
  };

  const handleDelete = async (commentId: number) => {
    try {
      await deleteComment(commentId);

      await fetchComments(answer.id);
    } catch (error) {
      console.error("Gagal menghapus komentar:", error);
    }
  };

  const toggleReply = (commentId: number) => {
    if (replyingTo === commentId) {
      setReplyingTo(null);
      setReplyText("");
    } else {
      setReplyingTo(commentId);
    }
  };

  // Pisahkan parent comments dan replies
  const parentComments = comments.filter((c) => c.reply_id === null);
  const getReplies = (parentId: number) =>
    comments.filter((c) => c.reply_id === parentId);

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between">
        <Button
          variant={"ghost"}
          onClick={() => setIsComment(!isComment)}
          className="text-lg font-semibold"
        >
          {isComment ? (
            <ChevronUp size={32} strokeWidth={3} />
          ) : (
            <ChevronDown size={32} strokeWidth={3} />
          )}
          Komentar ({parentComments.length})
        </Button>
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <MessageSquare size={18} />
          {isOpen ? "Tutup" : "Tambah komentar"}
        </Button>
      </div>

      {isOpen && (
        <CommentTextarea
          value={commentText}
          onChange={setCommentText}
          onSubmit={handleSubmit}
          onCancel={() => setIsOpen(false)}
          placeholder="Tulis komentar..."
          rows={4}
          isLoading={isLoadingCreate}
          submitText="Simpan"
        />
      )}

      {isComment && (
        <div className="mt-4 space-y-3">
          {isLoadingFetch ? (
            <p className="text-sm text-muted-foreground">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Memuat komentar...
            </p>
          ) : parentComments.length === 0 ? (
            <p className="text-sm text-muted-foreground">Belum ada komentar.</p>
          ) : (
            parentComments.map((comment) => {
              const profile = Array.isArray(comment.profiles)
                ? (comment.profiles[0] ?? null)
                : comment.profiles;

              const replies = getReplies(comment.id);

              return (
                <div key={comment.id} className="space-y-2">
                  {/* Parent Comment */}
                  <div className="flex gap-3">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      {profile?.profile_pic ? (
                        <Image
                          src={profile.profile_pic}
                          alt={profile.fullname}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-secondary-foreground">
                          {profile?.fullname.charAt(0).toUpperCase() ?? "U"}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {/* Header */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm">
                          {profile?.fullname ?? "Pengguna"}
                        </span>
                        <span className="text-muted-foreground text-xs">
                          {formatDistanceToNow(new Date(comment.created_at), {
                            addSuffix: true,
                            locale: id,
                          })}
                        </span>
                        {currentUser && profile?.id === currentUser.id && (
                          <Button
                            type="button"
                            variant={"ghost"}
                            onClick={() => handleDelete(comment.id)}
                            className="h-6 w-6 p-0 ml-auto"
                          >
                            <Trash2 size={14} />
                          </Button>
                        )}
                      </div>

                      {/* Comment Text */}
                      <p className="mt-1 text-sm text-foreground leading-relaxed">
                        {comment.text}
                      </p>

                      {/* Actions */}
                      <div className="mt-2">
                        <Button
                          type="button"
                          variant={"ghost"}
                          onClick={() => toggleReply(comment.id)}
                          className="flex items-center font-semibold hover:bg-muted"
                        >
                          <Reply size={12} />
                          {replyingTo === comment.id ? "Batal" : "Balas"}
                        </Button>
                      </div>

                      {/* Reply Form */}
                      {replyingTo === comment.id && (
                        <CommentTextarea
                          value={replyText}
                          onChange={setReplyText}
                          onSubmit={(e) => handleReplySubmit(e, comment.id)}
                          onCancel={() => toggleReply(comment.id)}
                          placeholder="Tulis balasan..."
                          rows={3}
                          isLoading={isLoadingCreate}
                          submitText="Balas"
                        />
                      )}
                    </div>
                  </div>

                  {/* Replies */}
                  <CommentReplies
                    replies={replies}
                    currentUser={currentUser}
                    answerId={answer.id}
                    onDeleteAction={handleDelete}
                  />
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
