import { Button } from "../ui/button";
import { createClient } from "@/lib/supabase/server";
import { UserAvatarDropdown } from "./user-avatar-dropdown";
import Link from "next/link";

export async function AuthButton() {
  const supabase = await createClient();

  const { data } = await supabase.auth.getClaims();

  const user = data?.claims;

  if (!user) {
    return (
      <div className="flex gap-2">
        <Button asChild size="lg" variant={"outline"}>
          <Link href="/auth/login">Sign in</Link>
        </Button>

        <Button asChild size="lg" variant={"default"}>
          <Link href="/auth/sign-up">Sign up</Link>
        </Button>
      </div>
    );
  }

  const { data: userProfile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.sub)
    .single();

  const getInitial = (value?: string | null) =>
    value?.trim()?.charAt(0)?.toUpperCase();

  const userProfileInitial =
    getInitial(userProfile?.firstname) ||
    getInitial(userProfile?.fullname) ||
    getInitial(user.email) ||
    "?";

  return (
    <UserAvatarDropdown
      profilePic={user.profile_pic}
      userInitial={userProfileInitial}
    />
  );
}
