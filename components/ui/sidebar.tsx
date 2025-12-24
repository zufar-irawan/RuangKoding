"use client";

import Link from "next/link";
import {
  Home,
  Globe,
  MessageCircleQuestionMark,
  BookOpen,
  Code,
} from "lucide-react";
import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

export default function Sidebar({ tabs }: { tabs: string }) {
  const [isPublicOpen, setIsPublicOpen] = useState(true);

  return (
    <aside className="fixed min-h-full border-r border-border max-w-xs w-full bg-card">
      <div className="flex flex-col py-5 w-full">
        {/* Home */}
        <Link
          href="/"
          className={`ps-5 h-12 items-center
            flex justify-between gap-3 hover:bg-tertiary/30 transition-colors
            ${tabs === "home" ? "bg-tertiary" : ""}`}
        >
          <div className="flex gap-4 items-center font-medium text-foreground">
            <Home strokeWidth={2} className="text-primary" size={20} />
            Home
          </div>
        </Link>

        {/* Public */}
        <div className="flex flex-col">
          <button
            onClick={() => setIsPublicOpen(!isPublicOpen)}
            className="ps-5 h-12 items-center flex justify-between gap-3 hover:bg-tertiary/30 transition-colors w-full"
          >
            <div className="flex gap-4 items-center font-medium text-foreground">
              <Globe strokeWidth={2} className="text-primary" size={20} />
              Public
            </div>
            {isPublicOpen ? (
              <ChevronDown size={16} className="text-muted-foreground mr-3" />
            ) : (
              <ChevronRight size={16} className="text-muted-foreground mr-3" />
            )}
          </button>

          {/* Children of Public */}
          {isPublicOpen && (
            <div className="flex flex-col ml-4">
              <Link
                href="/question"
                className={`ps-5 h-11 items-center flex justify-between
                  gap-3 hover:bg-tertiary/30 transition-colors
                  ${tabs === "questions" ? "bg-tertiary" : ""}`}
              >
                <div className="flex gap-4 items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <MessageCircleQuestionMark strokeWidth={2} size={18} />
                  Pertanyaan
                </div>
              </Link>

              <Link
                href="/lautan-feedback"
                className={`ps-5 h-11 items-center flex justify-between gap-3 hover:bg-tertiary/30 transition-colors
                  ${tabs === "lautan-feedback" ? "bg-tertiary" : ""}`}
              >
                <div className="flex gap-4 items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <BookOpen strokeWidth={2} size={18} />
                  Lautan Feedback
                </div>
              </Link>

              <Link
                href="/blogs"
                className={`ps-5 h-11 items-center flex justify-between gap-3 hover:bg-tertiary/30 transition-colors
                  ${tabs === "blogs" ? "bg-tertiary" : ""}`}
              >
                <div className="flex gap-4 items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <Code strokeWidth={2} size={18} />
                  Explain your code
                </div>
              </Link>
            </div>
          )}
        </div>

        {/* Code Review */}
        {/*<Link
          href="/code-review"
          className="ps-5 rounded-e-xl h-12 items-center flex justify-between gap-3 hover:bg-tertiary/30 transition-colors"
        >
          <div className="flex gap-4 items-center font-medium text-foreground">
            <Code strokeWidth={2} className="text-primary" size={20} />
            Code Review
          </div>
        </Link>*/}
      </div>
    </aside>
  );
}
