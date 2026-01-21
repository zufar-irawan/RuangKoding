"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Editor from "@monaco-editor/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { createClient } from "@/lib/supabase/client";
import { submitChallengeAnswer } from "@/lib/daily-challenge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle2, XCircle, Flame, Info, ChartBar } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface UserSubmission {
  id: string;
  answer: string;
  language: string | null;
  is_correct: boolean | null;
  penjelasan: string | null;
  created_at?: string;
}

interface ChallengeEditorProps {
  challengeId: string;
  challenge: string;
  initialSubmission: UserSubmission | null;
  streak: number;
}

const LANGUAGES = [
  { value: "javascript", label: "JavaScript", extension: "js" },
  { value: "typescript", label: "TypeScript", extension: "ts" },
  { value: "python", label: "Python", extension: "py" },
  { value: "java", label: "Java", extension: "java" },
  { value: "cpp", label: "C++", extension: "cpp" },
  { value: "csharp", label: "C#", extension: "cs" },
  { value: "go", label: "Go", extension: "go" },
  { value: "rust", label: "Rust", extension: "rs" },
  { value: "php", label: "PHP", extension: "php" },
  { value: "ruby", label: "Ruby", extension: "rb" },
];

const DEFAULT_CODE = {
  javascript: "// Tulis kode JavaScript kamu di sini\n\n",
  typescript: "// Tulis kode TypeScript kamu di sini\n\n",
  python: "# Tulis kode Python kamu di sini\n\n",
  java: "// Tulis kode Java kamu di sini\n\n",
  cpp: "// Tulis kode C++ kamu di sini\n\n",
  csharp: "// Tulis kode C# kamu di sini\n\n",
  go: "// Tulis kode Go kamu di sini\n\n",
  rust: "// Tulis kode Rust kamu di sini\n\n",
  php: "<?php\n// Tulis kode PHP kamu di sini\n\n",
  ruby: "# Tulis kode Ruby kamu di sini\n\n",
};

export function ChallengeEditor({
  challengeId,
  challenge,
  initialSubmission,
  streak,
}: ChallengeEditorProps) {
  const router = useRouter();
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(DEFAULT_CODE.javascript);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isWaitingResult, setIsWaitingResult] = useState(false);
  const [submission, setSubmission] = useState<UserSubmission | null>(
    initialSubmission,
  );
  const [error, setError] = useState<string | null>(null);

  // Initialize with existing submission if available
  useEffect(() => {
    if (initialSubmission) {
      setSubmission(initialSubmission);
      setLanguage(initialSubmission.language || "javascript");
      setCode(initialSubmission.answer || "");

      // If submission exists but is_correct is still null, start waiting
      if (initialSubmission.is_correct === null) {
        setIsWaitingResult(true);
      }
    }
  }, [initialSubmission]);

  // Realtime subscription to watch for is_correct changes
  useEffect(() => {
    if (!submission?.id || submission.is_correct !== null) {
      return;
    }

    const supabase = createClient();

    const channel = supabase
      .channel(`submission_${submission.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "daily_code_user",
          filter: `id=eq.${submission.id}`,
        },
        (payload) => {
          const updatedSubmission = payload.new as UserSubmission;

          if (updatedSubmission.is_correct !== null) {
            setSubmission(updatedSubmission);
            setIsWaitingResult(false);

            // Refresh the page data
            router.refresh();
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [submission?.id, submission?.is_correct, router]);

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    if (!submission) {
      setCode(DEFAULT_CODE[value as keyof typeof DEFAULT_CODE] || "");
    }
  };

  const handleSubmit = async () => {
    if (!code.trim()) {
      toast.error("Kode tidak boleh kosong!");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await submitChallengeAnswer(challengeId, code, language);

      if (result.success) {
        toast.success("Jawaban berhasil dikirim! Menunggu hasil...");
        setIsWaitingResult(true);

        // Set submission with null is_correct to trigger realtime listener
        setSubmission({
          id: result.submissionId || "",
          answer: code,
          language: language,
          is_correct: null,
          penjelasan: null,
        });
      } else {
        setError(result.error || "Gagal mengirim jawaban");
        toast.error(result.error || "Gagal mengirim jawaban");
      }
    } catch {
      setError("Terjadi kesalahan saat mengirim jawaban");
      toast.error("Terjadi kesalahan saat mengirim jawaban");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show result if submission is complete
  if (submission && submission.is_correct !== null) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flame className="w-6 h-6 text-orange-500 fill-orange-500" />
              <span className="text-orange-500 font-bold">{streak}</span>
              Daily Challenge
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose dark:prose-invert max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {challenge}
              </ReactMarkdown>
            </div>
          </CardContent>
        </Card>

        {submission.is_correct ? (
          <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <AlertDescription className="ml-2">
              <div className="space-y-2">
                <p className="font-semibold text-green-800 dark:text-green-200">
                  🎉 Selamat! Kode kamu benar!
                </p>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Streak kamu sekarang:{" "}
                  <span className="font-bold">{streak + 1}</span> hari
                </p>
                <p className="text-sm text-green-600 dark:text-green-400">
                  Kembali besok untuk challenge baru!
                </p>
              </div>
            </AlertDescription>
          </Alert>
        ) : (
          <Alert className="border-red-500 bg-red-50 dark:bg-red-950">
            <XCircle className="h-5 w-5 text-red-600" />
            <AlertDescription className="ml-2">
              <div className="space-y-3">
                <p className="font-semibold text-red-800 dark:text-red-200">
                  Kode kamu belum tepat
                </p>
                {submission.penjelasan && (
                  <div className="mt-4 p-4 bg-muted/50 rounded-lg border border-border">
                    <div className="flex items-center gap-2 mb-3 text-muted-foreground">
                      <Info className="w-4 h-4" />
                      <span className="text-sm font-semibold">Penjelasan</span>
                    </div>
                    <div className="text-sm prose prose-sm dark:prose-invert max-w-none prose-p:my-1 prose-headings:my-2 prose-code:bg-muted prose-code:px-1 prose-code:rounded prose-pre:bg-muted prose-pre:p-2 prose-pre:rounded-md">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          p: ({ ...props }) => (
                            <p className="whitespace-pre-wrap" {...props} />
                          ),
                        }}
                      >
                        {submission.penjelasan}
                      </ReactMarkdown>
                    </div>
                  </div>
                )}
                <p className="text-sm text-red-600 dark:text-red-400">
                  Coba lagi besok dengan challenge baru!
                </p>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Kode yang Kamu Submit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-2 text-sm text-muted-foreground">
              Bahasa:{" "}
              <span className="font-semibold">
                {submission.language || "N/A"}
              </span>
            </div>
            <div className="border rounded-md overflow-hidden">
              <Editor
                height="400px"
                language={submission.language || "javascript"}
                value={submission.answer}
                theme="vs-dark"
                options={{
                  readOnly: true,
                  minimap: { enabled: false },
                  fontSize: 14,
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              Leadeboard
            </CardTitle>
          </CardHeader>

          <CardContent className="flex w-full justify-between">
            <p className="flex max-w-lg">
              Lihat leaderboard pengerjaan daily challenge
              hari ini, dan lihat penyelesaian user lain!
            </p>

            <Link href={"/daily-challenge/leaderboard"}>
              <Button>
                <ChartBar />
                Leaderboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show loading state while waiting for result
  if (isWaitingResult) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flame className="w-6 h-6 text-orange-500 fill-orange-500" />
              <span className="text-orange-500 font-bold">{streak}</span>
              Daily Challenge
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose dark:prose-invert max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {challenge}
              </ReactMarkdown>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <div className="text-center space-y-2">
                <p className="text-lg font-semibold">
                  Sedang mengevaluasi kode kamu...
                </p>
                <p className="text-sm text-muted-foreground">
                  Mohon tunggu sebentar, ini tidak akan lama
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show editor for new submission
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flame className="w-6 h-6 text-orange-500 fill-orange-500" />
            <span className="text-orange-500 font-bold">{streak}</span>
            Daily Challenge
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose dark:prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {challenge}
            </ReactMarkdown>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Tulis Kode Kamu</CardTitle>
            <Select value={language} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Pilih bahasa" />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md overflow-hidden">
            <Editor
              height="500px"
              language={language}
              value={code}
              onChange={(value) => setCode(value || "")}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: "on",
                scrollBeyondLastLine: false,
                automaticLayout: true,
              }}
            />
          </div>

          <div className="mt-4 flex justify-end">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !code.trim()}
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Mengirim...
                </>
              ) : (
                "Submit Jawaban"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
