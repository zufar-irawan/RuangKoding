import { redirect } from "next/navigation";
import { GetUserProps } from "@/lib/profiles";
import { getSavedQuestions } from "@/lib/questions";
import ProfileHeader from "@/components/Profiles/ProfileHeader";
import ProfileTabs from "@/components/Profiles/Tabs/ProfileTabs";
import SavedQuestionsList from "@/components/Profiles/SavedQuestionsList";
import { Bookmark } from "lucide-react";
import { getUser } from "@/utils/GetUser";

export default async function SavedPage() {
  const user = await getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { userProfile, userLink } = await GetUserProps(user.sub);

  const questions = await getSavedQuestions(user.sub);

  return (
    <div className="flex flex-col mt-16">
      {/*header*/}
      <ProfileHeader
        user={{
          profile_pic: userProfile?.data?.profile_pic || null,
          fullname: userProfile?.data?.fullname || "User",
          email: userProfile?.data?.email || "",
          motto: userProfile?.data?.motto || null,
          bio: userProfile?.data?.bio || null,
        }}
        userId={user.sub}
        userLinks={userLink.data || []}
      />

      {/*tabs*/}
      <ProfileTabs />

      {/*body */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center gap-3">
            <Bookmark className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Pertanyaan yang Disimpan</h1>
          </div>

          <SavedQuestionsList savedQuestions={questions} />
        </div>
      </div>
    </div>
  );
}
