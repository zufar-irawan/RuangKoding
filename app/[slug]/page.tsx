import { GetUserPropsByDummyId } from "@/lib/profiles";
import ProfileHeader from "@/components/Profiles/ProfileHeader";
import SkillsCard from "@/components/Profiles/SkillsCard";
import ExperienceCard from "@/components/Profiles/ExperienceCard";
import LinksCard from "@/components/Profiles/LinksCard";
import BioViewer from "@/components/Profiles/BioViewer";
import { parseSlug } from "@/lib/utils";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function PublicProfilePage({ params }: Props) {
  const { slug } = await params;
  const { id } = parseSlug(slug);

  console.log(id)

  if (!id) {
    return notFound();
  }

  const { userLink, userProfile, userExperience, userSkills } =
    await GetUserPropsByDummyId(id);
  const user = userProfile.data;

  if (!user) {
    return notFound();
  }

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
        userId={user.id}
        userLinks={userLink.data || []}
        isPublic={true}
      />

      {/*body */}
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6 md:py-8">
        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 md:space-y-8">


          {/* Level Display (Text Only) */}
          <div className="flex items-center gap-2 px-1">
            <span className="text-lg font-medium">Level {user?.level || 1}</span>
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
