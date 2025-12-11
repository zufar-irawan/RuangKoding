import Link from "next/link";
import { Home, MessageCircleQuestionMark } from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="fixed min-h-full border-r border-foreground/10 max-w-xs w-full bg-card">
      <div className="flex flex-col py-5 w-full">
        <Link
          href="/"
          className="ps-5 rounded-e-xl h-14 bg-tertiary/50 items-center flex justify-between gap-3 hover:bg-tertiary transition-colors"
        >
          <div className="flex gap-4 items-center font-medium">
            <Home strokeWidth={2} className="text-primary" size={24} />
            Home
          </div>

          <div className="h-full text-primary w-2 rounded-xl bg-primary" />
        </Link>

        <Link
          href="/question"
          className="ps-5 rounded-e-xl h-12 items-center flex justify-between gap-3 hover:bg-tertiary/30 transition-colors"
        >
          <div className="flex gap-4 items-center font-medium">
            <MessageCircleQuestionMark
              strokeWidth={2}
              className="text-secondary"
              size={24}
            />
            Pertanyaan
          </div>
        </Link>
      </div>
    </aside>
  );
}
