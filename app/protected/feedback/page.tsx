import { ProfileTabs } from "@/components/Profiles/Tabs";
import ProfileHeader from "@/components/Profiles/ProfileHeader";
import { MessageSquare } from "lucide-react";
import { getUser } from "@/utils/GetUser";
import { redirect } from "next/navigation";
import { GetUserProps } from "@/lib/profiles";
import { getFeedbackRequestsByUserId } from "@/lib/servers/FeedbackRequestAction";
import YourFeedbackList from "@/components/Profiles/YourFeedbackList";
import Pagination from "@/components/pagination";

type UserFeedbackPageProps = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function UserFeedbackPage({
    searchParams,
}: UserFeedbackPageProps) {
    const user = await getUser();

    if (!user) redirect("/auth/login");

    const { userProfile, userLink } = await GetUserProps(user.sub);

    const resolvedSearchParams = await searchParams;
    const page = Number(resolvedSearchParams.page) || 1;
    const limit = 10;

    const { data, total } = await getFeedbackRequestsByUserId(
        user.sub,
        page,
        limit,
    );

    const totalPages = Math.ceil((total || 0) / limit);

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
                <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 text-primary shrink-0" />
                        <h1 className="text-xl sm:text-2xl font-bold">Feedback kamu</h1>
                    </div>

                    <YourFeedbackList feedbackRequests={data} />

                    <div className="mt-4">
                        <Pagination
                            currentPage={page}
                            totalPages={totalPages}
                            baseUrl="/protected/feedback"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
