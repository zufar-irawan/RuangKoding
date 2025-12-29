"use client";

import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getClientUser } from "@/utils/GetClientUser";
import { deleteFeedback } from "@/lib/servers/FeedbackAction";
import FeedbackBody from "./feedback-body";
import FeedbackVote from "./feedback-vote";
import FeedbackCommentForm from "./feedback-comment-form";
import FeedbackForm from "./feedback-form";
import styles from "@/styles/BlogContent.module.css";
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

type FeedbackWithHTML = {
  id: number;
  request_id: number;
  user_id: string;
  feedback: any;
  created_at: string;
  html?: string;
  profiles: {
    id: string;
    fullname: string;
    bio: string | null;
    profile_pic: string | null;
  } | null;
};

type Props = {
  feedbacks: FeedbackWithHTML[];
  requestId: number;
  requestUserId: string;
};

export default function FeedbackSection({
  feedbacks = [],
  requestId,
  requestUserId,
}: Props) {
  const router = useRouter();
  const feedbackCount = feedbacks.length;
  const [hasFeedback, setHasFeedback] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<{ id: string } | null>(null);

  useEffect(() => {
    async function checkIfUserHasFeedback() {
      setIsLoading(true);
      const user = await getClientUser();

      if (!user) {
        setHasFeedback(false);
        setIsLoading(false);
        return;
      }

      // Check if user has already given feedback
      const userHasFeedback = feedbacks.some(
        (feedback) => feedback.user_id === user.id
      );

      setHasFeedback(userHasFeedback);
      setIsLoading(false);
      setCurrentUser(user);
    }

    checkIfUserHasFeedback();
  }, [feedbacks]);

  const handleDelete = async (feedbackId: number) => {
    try {
      await deleteFeedback(feedbackId);
      toast.success("Feedback berhasil dihapus");
      router.refresh();
    } catch (error) {
      console.error("Error deleting feedback:", error);
      toast.error(
        error instanceof Error ? error.message : "Gagal menghapus feedback"
      );
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <h2 className="text-2xl font-semibold">{feedbackCount} Feedback</h2>

      <div className="flex flex-col w-full gap-6">
        {feedbackCount === 0 ? (
          <>
            <p className="text-md text-foreground">
              Belum ada feedback saat ini. Kamu bisa menjadi yang{" "}
              <span className="font-semibold">pertama memberi feedback!</span>
            </p>

            {!isLoading &&
              (hasFeedback ? (
                <p className="text-sm text-muted-foreground p-4 bg-secondary/50 rounded-md">
                  Kamu sudah memberikan feedback untuk request ini.
                </p>
              ) : currentUser?.id === requestUserId ? (
                <p className="text-sm text-muted-foreground p-4 bg-secondary/50 rounded-md">
                  Kamu tidak bisa memberi feedback untuk request kamu sendiri.
                </p>
              ) : (
                <FeedbackForm requestId={requestId} />
              ))}
          </>
        ) : (
          <div className="flex flex-col gap-6">
            {feedbacks.map((feedback) => {
              const profile = feedback.profiles;
              const timeAgo = feedback.created_at
                ? formatDistanceToNow(new Date(feedback.created_at), {
                    addSuffix: true,
                    locale: id,
                  })
                : "";

              return (
                <div
                  key={feedback.id}
                  className="px-4 py-6 border border-foreground/10 rounded-lg bg-card"
                >
                  <div className="flex gap-4">
                    {/* Vote Section */}
                    <FeedbackVote
                      feedbackId={feedback.id}
                      currentUserId={currentUser?.id ?? null}
                      feedbackUserId={feedback.user_id}
                    />

                    {/* Feedback Content */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 text-sm">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-secondary-foreground">
                            {profile?.fullname.charAt(0).toUpperCase() || "U"}
                          </div>
                          <span className="font-medium">
                            {profile?.fullname || "Pengguna"}
                          </span>
                          <span className="text-muted-foreground">•</span>
                          <span className="text-muted-foreground">
                            {timeAgo}
                          </span>
                        </div>

                        {currentUser &&
                          feedback.user_id === currentUser.id && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  className="h-8"
                                >
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Hapus
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Kamu yakin ingin menghapus?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Feedback yang sudah dihapus tidak bisa
                                    dikembalikan lagi. Pastikan kamu sudah
                                    yakin sebelum menghapusnya.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Batal</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(feedback.id)}
                                  >
                                    Ya, Hapus!
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                      </div>

                      {/* Feedback Body */}
                      {(() => {
                        const html = feedback.html;
                        if (!html) {
                          return (
                            <p className="mt-2 text-foreground whitespace-pre-wrap">
                              {typeof feedback.feedback === "string"
                                ? feedback.feedback
                                : ""}
                            </p>
                          );
                        }

                        return (
                          <article
                            className={`w-full mx-auto ${styles["blog-content"]}`}
                            dangerouslySetInnerHTML={{ __html: html }}
                          />
                        );
                      })()}

                      {/* Comments */}
                      <FeedbackCommentForm feedbackId={feedback.id} />
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Add feedback form at bottom */}
            {!isLoading &&
              (hasFeedback ? (
                <></>
              ) : currentUser?.id === requestUserId ? (
                <></>
              ) : (
                <div className="flex flex-col gap-3">
                  <h3 className="text-lg font-medium">
                    Punya feedback lain? Tambahkan di bawah!
                  </h3>
                  <FeedbackForm requestId={requestId} />
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
