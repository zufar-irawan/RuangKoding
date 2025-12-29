"use client";

import * as React from "react";
import { Search, Loader2, MessageSquare, FileText, X } from "lucide-react";
import { Input } from "./input";
import { Button } from "./button";
import Link from "next/link";
import { searchQuestions } from "@/lib/questions";
import { searchFeedbackRequests } from "@/lib/servers/FeedbackRequestAction";

interface QuestionResult {
  id: number;
  title: string;
  slug: string | null;
  excerpt?: string | null;
}

interface FeedbackResult {
  id: number;
  title: string;
  profiles?: {
    fullname: string;
  } | null;
}

interface SearchBarProps {
  isMobile?: boolean;
  onClose?: () => void;
}

export default function SearchBar({
  isMobile = false,
  onClose,
}: SearchBarProps) {
  const [query, setQuery] = React.useState("");
  const [debouncedQuery, setDebouncedQuery] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const [results, setResults] = React.useState<{
    questions: QuestionResult[];
    feedback: FeedbackResult[];
  }>({ questions: [], feedback: [] });

  const containerRef = React.useRef<HTMLDivElement>(null);

  // Handle click outside to close dropdown
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Debounce logic
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  // Fetch logic
  React.useEffect(() => {
    const fetchResults = async () => {
      if (!debouncedQuery.trim()) {
        setResults({ questions: [], feedback: [] });
        setIsLoading(false);
        return;
      }

      try {
        const [questionsRes, feedbackRes] = await Promise.all([
          searchQuestions(debouncedQuery, 2),
          searchFeedbackRequests(debouncedQuery, 2),
        ]);

        setResults({
          questions: questionsRes.data || [],
          feedback: feedbackRes.data || [],
        });
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (debouncedQuery.trim()) {
      fetchResults();
    } else {
      setIsLoading(false);
    }
  }, [debouncedQuery]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    if (e.target.value.trim()) {
      setIsLoading(true);
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  const handleClear = () => {
    setQuery("");
    setDebouncedQuery("");
    setResults({ questions: [], feedback: [] });
    setIsOpen(false);
  };

  const handleLinkClick = () => {
    setIsOpen(false);
    if (isMobile && onClose) {
      onClose();
    }
  };

  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^\w ]+/g, "")
      .replace(/ +/g, "-");
  };

  const hasResults =
    results.questions.length > 0 || results.feedback.length > 0;

  return (
    <div
      ref={containerRef}
      className={`flex flex-1 w-full items-center gap-2 relative ${
        isMobile ? "px-0" : "px-2 sm:px-5"
      }`}
    >
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => {
            if (query.trim()) setIsOpen(true);
          }}
          className="flex-1 bg-background pl-10 pr-10"
          placeholder="Cari pertanyaan atau feedback..."
          autoFocus={isMobile}
        />

        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {!isMobile && (
        <Button size="icon" className="shrink-0 hidden sm:flex">
          <Search className="h-4 w-4" />
        </Button>
      )}

      {/* Dropdown Results */}
      {isOpen && (
        <div
          className={`absolute top-full mt-2 bg-card border border-border rounded-lg shadow-xl overflow-hidden ${
            isMobile
              ? "left-0 right-0 z-50"
              : "left-2 right-2 sm:left-5 sm:right-5 z-50"
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center p-8 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span>Mencari...</span>
            </div>
          ) : !hasResults ? (
            <div className="p-4 sm:p-8 text-center text-muted-foreground text-sm">
              <p>Tidak ada hasil ditemukan untuk &quot;{query}&quot;</p>
            </div>
          ) : (
            <div
              className={`overflow-y-auto ${
                isMobile
                  ? "max-h-[calc(100vh-200px)]"
                  : "max-h-[60vh] sm:max-h-[70vh] lg:max-h-[80vh]"
              }`}
            >
              {/* Questions Section */}
              {results.questions.length > 0 && (
                <div className="border-b border-border last:border-0">
                  <Link
                    href={`/question?search=${encodeURIComponent(query)}`}
                    className="flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 bg-muted/30 hover:bg-muted/50 transition-colors"
                    onClick={handleLinkClick}
                  >
                    <div className="flex items-center gap-2 font-semibold text-sm">
                      <MessageSquare className="h-4 w-4" />
                      Pertanyaan
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Lihat semua
                    </span>
                  </Link>
                  <div className="divide-y divide-border">
                    {results.questions.map((q) => (
                      <Link
                        key={q.id}
                        href={`/question/${q.slug || "question"}-${q.id}`}
                        className="block px-3 sm:px-4 py-2.5 sm:py-3 hover:bg-accent/5 transition-colors"
                        onClick={handleLinkClick}
                      >
                        <p className="text-sm font-medium line-clamp-1">
                          {q.title}
                        </p>
                        {q.excerpt && (
                          <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                            {q.excerpt}
                          </p>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Feedback Section */}
              {results.feedback.length > 0 && (
                <div className="border-b border-border last:border-0">
                  <Link
                    href={`/lautan-feedback?search=${encodeURIComponent(query)}`}
                    className="flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 bg-muted/30 hover:bg-muted/50 transition-colors"
                    onClick={handleLinkClick}
                  >
                    <div className="flex items-center gap-2 font-semibold text-sm">
                      <FileText className="h-4 w-4" />
                      Lautan Feedback
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Lihat semua
                    </span>
                  </Link>
                  <div className="divide-y divide-border">
                    {results.feedback.map((f) => (
                      <Link
                        key={f.id}
                        href={`/lautan-feedback/${slugify(f.title)}-${f.id}`}
                        className="block px-3 sm:px-4 py-2.5 sm:py-3 hover:bg-accent/5 transition-colors"
                        onClick={handleLinkClick}
                      >
                        <p className="text-sm font-medium line-clamp-1">
                          {f.title}
                        </p>
                        {f.profiles?.fullname && (
                          <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                            by {f.profiles.fullname}
                          </p>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
