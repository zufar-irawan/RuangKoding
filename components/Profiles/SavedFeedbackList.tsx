import FeedbackRequestCard from "@/components/feedback-request-card";
import { MessageSquareX } from "lucide-react";

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

type SavedFeedbackListProps = {
    savedFeedback: unknown;
};

export default function SavedFeedbackList({
    savedFeedback,
}: SavedFeedbackListProps) {
    const validFeedback = (
        Array.isArray(savedFeedback) ? savedFeedback : []
    ).filter((f: unknown) => f !== null && typeof f === "object" && "id" in f) as FeedbackRequest[];

    if (!validFeedback || validFeedback.length === 0) {
        return (
            <div className="bg-card border rounded-lg p-12 shadow-sm">
                <div className="flex flex-col items-center justify-center gap-4 text-center">
                    <MessageSquareX className="h-16 w-16 text-muted-foreground/50" />
                    <div>
                        <h3 className="text-xl font-semibold mb-2">
                            Belum Ada Feedback yang Disimpan
                        </h3>
                        <p className="text-muted-foreground max-w-md">
                            Feedback yang kamu simpan akan muncul di sini. Mulai simpan
                            feedback yang menarik untuk dibaca nanti.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {validFeedback.map((feedback) => (
                <FeedbackRequestCard key={feedback.id} request={feedback} />
            ))}
        </div>
    );
}
