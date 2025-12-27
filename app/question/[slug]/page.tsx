import { Suspense } from "react";
import Navbar from "@/components/ui/navigation-bar";
import { parseSlug } from "@/lib/utils";
import Sidebar from "@/components/ui/sidebar";
import { BackButton } from "@/components/ui/back-button";
import QuestionContent from "@/components/Questions/question-content";
import QuestionDetailSkeleton from "@/components/Questions/question-detail-skeleton";

type Props = {
  params: {
    slug: string;
  };
};

export default async function QuestionDetailPage({ params }: Props) {
  const { slug } = await params;
  const { id: questionId } = parseSlug(slug);

  return (
    <main className="min-h-screen w-full flex flex-col">
      <Navbar />

      <div className="flex w-full gap-4 mt-16">
        <Sidebar tabs="questions" />

        <div className="flex flex-col justify-center max-w-4xl py-10 ml-[22rem]">
          <div>
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
