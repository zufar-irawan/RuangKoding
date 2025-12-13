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

import type { AnswerCommentItem, AnswerWithHTML } from "@/lib/type";
import { createComment, getComments, deleteComment } from "@/lib/answers";
import { Button } from "../ui/button";
import CommentReplies from "./comment-replies";
import CommentTextarea from "./comment-textarea";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import {
  createQuestionComment,
  deleteQuestionComment,
  getQuestionComments,
} from "@/lib/questions";
import { showXPAlert } from "@/utils/xpAlert";
import Swal from "sweetalert2";

type Props = {
  question_id?: number;
  answer?: AnswerWithHTML;
  currentUser?: { id: string } | null;
};

export default function CommentForm({
  question_id,
  answer,
  currentUser,
}: Props) {
  const [isComment, setIsComment] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [comments, setComments] = useState<AnswerCommentItem[]>([]);
  const [isLoadingFetch, setIsLoadingFetch] = useState(false);
  const [isLoadingCreate, setIsLoadingCreate] = useState(false);

  const [commentText, setCommentText] = useState("");
  const [replyText, setReplyText] = useState("");

  const fetchComments = async (id: number, question: boolean) => {
    setIsLoadingFetch(true);

    try {
      if (question) {
        const result = await getQuestionComments(id);
        setComments(result ?? []);
      } else {
        const result = await getComments(id);
        setComments(result ?? []);
      }
    } finally {
      setIsLoadingFetch(false);
    }
  };

  useEffect(() => {
    if (question_id) {
      fetchComments(question_id, true);
    } else if (answer?.id) {
      fetchComments(answer.id, false);
    }
  }, [answer?.id, question_id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!commentText.trim()) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Komentar tidak boleh kosong",
        confirmButtonColor: "#667eea",
      });
      return;
    }

    setIsLoadingCreate(true);

    try {
      if (answer?.id) {
        await createComment(answer.id, commentText);
      } else if (question_id) {
        await createQuestionComment(question_id, commentText);
      }

      if (question_id) {
        fetchComments(question_id, true);
      } else if (answer?.id) {
        fetchComments(answer.id, false);
      }

      // Show XP Alert
      showXPAlert({
        xp: 5,
        title: "Komentar Berhasil Ditambahkan!",
        message: "Terimakasih sudah berkontribusi!",
      });

      setCommentText("");
      setIsOpen(false);
    } catch (error) {
      console.error("Gagal membuat komentar:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: "Gagal menambahkan komentar. Silakan coba lagi.",
        confirmButtonColor: "#667eea",
      });
    } finally {
      setIsLoadingCreate(false);
    }
  };

  const handleReplySubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    commentId: number,
  ) => {
    e.preventDefault();

    if (!replyText.trim()) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Balasan tidak boleh kosong",
        confirmButtonColor: "#667eea",
      });
      return;
    }

    setIsLoadingCreate(true);

    try {
      if (answer?.id) {
        await createComment(answer.id, replyText, commentId);
      } else if (question_id) {
        await createQuestionComment(question_id, replyText, commentId);
      }

      if (question_id) {
        fetchComments(question_id, true);
      } else if (answer?.id) {
        fetchComments(answer.id, false);
      }

      // Show XP Alert
      showXPAlert({
        xp: 5,
        title: "Balasan Berhasil Ditambahkan!",
        message: "Terimakasih sudah berkontribusi!",
      });

      setReplyText("");
      setReplyingTo(null);
    } catch (error) {
      console.error("Gagal membuat reply:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: "Gagal menambahkan balasan. Silakan coba lagi.",
        confirmButtonColor: "#667eea",
      });
    } finally {
      setIsLoadingCreate(false);
    }
  };

  const handleDelete = async (commentId: number) => {
    const result = await Swal.fire({
      title: "Hapus Komentar?",
      text: "Komentar yang dihapus tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#667eea",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      if (question_id) {
        await deleteQuestionComment(commentId);
        fetchComments(question_id, true);
      } else if (answer?.id) {
        await deleteComment(commentId);
        fetchComments(answer.id, false);
      }

      Swal.fire({
        title: "Terhapus!",
        text: "Komentar berhasil dihapus.",
        icon: "success",
        confirmButtonColor: "#667eea",
        timer: 2000,
      });
    } catch (error) {
      console.error("Gagal menghapus komentar:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: "Gagal menghapus komentar. Silakan coba lagi.",
        confirmButtonColor: "#667eea",
      });
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
          onChangeAction={setCommentText}
          onSubmitAction={handleSubmit}
          onCancelAction={() => setIsOpen(false)}
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
                          onChangeAction={setReplyText}
                          onSubmitAction={(e) =>
                            handleReplySubmit(e, comment.id)
                          }
                          onCancelAction={() => toggleReply(comment.id)}
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
