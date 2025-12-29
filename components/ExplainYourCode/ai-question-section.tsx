"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Loader2, MessageSquare, Code2 } from "lucide-react";
import { updateQuestionAnswer } from "@/lib/servers/ExplainYourCodeAction";

interface AIQuestionSectionProps {
  question: {
    id: number;
    code: string;
    question: string;
    options: string[];
    language?: string;
  };
  onAnswerSubmitted: () => void;
}

export default function AIQuestionSection({
  question,
  onAnswerSubmitted,
}: AIQuestionSectionProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>("");

  // Add "Aku belum tau :(" option at the end
  const allOptions = [...question.options, "Aku belum tau :("];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!selectedAnswer) {
      setError("Silakan pilih salah satu jawaban");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await updateQuestionAnswer({
        questionId: question.id,
        answer: selectedAnswer,
      });

      if (result.success) {
        onAnswerSubmitted();
      } else {
        setError(result.message || "Gagal menyimpan jawaban");
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error("Error submitting answer:", err);
      setError("Terjadi kesalahan saat mengirim jawaban");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="overflow-hidden w-full">
      {/* Code Section */}
      <div className="w-full">
        <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3 md:mb-4">
          <Code2 className="text-primary flex-shrink-0" size={16} />
          <h3 className="text-sm sm:text-base md:text-lg font-semibold text-foreground">
            Kode yang kamu Submit!
          </h3>
        </div>
        <div className="bg-slate-900 rounded-md sm:rounded-lg p-2 sm:p-3 md:p-4 overflow-x-auto border border-slate-800">
          <pre className="text-[10px] sm:text-xs md:text-sm text-slate-100 whitespace-pre-wrap break-words">
            <code>{question.code}</code>
          </pre>
        </div>
      </div>

      {/* Question Section */}
      <div className="mt-3 sm:mt-4 md:mt-6">
        <div className="flex items-start gap-1.5 sm:gap-2 md:gap-3 mb-3 sm:mb-4 md:mb-6">
          <MessageSquare
            className="text-primary mt-0.5 sm:mt-1 flex-shrink-0"
            size={16}
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-sm sm:text-base md:text-lg font-semibold text-foreground mb-1.5 sm:mb-2">
              Pertanyaan dari AI
            </h3>
            <p className="text-xs sm:text-sm md:text-base text-foreground leading-relaxed break-words">
              {question.question}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 md:space-y-6">
          <div className="space-y-2 sm:space-y-2.5 md:space-y-3">
            <Label className="text-xs sm:text-sm md:text-base font-semibold text-foreground">
              Pilih jawaban Anda:
            </Label>
            <RadioGroup
              value={selectedAnswer}
              onValueChange={setSelectedAnswer}
              className="space-y-1.5 sm:space-y-2 md:space-y-3"
            >
              {allOptions.map((option, index) => (
                <label
                  key={index}
                  htmlFor={`option-${index}`}
                  className={`relative flex items-start space-x-1.5 sm:space-x-2 md:space-x-3 rounded-md sm:rounded-lg border-2 p-2.5 sm:p-3 md:p-4 transition-all cursor-pointer hover:border-primary/50 hover:bg-accent/50 ${
                    selectedAnswer === option
                      ? "border-primary bg-accent shadow-md"
                      : "border-border bg-background"
                  }`}
                >
                  <RadioGroupItem
                    value={option}
                    id={`option-${index}`}
                    className="mt-0.5 flex-shrink-0"
                  />
                  <span className="flex-1 cursor-pointer text-xs sm:text-sm md:text-base text-foreground leading-relaxed break-words">
                    {option}
                  </span>

                </label>
              ))}
            </RadioGroup>
          </div>

          {error && (
            <div className="bg-destructive/10 text-destructive px-2.5 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 rounded-md sm:rounded-lg text-xs sm:text-sm">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full sm:w-auto text-sm sm:text-base"
            disabled={isSubmitting || !selectedAnswer}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 animate-spin" size={16} />
                Mengirim Jawaban...
              </>
            ) : (
              "Kirim Jawaban!"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
