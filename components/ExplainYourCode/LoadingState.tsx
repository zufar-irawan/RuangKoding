"use client";

import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  message?: string;
}

export default function LoadingState({
  message = "Memproses request Anda...",
}: LoadingStateProps) {
  return (
    <div className="p-8">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="relative">
          <Loader2 className="animate-spin text-primary" size={48} />
          <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold text-foreground">{message}</h3>
          <p className="text-sm text-muted-foreground">
            AI sedang menganalisis kode Anda, mohon tunggu sebentar...
          </p>
        </div>
        <div className="flex gap-2 mt-4">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
        </div>
      </div>
    </div>
  );
}
