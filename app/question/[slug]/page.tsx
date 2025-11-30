import Navbar from "@/components/ui/navigation-bar";
import QuestionBody from "@/components/Questions/question-body";
import Link from "next/link";
import { Undo2, Eye, CheckCircle, ThumbsUp, } from "lucide-react";

import { getQuestionFromID } from "@/lib/questions";
import { parseSlug } from "@/lib/utils";

import { format } from "date-fns";
import { id } from "date-fns/locale";
import Sidebar from "@/components/ui/sidebar";
import UserProfilesQuestion from "@/components/Questions/profiles-question";
import SharesNVote from "@/components/Questions/share-vote";
import AnswersSection from "@/components/Answers/answers-section";

type CountRelation = { count: number | null } | { count: number | null }[] | null | undefined;

type Props = {
    params: {
        slug: string;
    }
}

function getCountValue(relation: CountRelation): number {
    if (Array.isArray(relation)) {
        return relation[0]?.count ?? 0;
    }

    return relation?.count ?? 0;
}

export default async function QuestionDetailPage({ params }: Props) {
    const { slug } = await params;
    const { id: questionId } = parseSlug(slug);

    const questions = await getQuestionFromID(Number(questionId));
    const question = questions.data ? questions.data[0] : null;

    const profiles = question?.profiles;
    const profile = Array.isArray(profiles)
        ? profiles[0] ?? null
        : profiles ?? null;

    const createdAt = new Date(question?.created_at || "");
    const createdAtLabel = format(createdAt, "d MMMM yyyy", { locale: id });

    console.log('Question detail fetched:', question);

    const answerCount = getCountValue(question?.answers);
    const votesCount = getCountValue(question?.votes);

    return (
        <main className="min-h-screen w-full flex flex-col">
            <Navbar />

            <div className="flex w-full gap-4 mt-16">
                <Sidebar />

                <div className="flex flex-col justify-center max-w-4xl py-10 ml-[22rem]">
                    <Link href="/question" className="hover:bg-foreground/10 w-fit p-2 rounded-lg">
                        <Undo2 className="text-primary" size={24} />
                    </Link>

                    <div className="flex flex-col gap-4">
                        <h1 className="text-4xl font-bold text-primary">
                            {question?.title}
                        </h1>

                        <UserProfilesQuestion
                            profile={profile ?? {}}
                            createdAtLabel={createdAtLabel}
                        />

                        <div className="flex gap-8 text-sm mt-2">
                            <span className={`${answerCount > 0 ? "text-green-600" : "text-red-600"} items-center`}>
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
                    </div>

                    <div className="prose prose-invert max-w-none">
                        <QuestionBody question={question} />
                    </div>

                    <div className="flex flex-col w-full gap-8 mt-10">
                        <SharesNVote votesCount={votesCount} />

                        <div className="flex border border-foreground/10 w-full"></div>

                        <AnswersSection answerCount={answerCount} />
                    </div>

                </div>
            </div >
        </main >
    );
}