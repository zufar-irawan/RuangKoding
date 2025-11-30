import { Editor } from "../Editor/editor";

type Props = {
    answerCount?: number;
}

export default function AnswersSection({ answerCount = 0 }: Props) {

    function AnswerComponents() {
        return (
            <div className="flex flex-col w-full">
                {answerCount === 0 ? (
                    <>
                        <h1 className="text-md text-foreground">
                            Belum ada jawaban saat ini.
                            Kamu bisa menjadi yang <span className="font-semibold">pertama menjawab!</span>
                        </h1>

                        <Editor />
                    </>

                ) : (
                    <>
                        Hello World
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