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
    <div className="overflow-hidden">
      {/* Code Section */}
      <div className="">
        <div className="flex items-center gap-2 mb-4">
          <Code2 className="text-primary" size={20} />
          <h3 className="text-lg font-semibold text-foreground">
            Kode yang kamu Submit!
          </h3>
        </div>
        <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm text-slate-100">
            <code>{question.code}</code>
          </pre>
        </div>
      </div>

      {/* Question Section */}
      <div className="mt-6z">
        <div className="flex items-start gap-3 mb-6">
          <MessageSquare
            className="text-primary mt-1 flex-shrink-0"
            size={20}
          />
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Pertanyaan dari AI
            </h3>
            <p className="text-foreground leading-relaxed">
              {question.question}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <Label className="text-base font-semibold text-foreground">
              Pilih jawaban Anda:
            </Label>
            <RadioGroup
              value={selectedAnswer}
              onValueChange={setSelectedAnswer}
              className="space-y-3"
            >
              {allOptions.map((option, index) => (
                <label
                  key={index}
                  htmlFor={`option-${index}`}
                  className={`relative flex items-start space-x-3 rounded-lg border-2 p-4 transition-all cursor-pointer hover:border-primary/50 hover:bg-accent/50 ${
                    selectedAnswer === option
                      ? "border-primary bg-accent shadow-md"
                      : "border-border bg-background"
                  }`}
                >
                  <RadioGroupItem
                    value={option}
                    id={`option-${index}`}
                    className="mt-0.5"
                  />
                  <span className="flex-1 cursor-pointer text-foreground leading-relaxed">
                    {option}
                  </span>
                  {selectedAnswer === option && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-primary-foreground"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                  )}
                </label>
              ))}
            </RadioGroup>
          </div>

          {error && (
            <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className=""
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
