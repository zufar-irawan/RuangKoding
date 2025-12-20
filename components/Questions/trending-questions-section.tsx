import { getTrendingQuestions } from "@/lib/questions";
import type { QuestionListItem } from "@/lib/type";
import type { PostgrestError } from "@supabase/supabase-js";

export default async function TrendingQuestionsSection(): Promise<{
  data: QuestionListItem[];
  error: PostgrestError | null;
}> {
  const { data, error } = await getTrendingQuestions("weekly", 1, 10);

  return {
    data: data || [],
    error,
  };
}
