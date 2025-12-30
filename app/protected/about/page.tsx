import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { GetUserProps } from "@/lib/profiles";
import ProfileHeader from "@/components/Profiles/ProfileHeader";
import ProfileTabs from "@/components/Profiles/Tabs/ProfileTabs";
import BioViewer from "@/components/Profiles/BioViewer";
import SkillsCard from "@/components/Profiles/SkillsCard";
import ExperienceCard from "@/components/Profiles/ExperienceCard";
import LinksCard from "@/components/Profiles/LinksCard";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

export default async function AboutPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  const { userLink, userProfile, userExperience, userSkills } =
    await GetUserProps(data?.claims?.sub);
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

      <ProfileTabs />

      {/*body */}
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6 md:py-8">
        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 md:space-y-8">
          <div className="flex justify-between items-center gap-2 sm:gap-4">
            <h1 className="text-xl sm:text-2xl font-bold">Tentang</h1>
            <Link href="/protected/about/edit">
              <Button size="sm" className="text-xs sm:text-sm">
                <Pencil className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Edit Bio</span>
                <span className="sm:hidden">Edit</span>
              </Button>
            </Link>
          </div>

          <BioViewer bioContent={user?.bio || null} />

          <SkillsCard skills={userSkills.data || null} />

          <ExperienceCard experiences={userExperience.data || null} />

          <LinksCard links={userLink.data || null} />
        </div>
      </div>
    </div>
  );
}
