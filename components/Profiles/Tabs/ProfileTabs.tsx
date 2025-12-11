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
      name: "Tersimpan",
      href: "/protected/saved",
      active: pathname === "/protected/saved",
    },
  ];

  return (
    <div className="w-full border-b">
      <div className="container mx-auto px-4">
        <nav className="max-w-4xl mx-auto flex gap-8" aria-label="Profile tabs">
          {tabs.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "py-4 px-1 border-b-2 font-medium text-sm transition-colors",
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
