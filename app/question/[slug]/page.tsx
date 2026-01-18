import { Suspense } from "react";
import Navbar from "@/components/ui/navigation-bar";
import { parseSlug } from "@/lib/utils";
import Sidebar from "@/components/ui/sidebar";
import { BackButton } from "@/components/ui/back-button";
import QuestionContent from "@/components/Questions/question-content";
import QuestionDetailSkeleton from "@/components/Questions/question-detail-skeleton";
import { Metadata } from "next";
import { getQuestionFromID } from "@/lib/questions";

type Props = {
  params: {
    slug: string;
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { id: questionId } = parseSlug(slug);

  const { data: questionData } = await getQuestionFromID(Number(questionId));
  const question = questionData?.[0];

  if (!question) {
    return {
      title: "Question Not Found - RuangKoding",
    };
  }

  return {
    title: `${question.title} - RuangKoding`,
    description: question.body
      ? String(question.body).substring(0, 160)
      : question.title,
  };
}

export default async function QuestionDetailPage({ params }: Props) {
  const { slug } = await params;
  const { id: questionId } = parseSlug(slug);

  return (
    <main className="min-h-screen w-full flex flex-col">
      <Navbar />

      <div className="flex w-full gap-4 mt-16">
        <Sidebar tabs="questions" />

        <div className="flex flex-col justify-center w-full max-w-4xl py-4 md:py-6 lg:py-10 px-4 md:px-6 lg:px-8 lg:ml-[22rem]">
          <div className="mb-2 md:mb-4">
            <BackButton href="/" label="Kembali" />
          </div>

          <Suspense fallback={<QuestionDetailSkeleton />}>
            <QuestionContent questionId={Number(questionId)} />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
