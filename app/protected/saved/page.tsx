import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { GetUserProps } from "@/lib/profiles";
import ProfileHeader from "@/components/Profiles/ProfileHeader";
import ProfileTabs from "@/components/Profiles/Tabs/ProfileTabs";

export default async function SavedPage() {
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

      {/*body - Saved*/}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="bg-card border rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Tersimpan</h2>
            <p className="text-muted-foreground">
              Konten yang kamu simpan akan muncul di sini.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
