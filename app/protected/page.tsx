import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Edit, ExternalLink } from "lucide-react";
import Link from "next/link";
import { GetUserProps } from "@/utils/GetClientUser";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  const { userLink, userProfile } = await GetUserProps(data?.claims?.sub);
  const user = userProfile.data;

  return (
    <div className="flex flex-col mt-16">
      <header className="flex w-full justify-center items-center steps haikei">
        <Card className="w-full max-w-3xl">
          <CardContent className="p-8 items-center w-full">
            <div className="flex items-start justify-between w-full">
              <div className="flex items-center gap-4">
                {user?.profile_pic ? (
                  <Image
                    src={user.profile_pic}
                    alt="Your Profile Picture"
                    width={100}
                    height={100}
                    className="rounded-full"
                  />
                ) : (
                  <p className="flex h-24 w-24 items-center justify-center rounded-full bg-secondary/80 text-4xl font-semibold text-secondary-foreground">
                    {user?.fullname.charAt(0).toUpperCase()}
                  </p>
                )}

                <div className="flex flex-col gap-4">
                  <h2 className="text-xs text-muted-foreground flex flex-col font-semibold">
                    Selamat datange kembali,{" "}
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

              {userLink.data && userLink.data?.length > 0 && (
                <>
                  <div className="w-full border border-foreground/10 my-2" />

                  <div className="flex gap-2">
                    {userLink.data?.map((link, index) => (
                      <Link href={link.url} key={index}>
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
    </div>
  );
}
