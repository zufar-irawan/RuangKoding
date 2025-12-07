"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type Props = {
  variant?: "default" | "text";
};

export function LogoutButton({ variant = "default" }: Props) {
  const router = useRouter();

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  if (variant === "text") {
    return (
      <span onClick={logout} className="w-full">
        Logout
      </span>
    );
  }

  return <Button onClick={logout}>Logout</Button>;
}
