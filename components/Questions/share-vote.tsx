"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { getClientUser } from "@/utils/GetClientUser";
import { Share, Link2, ChevronUp, ChevronDown, Bookmark } from "lucide-react";
import { toast } from "sonner";

type Props = {
  votesCount?: number;
  question_id: number;
};

export default function SharesNVote({ votesCount, question_id }: Props) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkBookmarkStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question_id]);

  const checkBookmarkStatus = async () => {
    try {
      const supabase = createClient();
      const user = await getClientUser();

      if (!user?.id || !question_id) return;

      const { data } = await supabase
        .from("saved_quest")
        .select("*")
        .eq("user_id", user.id)
        .eq("question_id", question_id);

      setIsBookmarked(!!(data && data.length > 0));
    } catch (error) {
      console.error("Error checking bookmark status:", error);
    }
  };

  const handleBookmark = async () => {
    if (isLoading) return;

    setIsLoading(true);
    const supabase = createClient();

    try {
      const user = await getClientUser();

      if (!user?.id) {
        toast.error("Silakan login terlebih dahulu");
        return;
      }

      if (!question_id) {
        toast.error("ID pertanyaan tidak valid");
        return;
      }

      if (isBookmarked) {
        const { error } = await supabase
          .from("saved_quest")
          .delete()
          .eq("user_id", user.id)
          .eq("question_id", question_id);

        if (error) throw error;

        setIsBookmarked(false);
        toast.success("Bookmark dihapus");
      } else {
        const payload = {
          user_id: user.id,
          question_id: question_id,
        };

        const { error } = await supabase.from("saved_quest").insert(payload);

        if (error) {
          if (error.code === "23505") {
            toast.info("Pertanyaan sudah tersimpan");
          } else {
            throw error;
          }
        } else {
          setIsBookmarked(true);
          toast.success("Berhasil menyimpan pertanyaan");
        }
      }
    } catch (error) {
      console.error("Error handling bookmark:", error);
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
          <Button variant={"outline"} size="lg" className="h-11 w-11 p-0">
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
          <Button variant={"ghost"} size="lg" className="h-11 w-11 p-0">
            <ChevronUp size={26} />
          </Button>
          <span className="text-3xl font-bold min-w-[3ch] text-center">
            {votesCount}
          </span>
          <Button variant={"ghost"} size="lg" className="h-11 w-11 p-0">
            <ChevronDown size={26} />
          </Button>
        </div>
      </div>
    </div>
  );
}
