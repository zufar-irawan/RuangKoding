"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  checkUserFeedbackVote,
  handleFeedbackVote,
  getFeedbackVoteCount,
} from "@/lib/servers/FeedbackAction";
import { useRouter } from "next/navigation";

type Props = {
  feedbackId: number;
  currentUserId: string | null;
  feedbackUserId: string;
};

export default function FeedbackVote({
  feedbackId,
  currentUserId,
  feedbackUserId,
}: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isVoting, setIsVoting] = useState(false);
  const [userVote, setUserVote] = useState<boolean | null>(null);
  const [voteCount, setVoteCount] = useState(0);

  useEffect(() => {
    loadVoteData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feedbackId]);

  const loadVoteData = async () => {
    setIsLoading(true);
    try {
      const [vote, count] = await Promise.all([
        checkUserFeedbackVote(feedbackId),
        getFeedbackVoteCount(feedbackId),
      ]);
      setUserVote(vote);
      setVoteCount(count);
    } catch (error) {
      console.error("Error loading vote data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVote = async (voteType: boolean) => {
    if (isVoting || !currentUserId) {
      if (!currentUserId) {
        toast.error("Anda harus login untuk melakukan voting");
      }
      return;
    }

    if (currentUserId === feedbackUserId) {
      toast.error("Anda tidak bisa vote feedback sendiri");
      return;
    }

    setIsVoting(true);

    try {
      const result = await handleFeedbackVote(feedbackId, voteType);

      if (result.success) {
        const previousVote = userVote;
        const newVote = result.newVoteState;

        // Calculate vote count change
        let change = 0;
        if (previousVote === null && newVote !== null) {
          // New vote
          change = newVote ? 1 : -1;
        } else if (previousVote !== null && newVote === null) {
          // Removed vote
          change = previousVote ? -1 : 1;
        } else if (previousVote !== null && newVote !== null) {
          // Changed vote
          change = newVote ? 2 : -2;
        }

        setUserVote(newVote);
        setVoteCount((prev) => prev + change);

        toast.success(
          newVote === null
            ? "Vote berhasil dihapus"
            : newVote
              ? "Berhasil upvote"
              : "Berhasil downvote",
          {
            duration: 2000,
          }
        );

        router.refresh();
      }
    } catch (error) {
      console.error("Error handling vote:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan, silakan coba lagi"
      );
    } finally {
      setIsVoting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center gap-1 w-12">
        <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled>
          <Loader2 className="h-4 w-4 animate-spin" />
        </Button>
        <span className="text-xs font-medium text-muted-foreground">
          {voteCount}
        </span>
        <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled>
          <Loader2 className="h-4 w-4 animate-spin" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-1 w-12">
      <Button
        variant={userVote === true ? "default" : "outline"}
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => handleVote(true)}
        disabled={isVoting || !currentUserId}
      >
        {isVoting && userVote !== false ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ChevronUp className="h-4 w-4" />
        )}
      </Button>
      <span className="text-sm font-semibold text-foreground">{voteCount}</span>
      <Button
        variant={userVote === false ? "default" : "outline"}
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => handleVote(false)}
        disabled={isVoting || !currentUserId}
      >
        {isVoting && userVote !== true ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
