"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Flame } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DailyChallengeStatus } from "@/lib/daily-challenge";

interface DailyReminderModalProps {
  initialStatus: DailyChallengeStatus | null;
}

export function DailyReminderModal({ initialStatus }: DailyReminderModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Only show on homepage
    if (pathname !== "/") {
      return;
    }

    // Don't show if user is not logged in
    if (!initialStatus) {
      return;
    }

    // Only show if user hasn't completed today's challenge
    if (!initialStatus.hasCompletedToday && initialStatus.todayChallengeId) {
      // Check if modal was already shown in this session
      const hasShownModal = sessionStorage.getItem("daily-reminder-shown");

      if (!hasShownModal) {
        setIsOpen(true);
        sessionStorage.setItem("daily-reminder-shown", "true");
      }
    }
  }, [initialStatus, pathname]);

  const handleGoToChallenge = () => {
    setIsOpen(false);
    // TODO: Update this route to your actual daily challenge page
    router.push("/daily-challenge");
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  if (!initialStatus) {
    return null;
  }

  const { streak } = initialStatus;
  const hasStreak = streak > 0;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">
            Daily Coding Challenge
          </DialogTitle>
          <DialogDescription className="text-center">
            Jaga streak kamu dengan menyelesaikan tantangan hari ini!
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center py-6 space-y-4">
          {/* Fire Icon */}
          <div className="relative">
            <Flame
              className={`w-24 h-24 ${
                hasStreak
                  ? "text-orange-500 fill-orange-500"
                  : "text-gray-400 fill-gray-400"
              }`}
              strokeWidth={1.5}
            />
          </div>

          {/* Streak Count */}
          <div className="text-center">
            <p className="text-4xl font-bold">{streak}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {streak === 1 ? "Hari Streak" : "Hari Streak"}
            </p>
          </div>

          {/* Message */}
          <p className="text-center text-sm text-muted-foreground max-w-xs">
            {hasStreak
              ? "Pertahankan streak kamu! Selesaikan tantangan hari ini untuk melanjutkan."
              : "Mulai streak kamu hari ini! Selesaikan tantangan coding pertama kamu."}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          <Button onClick={handleGoToChallenge} className="w-full" size="lg">
            Mulai Challenge
          </Button>
          <Button
            onClick={handleClose}
            variant="ghost"
            className="w-full"
            size="sm"
          >
            Nanti Saja
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
