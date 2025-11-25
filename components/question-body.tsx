import type { QuestionWithBody } from "@/lib/type"
import { parseLexicalBodyToHTML } from "@/lib/lexical-parser"
import styles from "@/styles/BlogContent.module.css"

type QuestionBodyProps = {
    question: Pick<QuestionWithBody, "body"> | null
}

export default function QuestionBody({ question }: QuestionBodyProps) {
    if (!question?.body) {
        return null
    }

    const html = parseLexicalBodyToHTML(question.body)

    if (!html) {
        return null
    }

    return (
        <article
            className={`w-full mx-auto py-10 px-4 ${styles["blog-content"]}`}
            dangerouslySetInnerHTML={{ __html: html }}
        />
    )
}