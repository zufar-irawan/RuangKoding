"use client";

import {
  Code2,
  Sparkles,
  MessageCircle,
  Lightbulb,
  CheckCircle2,
  BookOpen,
  AlertCircle,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useState, useRef, useEffect } from "react";
import Editor, { OnMount } from "@monaco-editor/react";
import * as monaco from "monaco-editor";

interface ExplanationBlock {
  endLine: number;
  summary: string;
  startLine: number;
  description: string;
}

interface Greetings {
  reason: string;
  isCorrect: boolean;
}

interface AIReviewSectionProps {
  review: {
    id: number;
    code: string;
    answer: string;
    greetings: Greetings;
    explanation: ExplanationBlock[];
    tips: string[];
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
            <li className="leading-6 md:leading-7 text-foreground pl-1">
              {children}
            </li>
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
            <td className="px-2 md:px-4 py-2 md:py-3 align-top text-xs md:text-sm">
              {children}
            </td>
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
  const [selectedBlock, setSelectedBlock] = useState<ExplanationBlock | null>(
    null,
  );
  const [activeTab, setActiveTab] = useState<"description" | "tips">(
    "description",
  );
  const [editorInstance, setEditorInstance] =
    useState<monaco.editor.IStandaloneCodeEditor | null>(null);
  const decorationsRef = useRef<string[]>([]);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    setEditorInstance(editor);

    // Add decorations for each explanation block
    if (review.explanation && review.explanation.length > 0) {
      const decorations: monaco.editor.IModelDeltaDecoration[] =
        review.explanation.map((block) => ({
          range: new monaco.Range(block.startLine, 1, block.endLine, 1),
          options: {
            isWholeLine: true,
            className: "explanation-block",
            glyphMarginClassName: "explanation-glyph",
            hoverMessage: { value: `**${block.summary}**` },
          },
        }));

      decorationsRef.current = editor.deltaDecorations([], decorations);
    }

    // Handle click on line numbers to select block
    editor.onMouseDown((e) => {
      if (e.target.position) {
        const lineNumber = e.target.position.lineNumber;
        const block = review.explanation.find(
          (b) => lineNumber >= b.startLine && lineNumber <= b.endLine,
        );
        if (block) {
          setSelectedBlock(block);
          setActiveTab("description");

          // Highlight selected block
          const newDecorations = review.explanation.map((b) => ({
            range: new monaco.Range(b.startLine, 1, b.endLine, 1),
            options: {
              isWholeLine: true,
              className:
                b === block
                  ? "explanation-block-selected"
                  : "explanation-block",
              glyphMarginClassName: "explanation-glyph",
              hoverMessage: { value: `**${b.summary}**` },
            },
          }));

          decorationsRef.current = editor.deltaDecorations(
            decorationsRef.current,
            newDecorations,
          );
        }
      }
    });
  };

  useEffect(() => {
    // Add custom CSS for decorations
    const style = document.createElement("style");
    style.innerHTML = `
      .explanation-block {
        background: rgba(59, 130, 246, 0.1);
        border-left: 3px solid rgba(59, 130, 246, 0.3);
      }
      .explanation-block-selected {
        background: rgba(59, 130, 246, 0.2);
        border-left: 3px solid rgba(59, 130, 246, 0.6);
      }
      .explanation-glyph {
        background: rgba(59, 130, 246, 0.3);
        width: 5px !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const greetingBgColor = review.greetings.isCorrect
    ? "bg-gradient-to-br from-green-50/80 to-emerald-50/50 dark:from-green-950/20 dark:to-emerald-950/10"
    : "bg-gradient-to-br from-gray-50/80 to-slate-50/50 dark:from-gray-950/20 dark:to-slate-950/10";

  const greetingIconBg = review.greetings.isCorrect
    ? "bg-gradient-to-br from-green-500/20 to-emerald-500/20"
    : "bg-gradient-to-br from-gray-500/20 to-slate-500/20";

  const greetingIconColor = review.greetings.isCorrect
    ? "text-green-600 dark:text-green-400"
    : "text-gray-600 dark:text-gray-400";

  return (
    <div className="space-y-3 sm:space-y-4 md:space-y-6 w-full">
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
              <p className="text-xs sm:text-sm md:text-base text-foreground leading-5 sm:leading-6 md:leading-7 break-words">
                {review.answer}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Response Container - ChatGPT-like */}
      <div className="bg-card border border-border rounded-md sm:rounded-lg overflow-hidden">
        {/* Greetings Section */}
        <div
          className={`p-3 sm:p-4 md:p-6 border-b border-border ${greetingBgColor}`}
        >
          <div className="flex items-start gap-1.5 sm:gap-2 md:gap-3">
            <div
              className={`${greetingIconBg} p-1.5 sm:p-2 md:p-2.5 rounded-md sm:rounded-lg flex-shrink-0`}
            >
              {review.greetings.isCorrect ? (
                <Sparkles className={greetingIconColor} size={16} />
              ) : (
                <AlertCircle className={greetingIconColor} size={16} />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm sm:text-base md:text-lg font-semibold text-foreground mb-1.5 sm:mb-2 md:mb-3 flex items-center gap-1 sm:gap-2">
                Penjelasan dari AI
              </h3>
              <div className="text-xs sm:text-sm md:text-base text-foreground/90 leading-5 sm:leading-6 md:leading-7">
                <p>{review.greetings.reason}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Explanation Section with Monaco Editor */}
        <div className="p-3 sm:p-4 md:p-6 border-b border-border">
          <div className="flex items-start gap-1.5 sm:gap-2 md:gap-3 mb-3 sm:mb-4">
            <div className="bg-emerald-500/10 p-1.5 sm:p-2 md:p-2.5 rounded-md sm:rounded-lg flex-shrink-0">
              <BookOpen
                className="text-emerald-600 dark:text-emerald-400"
                size={16}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs sm:text-sm md:text-base font-semibold text-foreground flex items-center gap-1 sm:gap-2">
                Penjelasan Detail
              </h4>
            </div>
          </div>

          {/* Monaco Editor and Description Side by Side */}
          <div className="flex flex-col lg:flex-row gap-3 sm:gap-4">
            {/* Left: Monaco Editor */}
            <div className="flex-1 min-w-0 border border-border rounded-lg overflow-hidden">
              <Editor
                height="500px"
                language={review.language || "typescript"}
                value={review.code}
                theme="vs-dark"
                onMount={handleEditorDidMount}
                options={{
                  readOnly: true,
                  minimap: { enabled: false },
                  lineNumbers: "on",
                  glyphMargin: true,
                  folding: false,
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  fontSize: 13,
                  lineDecorationsWidth: 10,
                  lineNumbersMinChars: 3,
                }}
              />
            </div>

            {/* Right: Description/Tips Panel */}
            <div className="w-full lg:w-96 border border-border rounded-lg bg-card flex flex-col">
              {/* Tabs */}
              <div className="flex border-b border-border">
                <button
                  onClick={() => setActiveTab("description")}
                  className={`flex-1 px-4 py-2.5 text-xs sm:text-sm font-medium transition-colors ${
                    activeTab === "description"
                      ? "bg-primary/10 text-primary border-b-2 border-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  Deskripsi
                </button>
                <button
                  onClick={() => setActiveTab("tips")}
                  className={`flex-1 px-4 py-2.5 text-xs sm:text-sm font-medium transition-colors ${
                    activeTab === "tips"
                      ? "bg-primary/10 text-primary border-b-2 border-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  Tips
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 p-3 sm:p-4 overflow-y-auto max-h-[500px]">
                {activeTab === "description" ? (
                  selectedBlock ? (
                    <div className="space-y-3">
                      <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground mb-1">
                          Baris {selectedBlock.startLine}-
                          {selectedBlock.endLine}
                        </p>
                        <h5 className="text-sm sm:text-base font-semibold text-foreground">
                          {selectedBlock.summary}
                        </h5>
                      </div>
                      <div className="prose prose-sm max-w-none dark:prose-invert">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            p: ({ children }) => (
                              <p className="mb-2 text-xs sm:text-sm leading-relaxed text-foreground">
                                {children}
                              </p>
                            ),
                            code: ({ children, ...props }: any) => (
                              <code
                                className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono text-foreground border border-border"
                                {...props}
                              >
                                {children}
                              </code>
                            ),
                            pre: ({ children }) => (
                              <pre className="my-2 overflow-x-auto bg-slate-950 text-slate-50 p-2 rounded text-xs font-mono [&>code]:bg-transparent [&>code]:border-0 [&>code]:p-0 [&>code]:text-inherit">
                                {children}
                              </pre>
                            ),
                            ul: ({ children }) => (
                              <ul className="list-disc list-outside ml-4 space-y-1 my-2 text-xs sm:text-sm text-foreground">
                                {children}
                              </ul>
                            ),
                            ol: ({ children }) => (
                              <ol className="list-decimal list-outside ml-4 space-y-1 my-2 text-xs sm:text-sm text-foreground">
                                {children}
                              </ol>
                            ),
                            li: ({ children }) => (
                              <li className="leading-relaxed text-foreground">
                                {children}
                              </li>
                            ),
                            strong: ({ children }) => (
                              <strong className="font-semibold text-foreground">
                                {children}
                              </strong>
                            ),
                            em: ({ children }) => (
                              <em className="italic text-foreground">
                                {children}
                              </em>
                            ),
                            blockquote: ({ children }) => (
                              <blockquote className="border-l-2 border-primary/50 pl-2 italic my-2 text-muted-foreground text-xs">
                                {children}
                              </blockquote>
                            ),
                          }}
                        >
                          {selectedBlock.description}
                        </ReactMarkdown>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                      <Code2 className="mb-3 opacity-50" size={32} />
                      <p className="text-xs sm:text-sm">
                        Klik salah satu blok kode di sebelah kiri untuk
                        menampilkan deskripsi detail.
                      </p>
                      <p className="text-xs mt-2 opacity-70">
                        💡 Hover pada kode untuk melihat ringkasan
                      </p>
                    </div>
                  )
                ) : (
                  <div className="space-y-2">
                    {review.tips && review.tips.length > 0 ? (
                      review.tips.map((tip, index) => (
                        <div
                          key={index}
                          className="bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-800/30 rounded-lg p-3"
                        >
                          <div className="flex items-start gap-2">
                            <span className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5">
                              💡
                            </span>
                            <div className="prose prose-sm max-w-none dark:prose-invert flex-1">
                              <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                  p: ({ children }) => (
                                    <p className="mb-0 text-xs sm:text-sm leading-relaxed text-foreground">
                                      {children}
                                    </p>
                                  ),
                                  code: ({ children, ...props }: any) => (
                                    <code
                                      className="bg-amber-100 dark:bg-amber-900/30 px-1.5 py-0.5 rounded text-xs font-mono text-foreground border border-amber-300/50 dark:border-amber-700/50"
                                      {...props}
                                    >
                                      {children}
                                    </code>
                                  ),
                                  pre: ({ children }) => (
                                    <pre className="my-2 overflow-x-auto bg-slate-950 text-slate-50 p-2 rounded text-xs font-mono [&>code]:bg-transparent [&>code]:border-0 [&>code]:p-0 [&>code]:text-inherit">
                                      {children}
                                    </pre>
                                  ),
                                  ul: ({ children }) => (
                                    <ul className="list-disc list-outside ml-4 space-y-1 my-2 text-xs sm:text-sm text-foreground">
                                      {children}
                                    </ul>
                                  ),
                                  ol: ({ children }) => (
                                    <ol className="list-decimal list-outside ml-4 space-y-1 my-2 text-xs sm:text-sm text-foreground">
                                      {children}
                                    </ol>
                                  ),
                                  li: ({ children }) => (
                                    <li className="leading-relaxed text-foreground">
                                      {children}
                                    </li>
                                  ),
                                  strong: ({ children }) => (
                                    <strong className="font-semibold text-foreground">
                                      {children}
                                    </strong>
                                  ),
                                  em: ({ children }) => (
                                    <em className="italic text-foreground">
                                      {children}
                                    </em>
                                  ),
                                }}
                              >
                                {tip}
                              </ReactMarkdown>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs sm:text-sm text-muted-foreground text-center py-8">
                        Tidak ada tips tersedia.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex justify-end pt-1 sm:pt-2">
        <Button
          onClick={onNewRequest}
          size="lg"
          className="gap-2 w-full sm:w-auto text-sm sm:text-base"
        >
          <Sparkles size={14} />
          Buat Request Baru
        </Button>
      </div>
    </div>
  );
}
