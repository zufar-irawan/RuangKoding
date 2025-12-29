"use client";

import { ArrowDown, ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  answerUpVote,
  getAnswerVoteCount,
  answerDownVote,
  isAnswerUpVoted,
  isAnswerDownVoted,
  updateAnswerUpVote,
  updateAnswerDownVote,
} from "@/lib/servers/AnswerAction";
import { useRouter } from "next/navigation";

type Props = {
  currentUserId: string | null;
  answer_id: number;
  answer_user_id: string;
};

export default function AnswerVote({
  currentUserId,
  answer_id,
  answer_user_id,
}: Props) {
  const router = useRouter();
  const [hasVotedUp, setHasVotedUp] = useState(false);
  const [hasVotedDown, setHasVotedDown] = useState(false);
  const [voteCount, setVoteCount] = useState("0");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkVoteStatus() {
      if (!currentUserId) {
        setIsLoading(false);
        return;
      }

      try {
        const [votedUp, votedDown, count] = await Promise.all([
          isAnswerUpVoted(answer_id, currentUserId),
          isAnswerDownVoted(answer_id, currentUserId),
          getAnswerVoteCount(answer_id),
        ]);

        setHasVotedUp(votedUp);
        setHasVotedDown(votedDown);
        setVoteCount(count);
      } catch (error) {
        console.error("Error checking vote status:", error);
      } finally {
        setIsLoading(false);
      }
    }

    checkVoteStatus();
  }, [answer_id, currentUserId]);

  const handleDownVote = async () => {
    if (!currentUserId) {
      toast.error("Kamu harus login untuk vote");
      return;
    }

    if (hasVotedDown) {
      toast.info("Kamu sudah melakukan voting pada jawaban ini");
      return;
    }

    if (currentUserId === answer_user_id) {
      toast.error("Kamu tidak bisa vote jawaban kamu sendiri");
      return;
    }

    try {
      if (hasVotedUp) {
        await updateAnswerUpVote(answer_id, currentUserId, answer_user_id);
        setHasVotedDown(true);
        setHasVotedUp(false);
        setVoteCount((prev) => (Number(prev) - 2).toString());
      } else {
        await answerDownVote(answer_id, currentUserId, answer_user_id);
        setHasVotedDown(true);
        setVoteCount((prev) => (Number(prev) - 1).toString());
      }

      toast.success("Berhasil downvote jawaban!");
      router.refresh();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Gagal melakukan downvote");
      }
      console.error("Error downvoting:", error);
    }
  };

  const handleUpVote = async () => {
    if (!currentUserId) {
      toast.error("Kamu harus login untuk vote");
      return;
    }

    if (hasVotedUp) {
      toast.info("Kamu sudah melakukan voting pada jawaban ini");
      return;
    }

    if (currentUserId === answer_user_id) {
      toast.error("Kamu tidak bisa vote jawaban kamu sendiri");
      return;
    }

    try {
      if (hasVotedDown) {
        await updateAnswerDownVote(answer_id, currentUserId, answer_user_id);
        setHasVotedDown(false);
        setHasVotedUp(true);
        setVoteCount((prev) => (Number(prev) + 2).toString());
      } else {
        await answerUpVote(answer_id, currentUserId, answer_user_id);
        setHasVotedUp(true);
        setVoteCount((prev) => (Number(prev) + 1).toString());
      }

      toast.success("Berhasil upvote jawaban!");
      router.refresh();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Gagal melakukan upvote");
      }
      console.error("Error upvoting:", error);
    }
  };

  const isDisabledUp =
    isLoading ||
    hasVotedUp ||
    currentUserId === answer_user_id ||
    !currentUserId;

  const isDisabledDown =
    isLoading ||
    hasVotedDown ||
    currentUserId === answer_user_id ||
    !currentUserId;

  return (
    <div className="flex flex-col items-center gap-1 md:gap-2 pt-1 shrink-0">
      <button
        onClick={handleUpVote}
        disabled={isDisabledUp}
        className={`p-1.5 md:p-2 rounded-lg transition-colors ${
          hasVotedUp
            ? "bg-green-100 dark:bg-green-900/30 text-green-600"
            : "hover:bg-secondary text-muted-foreground hover:text-foreground"
        } ${isDisabledUp ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
        title={
          !currentUserId
            ? "Login untuk vote"
            : currentUserId === answer_user_id
              ? "Tidak bisa vote jawaban sendiri"
              : hasVotedUp
                ? "Sudah vote"
                : "Upvote jawaban"
        }
      >
        <ArrowUp className="w-4 h-4 md:w-5 md:h-5" />
      </button>

      <span className="text-base md:text-lg font-semibold text-foreground">{voteCount}</span>

      <button
        onClick={handleDownVote}
        disabled={isDisabledDown}
        className={`p-1.5 md:p-2 rounded-lg transition-colors ${
          hasVotedDown
            ? "bg-red-100 dark:bg-red-900/30 text-red-600"
            : "hover:bg-secondary text-muted-foreground hover:text-foreground"
        } ${isDisabledDown ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
        title={
          !currentUserId
            ? "Login untuk vote"
            : currentUserId === answer_user_id
              ? "Tidak bisa vote jawaban sendiri"
              : hasVotedDown
                ? "Sudah vote"
                : "Downvote jawaban"
        }
      >
        <ArrowDown className="w-4 h-4 md:w-5 md:h-5" />
      </button>
    </div>
  );
}
