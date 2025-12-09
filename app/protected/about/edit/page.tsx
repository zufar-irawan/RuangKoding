import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { GetUserProps } from "@/lib/profiles";
import ProfileHeader from "@/components/Profiles/ProfileHeader";
import ProfileTabs from "@/components/Profiles/Tabs/ProfileTabs";
import AboutEditor from "@/components/Profiles/AboutEditor";

export default async function EditAboutPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  const { userLink, userProfile } = await GetUserProps(data?.claims?.sub);
  const user = userProfile.data;

  return (
    <div className="flex flex-col mt-16">
      {/*header*/}
      <ProfileHeader
        user={{
          profile_pic: user?.profile_pic || null,
          fullname: user?.fullname || "User",
          email: user?.email || "",
          motto: user?.motto || null,
          bio: user?.bio || null,
        }}
        userId={data?.claims?.sub || ""}
        userLinks={userLink.data || []}
      />

      {/*tabs*/}
      <ProfileTabs />

      {/*body - About Editor*/}
      <AboutEditor
        userId={data?.claims?.sub || ""}
        initialBio={user?.bio || null}
      />
    </div>
  );
}
