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
import { Trash2 } from "lucide-react";
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

  const handleAcceptAnswer = () => {
    // TODO: Implement accept answer logic
    toast.success("Jawaban ditandai sebagai membantu!");
  };

  return (
    <div className="w-full flex flex-col gap-2">
      <h2 className="text-2xl font-semibold">{answerCount} Jawaban</h2>

      <div className="flex flex-col w-full">
        {answerCount === 0 ? (
          <>
            <h1 className="text-md text-foreground">
              Belum ada jawaban saat ini. Kamu bisa menjadi yang{" "}
              <span className="font-semibold">pertama menjawab!</span>
            </h1>

            {!isLoading &&
              (hasAnswered ? (
                <p className="text-sm text-muted-foreground mt-4 p-4 bg-secondary/50 rounded-md">
                  Kamu sudah memberikan jawaban untuk pertanyaan ini.
                </p>
              ) : currentUser?.id === user_question_id ? (
                <p className="text-sm text-muted-foreground mt-4 p-4 bg-secondary/50 rounded-md">
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
          <div className="flex flex-col gap-4">
            {answers.map((answer, idx) => (
              <div
                key={answer.id}
                className="px-4 py-8 border-b border-foreground/10"
              >
                <div className="flex gap-4">
                  {/* Vote Section */}
                  <AnswerVote
                    currentUserId={currentUser?.id ?? null}
                    answer_id={answer.id}
                    answer_user_id={answer.user_id}
                  />

                  {/* Answer Content */}
                  <div className="flex-1">
                    <div className="text-sm text-muted-foreground">
                      {(() => {
                        if (!answer.profiles)
                          return (
                            <div className="flex items-center gap-2">
                              <p className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-secondary-foreground">
                                P
                              </p>
                              Pengguna
                            </div>
                          );
                        const profile = Array.isArray(answer.profiles)
                          ? answer.profiles[0]
                          : answer.profiles;
                        return (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <p className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-secondary-foreground">
                                {profile?.fullname.charAt(0).toUpperCase()}
                              </p>

                              {profile?.fullname ?? "Pengguna"}
                            </div>

                            <div className="flex items-center gap-3">
                              <p className="text-muted-foreground">
                                {createdAtLabel[idx]}
                              </p>

                              {currentUser &&
                                answer?.user_id === currentUser.id && (
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button
                                        type="button"
                                        variant={"destructive"}
                                        className="h-10 w-10 flex justify-start p-0 hover:w-40 transition-[width] duration-300 ease-in-out group overflow-hidden"
                                      >
                                        <div className="flex items-center space-x-2 px-3">
                                          <Trash2
                                            size={20}
                                            className="shrink-0"
                                          />
                                          <span className="translate-x-1 opacity-0 transition-all duration-300 ease-in-out whitespace-nowrap group-hover:translate-x-0 group-hover:opacity-100">
                                            Hapus jawaban
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
                                          Kalau kamu hapus jawaban ini, kamu
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
                                            handleDelete(answer.id)
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
                        );
                      })()}
                    </div>

                    {(() => {
                      const html = answer.html;
                      if (!html) {
                        return (
                          <p className="mt-2 text-foreground whitespace-pre-wrap">
                            {typeof answer.content === "string"
                              ? answer.content
                              : ""}
                          </p>
                        );
                      }

                      return (
                        <article
                          className={`w-full mx-auto pt-4 ${styles["blog-content"]}`}
                          dangerouslySetInnerHTML={{ __html: html }}
                        />
                      );
                    })()}

                    {/* Accept Answer Section - Only for Question Owner */}
                    {currentUser &&
                      user_question_id === currentUser.id &&
                      answer.user_id !== currentUser.id &&
                      !answer.helpful && (
                        <div className="flex items-center gap-3 mt-6 p-4 bg-secondary/30 rounded-lg border border-foreground/10">
                          <p className="text-sm text-foreground">
                            Apakah jawaban ini membantu untukmu?
                          </p>
                          <Button
                            onClick={() => handleAcceptAnswer()}
                            variant="default"
                            size="sm"
                          >
                            Ya, Terima Jawaban
                          </Button>
                        </div>
                      )}

                    {answer.helpful && (
                      <div className="flex items-center gap-2 mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-green-600"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <p className="text-sm text-green-700 dark:text-green-400 font-medium">
                          Jawaban diterima sebagai solusi
                        </p>
                      </div>
                    )}

                    <CommentForm answer={answer} currentUser={currentUser} />
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
                <div className="flex flex-col">
                  <h1 className="text-md text-foreground">
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
