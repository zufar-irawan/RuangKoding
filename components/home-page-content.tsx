"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import TrendingQuestions from "@/components/Questions/trending-questions";
import type { QuestionListItem } from "@/lib/type";

interface HomePageContentProps {
  initialTrendingData: QuestionListItem[];
}

export default function HomePageContent({
  initialTrendingData,
}: HomePageContentProps) {
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly">(
    "monthly",
  );

  const handlePeriodChange = (value: string) => {
    setPeriod(value as "daily" | "weekly" | "monthly");
  };

  return (
    <div className="flex flex-col flex-1 gap-6 py-6 px-8 ml-[22rem]">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-foreground">
            Gimana kabarmu hari ini?
          </h1>

          <div className="max-w-2xl text-muted-foreground">
            Bete karena kodingan error terus? Daripada kena limit AI, kamu bisa
            bertanya aja di Ruang Koding. Pastikan kalau pertanyaan kamu jelas
            dan sepsifik, biar dilirik sepuh.
          </div>
        </div>

        <Link href="/question/create">
          <Button>
            <Plus className="mr-2" size={16} />
            Buat pertanyaan baru
          </Button>
        </Link>
      </div>

      {/* Trending Questions Section */}
      <TrendingQuestions
        initialData={initialTrendingData}
        period={period}
        onPeriodChange={handlePeriodChange}
      />
    </div>
  );
}
