"use client";

import { useState } from "react";
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
    <div className="">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2 ">
          <Label
            htmlFor="language"
            className="text-foreground flex flex-col gap-1"
          >
            Bahasa Pemrograman
            <span className="text-muted-foreground">
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

        <div className="space-y-2">
          <Label htmlFor="code" className="text-foreground flex flex-col gap-1">
            Kode Program
            <span className="text-muted-foreground">
              Copy kode program yang ingin kamu pahami, dan Paste ke sini!
            </span>
          </Label>
          <div className="rounded-2xl overflow-hidden">
            <Editor
              height="400px"
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
                tabSize: 2,
              }}
            />
          </div>
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <Button
          type="submit"
          className=""
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
