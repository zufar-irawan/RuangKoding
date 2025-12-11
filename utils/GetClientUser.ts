import { createClient } from "@/lib/supabase/client";

export async function getClientUser() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) return null;
  return data.user;
}
