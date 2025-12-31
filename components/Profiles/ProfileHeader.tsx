"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, ExternalLink, Quote } from "lucide-react";
import Link from "next/link";
import UserAvatar from "../ui/UserAvatar";

type UserLink = {
  platform: string | null;
  url: string;
  user_id: string;
  created_at: string;
};

type UserProfile = {
  profile_pic: string | null;
  fullname: string;
  email: string;
  motto: string | null;
  bio: string | null;
};

type Props = {
  user: UserProfile;
  userId: string;
  userLinks: UserLink[];
  isPublic?: boolean;
};

export default function ProfileHeader({ user, userId, userLinks, isPublic }: Props) {
  return (
    <header className="flex w-full justify-center items-center steps haikei">
      <Card className="w-full max-w-3xl rounded-none md:rounded-2xl lg:rounded-2xl">
        <CardContent className="p-4 sm:p-6 md:p-8 items-center w-full">
          <div className="flex items-start justify-between w-full gap-2 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-1 min-w-0">
              <UserAvatar
                profilePic={user?.profile_pic || undefined}
                fullname={user?.fullname || "User"}
                userId={userId}
              />

              <div className="flex flex-col gap-1 sm:gap-2 md:gap-4 min-w-0 flex-1">
                <h2 className="text-xs text-muted-foreground flex flex-col font-semibold">
                  {!isPublic && (
                    <>
                      <span className="hidden sm:inline">Selamat datang kembali, </span>
                      <span className="sm:hidden">Selamat datang,</span>
                    </>
                  )}
                  <span className="text-primary text-xl sm:text-2xl md:text-3xl font-bold break-words">
                    {user?.fullname}
                  </span>
                  <span className="text-[10px] sm:text-xs text-muted-foreground truncate">
                    {user?.email}
                  </span>
                </h2>
              </div>
            </div>

            {!isPublic && (
              <Link
                href={"/protected/edit"}
                className="rounded-full w-10 h-10 sm:w-12 sm:h-12 hover:text-primary flex justify-center items-center p-2 shrink-0"
              >
                <Edit size={20} className="w-6 h-6 sm:w-8 sm:h-8" />
              </Link>
            )}
          </div>

          <div className="flex flex-col mt-4 sm:mt-6 gap-4">
            {/* Motto Section */}
            <div className="relative overflow-hidden rounded-xl sm:rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-background to-primary/5 p-4 sm:p-6 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 right-0 w-1/2 bg-primary/10 blur-3xl"
              />
              <Quote
                className="absolute -top-2 -left-1 sm:-top-4 sm:-left-2 h-12 w-12 sm:h-16 sm:w-16 text-primary/30"
                strokeWidth={1.5}
              />
              <Quote
                className="absolute -bottom-4 right-2 sm:-bottom-6 sm:right-4 h-10 w-10 sm:h-14 sm:w-14 text-primary/20 rotate-180"
                strokeWidth={1.5}
              />
              <blockquote className="relative z-10 pl-6 sm:pl-8 md:pl-10">
                <p className="text-sm sm:text-base md:text-lg font-semibold italic leading-relaxed text-foreground/90">
                  {user?.motto ||
                    "Where imagination never ends"}
                </p>
                <footer className="mt-2 sm:mt-4 text-xs sm:text-sm font-medium text-foreground/70">
                  — {user?.fullname || "Pengguna"}
                </footer>
              </blockquote>
            </div>

            {userLinks && userLinks.length > 0 && (
              <>
                <div className="w-full border border-foreground/10" />

                <div className="flex gap-2 flex-wrap">
                  {userLinks.map((link, index) => (
                    <Link href={link.url} key={index} target="_blank">
                      <Button variant="ghost" className="flex gap-2 group text-xs sm:text-sm">
                        {link.platform}

                        <ExternalLink
                          size={16}
                          className="sm:w-6 sm:h-6 group-hover:block hidden"
                        />
                      </Button>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </header>
  );
}
