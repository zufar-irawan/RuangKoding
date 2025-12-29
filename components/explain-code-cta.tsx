"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, Code, Brain, ArrowRight } from "lucide-react";

export default function ExplainCodeCTA() {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-between gap-8 py-12 border-y border-border">
      {/* Left side - Text content */}
      <div className="flex-1 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" />
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">
            Fitur AI Terbaru
          </span>
        </div>

        <h2 className="text-4xl font-bold text-foreground leading-tight">
          Bingung sama kode kamu sendiri?
        </h2>

        <p className="text-lg text-muted-foreground max-w-2xl">
          Gunakan fitur{" "}
          <span className="font-semibold text-foreground">
            Explain Your Code
          </span>{" "}
          untuk mendapatkan penjelasan detail tentang kode kamu. AI kami akan
          menganalisis dan memberikan review lengkap, tips optimasi, dan
          menjawab pertanyaan seputar kode kamu.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mt-2">
          <div className="flex items-center gap-2 text-sm">
            <Brain className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">
              Analisis mendalam dengan AI
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Code className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">
              Support banyak bahasa pemrograman
            </span>
          </div>
        </div>

        <Link href="/explain-your-code" className="mt-4">
          <Button size="lg" className="group">
            Coba Sekarang
            <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </div>

      {/* Right side - Visual element */}
      <div className="flex-shrink-0 relative">
        <div className="relative w-64 h-64 flex items-center justify-center">
          {/* Animated background circles */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-48 h-48 rounded-full bg-primary/5 animate-pulse" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full bg-primary/10 animate-pulse delay-75" />
          </div>

          {/* Center icon */}
          <div className="relative z-10 w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
            <Code
              className="w-12 h-12 text-primary-foreground"
              strokeWidth={2}
            />
          </div>

          {/* Floating icons */}
          <div className="absolute top-8 left-8 w-12 h-12 rounded-lg bg-background border border-border shadow-md flex items-center justify-center animate-float">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <div className="absolute bottom-8 right-8 w-12 h-12 rounded-lg bg-background border border-border shadow-md flex items-center justify-center animate-float delay-150">
            <Brain className="w-6 h-6 text-primary" />
          </div>
        </div>
      </div>
    </div>
  );
}
