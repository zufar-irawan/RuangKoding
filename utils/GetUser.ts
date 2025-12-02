import { createClient } from "@/lib/supabase/server";

type UserClaims = {
  sub: string;
  email?: string;
  [key: string]: unknown;
} | null;

export async function getUser(): Promise<UserClaims> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    return null;
  }

  return data.claims as UserClaims;
}
