import { Eye, CheckCircle, ThumbsUp } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

import { getQuestionFromID, incrementQuestionView } from "@/lib/questions";
import type { CountRelation, AnswerPreview } from "@/lib/type";
import { parseLexicalBodyToHTML } from "@/lib/lexical/lexical-parser";

import UserProfilesQuestion from "@/components/Questions/profiles-question";
import QuestionBody from "@/components/Questions/question-body";
import SharesNVote from "@/components/Questions/share-vote";
import CommentForm from "@/components/Comments/comment-form";
import AnswersSection from "@/components/Answers/answers-section";

function getCountValue(relation?: CountRelation | null): number {
  if (!relation) {
    return 0;
  }

  if (Array.isArray(relation)) {
    return relation[0]?.count ?? 0;
  }

  return relation.count ?? 0;
}

type AnswerRelation = AnswerPreview | AnswerPreview[] | null | undefined;

function normalizeAnswers(relation: AnswerRelation): AnswerPreview[] {
  if (Array.isArray(relation)) {
    return relation;
  }

  return relation ? [relation] : [];
}

type QuestionContentProps = {
  questionId: number;
};

export default async function QuestionContent({
  questionId,
}: QuestionContentProps) {
  // Fetch question data
  const questions = await getQuestionFromID(questionId);
  const question = questions.data ? questions.data[0] : null;

  incrementQuestionView(questionId).catch((err) =>
    console.error("Failed to increment view:", err),
  );

  if (!question) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-muted-foreground">Pertanyaan tidak ditemukan.</p>
      </div>
    );
  }

  const profiles = question?.profiles;
  const profile = Array.isArray(profiles)
    ? (profiles[0] ?? null)
    : (profiles ?? null);

  const createdAtLabel = question.created_at
    ? format(new Date(question.created_at), "d MMMM yyyy", { locale: id })
    : "";

  const votesCount = getCountValue(question?.votes);
  const answers = normalizeAnswers(question?.answers);
  const answerCount = answers.length;

  const answersWithHTML = answers.map((answer) => ({
    ...answer,
    html: parseLexicalBodyToHTML(
      typeof answer.content === "string" || typeof answer.content === "object"
        ? (answer.content as string | Record<string, unknown>)
        : null,
    ),
  }));

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-4xl font-bold text-primary">{question?.title}</h1>

      <UserProfilesQuestion
        profile={profile ?? {}}
        createdAtLabel={createdAtLabel}
      />

      <div className="flex gap-8 text-sm mt-2">
        <span
          className={`${answerCount > 0 ? "text-green-600" : "text-red-600"} items-center`}
        >
          <CheckCircle className="inline mr-1" size={16} />
          {answerCount} Jawaban
        </span>

        <span className="text-muted-foreground">
          <Eye className="inline mr-1" size={16} />
          {question?.view} Dilihat
        </span>

        <span className="text-muted-foreground">
          <ThumbsUp className="inline mr-1" size={16} />
          {votesCount} Divote
        </span>
      </div>

      <div className="max-w-none">
        <QuestionBody question={question} />
      </div>

      <div className="flex flex-col w-full gap-8 mt-10">
        <SharesNVote
          votesCount={votesCount}
          question_id={question?.id}
          questionSlug={question?.slug}
        />

        <CommentForm question_id={question?.id} />

        <div className="flex border border-foreground/10 w-full"></div>

        <AnswersSection
          answers={answersWithHTML}
          questionId={question?.id}
          questionSlug={question?.slug}
          user_question_id={question?.user_id}
        />
      </div>
    </div>
  );
}
