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
};

export default function ProfileHeader({ user, userId, userLinks }: Props) {
  return (
    <header className="flex w-full justify-center items-center steps haikei">
      <Card className="w-full max-w-3xl">
        <CardContent className="p-8 items-center w-full">
          <div className="flex items-start justify-between w-full">
            <div className="flex items-center gap-4">
              <UserAvatar
                profilePic={user?.profile_pic || undefined}
                fullname={user?.fullname || "User"}
                userId={userId}
              />

              <div className="flex flex-col gap-4">
                <h2 className="text-xs text-muted-foreground flex flex-col font-semibold">
                  Selamat datang kembali,{" "}
                  <span className="text-primary text-3xl font-bold">
                    {user?.fullname}
                  </span>
                  {user?.email}
                </h2>
              </div>
            </div>

            <Link
              href={"/protected/edit"}
              className="rounded-full w-12 h-12 hover:text-primary flex justify-center items-center p-2"
            >
              <Edit size={24} className="w-8 h-8" />
            </Link>
          </div>

          <div className="flex flex-col mt-6 gap-4">
            {/* Motto Section */}
            <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-background to-primary/5 p-6 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 right-0 w-1/2 bg-primary/10 blur-3xl"
              />
              <Quote
                className="absolute -top-4 -left-2 h-16 w-16 text-primary/30"
                strokeWidth={1.5}
              />
              <Quote
                className="absolute -bottom-6 right-4 h-14 w-14 text-primary/20 rotate-180"
                strokeWidth={1.5}
              />
              <blockquote className="relative z-10 pl-10">
                <p className="text-lg font-semibold italic leading-relaxed text-foreground/90">
                  {user?.motto ||
                    (user?.bio && user.bio.length > 100
                      ? user.bio.substring(0, 100) + "..."
                      : user?.bio) ||
                    "Where imagination never ends"}
                </p>
                <footer className="mt-4 text-sm font-medium text-foreground/70">
                  — {user?.fullname || "Pengguna"}
                </footer>
              </blockquote>
            </div>

            {userLinks && userLinks.length > 0 && (
              <>
                <div className="w-full border border-foreground/10" />

                <div className="flex gap-2">
                  {userLinks.map((link, index) => (
                    <Link href={link.url} key={index} target="_blank">
                      <Button variant="ghost" className="flex gap-2 group">
                        {link.platform}

                        <ExternalLink
                          size={24}
                          className="group-hover:block hidden"
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
