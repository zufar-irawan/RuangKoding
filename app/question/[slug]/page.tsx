import Navbar from "@/components/navigation-bar";
import QuestionBody from "@/components/question-body";
import Image from "next/image";

import { getQuestionFromID } from "@/lib/questions";
import { parseSlug } from "@/lib/utils";

import { format } from "date-fns";
import { id } from "date-fns/locale";

type Props = {
    params: {
        slug: string;
    }
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

    return (
        <main className="min-h-screen flex flex-col">
            <Navbar />

            <div className="flex justify-center w-full py-10">
                <div className="flex flex-col max-w-4xl">

                    <div className="flex flex-col gap-2">
                        <h1 className="text-4xl font-bold text-primary">
                            {question?.title}
                        </h1>

                        <div className="flex gap-3 items-center text-md text-muted-foreground">
                            {profile?.profile_pic ? (
                                <Image
                                    src={profile.profile_pic}
                                    alt="Profile Picture"
                                    width={50}
                                    height={50}
                                />
                            ) : (
                                <p className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-secondary-foreground">
                                    {profile?.fullname
                                        ? profile.fullname.charAt(0).toUpperCase()
                                        : "?"}
                                </p>
                            )}

                            <p className="text-foreground">{profile?.fullname}</p>

                            <div className="w-1 h-1 rounded-full bg-foreground text-foreground"></div>

                            <p>{createdAtLabel}</p>
                        </div>
                    </div>

                    <div className="prose prose-invert max-w-none">
                        <QuestionBody question={question} />
                    </div>
                </div>

            </div >
        </main >
    );
}