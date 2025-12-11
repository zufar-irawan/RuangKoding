import PostCard from "@/components/post-card";
import { PencilLine } from "lucide-react";
import type { QuestionListItem } from "@/lib/type";

type Props = {
  questions: unknown;
};

export default function YourQuestionsList({ questions }: Props) {
  const validQuestions = (Array.isArray(questions) ? questions : []).filter(
    (q: unknown) => q !== null,
  ) as QuestionListItem[];

  if (!validQuestions || validQuestions.length === 0) {
    return (
      <div className="bg-card border rounded-lg p-12 shadow-sm">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <PencilLine className="h-16 w-16 text-muted-foreground/50" />
          <div>
            <h3 className="text-xl font-semibold mb-2">
              Belum Ada Pertanyaan yang dibuat
            </h3>
            <p className="text-muted-foreground max-w-md">
              Pertanyaan yang kamu buat akan muncul di sini. Jika ada kesulitan,
              jangan segan membuat pertanyaan!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {validQuestions.map((question) => (
        <PostCard key={question.id} question={question} />
      ))}
    </div>
  );
}
