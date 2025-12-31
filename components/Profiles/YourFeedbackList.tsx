import FeedbackRequestCard from "@/components/feedback-request-card";
import { MessageSquarePlus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type FeedbackRequest = {
    id: number;
    title: string;
    description: unknown;
    project_url: string;
    icon_url: string | null;
    created_at: string;
    user_id: string;
    profiles: {
        fullname: string;
        id_dummy: number;
        profile_pic: string | null;
    } | null;
    vote_count?: number;
    feedback_count?: number;
};

type YourFeedbackListProps = {
    feedbackRequests: unknown;
};

export default function YourFeedbackList({
    feedbackRequests,
}: YourFeedbackListProps) {
    const validRequests = (
        Array.isArray(feedbackRequests) ? feedbackRequests : []
    ).filter((f: unknown) => f !== null && typeof f === "object" && "id" in f) as FeedbackRequest[];

    if (!validRequests || validRequests.length === 0) {
        return (
            <div className="bg-card border rounded-lg p-12 shadow-sm">
                <div className="flex flex-col items-center justify-center gap-4 text-center">
                    <MessageSquarePlus className="h-16 w-16 text-muted-foreground/50" />
                    <div>
                        <h3 className="text-xl font-semibold mb-2">
                            Belum Ada Feedback yang Dibuat
                        </h3>
                        <p className="text-muted-foreground max-w-md mb-4">
                            Feedback request yang kamu buat akan muncul di sini. Mulai kumpulkan
                            masukan dari pengguna lain untuk projectmu!
                        </p>
                        <Button asChild>
                            <Link href="/request-feedback">Buat Feedback Request</Link>
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {validRequests.map((request) => (
                <FeedbackRequestCard key={request.id} request={request} />
            ))}
        </div>
    );
}
