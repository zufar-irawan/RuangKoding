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
      <div className="bg-card border border-border rounded-lg p-8">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="bg-muted rounded-full p-4 mb-4">
            <History className="text-muted-foreground" size={32} />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Belum Ada History
          </h3>
          <p className="text-sm text-muted-foreground max-w-md">
            History request explain your code akan muncul di sini setelah Anda
            membuat request pertama.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="bg-muted/50 border-b border-border p-6">
        <div className="flex items-center gap-2">
          <History className="text-primary" size={20} />
          <h3 className="text-lg font-semibold text-foreground">
            History Request
          </h3>
          <span className="ml-auto text-sm text-muted-foreground">
            {history.length} request
          </span>
        </div>
      </div>

      <div className="divide-y divide-border">
        {history.map((item) => {
          const codePreview =
            item.code.length > 100
              ? item.code.substring(0, 100) + "..."
              : item.code;

          return (
            <div
              key={item.id}
              className="p-4 hover:bg-accent/50 transition-colors cursor-pointer group"
              onClick={() => onSelectHistory(item.id)}
            >
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-2 rounded-lg flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                  <Code2 className="text-primary" size={20} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent text-accent-foreground">
                      {item.language}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar size={12} />
                      <span>
                        {formatDistanceToNow(new Date(item.created_at), {
                          addSuffix: true,
                          locale: id,
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="bg-slate-900 rounded-lg p-3 overflow-hidden">
                    <pre className="text-xs text-slate-100 overflow-hidden">
                      <code>{codePreview}</code>
                    </pre>
                  </div>
                </div>

                <ChevronRight
                  className="text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all flex-shrink-0"
                  size={20}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
