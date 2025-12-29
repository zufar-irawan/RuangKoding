"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, MessageSquare, Sparkles } from "lucide-react";
import Link from "next/link";
import TrendingQuestions from "@/components/Questions/trending-questions";
import TrendingFeedback from "@/components/Feedback/trending-feedback";
import DailyChallengeBanner from "@/components/daily-challenge-banner";
import ExplainCodeCTA from "@/components/explain-code-cta";
import type { QuestionListItem, FeedbackListItem } from "@/lib/type";
import type { DailyChallengeStatus } from "@/lib/daily-challenge";

interface HomePageContentProps {
  initialTrendingData: QuestionListItem[];
  initialFeedbackData: FeedbackListItem[];
  dailyChallengeStatus: DailyChallengeStatus | null;
}

export default function HomePageContent({
  initialTrendingData,
  initialFeedbackData,
  dailyChallengeStatus,
}: HomePageContentProps) {
  const [questionsPeriod, setQuestionsPeriod] = useState<
    "daily" | "weekly" | "monthly"
  >("monthly");
  const [feedbackPeriod, setFeedbackPeriod] = useState<
    "daily" | "monthly" | "yearly"
  >("monthly");

  const handleQuestionsPeriodChange = (value: string) => {
    setQuestionsPeriod(value as "daily" | "weekly" | "monthly");
  };

  const handleFeedbackPeriodChange = (value: string) => {
    setFeedbackPeriod(value as "daily" | "monthly" | "yearly");
  };

  return (
    <div className="flex flex-col flex-1 gap-6 md:gap-8 py-4 md:py-6 px-4 md:px-8 ml-0 lg:ml-[22rem]">
      {/* Daily Challenge Banner */}
      {dailyChallengeStatus && (
        <DailyChallengeBanner status={dailyChallengeStatus} />
      )}

      {/* Hero Section - Gimana kabarmu hari ini */}
      <div className="flex flex-col gap-4 md:gap-6 py-4 md:py-6">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-1 h-8 md:h-12 bg-primary rounded-full" />
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
              Gimana kabarmu hari ini?
            </h1>
          </div>

          <div className="max-w-3xl text-base md:text-lg text-muted-foreground leading-relaxed ml-3 md:ml-4">
            <p className="mb-2 md:mb-3">
              Bete karena kodingan error terus? Daripada kena limit AI, kamu
              bisa bertanya aja di{" "}
              <span className="font-semibold text-foreground">
                Ruang Koding
              </span>
              .
            </p>
            <p className="text-sm md:text-base">
              Pastikan kalau pertanyaan kamu{" "}
              <span className="font-semibold text-foreground">
                jelas dan spesifik
              </span>
              , biar dilirik sepuh dan dapat jawaban yang berkualitas.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 md:gap-3 ml-0 md:ml-4">
          <Link href="/question/create" className="w-full sm:w-auto">
            <Button size="lg" className="gap-2 w-full sm:w-auto">
              <Plus size={18} />
              Buat Pertanyaan Baru
            </Button>
          </Link>

          <Link href="/lautan-feedback" className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="outline"
              className="gap-2 w-full sm:w-auto"
            >
              <MessageSquare size={18} />
              Request Feedback
            </Button>
          </Link>

          <Link href="/explain-your-code" className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="outline"
              className="gap-2 w-full sm:w-auto"
            >
              <Sparkles size={18} />
              Explain Your Code
            </Button>
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 md:gap-6 text-xs md:text-sm text-muted-foreground ml-0 md:ml-4 mt-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
            <span>Komunitas developer yang aktif</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
            <span>Jawaban berkualitas dari sepuh</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-purple-500 flex-shrink-0" />
            <span>Gratis tanpa limit</span>
          </div>
        </div>
      </div>

      {/* Trending Questions Section */}
      <TrendingQuestions
        initialData={initialTrendingData}
        period={questionsPeriod}
        onPeriodChange={handleQuestionsPeriodChange}
      />

      {/* Trending Feedback Section */}
      <TrendingFeedback
        initialData={initialFeedbackData}
        period={feedbackPeriod}
        onPeriodChange={handleFeedbackPeriodChange}
      />

      {/* Explain Your Code CTA */}
      <ExplainCodeCTA />
    </div>
  );
}
