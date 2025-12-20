"use client";

import { useState, useEffect } from "react";
import PostCard from "../post-card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { QuestionListItem } from "@/lib/type";

interface TrendingQuestionsProps {
  initialData: QuestionListItem[];
  period: "daily" | "weekly" | "monthly";
  onPeriodChange: (value: string) => void;
}

export default function TrendingQuestions({
  initialData,
  period,
  onPeriodChange,
}: TrendingQuestionsProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [questions, setQuestions] = useState<QuestionListItem[]>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  const ITEMS_PER_PAGE = 10;

  // Reset page when period changes
  useEffect(() => {
    setCurrentPage(1);
  }, [period]);

  // Fetch trending questions
  useEffect(() => {
    const fetchTrendingQuestions = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/trending-questions?period=${period}&page=${currentPage}&limit=${ITEMS_PER_PAGE}`,
        );
        const data = await response.json();

        if (data.success && data.data) {
          setQuestions(data.data);
          setTotalPages(data.totalPages || 1);
        }
      } catch (error) {
        console.error("Error fetching trending questions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrendingQuestions();
  }, [period, currentPage]);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const getPeriodLabel = () => {
    switch (period) {
      case "daily":
        return "Harian";
      case "weekly":
        return "Mingguan";
      case "monthly":
        return "Bulanan";
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header with Title and Filter */}
      <div className="flex flex-col gap-3">
        <h2 className="text-3xl font-bold text-foreground">
          Pertanyaan Trending
        </h2>

        <Tabs value={period} onValueChange={onPeriodChange}>
          <TabsList className="bg-secondary w-fit">
            <TabsTrigger value="daily" className="text-xs">
              Harian
            </TabsTrigger>
            <TabsTrigger value="weekly" className="text-xs">
              Mingguan
            </TabsTrigger>
            <TabsTrigger value="monthly" className="text-xs">
              Bulanan
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Scrollable Container with Limited Height */}
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="relative">
          <div
            className="overflow-y-auto"
            style={{
              maxHeight: "600px",
              minHeight: "400px",
            }}
          >
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : questions.length === 0 ? (
              <div className="flex items-center justify-center py-12 text-muted-foreground">
                Tidak ada pertanyaan trending untuk periode{" "}
                {getPeriodLabel().toLowerCase()}.
              </div>
            ) : (
              <div className="flex flex-col px-4">
                {questions.map((question) => (
                  <PostCard key={question.id} question={question} />
                ))}
              </div>
            )}
          </div>

          {/* Gradient overlay to indicate scrollable content */}
          {!isLoading && questions.length > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none" />
          )}
        </div>

        {/* Pagination */}
        {!isLoading && questions.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-background">
            <div className="text-sm text-muted-foreground">
              Halaman {currentPage} dari {totalPages}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={16} className="mr-1" />
                Sebelumnya
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={currentPage >= totalPages}
              >
                Selanjutnya
                <ChevronRight size={16} className="ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
