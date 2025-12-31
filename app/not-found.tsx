"use client";

import Link from "next/link";
import { MoveLeft, FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
    return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-background px-4 text-center">
            {/* Background Decor */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute left-1/2 top-1/2 -ml-[40rem] -mt-[30rem] h-[50rem] w-[50rem] rounded-full bg-primary/5 blur-[100px] animate-pulse" />
                <div className="absolute right-1/2 bottom-1/2 -mr-[40rem] -mb-[30rem] h-[50rem] w-[50rem] rounded-full bg-secondary/5 blur-[100px] animate-pulse delay-700" />
            </div>

            <div className="animate-in fade-in zoom-in duration-500 hover:scale-105 transition-transform">
                <div className="relative mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-muted/50 p-8 mb-8 backdrop-blur-sm border border-border shadow-xl">
                    <FileQuestion className="h-16 w-16 text-primary animate-float" />
                    <div className="absolute inset-0 rounded-full ring-1 ring-white/20" />
                </div>
            </div>

            <h1 className="mb-4 text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary animate-in slide-in-from-bottom-4 duration-700">
                404
            </h1>

            <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl animate-in slide-in-from-bottom-5 duration-700 delay-150">
                Page Not Found
            </h2>

            <p className="max-w-[600px] text-muted-foreground mb-8 text-lg animate-in slide-in-from-bottom-6 duration-700 delay-200">
                Oops! We couldn't find the page you were looking for. It might have been moved, deleted, or you may have mistyped the address.
            </p>

            <div className="flex gap-4 animate-in slide-in-from-bottom-7 duration-700 delay-300">
                <Button asChild size="lg" className="gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
                    <Link href="/">
                        <MoveLeft className="h-4 w-4" />
                        Back to Home
                    </Link>
                </Button>
            </div>
        </div>
    );
}
