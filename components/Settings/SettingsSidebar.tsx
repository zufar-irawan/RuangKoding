"use client";

import { Card, CardContent } from "@/components/ui/card";
import UserAvatar from "../ui/UserAvatar";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { LucideIcon } from "lucide-react";

export interface SettingsSection {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

interface SettingsSidebarProps {
  user: {
    profile_pic?: string | null;
    fullname?: string | null;
    email?: string | null;
  } | null;
  userId: string;
  sections: SettingsSection[];
  activeSection: string;
  onSectionClick: (sectionId: string) => void;
}

export function SettingsSidebar({
  user,
  userId,
  sections,
  activeSection,
  onSectionClick,
}: SettingsSidebarProps) {
  return (
    <aside className="w-full lg:w-64 shrink-0">
      <div className="sticky top-20 sm:top-24 space-y-2">
        {/* Profile Card in Sidebar */}
        <Card className="mb-3 sm:mb-4 border-2 shadow-lg">
          <CardContent className="p-3 sm:p-4">
            <div className="flex flex-col items-center gap-2 sm:gap-3">
              <div className="relative">
                <UserAvatar
                  profilePic={user?.profile_pic || undefined}
                  fullname={user?.fullname || "User"}
                  userId={userId || ""}
                />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full border-2 border-background"></div>
              </div>
              <div className="text-center">
                <h2 className="font-bold text-xs sm:text-sm">{user?.fullname}</h2>
                <p className="text-[10px] sm:text-xs text-muted-foreground truncate max-w-[180px] sm:max-w-[200px]">
                  {user?.email}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Menu */}
        <nav className="space-y-1">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => onSectionClick(section.id)}
                className={cn(
                  "w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-all duration-200 text-left",
                  activeSection === section.id
                    ? `${section.bgColor} ${section.color} font-medium`
                    : "hover:bg-muted text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon size={18} className="sm:w-5 sm:h-5" />
                <span className="text-xs sm:text-sm">{section.title}</span>
              </button>
            );
          })}
        </nav>

        {/* Support Link */}
        <div className="mt-4 sm:mt-6 p-2 sm:p-3 rounded-lg bg-muted/50 border border-border/50">
          <p className="text-[10px] sm:text-xs text-muted-foreground text-center">
            Butuh bantuan?{" "}
            <Link
              href="/support"
              className="text-primary hover:underline font-medium"
            >
              Hubungi Support
            </Link>
          </p>
        </div>
      </div>
    </aside>
  );
}
