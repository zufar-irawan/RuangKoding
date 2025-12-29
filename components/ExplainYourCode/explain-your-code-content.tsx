"use client";

import { useState, useEffect } from "react";
import ExplainRequestForm from "./explain-request-form";
import LoadingState from "./LoadingState";
import AIQuestionSection from "./ai-question-section";
import AIReviewSection from "./ai-review-section";
import HistorySection from "./history-section";
import {
  getAIQuestion,
  getAIReview,
  getExplainRequestHistory,
} from "@/lib/servers/ExplainYourCodeAction";
import { createClient } from "@/lib/supabase/client";

type Phase =
  | "form"
  | "waiting-question"
  | "question"
  | "waiting-review"
  | "review";

interface HistoryItem {
  id: number;
  code: string;
  language: string;
  created_at: string;
}

interface ExplainYourCodeContentProps {
  initialHistory: HistoryItem[];
}

export default function ExplainYourCodeContent({
  initialHistory,
}: ExplainYourCodeContentProps) {
  const [phase, setPhase] = useState<Phase>("form");
  const [currentRequestId, setCurrentRequestId] = useState<number | null>(null);
  const [questionData, setQuestionData] = useState<{
    id: number;
    code: string;
    question: string;
    options: string[];
  } | null>(null);
  const [reviewData, setReviewData] = useState<{
    id: number;
    code: string;
    answer: string;
    greetings: string;
    explanation: string;
    tips: string;
    conclusions: string;
  } | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>(initialHistory);
  const [showHistory, setShowHistory] = useState(true);

  useEffect(() => {
    if (!currentRequestId) return;

    const supabase = createClient();

    if (phase === "waiting-question") {
      // Subscribe to AI question
      const questionChannel = supabase
        .channel(`code_ai_question_${currentRequestId}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "code_ai_question",
            filter: `code_id=eq.${currentRequestId}`,
          },
          async (payload: unknown) => {
            console.log("Question received:", payload);
            const result = await getAIQuestion(currentRequestId);
            if (result.success && result.data) {
              setQuestionData(result.data);
              setPhase("question");
            }
          },
        )
        .subscribe();

      // Check if question already exists
      const checkQuestion = async () => {
        const result = await getAIQuestion(currentRequestId);
        if (result.success && result.data) {
          setQuestionData(result.data);
          setPhase("question");
        }
      };

      checkQuestion();

      return () => {
        supabase.removeChannel(questionChannel);
      };
    }

    if (phase === "waiting-review") {
      // Subscribe to AI review
      const reviewChannel = supabase
        .channel(`code_ai_review_${currentRequestId}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "code_ai_review",
            filter: `code_id=eq.${currentRequestId}`,
          },
          async (payload: unknown) => {
            console.log("Review received:", payload);
            const result = await getAIReview(currentRequestId);
            if (result.success && result.data) {
              setReviewData(result.data);
              setPhase("review");
            }
          },
        )
        .subscribe();

      // Check if review already exists
      const checkReview = async () => {
        const result = await getAIReview(currentRequestId);
        if (result.success && result.data) {
          setReviewData(result.data);
          setPhase("review");
        }
      };

      checkReview();

      return () => {
        supabase.removeChannel(reviewChannel);
      };
    }
  }, [phase, currentRequestId]);

  const handleRequestCreated = (requestId: number) => {
    setCurrentRequestId(requestId);
    setShowHistory(false);
    setPhase("waiting-question");
  };

  const handleAnswerSubmitted = () => {
    setPhase("waiting-review");
  };

  const handleNewRequest = async () => {
    setPhase("form");
    setCurrentRequestId(null);
    setQuestionData(null);
    setReviewData(null);
    setShowHistory(true);
    // Refresh history
    const historyResult = await getExplainRequestHistory(1, 20);
    if (historyResult.success && historyResult.data) {
      setHistory(historyResult.data);
    }
  };

  const handleSelectHistory = (historyId: number) => {
    setCurrentRequestId(historyId);
    setShowHistory(false);
    setPhase("waiting-review");
  };

  return (
    <div className="space-y-8">
      {/* Top Section */}
      <div
        className={`transition-all duration-500 ${
          !showHistory ? "opacity-0 h-0 overflow-hidden" : "opacity-100"
        }`}
      >
        {phase === "form" && (
          <ExplainRequestForm onRequestCreated={handleRequestCreated} />
        )}
      </div>

      {/* Main Content Section */}
      {phase === "waiting-question" && (
        <LoadingState message="Menunggu pertanyaan dari AI..." />
      )}

      {phase === "question" && questionData && (
        <AIQuestionSection
          question={questionData}
          onAnswerSubmitted={handleAnswerSubmitted}
        />
      )}

      {phase === "waiting-review" && (
        <LoadingState message="Menunggu review dari AI..." />
      )}

      {phase === "review" && reviewData && (
        <AIReviewSection review={reviewData} onNewRequest={handleNewRequest} />
      )}

      {/* Bottom Section - History */}
      <div
        className={`transition-all duration-500 ${
          !showHistory ? "opacity-0 h-0 overflow-hidden" : "opacity-100"
        }`}
      >
        {phase === "form" && (
          <HistorySection
            history={history}
            onSelectHistory={handleSelectHistory}
          />
        )}
      </div>
    </div>
  );
}
