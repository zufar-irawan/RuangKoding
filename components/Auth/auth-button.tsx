import Link from "next/link";
import Image from "next/image";
import { Button } from "../ui/button";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "../Auth/logout-button";

export async function AuthButton() {
  const supabase = await createClient();

  // You can also use getUser() which will be slower.
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

  const getInitial = (value?: string | null) =>
    value?.trim()?.charAt(0)?.toUpperCase();

  const userProfileInitial =
    getInitial(user.firstname) ||
    getInitial(user.fullname) ||
    getInitial(user.email) ||
    "?";

  return (
    <div className="flex items-center gap-4">
      <Link href="/protected">
        {user.profile_pic ? (

          <Image
            src={user.profile_pic}
            alt="User Avatar"
            width={32}
            height={32}
            className="rounded-full"
          />

        ) : (
          <p className="flex h-10 w-10 items-center justify-center rounded-full bg-background border text-base font-semibold text-secondary-foreground">
            {userProfileInitial}
          </p>
        )}
      </Link>

      <LogoutButton />
    </div>
  );
}
