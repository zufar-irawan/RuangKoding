import { getQuestions } from "@/lib/questions";
import PostCard from "./post-card";

export default async function Questions() {
  const { data, error } = await getQuestions();

  if (error) {
    console.error("Failed to fetch questions", error);
  }

  if (!data || data.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-foreground/20 p-6 text-center text-muted-foreground">
        Belum ada pertanyaan.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {data.map((question) => (
        <PostCard key={question.id} question={question} />
      ))}
    </div>
  );
}
