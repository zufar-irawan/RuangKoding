"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Share,
  Link2,
  ChevronUp,
  ChevronDown,
  Bookmark,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { checkUserVote, handleQuestionVote } from "@/utils/questionVote";
import {
  checkBookmarkStatus,
  toggleQuestionBookmark,
} from "@/utils/questionBookmark";
import { ShareModal } from "./ShareModal";

type Props = {
  votesCount?: number;
  question_id: number;
  questionTitle?: string;
  questionSlug?: string | null;
};

export default function SharesNVote({
  votesCount,
  question_id,
  questionTitle,
  questionSlug,
}: Props) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isVoteLoading, setIsVoteLoading] = useState(false);
  const [isBookmarkLoading, setIsBookmarkLoading] = useState(false);
  const [isCopyLoading, setIsCopyLoading] = useState(false);
  const [userVote, setUserVote] = useState<boolean | null>(null);
  const [currentVoteCount, setCurrentVoteCount] = useState(votesCount || 0);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/questions/${questionSlug}-${question_id}`
      : "";

  useEffect(() => {
    loadInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question_id]);

  const loadInitialData = async () => {
    setIsInitialLoading(true);
    try {
      // Load bookmark status and user vote in parallel
      const [bookmarkStatus, voteStatus] = await Promise.all([
        checkBookmarkStatus(question_id),
        checkUserVote(question_id),
      ]);

      setIsBookmarked(bookmarkStatus);
      setUserVote(voteStatus);
    } catch (error) {
      console.error("Error loading initial data:", error);
    } finally {
      setIsInitialLoading(false);
    }
  };

  const handleBookmark = async () => {
    if (isBookmarkLoading || isVoteLoading) return;

    setIsBookmarkLoading(true);

    try {
      const result = await toggleQuestionBookmark(question_id, isBookmarked);

      if (result.success) {
        setIsBookmarked(result.isBookmarked);
        toast.success(result.message, {
          duration: 3000,
        });
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error handling bookmark:", error);
      toast.error("Terjadi kesalahan, silakan coba lagi");
    } finally {
      setIsBookmarkLoading(false);
    }
  };

  const handleVote = async (voteType: boolean) => {
    if (isVoteLoading || isBookmarkLoading) return;

    setIsVoteLoading(true);

    try {
      const result = await handleQuestionVote(question_id, voteType);

      if (result.success) {
        setUserVote(result.newVoteState);
        setCurrentVoteCount((prev) => prev + result.voteCountChange);
        toast.success(result.message, {
          duration: 3000,
        });
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error handling vote:", error);
      toast.error("Terjadi kesalahan, silakan coba lagi");
    } finally {
      setIsVoteLoading(false);
    }
  };

  const handleCopyLink = async () => {
    if (isCopyLoading) return;

    setIsCopyLoading(true);

    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link pertanyaan telah disalin ke clipboard!", {
        duration: 2000,
      });
    } catch (error) {
      console.error("Error copying link:", error);
      toast.error("Gagal menyalin link");
    } finally {
      setTimeout(() => {
        setIsCopyLoading(false);
      }, 500);
    }
  };

  // Loading skeleton for initial load
  if (isInitialLoading) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-6 w-full rounded-2xl border border-foreground/10 bg-foreground/[0.03] px-8 py-6 shadow-sm">
        <div className="flex flex-col gap-3 max-w-xl flex-1">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <div className="flex items-center gap-4 mt-2">
            <Skeleton className="h-11 w-32" />
            <Skeleton className="h-11 w-11 rounded-lg" />
            <Skeleton className="h-11 w-11 rounded-lg" />
          </div>
        </div>

        <div className="flex flex-col gap-3 items-center justify-center min-w-[220px]">
          <Skeleton className="h-8 w-32" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-11 w-11 rounded-lg" />
            <Skeleton className="h-12 w-16" />
            <Skeleton className="h-11 w-11 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        questionId={question_id}
        questionTitle={questionTitle}
        questionSlug={questionSlug}
      />

      <div className="flex flex-wrap items-center justify-between gap-6 w-full rounded-2xl border border-foreground/10 bg-foreground/[0.03] px-8 py-6 shadow-sm">
        <div className="flex flex-col gap-3 max-w-xl">
          <p className="text-2xl font-semibold text-foreground">
            Kenal sepuh yang bisa bantu jawab pertanyaan ini?
          </p>
          <p className="text-sm text-muted-foreground">
            Bagikan pertanyaan ini supaya mereka bisa bantu kamu.
          </p>
          <div className="flex items-center gap-4">
            <Button
              onClick={() => setIsShareModalOpen(true)}
              variant={"default"}
              size="lg"
              className="h-11 px-6 text-base"
              disabled={isVoteLoading || isBookmarkLoading}
            >
              <Share size={18} className="mr-2" />
              Bagikan
            </Button>
            <Button
              onClick={handleCopyLink}
              variant={"outline"}
              size="lg"
              className="h-11 w-11 p-0 relative"
              disabled={isCopyLoading || isVoteLoading || isBookmarkLoading}
              title="Copy link pertanyaan"
            >
              {isCopyLoading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <Link2 size={20} />
              )}
            </Button>
            <Button
              onClick={handleBookmark}
              variant={isBookmarked ? "default" : "outline"}
              size="lg"
              className="h-11 w-11 p-0 relative"
              disabled={isBookmarkLoading || isVoteLoading}
              title={isBookmarked ? "Hapus bookmark" : "Tambah bookmark"}
            >
              {isBookmarkLoading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <Bookmark
                  size={20}
                  fill={isBookmarked ? "currentColor" : "none"}
                  className="transition-all duration-200"
                />
              )}
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
              className="h-11 w-11 p-0 relative transition-all duration-200"
              disabled={isVoteLoading || isBookmarkLoading}
              title="Vote up"
            >
              {isVoteLoading && userVote === true ? (
                <Loader2 size={26} className="animate-spin" />
              ) : (
                <ChevronUp
                  size={26}
                  className={
                    userVote === true
                      ? "text-primary-foreground"
                      : "text-foreground"
                  }
                />
              )}
            </Button>
            <span
              className={`text-3xl font-bold min-w-[3ch] text-center transition-all duration-300 ${
                isVoteLoading ? "opacity-50 scale-95" : "opacity-100 scale-100"
              }`}
            >
              {currentVoteCount}
            </span>
            <Button
              onClick={() => handleVote(false)}
              variant={userVote === false ? "default" : "ghost"}
              size="lg"
              className="h-11 w-11 p-0 relative transition-all duration-200"
              disabled={isVoteLoading || isBookmarkLoading}
              title="Vote down"
            >
              {isVoteLoading && userVote === false ? (
                <Loader2 size={26} className="animate-spin" />
              ) : (
                <ChevronDown
                  size={26}
                  className={
                    userVote === false
                      ? "text-primary-foreground"
                      : "text-foreground"
                  }
                />
              )}
            </Button>
          </div>
          {isVoteLoading && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 size={12} className="animate-spin" />
              <span>Memproses vote...</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
