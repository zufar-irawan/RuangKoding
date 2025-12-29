"use client";

import Link from "next/link";
import { Flame } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DailyChallengeButtonProps {
  hasCompletedToday: boolean;
  streak: number;
}

export function DailyChallengeButton({
  hasCompletedToday,
  streak,
}: DailyChallengeButtonProps) {
  return (
    <Link href="/daily-challenge">
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        title={
          hasCompletedToday
            ? `Streak: ${streak} hari`
            : "Daily Challenge - Belum diselesaikan"
        }
      >
        <Flame
          className={`h-5 w-5 ${
            streak > 0
              ? "text-orange-500 fill-orange-500"
              : "text-gray-400 fill-gray-400"
          }`}
        />
        {!hasCompletedToday && (
          <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-background" />
        )}
      </Button>
    </Link>
  );
}
