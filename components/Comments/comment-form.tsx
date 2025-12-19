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
import { toast } from "sonner";
import { getClientUser } from "@/utils/GetClientUser";
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

type Props = {
  question_id?: number;
  answer?: AnswerWithHTML;
};

export default function CommentForm({ question_id, answer }: Props) {
  const [isComment, setIsComment] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [comments, setComments] = useState<AnswerCommentItem[]>([]);
  const [isLoadingFetch, setIsLoadingFetch] = useState(false);
  const [isLoadingCreate, setIsLoadingCreate] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | undefined>(undefined);

  const [commentText, setCommentText] = useState("");
  const [replyText, setReplyText] = useState("");

  // Fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      const user = await getClientUser();
      if (user) {
        setCurrentUser(user.id);
      }
    };

    fetchUser();
  }, []);

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

      toast.success("Komentar Berhasil Ditambahkan!");

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
    try {
      if (question_id) {
        await deleteQuestionComment(commentId);
        fetchComments(question_id, true);
      } else if (answer?.id) {
        await deleteComment(commentId);
        fetchComments(answer.id, false);
      }

      toast.success("Komentar berhasil dihapus.");
    } catch (error) {
      console.error("Gagal menghapus komentar:", error);
      toast.error("Gagal menghapus komentar. Silakan coba lagi.");
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
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm">
                          {profile?.fullname ?? "Pengguna"}
                        </span>

                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground text-xs">
                            {formatDistanceToNow(new Date(comment.created_at), {
                              addSuffix: true,
                              locale: id,
                            })}
                          </span>

                          {currentUser && profile?.id === currentUser && (
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
                                    Kalau kamu hapus jawaban ini, kamu tidak
                                    bisa mengembalikannya lagi loh. Pastikan
                                    kamu udah mikir sebelum menghapusnya.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Batal</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(comment.id)}
                                  >
                                    Ya, Hapus!
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </div>
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
