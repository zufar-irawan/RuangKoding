"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  getFeedbackComments,
  createFeedbackComment,
  deleteFeedbackComment,
} from "@/lib/servers/FeedbackAction";
import {
  toggleCommentLike,
  getCommentsLikesData,
} from "@/lib/servers/commentLikeAction";
import ReportButton from "@/components/Report/report-button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Loader2,
  MessageSquare,
  Trash2,
  ChevronUp,
  ChevronDown,
  Reply,
  ThumbsUp,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
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
} from "@/components/ui/alert-dialog";
import Link from "next/link";
import Image from "next/image";

type Comment = {
  id: number;
  text: string;
  created_at: string;
  reply_id: number | null;
  user_id: string;
  profiles: {
    id: string;
    fullname: string;
    bio: string | null;
    profile_pic: string | null;
    id_dummy: number;
  } | null;
};

type Props = {
  feedbackId: number;
};

export default function FeedbackCommentForm({ feedbackId }: Props) {
  const router = useRouter();
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [replyText, setReplyText] = useState("");
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ id: string } | null>(null);
  const [likesData, setLikesData] = useState<
    Map<number, { liked: boolean; likesCount: number }>
  >(new Map());
  const [likingComments, setLikingComments] = useState<Set<number>>(new Set());

  useEffect(() => {
    loadComments();
    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feedbackId]);

  const loadUser = async () => {
    const user = await getClientUser();
    setCurrentUser(user);
  };

  const loadComments = async () => {
    setIsLoading(true);
    try {
      const data = await getFeedbackComments(feedbackId);
      setComments(data);

      if (data.length > 0) {
        const commentIds = data.map((c) => c.id);
        const likesMap = await getCommentsLikesData(
          commentIds,
          "feedback_comment",
        );
        setLikesData(likesMap);
      }
    } catch (error) {
      console.error("Error loading comments:", error);
      toast.error("Gagal memuat komentar");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLike = async (commentId: number, ownerId: string) => {
    if (!currentUser) {
      toast.error("Anda harus login untuk menyukai komentar");
      return;
    }

    if (currentUser.id === ownerId) {
      toast.warning("Anda tidak bisa menyukai komentar sendiri");
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
      const result = await toggleCommentLike(commentId, "feedback_comment");

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

  const handleSubmit = async () => {
    if (!commentText.trim()) {
      toast.error("Komentar tidak boleh kosong");
      return;
    }

    setIsSubmitting(true);

    try {
      await createFeedbackComment(feedbackId, commentText);
      toast.success("Komentar berhasil ditambahkan!");
      setCommentText("");
      setShowCommentForm(false);
      await loadComments();
      router.refresh();
    } catch (error) {
      console.error("Error creating comment:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Gagal menambahkan komentar. Silakan coba lagi.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReplySubmit = async (parentId: number) => {
    if (!replyText.trim()) {
      toast.error("Balasan tidak boleh kosong");
      return;
    }

    setIsSubmitting(true);

    try {
      await createFeedbackComment(feedbackId, replyText, parentId);
      toast.success("Balasan berhasil ditambahkan!");
      setReplyText("");
      setReplyingTo(null);
      await loadComments();
      router.refresh();
    } catch (error) {
      console.error("Error creating reply:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Gagal menambahkan balasan. Silakan coba lagi.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId: number) => {
    try {
      await deleteFeedbackComment(commentId);
      toast.success("Komentar berhasil dihapus");
      await loadComments();
      router.refresh();
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error(
        error instanceof Error ? error.message : "Gagal menghapus komentar",
      );
    }
  };

  const toggleReply = (commentId: number) => {
    if (replyingTo === commentId) {
      setReplyingTo(null);
      setReplyText("");
    } else {
      setReplyingTo(commentId);
      setReplyText("");
    }
  };

  const parentComments = comments.filter((c) => c.reply_id === null);
  const getReplies = (parentId: number) =>
    comments.filter((c) => c.reply_id === parentId);

  const CommentTextarea = ({
    value,
    onChange,
    onSubmit,
    onCancel,
    placeholder,
    isLoading,
  }: {
    value: string;
    onChange: (value: string) => void;
    onSubmit: () => void;
    onCancel: () => void;
    placeholder: string;
    isLoading: boolean;
  }) => (
    <div className="mt-3 space-y-3">
      <Textarea
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[80px] md:min-h-[100px] text-sm md:text-base"
        disabled={isLoading}
      />
      <div className="flex gap-2 justify-end">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onCancel}
          disabled={isLoading}
          className="text-xs md:text-sm"
        >
          Batal
        </Button>
        <Button
          type="button"
          size="sm"
          onClick={onSubmit}
          disabled={isLoading}
          className="text-xs md:text-sm"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-3 w-3 animate-spin" />
              Mengirim...
            </>
          ) : (
            "Kirim"
          )}
        </Button>
      </div>
    </div>
  );

  const CommentReplies = ({ replies }: { replies: Comment[] }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    if (replies.length === 0) return null;

    return (
      <div className="ml-[44px] md:ml-[52px]">
        {/* Toggle Button */}
        <Button
          variant="ghost"
          className="font-semibold text-primary hover:bg-primary/10 mb-3 text-xs md:text-sm h-auto py-1.5 md:py-2"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <ChevronUp size={14} className="md:w-4 md:h-4" />
          ) : (
            <ChevronDown size={14} className="md:w-4 md:h-4" />
          )}
          {isExpanded ? "Sembunyikan" : "Tampilkan"} {replies.length} balasan
        </Button>

        {/* Replies List */}
        {isExpanded && (
          <div className="space-y-3 md:space-y-4 border-l-2 border-muted pl-3 md:pl-4">
            {replies.map((reply) => {
              const profile = reply.profiles;
              return (
                <div key={reply.id} className="flex gap-2 md:gap-3">
                  {/* Avatar */}
                  <Link
                    href={`/${profile?.fullname.toLowerCase().replace(/\s/g, "-")}-${profile?.id_dummy}`}
                    className="flex-shrink-0"
                  >
                    {profile?.profile_pic ? (
                      <Image
                        src={profile?.profile_pic}
                        alt={profile?.fullname}
                        width={24}
                        height={24}
                        className="rounded-full h-7 w-7 md:h-8 md:w-8"
                      />
                    ) : (
                      <div className="flex h-7 w-7 md:h-8 md:w-8 items-center justify-center rounded-full bg-secondary text-xs md:text-sm font-semibold text-secondary-foreground">
                        {profile?.fullname.charAt(0).toUpperCase() ?? "U"}
                      </div>
                    )}
                  </Link>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <Link
                        href={`/${profile?.fullname.toLowerCase().replace(/\s/g, "-")}-${profile?.id_dummy}`}
                        className="hover:text-primary font-semibold text-xs md:text-sm"
                      >
                        {profile?.fullname ?? "Pengguna"}
                      </Link>

                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground text-xs hidden sm:inline">
                          {formatDistanceToNow(new Date(reply.created_at), {
                            addSuffix: true,
                            locale: id,
                          })}
                        </span>

                        {currentUser && reply.user_id !== currentUser.id && (
                          <ReportButton
                            type="comment"
                            referenceId={reply.id}
                            variant="ghost"
                            size="sm"
                          />
                        )}

                        {currentUser && reply.user_id === currentUser.id && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                type="button"
                                variant="destructive"
                                className="h-7 md:h-10 w-7 md:w-10 flex justify-start p-0 hover:w-28 md:hover:w-40 transition-[width] duration-300 ease-in-out group overflow-hidden"
                              >
                                <div className="flex items-center space-x-1 md:space-x-2 px-1.5 md:px-3">
                                  <Trash2
                                    size={14}
                                    className="shrink-0 md:w-5 md:h-5"
                                  />
                                  <span className="translate-x-1 opacity-0 transition-all duration-300 ease-in-out whitespace-nowrap group-hover:translate-x-0 group-hover:opacity-100 text-xs md:text-sm">
                                    Hapus balasan
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
                                  Kalau kamu hapus balasan ini, kamu tidak bisa
                                  mengembalikannya lagi loh. Pastikan kamu udah
                                  mikir sebelum menghapusnya.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(reply.id)}
                                >
                                  Ya, Hapus!
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    </div>

                    {/* Show timeAgo on mobile below name */}
                    <p className="text-xs text-muted-foreground mt-0.5 sm:hidden">
                      {formatDistanceToNow(new Date(reply.created_at), {
                        addSuffix: true,
                        locale: id,
                      })}
                    </p>

                    {/* Comment Text */}
                    <p className="mt-1 text-xs md:text-sm text-foreground leading-relaxed">
                      {reply.text}
                    </p>

                    {/* Like Button for Reply */}
                    <div className="mt-1 flex items-center">
                      <button
                        type="button"
                        onClick={() => toggleLike(reply.id, reply.user_id)}
                        disabled={
                          likingComments.has(reply.id) ||
                          currentUser?.id === reply.user_id
                        }
                        className={`
                            group relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl
                            font-semibold transition-all duration-300 ease-out
                            ${
                              likesData.get(reply.id)?.liked
                                ? "bg-primary/10 hover:bg-primary/20 text-primary"
                                : "hover:bg-muted text-muted-foreground hover:text-foreground"
                            }
                            ${likingComments.has(reply.id) ? "opacity-50 cursor-not-allowed" : "active:scale-95"}
                             ${currentUser?.id === reply.user_id ? "opacity-50 cursor-not-allowed" : ""}
                            disabled:pointer-events-none
                          `}
                      >
                        <ThumbsUp
                          size={14}
                          className={`
                              transition-all duration-300 ease-out
                              ${
                                likesData.get(reply.id)?.liked
                                  ? "fill-primary stroke-primary scale-110"
                                  : "group-hover:scale-110"
                              }
                              ${likingComments.has(reply.id) ? "animate-pulse" : ""}
                            `}
                        />
                        <span className="text-xs font-bold min-w-[14px] text-center">
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
  };

  return (
    <div className="mt-4 md:mt-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => setIsCommentOpen(!isCommentOpen)}
          className="text-base md:text-lg font-semibold p-0 h-auto hover:bg-transparent"
        >
          {isCommentOpen ? (
            <ChevronUp size={28} strokeWidth={3} className="md:w-8 md:h-8" />
          ) : (
            <ChevronDown size={28} strokeWidth={3} className="md:w-8 md:h-8" />
          )}
          Komentar ({parentComments.length})
        </Button>
        <Button
          variant="outline"
          className="flex items-center gap-2 text-xs md:text-sm h-8 md:h-10"
          onClick={() => setShowCommentForm((prev) => !prev)}
        >
          <MessageSquare size={16} className="md:w-[18px] md:h-[18px]" />
          {showCommentForm ? "Tutup" : "Tambah komentar"}
        </Button>
      </div>

      {showCommentForm && (
        <CommentTextarea
          value={commentText}
          onChange={setCommentText}
          onSubmit={handleSubmit}
          onCancel={() => setShowCommentForm(false)}
          placeholder="Tulis komentar..."
          isLoading={isSubmitting}
        />
      )}

      {isCommentOpen && (
        <div className="mt-3 md:mt-4 space-y-3">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-5 w-5 md:h-6 md:w-6 animate-spin text-muted-foreground" />
            </div>
          ) : parentComments.length === 0 ? (
            <p className="text-xs md:text-sm text-muted-foreground text-center py-8">
              Belum ada komentar.
            </p>
          ) : (
            parentComments.map((comment) => {
              const profile = comment.profiles;
              const replies = getReplies(comment.id);

              return (
                <div key={comment.id} className="space-y-2">
                  {/* Parent Comment */}
                  <div className="flex gap-2 md:gap-3">
                    {/* Avatar */}
                    <Link
                      href={`/${profile?.fullname.toLowerCase().replace(/\s/g, "-")}-${profile?.id_dummy}`}
                      className="flex-shrink-0"
                    >
                      {profile?.profile_pic ? (
                        <Image
                          src={profile.profile_pic}
                          alt={profile.fullname}
                          width={40}
                          height={40}
                          className="rounded-full w-8 h-8 md:w-10 md:h-10"
                        />
                      ) : (
                        <div className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full bg-secondary text-xs md:text-sm font-semibold text-secondary-foreground">
                          {profile?.fullname.charAt(0).toUpperCase() ?? "U"}
                        </div>
                      )}
                    </Link>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {/* Header */}
                      <div className="flex items-center justify-between">
                        <Link
                          href={`/${profile?.fullname.toLowerCase().replace(/\s/g, "-")}-${profile?.id_dummy}`}
                          className="font-semibold text-xs md:text-sm hover:text-primary"
                        >
                          {profile?.fullname ?? "Pengguna"}
                        </Link>

                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground text-xs hidden sm:inline">
                            {formatDistanceToNow(new Date(comment.created_at), {
                              addSuffix: true,
                              locale: id,
                            })}
                          </span>

                          {currentUser &&
                            comment.user_id !== currentUser.id && (
                              <ReportButton
                                type="comment"
                                referenceId={comment.id}
                                variant="ghost"
                                size="sm"
                              />
                            )}

                          {currentUser &&
                            comment.user_id === currentUser.id && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    className="h-8 md:h-10 w-8 md:w-10 flex justify-start p-0 hover:w-32 md:hover:w-40 transition-[width] duration-300 ease-in-out group overflow-hidden"
                                  >
                                    <div className="flex items-center space-x-2 px-2 md:px-3">
                                      <Trash2
                                        size={16}
                                        className="shrink-0 md:w-5 md:h-5"
                                      />
                                      <span className="translate-x-1 opacity-0 transition-all duration-300 ease-in-out whitespace-nowrap group-hover:translate-x-0 group-hover:opacity-100 text-xs md:text-sm">
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
                                      Kalau kamu hapus komentar ini, kamu tidak
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

                      {/* Show timeAgo on mobile below name */}
                      <p className="text-xs text-muted-foreground mt-0.5 sm:hidden">
                        {formatDistanceToNow(new Date(comment.created_at), {
                          addSuffix: true,
                          locale: id,
                        })}
                      </p>

                      {/* Comment Text */}
                      <p className="mt-1 text-xs md:text-sm text-foreground leading-relaxed">
                        {comment.text}
                      </p>

                      {/* Actions */}
                      <div className="mt-2 flex items-center gap-4">
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => toggleReply(comment.id)}
                          className="h-7 md:h-8 px-2 md:px-3 flex items-center gap-1 font-semibold hover:bg-muted text-xs md:text-sm"
                        >
                          <Reply
                            size={12}
                            className="md:w-[14px] md:h-[14px]"
                          />
                          {replyingTo === comment.id ? "Batal" : "Balas"}
                        </Button>

                        <button
                          type="button"
                          onClick={() =>
                            toggleLike(comment.id, comment.user_id)
                          }
                          disabled={
                            likingComments.has(comment.id) ||
                            currentUser?.id === comment.user_id
                          }
                          className={`
                            group relative flex items-center gap-2 px-4 py-1.5 rounded-xl
                            font-semibold transition-all duration-300 ease-out
                            ${
                              likesData.get(comment.id)?.liked
                                ? "bg-primary/10 hover:bg-primary/20 text-primary"
                                : "bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground"
                            }
                            ${likingComments.has(comment.id) ? "opacity-50 cursor-not-allowed" : "hover:scale-105 active:scale-95"}
                            ${currentUser?.id === comment.user_id ? "opacity-50 cursor-not-allowed" : ""}
                            disabled:pointer-events-none
                          `}
                        >
                          <ThumbsUp
                            size={16}
                            className={`
                              transition-all duration-300 ease-out
                              ${
                                likesData.get(comment.id)?.liked
                                  ? "fill-primary stroke-primary scale-110"
                                  : "group-hover:scale-110"
                              }
                              ${likingComments.has(comment.id) ? "animate-pulse" : ""}
                            `}
                          />
                          <span className="text-xs md:text-sm font-bold min-w-[20px] text-center">
                            {likesData.get(comment.id)?.likesCount ?? 0}
                          </span>
                        </button>
                      </div>

                      {/* Reply Form */}
                      {replyingTo === comment.id && (
                        <CommentTextarea
                          value={replyText}
                          onChange={setReplyText}
                          onSubmit={() => handleReplySubmit(comment.id)}
                          onCancel={() => toggleReply(comment.id)}
                          placeholder="Tulis balasan..."
                          isLoading={isSubmitting}
                        />
                      )}
                    </div>
                  </div>

                  {/* Replies */}
                  <CommentReplies replies={replies} />
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
