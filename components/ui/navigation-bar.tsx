import Link from "next/link";
import Image from "next/image";
import { AuthButton } from "@/components/Auth/auth-button";
import SearchBar from "./searchbar";
import { createClient } from "@/lib/supabase/server";
import LevelBar from "@/components/Profiles/LevelBar";
import { NotificationDropdown } from "@/components/ui/notification-dropdown";
import { DailyChallengeButton } from "@/components/ui/daily-challenge-button";
import { getDailyChallengeStatus } from "@/lib/daily-challenge";
import { NavbarClientWrapper } from "./navbar-client-wrapper";

export default async function Navbar() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  let userLevel = 1;
  let userXP = 0;
  let dailyChallengeStatus = null;

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

    // Get daily challenge status
    dailyChallengeStatus = await getDailyChallengeStatus();
  }

  return (
    <nav className="fixed top-0 left-0 w-full flex justify-center border-b border-border h-16 bg-card z-40 shadow-sm">
      <div className="flex w-full items-center py-3 px-4 md:px-10 text-sm gap-2 md:gap-4">
        <div className="flex gap-5 font-semibold shrink-0">
          <Link href={"/"}>
            <Image
              src="/logo.png"
              alt="Ruang Koding Logo"
              width={170}
              height={150}
              className="w-32 md:w-[170px]"
            />
          </Link>
        </div>

        <NavbarClientWrapper searchBar={<SearchBar />}>
          {user && (
            <>
              <div className="w-48 hidden xl:block">
                <LevelBar level={userLevel} xp={userXP} />
              </div>

              {dailyChallengeStatus && (
                <DailyChallengeButton
                  hasCompletedToday={dailyChallengeStatus.hasCompletedToday}
                  streak={dailyChallengeStatus.streak}
                />
              )}

              <NotificationDropdown />
            </>
          )}

          <AuthButton />
        </NavbarClientWrapper>
      </div>
    </nav>
  );
}
