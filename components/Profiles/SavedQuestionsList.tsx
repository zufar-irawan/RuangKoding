import PostCard from "@/components/post-card";
import { BookmarkX } from "lucide-react";
import type { QuestionListItem } from "@/lib/type";

type SavedQuestionsListProps = {
  savedQuestions: unknown;
};

export default function SavedQuestionsList({
  savedQuestions,
}: SavedQuestionsListProps) {
  const validQuestions = (
    Array.isArray(savedQuestions) ? savedQuestions : []
  ).filter((q: unknown) => q !== null) as QuestionListItem[];

  if (!validQuestions || validQuestions.length === 0) {
    return (
      <div className="bg-card border rounded-lg p-12 shadow-sm">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <BookmarkX className="h-16 w-16 text-muted-foreground/50" />
          <div>
            <h3 className="text-xl font-semibold mb-2">
              Belum Ada Pertanyaan yang Disimpan
            </h3>
            <p className="text-muted-foreground max-w-md">
              Pertanyaan yang kamu simpan akan muncul di sini. Mulai simpan
              pertanyaan yang menarik untuk dibaca nanti.
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
