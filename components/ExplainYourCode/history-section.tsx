"use client";

import { History, Code2, Calendar, ChevronRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

interface HistoryItem {
  id: number;
  code: string;
  language: string;
  created_at: string;
}

interface HistorySectionProps {
  history: HistoryItem[];
  onSelectHistory: (historyId: number) => void;
}

export default function HistorySection({
  history,
  onSelectHistory,
}: HistorySectionProps) {
  if (history.length === 0) {
    return (
      <div className="bg-card border border-border rounded-md sm:rounded-lg p-4 sm:p-6 md:p-8">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="bg-muted rounded-full p-2.5 sm:p-3 md:p-4 mb-2.5 sm:mb-3 md:mb-4">
            <History className="text-muted-foreground" size={24} />
          </div>
          <h3 className="text-sm sm:text-base md:text-lg font-semibold text-foreground mb-1.5 sm:mb-2">
            Belum Ada History
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-md px-3 sm:px-4">
            History request explain your code akan muncul di sini setelah Anda
            membuat request pertama.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-md sm:rounded-lg overflow-hidden">
      <div className="bg-muted/50 border-b border-border p-3 sm:p-4 md:p-6">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <History className="text-primary flex-shrink-0" size={16} />
          <h3 className="text-sm sm:text-base md:text-lg font-semibold text-foreground">
            History Request
          </h3>
          <span className="ml-auto text-xs sm:text-sm text-muted-foreground">
            {history.length} request
          </span>
        </div>
      </div>

      <div className="divide-y divide-border">
        {history.map((item) => {
          const codePreview =
            item.code.length > 80
              ? item.code.substring(0, 80) + "..."
              : item.code;

          return (
            <div
              key={item.id}
              className="p-2.5 sm:p-3 md:p-4 hover:bg-accent/50 transition-colors cursor-pointer group"
              onClick={() => onSelectHistory(item.id)}
            >
              <div className="flex items-start gap-1.5 sm:gap-2 md:gap-4">
                <div className="bg-primary/10 p-1 sm:p-1.5 md:p-2 rounded-md sm:rounded-lg flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                  <Code2 className="text-primary" size={14} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-1 md:gap-2 mb-1.5 sm:mb-2">
                    <span className="inline-flex items-center px-1.5 sm:px-2 md:px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-medium bg-accent text-accent-foreground w-fit">
                      {item.language}
                    </span>
                    <div className="flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-xs text-muted-foreground">
                      <Calendar size={10} />
                      <span>
                        {formatDistanceToNow(new Date(item.created_at), {
                          addSuffix: true,
                          locale: id,
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="bg-slate-900 rounded-md sm:rounded-lg p-1.5 sm:p-2 md:p-3 overflow-hidden border border-slate-800">
                    <pre className="text-[10px] sm:text-xs text-slate-100 overflow-hidden whitespace-pre-wrap break-words">
                      <code>{codePreview}</code>
                    </pre>
                  </div>
                </div>

                <ChevronRight
                  className="text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all flex-shrink-0 hidden sm:block"
                  size={18}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
