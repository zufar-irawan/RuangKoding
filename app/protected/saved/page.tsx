import { redirect } from "next/navigation";
import { GetUserProps } from "@/lib/profiles";
import { getSavedQuestions } from "@/lib/questions";
import { getSavedFeedbackRequests } from "@/lib/servers/FeedbackRequestAction";
import ProfileHeader from "@/components/Profiles/ProfileHeader";
import ProfileTabs from "@/components/Profiles/Tabs/ProfileTabs";
import SavedQuestionsList from "@/components/Profiles/SavedQuestionsList";
import SavedFeedbackList from "@/components/Profiles/SavedFeedbackList";
import Pagination from "@/components/pagination";
import { Bookmark, MessageSquare } from "lucide-react";
import { getUser } from "@/utils/GetUser";

type SavedPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function SavedPage({ searchParams }: SavedPageProps) {
  const user = await getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { userProfile, userLink } = await GetUserProps(user.sub);

  const resolvedSearchParams = await searchParams;
  const qPage = Number(resolvedSearchParams.q_page) || 1;
  const fPage = Number(resolvedSearchParams.f_page) || 1;
  const limit = 3;

  const questionsData = await getSavedQuestions(user.sub, qPage, limit);
  const feedbackData = await getSavedFeedbackRequests(user.sub, fPage, limit);

  const questions = questionsData.data;
  const totalQuestions = questionsData.total || 0;
  const totalQuestionPages = Math.ceil(totalQuestions / limit);

  const feedback = feedbackData.data;
  const totalFeedback = feedbackData.total || 0;
  const totalFeedbackPages = Math.ceil(totalFeedback / limit);

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
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6 md:py-8">
        <div className="max-w-4xl mx-auto space-y-8 sm:space-y-10">
          {/* Saved Questions Section */}
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <Bookmark className="h-5 w-5 sm:h-6 sm:w-6 text-primary shrink-0" />
              <h1 className="text-xl sm:text-2xl font-bold">
                Pertanyaan yang Disimpan
              </h1>
            </div>

            <SavedQuestionsList savedQuestions={questions} />

            {/* Questions Pagination */}
            <div className="mt-4">
              <Pagination
                currentPage={qPage}
                totalPages={totalQuestionPages}
                baseUrl="/protected/saved"
                pageParamName="q_page"
              />
            </div>
          </div>

          <div className="border-t border-border/50" />

          {/* Saved Feedback Section */}
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 text-primary shrink-0" />
              <h1 className="text-xl sm:text-2xl font-bold">
                Feedback yang Disimpan
              </h1>
            </div>

            <SavedFeedbackList savedFeedback={feedback} />

            {/* Feedback Pagination */}
            <div className="mt-4">
              <Pagination
                currentPage={fPage}
                totalPages={totalFeedbackPages}
                baseUrl="/protected/saved"
                pageParamName="f_page"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
