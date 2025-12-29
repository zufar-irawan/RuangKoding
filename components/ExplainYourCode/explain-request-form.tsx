"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { createExplainRequest } from "@/lib/servers/ExplainYourCodeAction";
import dynamic from "next/dynamic";

const Editor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

const PROGRAMMING_LANGUAGES = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
  { value: "c", label: "C" },
  { value: "csharp", label: "C#" },
  { value: "php", label: "PHP" },
  { value: "ruby", label: "Ruby" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
  { value: "kotlin", label: "Kotlin" },
  { value: "swift", label: "Swift" },
  { value: "sql", label: "SQL" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
];

interface ExplainRequestFormProps {
  onRequestCreated: (requestId: number) => void;
}

export default function ExplainRequestForm({
  onRequestCreated,
}: ExplainRequestFormProps) {
  const [language, setLanguage] = useState<string>("javascript");
  const [code, setCode] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>("");
  const [editorHeight, setEditorHeight] = useState<string>("250px");
  const [editorFontSize, setEditorFontSize] = useState<number>(11);
  const [showLineNumbers, setShowLineNumbers] = useState<"on" | "off">("off");

  useEffect(() => {
    const updateEditorSettings = () => {
      if (window.innerWidth >= 768) {
        setEditorHeight("400px");
        setEditorFontSize(12);
        setShowLineNumbers("on");
      } else if (window.innerWidth >= 640) {
        setEditorHeight("300px");
        setEditorFontSize(11);
        setShowLineNumbers("on");
      } else {
        setEditorHeight("250px");
        setEditorFontSize(11);
        setShowLineNumbers("off");
      }
    };

    updateEditorSettings();
    window.addEventListener("resize", updateEditorSettings);
    return () => window.removeEventListener("resize", updateEditorSettings);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!code.trim()) {
      setError("Silakan masukkan kode yang ingin dijelaskan");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createExplainRequest({
        language,
        code: code.trim(),
      });

      if (result.success && result.data) {
        onRequestCreated(result.data.id);
      } else {
        setError(result.message || "Gagal membuat request");
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      setError("Terjadi kesalahan saat mengirim request");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 md:space-y-6">
        <div className="space-y-1.5 sm:space-y-2">
          <Label
            htmlFor="language"
            className="text-sm sm:text-base text-foreground flex flex-col gap-0.5 sm:gap-1"
          >
            Bahasa Pemrograman
            <span className="text-xs sm:text-sm text-muted-foreground">
              Pilih bahasa pemrograman dari program kamu!
            </span>
          </Label>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger id="language" className="w-full">
              <SelectValue placeholder="Pilih bahasa pemrograman" />
            </SelectTrigger>
            <SelectContent>
              {PROGRAMMING_LANGUAGES.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5 sm:space-y-2">
          <Label htmlFor="code" className="text-sm sm:text-base text-foreground flex flex-col gap-0.5 sm:gap-1">
            Kode Program
            <span className="text-xs sm:text-sm text-muted-foreground">
              Copy kode program yang ingin kamu pahami, dan Paste ke sini!
            </span>
          </Label>
          <div className="rounded-md sm:rounded-lg md:rounded-2xl overflow-hidden border border-border/50">
            <Editor
              height={editorHeight}
              language={language}
              value={code}
              onChange={(value) => setCode(value || "")}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: editorFontSize,
                lineNumbers: showLineNumbers,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                wordWrap: "on",
              }}
            />
          </div>
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive px-2.5 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 rounded-md sm:rounded-lg text-xs sm:text-sm">
            {error}
          </div>
        )}

        <Button
          type="submit"
          className="w-full sm:w-auto text-sm sm:text-base"
          disabled={isSubmitting || !code.trim()}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 animate-spin" size={16} />
              Memproses...
            </>
          ) : (
            "Mulai Explain!"
          )}
        </Button>
      </form>
    </div>
  );
}
