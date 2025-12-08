"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, ExternalLink } from "lucide-react";
import Link from "next/link";
import UserAvatar from "@/components/UserAvatar";

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

          <div className="flex flex-col mt-4 gap-2">
            <p className="text-md text-accent-foreground">
              {user?.motto ||
                (user?.bio && user.bio.length > 100
                  ? user.bio.substring(0, 100) + "..."
                  : user?.bio) ||
                "Halo! Aku programmer junior disini. Salam kenal yah puh."}
            </p>

            {userLinks && userLinks.length > 0 && (
              <>
                <div className="w-full border border-foreground/10 my-2" />

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
