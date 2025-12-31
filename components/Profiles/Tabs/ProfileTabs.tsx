"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function ProfileTabs() {
  const pathname = usePathname();

  const tabs = [
    {
      name: "Dashboard",
      href: "/protected",
      active: pathname === "/protected",
    },
    {
      name: "Tentang Kamu",
      href: "/protected/about",
      active: pathname === "/protected/about",
    },
    {
      name: "Pertanyaan Kamu",
      href: "/protected/questions",
      active: pathname === "/protected/questions",
    },
    {
      name: "Feedback Kamu",
      href: "/protected/feedback",
      active: pathname === "/protected/feedback",
    },
    {
      name: "Tersimpan",
      href: "/protected/saved",
      active: pathname === "/protected/saved",
    },
  ];

  return (
    <div className="w-full border-b">
      <div className="container mx-auto px-2 sm:px-4">
        <nav className="max-w-4xl mx-auto flex gap-2 sm:gap-4 md:gap-8 overflow-x-auto scrollbar-hide" aria-label="Profile tabs">
          {tabs.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "py-3 sm:py-4 px-1 sm:px-2 border-b-2 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap shrink-0",
                tab.active
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground",
              )}
            >
              {tab.name}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
