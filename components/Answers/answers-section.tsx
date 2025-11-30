import { Editor } from "../Editor/editor";
import type { AnswerPreview } from "@/lib/questions";
import AnswerForm from "./answer-form";
import { parseLexicalBodyToHTML } from "@/lib/lexical/lexical-parser";

type Props = {
    answers?: AnswerPreview[];
    questionId?: number;
}

function getAnswerContentHtml(content: AnswerPreview["content"]): string {
    const serialized =
        typeof content === "string" || typeof content === "object"
            ? (content as string | Record<string, unknown>)
            : null;

    return parseLexicalBodyToHTML(serialized);
}

export default function AnswersSection({ answers = [], questionId }: Props) {
    const answerCount = answers.length;

    function AnswerComponents() {
        return (
            <div className="flex flex-col w-full">
                {answerCount === 0 ? (
                    <>
                        <h1 className="text-md text-foreground">
                            Belum ada jawaban saat ini.
                            Kamu bisa menjadi yang <span className="font-semibold">pertama menjawab!</span>
                        </h1>

                        <AnswerForm questionId={questionId} />
                    </>

                ) : (
                    <>
                        <div className="flex flex-col gap-4">
                            {answers.map((answer) => (
                                <article key={answer.id} className="rounded-xl border border-foreground/10 p-4">
                                    <div className="text-sm text-muted-foreground">
                                        {(() => {
                                            if (!answer.profiles) return "Pengguna";
                                            const profile = Array.isArray(answer.profiles)
                                                ? answer.profiles[0]
                                                : answer.profiles;
                                            return profile?.fullname ?? "Pengguna";
                                        })()}
                                    </div>
                                    {(() => {
                                        const html = getAnswerContentHtml(answer.content);
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
                                </article>
                            ))}

                            <div className="border border-foreground/10 w-full flex my-5"></div>

                            <div className="flex flex-col">
                                <h1 className="text-md text-foreground">
                                    Tahu jawaban lainnya? Tambahkan jawabanmu di bawah!
                                </h1>

                                <AnswerForm questionId={questionId} />
                            </div>

                        </div>
                    </>
                )}


            </div>
        )
    }

    return (
        <div className="w-full flex flex-col gap-2">
            <h2 className="text-2xl font-semibold">{answerCount} Jawaban</h2>

            <AnswerComponents />
        </div>
    )
}