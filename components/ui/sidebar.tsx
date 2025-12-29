"use client";

import Link from "next/link";
import {
  Home,
  Globe,
  MessageCircleQuestionMark,
  BookOpen,
  Code,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

export default function Sidebar({ tabs }: { tabs: string }) {
  const [isPublicOpen, setIsPublicOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-20 left-4 z-30 p-2 rounded-lg bg-card border border-border hover:bg-tertiary/30 transition-colors"
        aria-label="Toggle Sidebar"
      >
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-20 mt-16"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed min-h-full border-r border-border max-w-xs w-full bg-card z-30 transition-transform duration-300 ease-in-out
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0`}
      >
        <div className="flex flex-col py-5 w-full">
          {/* Home */}
          <Link
            href="/"
            onClick={() => setIsMobileOpen(false)}
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
                <ChevronRight
                  size={16}
                  className="text-muted-foreground mr-3"
                />
              )}
            </button>

            {/* Children of Public */}
            {isPublicOpen && (
              <div className="flex flex-col ml-4">
                <Link
                  href="/question"
                  onClick={() => setIsMobileOpen(false)}
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
                  onClick={() => setIsMobileOpen(false)}
                  className={`ps-5 h-11 items-center flex justify-between gap-3 hover:bg-tertiary/30 transition-colors
                  ${tabs === "lautan-feedback" ? "bg-tertiary" : ""}`}
                >
                  <div className="flex gap-4 items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <BookOpen strokeWidth={2} size={18} />
                    Lautan Feedback
                  </div>
                </Link>

                <Link
                  href="/explain-your-code"
                  onClick={() => setIsMobileOpen(false)}
                  className={`ps-5 h-11 items-center flex justify-between gap-3 hover:bg-tertiary/30 transition-colors
                  ${tabs === "explain-your-code" ? "bg-tertiary" : ""}`}
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
    </>
  );
}
