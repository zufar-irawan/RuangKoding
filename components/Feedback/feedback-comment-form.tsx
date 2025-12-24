"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  getFeedbackComments,
  createFeedbackComment,
  deleteFeedbackComment,
} from "@/lib/servers/FeedbackAction";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2, MessageSquare, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import { getClientUser } from "@/utils/GetClientUser";

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
  } | null;
};

type Props = {
  feedbackId: number;
};

export default function FeedbackCommentForm({ feedbackId }: Props) {
  const router = useRouter();
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [replyToId, setReplyToId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ id: string } | null>(null);

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
    } catch (error) {
      console.error("Error loading comments:", error);
      toast.error("Gagal memuat komentar");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!commentText.trim()) {
      toast.error("Komentar tidak boleh kosong");
      return;
    }

    setIsSubmitting(true);

    try {
      await createFeedbackComment(feedbackId, commentText, replyToId || undefined);

      toast.success("Komentar berhasil ditambahkan!");
      setCommentText("");
      setReplyToId(null);
      setShowCommentForm(false);
      await loadComments();
      router.refresh();
    } catch (error) {
      console.error("Error creating comment:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Gagal menambahkan komentar. Silakan coba lagi."
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
        error instanceof Error ? error.message : "Gagal menghapus komentar"
      );
    }
  };

  const handleReply = (commentId: number, username: string) => {
    setReplyToId(commentId);
    setShowCommentForm(true);
    setCommentText(`@${username} `);
  };

  const cancelReply = () => {
    setReplyToId(null);
    setCommentText("");
  };

  // Group comments by parent
  const topLevelComments = comments.filter((c) => !c.reply_id);
  const getReplies = (commentId: number) =>
    comments.filter((c) => c.reply_id === commentId);

  const CommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => {
    const profile = comment.profiles;
    const timeAgo = formatDistanceToNow(new Date(comment.created_at), {
      addSuffix: true,
      locale: id,
    });

    const replies = getReplies(comment.id);

    return (
      <div className={`${isReply ? "ml-8 mt-3" : "mt-4"}`}>
        <div className="flex gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-secondary-foreground shrink-0">
            {profile?.fullname.charAt(0).toUpperCase() || "U"}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium text-sm">
                {profile?.fullname || "Pengguna"}
              </span>
              <span className="text-xs text-muted-foreground">{timeAgo}</span>
            </div>

            <p className="mt-1 text-sm text-foreground whitespace-pre-wrap">
              {comment.text}
            </p>

            <div className="flex items-center gap-3 mt-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={() => handleReply(comment.id, profile?.fullname || "Pengguna")}
              >
                Balas
              </Button>

              {currentUser && comment.user_id === currentUser.id && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs text-destructive hover:text-destructive"
                  onClick={() => handleDelete(comment.id)}
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Hapus
                </Button>
              )}
            </div>

            {/* Replies */}
            {replies.length > 0 && (
              <div className="mt-2">
                {replies.map((reply) => (
                  <CommentItem key={reply.id} comment={reply} isReply={true} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full mt-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-semibold flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          {comments.length} Komentar
        </h4>

        {!showCommentForm && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCommentForm(true)}
          >
            Tambah Komentar
          </Button>
        )}
      </div>

      {/* Comment Form */}
      {showCommentForm && (
        <div className="mb-4 p-4 border border-foreground/10 rounded-lg bg-card">
          {replyToId && (
            <div className="mb-2 text-sm text-muted-foreground flex items-center gap-2">
              <span>Membalas komentar</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-xs"
                onClick={cancelReply}
              >
                Batal
              </Button>
            </div>
          )}

          <Textarea
            placeholder="Tulis komentar..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="min-h-[80px] mb-3"
            disabled={isSubmitting}
          />

          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setShowCommentForm(false);
                setCommentText("");
                setReplyToId(null);
              }}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button size="sm" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
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
      )}

      {/* Comments List */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : comments.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">
          Belum ada komentar. Jadilah yang pertama berkomentar!
        </p>
      ) : (
        <div className="space-y-1">
          {topLevelComments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>
      )}
    </div>
  );
}
