"use client";

import {
  Code2,
  Sparkles,
  MessageCircle,
  Lightbulb,
  CheckCircle2,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface AIReviewSectionProps {
  review: {
    id: number;
    code: string;
    answer: string;
    greetings: string;
    explanation: string;
    tips: string;
    conclusions: string;
    language?: string;
  };
  onNewRequest: () => void;
}

// Component for rendering markdown-like text with proper formatting
function FormattedText({ content }: { content: string }) {
  return (
    <div className="prose prose-sm max-w-none dark:prose-invert">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => (
            <p className="mb-3 md:mb-4 leading-6 md:leading-7 text-foreground last:mb-0">
              {children}
            </p>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-foreground">
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="italic text-foreground">{children}</em>
          ),
          code: ({ children }) => (
            <code className="bg-muted px-1 md:px-1.5 py-0.5 rounded text-xs md:text-sm font-mono text-foreground border border-border">
              {children}
            </code>
          ),
          pre: ({ children }) => (
            <pre className="bg-slate-950 text-slate-50 p-3 md:p-4 rounded-lg overflow-x-auto my-3 md:my-4 border border-border/50 shadow-sm text-xs md:text-sm">
              {children}
            </pre>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-outside ml-4 md:ml-6 space-y-1 md:space-y-2 my-3 md:my-4 text-foreground marker:text-muted-foreground">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-outside ml-4 md:ml-6 space-y-1 md:space-y-2 my-3 md:my-4 text-foreground marker:text-muted-foreground">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="leading-6 md:leading-7 text-foreground pl-1">{children}</li>
          ),
          h1: ({ children }) => (
            <h1 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 mt-4 md:mt-6 text-foreground border-b border-border pb-2 first:mt-0">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-3 mt-4 md:mt-6 text-foreground first:mt-0">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base md:text-lg font-semibold mb-2 mt-3 md:mt-4 text-foreground first:mt-0">
              {children}
            </h3>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary/50 pl-3 md:pl-4 italic my-3 md:my-4 text-muted-foreground bg-muted/20 py-1 rounded-r">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="my-4 md:my-6 w-full overflow-y-auto rounded-lg border border-border">
              <table className="w-full border-collapse text-xs md:text-sm">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-muted/50 text-foreground border-b border-border">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="text-foreground bg-card">{children}</tbody>
          ),
          tr: ({ children }) => (
            <tr className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
              {children}
            </tr>
          ),
          th: ({ children }) => (
            <th className="px-2 md:px-4 py-2 md:py-3 text-left font-semibold text-muted-foreground text-xs md:text-sm">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-2 md:px-4 py-2 md:py-3 align-top text-xs md:text-sm">{children}</td>
          ),
          hr: () => <hr className="my-4 md:my-6 border-border" />,
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

export default function AIReviewSection({
  review,
  onNewRequest,
}: AIReviewSectionProps) {
  return (
    <div className="space-y-3 sm:space-y-4 md:space-y-6 w-full">
      {/* Code Section */}
      <div className="bg-card border border-border rounded-md sm:rounded-lg p-3 sm:p-4 md:p-6">
        <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3 md:mb-4">
          <Code2 className="text-primary flex-shrink-0" size={16} />
          <h3 className="text-sm sm:text-base md:text-lg font-semibold text-foreground">
            Kode yang kamu Submit
          </h3>
        </div>
        <div className="bg-slate-900 rounded-md sm:rounded-lg p-2 sm:p-3 md:p-4 overflow-x-auto border border-slate-800">
          <pre className="text-[10px] sm:text-xs md:text-sm text-slate-100 whitespace-pre-wrap break-words">
            <code>{review.code}</code>
          </pre>
        </div>
      </div>

      {/* Answer Section */}
      <div className="bg-card border border-border rounded-md sm:rounded-lg p-3 sm:p-4 md:p-6">
        <div className="flex items-start gap-1.5 sm:gap-2 md:gap-3">
          <div className="bg-blue-500/10 p-1.5 sm:p-2 md:p-2.5 rounded-md sm:rounded-lg flex-shrink-0">
            <MessageCircle className="text-blue-500" size={16} />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs sm:text-sm md:text-base font-semibold text-foreground mb-1.5 sm:mb-2 md:mb-3">
              Jawaban kamu
            </h4>
            <div className="bg-muted/50 border border-border rounded-md sm:rounded-lg p-2 sm:p-3 md:p-4">
              <p className="text-xs sm:text-sm md:text-base text-foreground leading-5 sm:leading-6 md:leading-7 break-words">{review.answer}</p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Response Container - ChatGPT-like */}
      <div className="bg-card border border-border rounded-md sm:rounded-lg overflow-hidden">
        {/* Greetings Section */}
        <div className="p-3 sm:p-4 md:p-6 border-b border-border bg-gradient-to-br from-primary/5 to-transparent">
          <div className="flex items-start gap-1.5 sm:gap-2 md:gap-3">
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-1.5 sm:p-2 md:p-2.5 rounded-md sm:rounded-lg flex-shrink-0">
              <Sparkles
                className="text-purple-600 dark:text-purple-400"
                size={16}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm sm:text-base md:text-lg font-semibold text-foreground mb-1.5 sm:mb-2 md:mb-3 flex items-center gap-1 sm:gap-2">
                👋 Penjelasan dari AI
              </h3>
              <div className="text-xs sm:text-sm md:text-base text-foreground/90 leading-5 sm:leading-6 md:leading-7">
                <FormattedText content={review.greetings} />
              </div>
            </div>
          </div>
        </div>

        {/* Explanation Section */}
        <div className="p-3 sm:p-4 md:p-6 border-b border-border">
          <div className="flex items-start gap-1.5 sm:gap-2 md:gap-3">
            <div className="bg-emerald-500/10 p-1.5 sm:p-2 md:p-2.5 rounded-md sm:rounded-lg flex-shrink-0">
              <BookOpen
                className="text-emerald-600 dark:text-emerald-400"
                size={16}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs sm:text-sm md:text-base font-semibold text-foreground mb-1.5 sm:mb-2 md:mb-3 flex items-center gap-1 sm:gap-2">
                📚 Penjelasan Detail
              </h4>
              <div className="text-xs sm:text-sm md:text-base text-foreground/90 leading-5 sm:leading-6 md:leading-7">
                <FormattedText content={review.explanation} />
              </div>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="p-3 sm:p-4 md:p-6 border-b border-border bg-amber-50/50 dark:bg-amber-950/10">
          <div className="flex items-start gap-1.5 sm:gap-2 md:gap-3">
            <div className="bg-amber-500/10 p-1.5 sm:p-2 md:p-2.5 rounded-md sm:rounded-lg flex-shrink-0">
              <Lightbulb
                className="text-amber-600 dark:text-amber-400"
                size={16}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs sm:text-sm md:text-base font-semibold text-foreground mb-1.5 sm:mb-2 md:mb-3 flex items-center gap-1 sm:gap-2">
                💡 Tips & Saran
              </h4>
              <div className="text-xs sm:text-sm md:text-base text-foreground/90 leading-5 sm:leading-6 md:leading-7">
                <FormattedText content={review.tips} />
              </div>
            </div>
          </div>
        </div>

        {/* Conclusions Section */}
        <div className="p-3 sm:p-4 md:p-6 bg-gradient-to-br from-green-50/50 to-transparent dark:from-green-950/10">
          <div className="flex items-start gap-1.5 sm:gap-2 md:gap-3">
            <div className="bg-green-500/10 p-1.5 sm:p-2 md:p-2.5 rounded-md sm:rounded-lg flex-shrink-0">
              <CheckCircle2
                className="text-green-600 dark:text-green-400"
                size={16}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs sm:text-sm md:text-base font-semibold text-foreground mb-1.5 sm:mb-2 md:mb-3 flex items-center gap-1 sm:gap-2">
                ✨ Kesimpulan
              </h4>
              <div className="text-xs sm:text-sm md:text-base text-foreground/90 leading-5 sm:leading-6 md:leading-7">
                <FormattedText content={review.conclusions} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex justify-end pt-1 sm:pt-2">
        <Button onClick={onNewRequest} size="lg" className="gap-2 w-full sm:w-auto text-sm sm:text-base">
          <Sparkles size={14} />
          Buat Request Baru
        </Button>
      </div>
    </div>
  );
}
