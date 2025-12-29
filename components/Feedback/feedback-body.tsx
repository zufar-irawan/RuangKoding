import { parseLexicalBodyToHTML } from "@/lib/lexical/lexical-parser";
import styles from "@/styles/BlogContent.module.css";
import type { Json } from "@/lib/supabase/types";

type FeedbackBodyProps = {
  feedback: Json | null;
};

export default function FeedbackBody({ feedback }: FeedbackBodyProps) {
  if (!feedback) {
    return null;
  }

  const serializedBody =
    typeof feedback === "string" || typeof feedback === "object"
      ? (feedback as string | Record<string, unknown>)
      : null;

  const html = parseLexicalBodyToHTML(serializedBody);

  if (!html) {
    return null;
  }

  return (
    <article
      className={`w-full mx-auto py-4 ${styles["blog-content"]}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
