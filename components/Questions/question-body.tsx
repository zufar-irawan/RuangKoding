import type { QuestionDetailItem } from "@/lib/questions"
import { parseLexicalBodyToHTML } from "@/lib/lexical/lexical-parser"
import styles from "@/styles/BlogContent.module.css"

type QuestionBodyProps = {
    question: Pick<QuestionDetailItem, "body"> | null
}

export default function QuestionBody({ question }: QuestionBodyProps) {
    if (!question?.body) {
        return null
    }

    const serializedBody =
        typeof question.body === "string" || typeof question.body === "object"
            ? (question.body as string | Record<string, unknown>)
            : null

    const html = parseLexicalBodyToHTML(serializedBody)

    if (!html) {
        return null
    }

    return (
        <article
            className={`w-full mx-auto py-4 ${styles["blog-content"]}`}
            dangerouslySetInnerHTML={{ __html: html }}
        />
    )
}