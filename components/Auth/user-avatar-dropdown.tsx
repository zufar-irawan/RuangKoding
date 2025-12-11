"use client";

import Image from "next/image";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings, LogOut, User } from "lucide-react";
import { LogoutButton } from "./logout-button";

type Props = {
  profilePic?: string | null;
  userInitial: string;
};

export function UserAvatarDropdown({ profilePic, userInitial }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="focus:outline-none focus:ring-2 focus:ring-primary rounded-full">
          {profilePic ? (
            <Image
              src={profilePic}
              alt="User Avatar"
              width={40}
              height={40}
              className="rounded-full w-10 h-10 object-cover hover:opacity-80 transition-opacity"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/80 border-2 border-secondary text-base font-semibold text-secondary-foreground hover:bg-secondary transition-colors">
              {userInitial}
            </div>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem asChild>
          <Link
            href="/protected"
            className="flex items-center gap-2 cursor-pointer"
          >
            <User size={16} />
            <span>Profil Kamu</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link
            href="/protected/settings"
            className="flex items-center gap-2 cursor-pointer"
          >
            <Settings size={16} />
            <span>Setelan</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <div className="flex items-center gap-2 cursor-pointer bg-destructive">
            <LogOut size={16} />
            <LogoutButton variant="text" />
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
