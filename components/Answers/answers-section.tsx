"use client";

import type { AnswerWithHTML } from "@/lib/questions";
import AnswerForm from "./answer-form";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import CommentForm from "../ui/comment-form";

type Props = {
  answers?: AnswerWithHTML[];
  questionId?: number;
};

export default function AnswersSection({ answers = [], questionId }: Props) {
  const answerCount = answers.length;

  const createdAtLabel = answers.map((answer) =>
    answer.created_at
      ? formatDistanceToNow(new Date(answer.created_at), {
          addSuffix: true,
          locale: id,
        })
      : "",
  );

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

            <AnswerForm questionId={questionId} />
          </>
        ) : (
          <div className="flex flex-col gap-4">
            {answers.map((answer, idx) => (
              <article
                key={answer.id}
                className="px-4 py-8 border-b border-foreground/10"
              >
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

                        <p className="text-muted-foreground">
                          {createdAtLabel[idx]}
                        </p>
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
                    <div
                      className="mt-2 text-foreground prose prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ __html: html }}
                    />
                  );
                })()}

                <CommentForm answer={answer} />
              </article>
            ))}

            {/*<div className="border border-foreground/10 w-full flex my-5"></div>*/}

            <div className="flex flex-col">
              <h1 className="text-md text-foreground">
                Tahu jawaban lainnya? Tambahkan jawabanmu di bawah!
              </h1>

              <AnswerForm questionId={questionId} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
