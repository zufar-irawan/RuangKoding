import { createClient } from "@/lib/supabase/client";

export async function getClientUser() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) return null;
  return data.user;
}

export const GetUserProps = async (id: string) => {
  const supabase = createClient();

  const userProfile = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  const userLink = await supabase
    .from("user_links")
    .select("*")
    .eq("user_id", id);

  const userExperience = await supabase
    .from("user_experience")
    .select("*")
    .eq("user_id", id);

  const userSkills = await supabase
    .from("user_skills")
    .select("*")
    .eq("user_id", id);

  return { userLink, userExperience, userSkills, userProfile };
};
