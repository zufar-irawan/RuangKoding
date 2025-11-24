import Link from "next/link";
import { Card, CardContent, CardHeader } from "./ui/card";

import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import { CheckCircle, Eye, ThumbsUp } from "lucide-react";

import type { Question } from "@/lib/type";

interface PostCardProps {
    question: Question;
}

export default function PostCard({ question }: PostCardProps) {
    const createdAtLabel = formatDistanceToNow(new Date(question.created_at), {
        addSuffix: true,
        locale: id,
    });

    const userProfile = question.profiles;

    const questionTags = question.quest_tags ?? [];

    const answerCount = question.answers?.[0]?.count ?? 0;
    const votesCount = question.votes?.[0]?.count ?? 0;

    return (
        <Card className="flex-1">
            <CardHeader>
                <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <p className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-secondary-foreground">
                                {userProfile.fullname.charAt(0).toUpperCase()}
                            </p>

                            <p className="text-md ">
                                {userProfile.fullname}
                            </p>
                        </div>

                        <p className="text-muted-foreground text-sm flex justify-end">
                            {createdAtLabel}
                        </p>
                    </div>

                    <div className="flex justify-between">
                        <Link href={`/question/${question.id}`} className="text-2xl font-bold text-primary hover:underline">
                            {question.title}
                        </Link>
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                <div className="flex flex-col gap-5">
                    <p>
                        {question.excerpt}
                    </p>

                    <div className="flex flex-col gap-3">
                        <div className="flex gap-2 items-center">
                            {questionTags.map((t) => (
                                <Link href={'#'} key={t.tags?.tag ?? "tag"} className="px-2 py-1 bg-accent text-accent-foreground rounded-md text-sm">
                                    {t.tags?.tag ?? "Tanpa tag"}
                                </Link>
                            ))}
                        </div>

                        <div className="flex gap-8 text-sm">
                            <span className={`${answerCount > 0 ? "text-green-600" : "text-red-600"} items-center`}>
                                <CheckCircle className="inline mr-1" size={16} />
                                {answerCount} Jawaban
                            </span>

                            <span className="text-muted-foreground">
                                <Eye className="inline mr-1" size={16} />
                                {question.view} Dilihat
                            </span>

                            <span className="text-muted-foreground">
                                <ThumbsUp className="inline mr-1" size={16} />
                                {votesCount} Divote
                            </span>
                        </div>

                    </div>

                </div>
            </CardContent>
        </Card>
    )
}