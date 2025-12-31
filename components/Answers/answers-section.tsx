"use client";

import type { AnswerWithHTML } from "@/lib/type";
import AnswerForm from "./answer-form";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import CommentForm from "../Comments/comment-form";
import styles from "@/styles/BlogContent.module.css";
import { getClientUser } from "@/utils/GetClientUser";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { CheckCircle, Trash2 } from "lucide-react";
import { deleteAnswer } from "@/lib/answers";
import AnswerVote from "../ui/answer-vote";
import { toast } from "sonner";
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
import { useRouter } from "next/navigation";
import { acceptAnswer } from "@/lib/servers/AnswerAction";
import Image from "next/image";
import Link from "next/link";

type Props = {
  answers?: AnswerWithHTML[];
  questionId?: number;
  questionSlug: string | null;
  user_question_id?: string;
};

export default function AnswersSection({
  answers = [],
  questionId,
  questionSlug,
  user_question_id,
}: Props) {
  const router = useRouter();
  const answerCount = answers.length;
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<{ id: string } | null>(null);

  const createdAtLabel = answers.map((answer) =>
    answer.created_at
      ? formatDistanceToNow(new Date(answer.created_at), {
        addSuffix: true,
        locale: id,
      })
      : "",
  );

  const handleDelete = async (answerId: number) => {
    try {
      await deleteAnswer(answerId);

      toast.success("Answer deleted successfully");
      router.push(`/question/${questionSlug}-${questionId}`);
      router.refresh();
    } catch (error) {
      console.error("Error deleting answer:", error);
    }
  };

  useEffect(() => {
    async function checkIfUserHasAnswered() {
      setIsLoading(true);
      const user = await getClientUser();

      if (!user) {
        setHasAnswered(false);
        setIsLoading(false);
        return;
      }

      // Cek apakah user sudah menjawab
      const userHasAnswered = answers.some(
        (answer) => answer.user_id === user.id,
      );

      setHasAnswered(userHasAnswered);
      setIsLoading(false);
      setCurrentUser(user);
    }

    checkIfUserHasAnswered();
  }, [answers]);

  const handleAcceptAnswer = async (
    answer_id: number,
    answer_user_id: string,
    question_user_id: string,
  ) => {
    try {
      if (!questionId) {
        toast.error("Pertanyaan tidak ditemukan!");
        return;
      }

      const message = await acceptAnswer(
        answer_id,
        answer_user_id,
        question_user_id,
      );

      if (message === "Jawaban ditandai sebagai membantu!") {
        toast.success(message);
        router.refresh();
      } else {
        toast.error(message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan saat menandai jawaban sebagai membantu!");
    }
  };

  // Check if any answer is already marked as helpful
  const hasHelpfulAnswer = answers.some((answer) => answer.helpful);

  return (
    <div className="w-full flex flex-col gap-2">
      <h2 className="text-xl md:text-2xl font-semibold">
        {answerCount} Jawaban
      </h2>

      <div className="flex flex-col w-full">
        {answerCount === 0 ? (
          <>
            <h1 className="text-sm md:text-base text-foreground">
              Belum ada jawaban saat ini. Kamu bisa menjadi yang{" "}
              <span className="font-semibold">pertama menjawab!</span>
            </h1>

            {!isLoading &&
              (hasAnswered ? (
                <p className="text-xs md:text-sm text-muted-foreground mt-3 md:mt-4 p-3 md:p-4 bg-secondary/50 rounded-md">
                  Kamu sudah memberikan jawaban untuk pertanyaan ini.
                </p>
              ) : currentUser?.id === user_question_id ? (
                <p className="text-xs md:text-sm text-muted-foreground mt-3 md:mt-4 p-3 md:p-4 bg-secondary/50 rounded-md">
                  Kamu tidak bisa menjawab pertanyaan kamu sendiri.
                </p>
              ) : (
                <AnswerForm
                  questionSlug={questionSlug}
                  questionId={questionId}
                />
              ))}
          </>
        ) : (
          <div className="flex flex-col gap-3 md:gap-4">
            {answers.map((answer, idx) => (
              <div
                key={answer.id}
                className="px-2 md:px-4 py-4 md:py-8 border-b border-foreground/10"
              >
                <div className="flex gap-2 md:gap-4">
                  {/* Vote Section */}
                  <AnswerVote
                    currentUserId={currentUser?.id ?? null}
                    answer_id={answer.id}
                    answer_user_id={answer.user_id}
                  />

                  {/* Answer Content */}
                  <div className="flex-1 min-w-0">
                    <div className="text-xs md:text-sm text-muted-foreground">
                      {(() => {
                        if (!answer.profiles)
                          return (
                            <div className="flex items-center gap-2">
                              <p className="flex h-7 w-7 md:h-8 md:w-8 items-center justify-center rounded-full bg-secondary text-xs md:text-sm font-semibold text-secondary-foreground">
                                P
                              </p>
                              <span className="truncate">Pengguna</span>
                            </div>
                          );
                        const profile = Array.isArray(answer.profiles)
                          ? answer.profiles[0]
                          : answer.profiles;
                        return (
                          <div className="flex items-center justify-between gap-2">
                            <Link href={`/${profile?.fullname?.toLowerCase().replace(" ", "-")}-${profile?.id_dummy}`} className="flex items-center gap-2 min-w-0 group">
                              {profile?.profile_pic ? (
                                <Image
                                  src={profile.profile_pic}
                                  alt={profile.fullname}
                                  width={32}
                                  height={32}
                                  className="h-7 w-7 md:h-8 md:w-8 rounded-full"
                                />
                              ) : (
                                <p className="flex h-7 w-7 md:h-8 md:w-8 items-center justify-center rounded-full bg-secondary text-xs md:text-sm font-semibold text-secondary-foreground shrink-0">
                                  {profile?.fullname.charAt(0).toUpperCase()}
                                </p>
                              )}

                              <span className="truncate group-hover:text-primary">
                                {profile?.fullname ?? "Pengguna"}
                              </span>
                            </Link>

                            <div className="flex items-center gap-2 md:gap-3 shrink-0">
                              <p className="text-muted-foreground text-xs md:text-sm whitespace-nowrap">
                                {createdAtLabel[idx]}
                              </p>

                              {currentUser &&
                                answer?.user_id === currentUser.id && (
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button
                                        type="button"
                                        variant={"destructive"}
                                        className="h-8 w-8 md:h-10 md:w-10 flex justify-start p-0 hover:w-32 md:hover:w-40 transition-[width] duration-300 ease-in-out group overflow-hidden"
                                      >
                                        <div className="flex items-center space-x-2 px-2 md:px-3">
                                          <Trash2
                                            size={16}
                                            className="md:w-5 md:h-5 shrink-0"
                                          />
                                          <span className="hidden md:inline translate-x-1 opacity-0 transition-all duration-300 ease-in-out whitespace-nowrap group-hover:translate-x-0 group-hover:opacity-100">
                                            Hapus jawaban
                                          </span>
                                        </div>
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent className="mx-4">
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>
                                          Kamu yakin ga nih?
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Kalau kamu hapus jawaban ini, kamu
                                          tidak bisa mengembalikannya lagi loh.
                                          Pastikan kamu udah mikir sebelum
                                          menghapusnya.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                                        <AlertDialogCancel className="w-full sm:w-auto">
                                          Batal
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() =>
                                            handleDelete(answer.id)
                                          }
                                          className="w-full sm:w-auto"
                                        >
                                          Ya, Hapus!
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                )}
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                    {(() => {
                      const html = answer.html;
                      if (!html) {
                        return (
                          <p className="mt-2 text-sm md:text-base text-foreground whitespace-pre-wrap break-words">
                            {typeof answer.content === "string"
                              ? answer.content
                              : ""}
                          </p>
                        );
                      }

                      return (
                        <article
                          className={`w-full mx-auto pt-2 md:pt-4 ${styles["blog-content"]}`}
                          dangerouslySetInnerHTML={{ __html: html }}
                        />
                      );
                    })()}

                    {/* Accept Answer Section - Only for Question Owner */}
                    {currentUser &&
                      user_question_id === currentUser.id &&
                      answer.user_id !== currentUser.id &&
                      !answer.helpful &&
                      !hasHelpfulAnswer && (
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 md:gap-3 mt-4 md:mt-6 p-3 md:p-4 bg-secondary/30 rounded-lg border border-foreground/10">
                          <p className="text-xs md:text-sm text-foreground flex-1">
                            Apakah jawaban ini membantu untukmu?
                          </p>
                          <Button
                            onClick={() =>
                              handleAcceptAnswer(
                                answer.id,
                                answer.user_id,
                                user_question_id,
                              )
                            }
                            variant="default"
                            size="sm"
                            className="w-full sm:w-auto text-xs md:text-sm"
                          >
                            Ya, Terima Jawaban
                          </Button>
                        </div>
                      )}

                    {answer.helpful && (
                      <div className="flex items-center gap-2 mt-4 md:mt-6 p-3 md:p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                        <CheckCircle className="text-green-500 w-4 h-4 md:w-5 md:h-5 shrink-0" />
                        <p className="text-xs md:text-sm text-green-700 dark:text-green-400 font-medium">
                          Jawaban diterima sebagai solusi
                        </p>
                      </div>
                    )}

                    <CommentForm answer={answer} />
                  </div>
                </div>
              </div>
            ))}

            {/*<div className="border border-foreground/10 w-full flex my-5"></div>*/}

            {!isLoading &&
              (hasAnswered ? (
                <></>
              ) : currentUser?.id === user_question_id ? (
                <></>
              ) : (
                <div className="flex flex-col mt-4 md:mt-6">
                  <h1 className="text-sm md:text-base text-foreground mb-3 md:mb-4">
                    Tahu jawaban lainnya? Tambahkan jawabanmu di bawah!
                  </h1>

                  <AnswerForm
                    questionSlug={questionSlug}
                    questionId={questionId}
                  />
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
