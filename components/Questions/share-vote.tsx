"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Share, Link2, ChevronUp, ChevronDown, Bookmark } from "lucide-react";
import { toast } from "sonner";
import { checkUserVote, handleQuestionVote } from "@/utils/questionVote";
import {
  checkBookmarkStatus,
  toggleQuestionBookmark,
} from "@/utils/questionBookmark";

type Props = {
  votesCount?: number;
  question_id: number;
};

export default function SharesNVote({ votesCount, question_id }: Props) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userVote, setUserVote] = useState<boolean | null>(null);
  const [currentVoteCount, setCurrentVoteCount] = useState(votesCount || 0);

  useEffect(() => {
    loadInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question_id]);

  const loadInitialData = async () => {
    // Load bookmark status
    const bookmarkStatus = await checkBookmarkStatus(question_id);
    setIsBookmarked(bookmarkStatus);

    // Load user vote
    const voteStatus = await checkUserVote(question_id);
    setUserVote(voteStatus);
  };

  const handleBookmark = async () => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      const result = await toggleQuestionBookmark(question_id, isBookmarked);

      if (result.success) {
        setIsBookmarked(result.isBookmarked);
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error handling bookmark:", error);
      toast.error("Terjadi kesalahan, silakan coba lagi");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVote = async (voteType: boolean) => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      const result = await handleQuestionVote(question_id, voteType);

      if (result.success) {
        setUserVote(result.newVoteState);
        setCurrentVoteCount((prev) => prev + result.voteCountChange);
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error handling vote:", error);
      toast.error("Terjadi kesalahan, silakan coba lagi");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-6 w-full rounded-2xl border border-foreground/10 bg-foreground/[0.03] px-8 py-6 shadow-sm">
      <div className="flex flex-col gap-3 max-w-xl">
        <p className="text-2xl font-semibold text-foreground">
          Kenal sepuh yang bisa bantu jawab pertanyaan ini?
        </p>
        <p className="text-sm text-muted-foreground">
          Bagikan pertanyaan ini supaya mereka bisa bantu kamu.
        </p>
        <div className="flex items-center gap-4">
          <Button variant={"default"} size="lg" className="h-11 px-6 text-base">
            <Share size={18} className="mr-2" />
            Bagikan
          </Button>
          <Button
            variant={"outline"}
            size="lg"
            className="h-11 w-11 p-0"
            disabled={isLoading}
          >
            <Link2 size={20} />
          </Button>
          <Button
            onClick={handleBookmark}
            variant={isBookmarked ? "default" : "outline"}
            size="lg"
            className="h-11 w-11 p-0"
            disabled={isLoading}
          >
            <Bookmark size={20} fill={isBookmarked ? "currentColor" : "none"} />
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-3 items-center justify-center min-w-[220px]">
        <div className="flex flex-col items-center text-center">
          <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Voting
          </span>
          <span className="text-base text-muted-foreground">
            Dorong jawaban lebih cepat
          </span>
        </div>
        <div className="flex items-center gap-4 border border-foreground/10 rounded-xl bg-background px-5 py-3">
          <Button
            onClick={() => handleVote(true)}
            variant={userVote === true ? "default" : "ghost"}
            size="lg"
            className="h-11 w-11 p-0"
            disabled={isLoading}
          >
            <ChevronUp size={26} />
          </Button>
          <span className="text-3xl font-bold min-w-[3ch] text-center">
            {currentVoteCount}
          </span>
          <Button
            onClick={() => handleVote(false)}
            variant={userVote === false ? "default" : "ghost"}
            size="lg"
            className="h-11 w-11 p-0"
            disabled={isLoading}
          >
            <ChevronDown size={26} />
          </Button>
        </div>
      </div>
    </div>
  );
}
