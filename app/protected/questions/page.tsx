import { ProfileTabs } from "@/components/Profiles/Tabs";
import ProfileHeader from "@/components/Profiles/ProfileHeader";
import { Bookmark } from "lucide-react";
import { getUser } from "@/utils/GetUser";
import { redirect } from "next/navigation";
import { GetUserProps } from "@/lib/profiles";
import { getQuestionsFromUserID } from "@/lib/questions";
import YourQuestionsList from "@/components/Profiles/YourQuestionsList";

export default async function YouQuestions() {
  const user = await getUser();

  if (!user) redirect("/auth/login");

  const { userProfile, userLink } = await GetUserProps(user.sub);

  const questions = await getQuestionsFromUserID(user.sub);

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
            <h1 className="text-2xl font-bold">Pertanyaan kamu</h1>
          </div>

          <YourQuestionsList questions={questions} />
        </div>
      </div>
    </div>
  );
}
