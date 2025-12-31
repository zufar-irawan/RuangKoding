"use client";

import { useEffect, useState } from "react";
import {
  MessageSquare,
  Loader2,
  Trash2,
  Reply,
  ChevronDown,
  ChevronUp,
  ThumbsUp,
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
import {
  toggleCommentLike,
  getCommentsLikesData,
} from "@/lib/servers/commentLikeAction";
import Link from "next/link";

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

  // Like state management
  const [likesData, setLikesData] = useState<
    Map<number, { liked: boolean; likesCount: number }>
  >(new Map());
  const [likingComments, setLikingComments] = useState<Set<number>>(new Set());

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
      let fetchedComments: AnswerCommentItem[] = [];

      if (question) {
        const result = await getQuestionComments(id);
        fetchedComments = result ?? [];
      } else {
        const result = await getComments(id);
        fetchedComments = result ?? [];
      }

      setComments(fetchedComments);

      // Fetch likes data for all comments
      if (fetchedComments.length > 0) {
        const commentIds = fetchedComments.map((c) => c.id);
        const commentType = question ? "quest_comment" : "answ_comment";
        const likesMap = await getCommentsLikesData(commentIds, commentType);
        setLikesData(likesMap);
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
      toast.warning("Komentar tidak boleh kosong.");
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
      toast.error("Gagal menambahkan komentar. Silakan coba lagi.");
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
      toast.error("Balasan tidak boleh kosong");
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

  const toggleLike = async (commentId: number) => {
    if (!currentUser) {
      toast.error("Anda harus login untuk menyukai komentar");
      return;
    }

    // Prevent double-clicking
    if (likingComments.has(commentId)) {
      return;
    }

    // Add to liking set
    setLikingComments((prev) => new Set(prev).add(commentId));

    // Optimistic update
    const currentData = likesData.get(commentId) || {
      liked: false,
      likesCount: 0,
    };
    const newLiked = !currentData.liked;
    const newCount = newLiked
      ? currentData.likesCount + 1
      : Math.max(0, currentData.likesCount - 1);

    setLikesData((prev) => {
      const newMap = new Map(prev);
      newMap.set(commentId, { liked: newLiked, likesCount: newCount });
      return newMap;
    });

    try {
      const commentType = question_id ? "quest_comment" : "answ_comment";
      const result = await toggleCommentLike(commentId, commentType);

      if (result.success) {
        // Update with actual server data
        setLikesData((prev) => {
          const newMap = new Map(prev);
          newMap.set(commentId, {
            liked: result.liked,
            likesCount: result.likesCount,
          });
          return newMap;
        });
      } else {
        // Revert on error
        setLikesData((prev) => {
          const newMap = new Map(prev);
          newMap.set(commentId, currentData);
          return newMap;
        });
        toast.error(result.error || "Gagal menyukai komentar");
      }
    } catch (error) {
      // Revert on error
      setLikesData((prev) => {
        const newMap = new Map(prev);
        newMap.set(commentId, currentData);
        return newMap;
      });
      console.error("Error toggling like:", error);
      toast.error("Terjadi kesalahan saat menyukai komentar");
    } finally {
      // Remove from liking set
      setLikingComments((prev) => {
        const newSet = new Set(prev);
        newSet.delete(commentId);
        return newSet;
      });
    }
  };

  // Pisahkan parent comments dan replies
  const parentComments = comments.filter((c) => c.reply_id === null);
  const getReplies = (parentId: number) =>
    comments.filter((c) => c.reply_id === parentId);

  return (
    <div className="mt-3 md:mt-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 md:gap-4">
        <Button
          variant={"ghost"}
          onClick={() => setIsComment(!isComment)}
          className="text-sm md:text-base lg:text-lg font-semibold h-auto p-2"
        >
          {isComment ? (
            <ChevronUp className="w-6 h-6 md:w-8 md:h-8" strokeWidth={3} />
          ) : (
            <ChevronDown className="w-6 h-6 md:w-8 md:h-8" strokeWidth={3} />
          )}
          <span className="ml-1 md:ml-2">
            Komentar ({parentComments.length})
          </span>
        </Button>
        <Button
          variant="outline"
          className="flex items-center gap-1 md:gap-2 text-xs md:text-sm h-8 md:h-9"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <MessageSquare className="w-4 h-4 md:w-[18px] md:h-[18px]" />
          <span className="hidden sm:inline">
            {isOpen ? "Tutup" : "Tambah komentar"}
          </span>
          <span className="sm:hidden">{isOpen ? "Tutup" : "Tambah"}</span>
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
                    <Link href={`/${profile?.fullname?.toLowerCase().replace(" ", "-")}-${profile?.id_dummy}`} className="flex-shrink-0">
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
                    </Link>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {/* Header */}
                      <div className="flex items-center justify-between">
                        <Link href={`/${profile?.fullname?.toLowerCase().replace(" ", "-")}-${profile?.id_dummy}`} className="font-semibold text-sm hover:text-primary">
                          {profile?.fullname ?? "Pengguna"}
                        </Link>

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
                      <div className="mt-2 flex justify-between">
                        <Button
                          type="button"
                          variant={"ghost"}
                          onClick={() => toggleReply(comment.id)}
                          className="flex items-center gap-1 font-semibold hover:bg-muted"
                        >
                          <Reply size={12} />
                          {replyingTo === comment.id ? "Batal" : "Balas"}
                        </Button>

                        <button
                          type="button"
                          onClick={() => toggleLike(comment.id)}
                          disabled={likingComments.has(comment.id)}
                          className={`
                            group relative flex items-center gap-2 px-4 py-2.5 rounded-xl
                            font-semibold transition-all duration-300 ease-out
                            ${likesData.get(comment.id)?.liked
                              ? "bg-primary/10 hover:bg-primary/20 text-primary"
                              : "bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground"
                            }
                            ${likingComments.has(comment.id) ? "opacity-50 cursor-not-allowed" : "hover:scale-105 active:scale-95"}
                            disabled:pointer-events-none
                          `}
                        >
                          <ThumbsUp
                            size={20}
                            className={`
                              transition-all duration-300 ease-out
                              ${likesData.get(comment.id)?.liked
                                ? "fill-primary stroke-primary scale-110"
                                : "group-hover:scale-110"
                              }
                              ${likingComments.has(comment.id) ? "animate-pulse" : ""}
                            `}
                          />
                          <span className="text-sm font-bold min-w-[20px] text-center">
                            {likesData.get(comment.id)?.likesCount ?? 0}
                          </span>
                        </button>
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
                    likesData={likesData}
                    onToggleLikeAction={toggleLike}
                    likingComments={likingComments}
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
