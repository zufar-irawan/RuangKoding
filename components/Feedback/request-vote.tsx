"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  checkUserRequestVote,
  handleRequestVote,
} from "@/lib/servers/FeedbackAction";
import { useRouter } from "next/navigation";

type Props = {
  requestId: number;
  initialVoteCount: number;
};

export default function RequestVote({ requestId, initialVoteCount }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isVoting, setIsVoting] = useState(false);
  const [userVote, setUserVote] = useState<boolean | null>(null);
  const [voteCount, setVoteCount] = useState(initialVoteCount);

  useEffect(() => {
    loadUserVote();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestId]);

  const loadUserVote = async () => {
    setIsLoading(true);
    try {
      const vote = await checkUserRequestVote(requestId);
      setUserVote(vote);
    } catch (error) {
      console.error("Error loading user vote:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVote = async (voteType: boolean) => {
    if (isVoting) return;

    setIsVoting(true);

    try {
      const result = await handleRequestVote(requestId, voteType);

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
      <div className="flex items-center gap-3">
        <div className="flex flex-col items-center gap-1 w-12">
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
            disabled
          >
            <Loader2 className="h-4 w-4 animate-spin" />
          </Button>
          <span className="text-xs font-medium text-muted-foreground">
            {voteCount}
          </span>
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
            disabled
          >
            <Loader2 className="h-4 w-4 animate-spin" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex flex-col items-center gap-1 w-12">
        <Button
          variant={userVote === true ? "default" : "outline"}
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => handleVote(true)}
          disabled={isVoting}
        >
          {isVoting && userVote !== false ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ChevronUp className="h-4 w-4" />
          )}
        </Button>
        <span className="text-sm font-semibold text-foreground">
          {voteCount}
        </span>
        <Button
          variant={userVote === false ? "default" : "outline"}
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => handleVote(false)}
          disabled={isVoting}
        >
          {isVoting && userVote !== true ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
