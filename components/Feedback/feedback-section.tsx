"use client";

import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getClientUser } from "@/utils/GetClientUser";
import { deleteFeedback } from "@/lib/servers/FeedbackAction";
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
import Image from "next/image";
import Link from "next/link";

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
    id_dummy: number;
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
        (feedback) => feedback.user_id === user.id,
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
        error instanceof Error ? error.message : "Gagal menghapus feedback",
      );
    }
  };

  return (
    <div className="w-full flex flex-col gap-2">
      <h2 className="text-xl md:text-2xl font-semibold">
        {feedbackCount} Feedback
      </h2>

      <div className="flex flex-col w-full">
        {feedbackCount === 0 ? (
          <>
            <h1 className="text-sm md:text-base text-foreground">
              Belum ada feedback saat ini. Kamu bisa menjadi yang{" "}
              <span className="font-semibold">pertama memberi feedback!</span>
            </h1>

            {!isLoading &&
              (hasFeedback ? (
                <p className="text-sm text-muted-foreground mt-4 p-4 bg-secondary/50 rounded-md">
                  Kamu sudah memberikan feedback untuk request ini.
                </p>
              ) : currentUser?.id === requestUserId ? (
                <p className="text-sm text-muted-foreground mt-4 p-4 bg-secondary/50 rounded-md">
                  Kamu tidak bisa memberi feedback untuk request kamu sendiri.
                </p>
              ) : (
                <FeedbackForm requestId={requestId} />
              ))}
          </>
        ) : (
          <div className="flex flex-col gap-4">
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
                  className="px-0 sm:px-4 py-6 md:py-8 border-b border-foreground/10"
                >
                  <div className="flex gap-3 md:gap-4">
                    {/* Vote Section */}
                    <FeedbackVote
                      feedbackId={feedback.id}
                      currentUserId={currentUser?.id ?? null}
                      feedbackUserId={feedback.user_id}
                    />

                    {/* Feedback Content */}
                    <div className="flex-1 min-w-0">
                      <div className="text-xs md:text-sm text-muted-foreground">
                        <div className="flex items-center justify-between">
                          <Link href={`/${profile?.fullname.toLowerCase().replace(/\s/g, "-")}-${profile?.id_dummy}`} className="flex group items-center gap-2">
                            {profile?.profile_pic ? (
                              <Image
                                src={profile.profile_pic}
                                alt={profile.fullname}
                                width={24}
                                height={24}
                                className="rounded-full"
                              />
                            ) : (
                              <div className="flex h-7 w-7 md:h-8 md:w-8 items-center justify-center rounded-full bg-secondary text-xs md:text-sm font-semibold text-secondary-foreground">
                                {profile?.fullname.charAt(0).toUpperCase() || "U"}
                              </div>
                            )}
                            <span className="text-foreground group-hover:text-primary">
                              {profile?.fullname || "Pengguna"}
                            </span>
                          </Link>

                          <div className="flex items-center gap-2 md:gap-3">
                            <p className="text-muted-foreground hidden sm:inline">
                              {timeAgo}
                            </p>

                            {currentUser &&
                              feedback.user_id === currentUser.id && (
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
                                          Hapus feedback
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
                                        Kalau kamu hapus feedback ini, kamu
                                        tidak bisa mengembalikannya lagi loh.
                                        Pastikan kamu udah mikir sebelum
                                        menghapusnya.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>
                                        Batal
                                      </AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() =>
                                          handleDelete(feedback.id)
                                        }
                                      >
                                        Ya, Hapus!
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              )}
                          </div>
                        </div>
                      </div>

                      {/* Show timeAgo on mobile below name */}
                      <p className="text-xs text-muted-foreground mt-1 sm:hidden">
                        {timeAgo}
                      </p>

                      {/* Feedback Body */}
                      {(() => {
                        const html = feedback.html;
                        if (!html) {
                          return (
                            <p className="mt-2 text-sm md:text-base text-foreground whitespace-pre-wrap">
                              {typeof feedback.feedback === "string"
                                ? feedback.feedback
                                : ""}
                            </p>
                          );
                        }

                        return (
                          <article
                            className={`w-full mx-auto pt-3 md:pt-4 ${styles["blog-content"]}`}
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
                <div className="flex flex-col">
                  <h1 className="text-sm md:text-base text-foreground">
                    Punya feedback lain? Tambahkan di bawah!
                  </h1>
                  <FeedbackForm requestId={requestId} />
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
