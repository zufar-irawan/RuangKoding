import Link from "next/link";
import Image from "next/image";
import { AuthButton } from "@/components/Auth/auth-button";
import SearchBar from "./searchbar";
import { createClient } from "@/lib/supabase/server";
import LevelBar from "@/components/Profiles/LevelBar";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function Navbar() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  let userLevel = 1;
  let userXP = 0;

  if (user) {
    const { data: userProfile } = await supabase
      .from("profiles")
      .select("level, xp")
      .eq("id", user.sub)
      .single();

    if (userProfile) {
      userLevel = userProfile.level || 1;
      userXP = userProfile.xp || 0;
    }
  }

  return (
    <nav className="fixed top-0 left-0 w-full flex justify-center border-b border-border h-16 bg-card z-40">
      <div className="flex w-full justify-between items-center py-3 px-10 text-sm">
        <div className="flex gap-5 font-semibold">
          <Link href={"/"}>
            <Image
              src="/logo.png"
              alt="Ruang Koding Logo"
              width={170}
              height={150}
            />
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center max-w-2xl">
          <SearchBar />
        </div>

        <div className="flex items-center gap-4">
          {user && (
            <>
              <div className="w-48 hidden lg:block">
                <LevelBar level={userLevel} xp={userXP} />
              </div>

              <Button variant="ghost" size="icon" className="relative">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
              </Button>
            </>
          )}

          <AuthButton />
        </div>
      </div>
    </nav>
  );
}
