"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Flame, Code2, Zap } from "lucide-react";
import type { DailyChallengeStatus } from "@/lib/daily-challenge";

interface DailyChallengeBannerProps {
  status: DailyChallengeStatus | null;
}

export default function DailyChallengeBanner({
  status,
}: DailyChallengeBannerProps) {
  if (!status) {
    return null;
  }

  const { streak, hasCompletedToday } = status;

  const getMessage = () => {
    if (hasCompletedToday) {
      return {
        title: "Keren! Kamu sudah menyelesaikan challenge hari ini! 🎉",
        description:
          "Streak kamu masih aman. Jangan lupa kembali besok untuk melanjutkan!",
        buttonText: "Lihat Challenge",
        icon: <Zap className="w-4 h-4 md:w-5 md:h-5" />,
      };
    }

    if (streak === 0) {
      return {
        title: "Mulai streak coding kamu hari ini!",
        description:
          "Asah skill dengan menyelesaikan tantangan coding setiap hari. Konsisten adalah kunci!",
        buttonText: "Mulai Challenge",
        icon: <Code2 className="w-4 h-4 md:w-5 md:h-5" />,
      };
    }

    if (streak < 7) {
      return {
        title: `${streak} hari streak! Jangan sampai putus sekarang!`,
        description:
          "Kamu sudah mulai konsisten. Selesaikan challenge hari ini untuk melanjutkan momentum!",
        buttonText: "Lanjutkan Challenge",
        icon: <Flame className="w-4 h-4 md:w-5 md:h-5" />,
      };
    }

    return {
      title: `Luar biasa! ${streak} hari streak berturut-turut! 🔥`,
      description:
        "Kamu sudah jadi coding warrior sejati. Pertahankan rekor streak kamu hari ini!",
      buttonText: "Lanjutkan Challenge",
      icon: <Flame className="w-4 h-4 md:w-5 md:h-5" />,
    };
  };

  const message = getMessage();

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6 py-4 md:py-6 border-b border-border">
      <div className="flex items-center gap-4 md:gap-6">
        {/* Streak Display */}
        <div className="flex flex-col items-center justify-center min-w-[60px] md:min-w-[80px]">
          <Flame
            className={`w-8 h-8 md:w-10 md:h-10 ${
              streak > 0
                ? "text-orange-500 fill-orange-500"
                : "text-muted-foreground/40 fill-muted-foreground/40"
            }`}
            strokeWidth={1.5}
          />
          <div className="text-xl md:text-2xl font-bold mt-1">{streak}</div>
          <div className="text-xs text-muted-foreground">
            {streak === 1 ? "Hari" : "Hari"}
          </div>
        </div>

        {/* Message */}
        <div className="flex flex-col gap-1 flex-1">
          <h3 className="text-base md:text-lg font-semibold text-foreground flex items-center gap-2">
            {message.icon}
            <span className="line-clamp-2">{message.title}</span>
          </h3>
          <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">
            {message.description}
          </p>
        </div>
      </div>

      {/* CTA Button */}
      <Link href="/daily-challenge" className="w-full md:w-auto">
        <Button
          size="lg"
          variant={hasCompletedToday ? "outline" : "default"}
          className="whitespace-nowrap w-full md:w-auto"
        >
          {message.buttonText}
        </Button>
      </Link>
    </div>
  );
}
