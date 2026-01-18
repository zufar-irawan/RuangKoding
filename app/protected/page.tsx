import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { GetUserProps } from "@/lib/profiles";
import { getDashboardStats } from "@/lib/dashboard";
import ProfileHeader from "@/components/Profiles/ProfileHeader";
import ProfileTabs from "@/components/Profiles/Tabs/ProfileTabs";
import LevelBar from "@/components/Profiles/LevelBar";
import StatsCard from "@/components/Dashboard/StatsCard";
import AnswersChart from "@/components/Dashboard/AnswersChart";
import {
  MessageSquare,
  CheckCircle,
  TrendingUp,
  HelpCircle,
} from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profil Kamu - RuangKoding",
  description: "Your dashboard on RuangKoding",
};

export default async function ProtectedPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  const { userLink, userProfile } = await GetUserProps(data?.claims?.sub);
  const user = userProfile.data;

  const dashboardStats = await getDashboardStats(data?.claims?.sub || "");

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
          {/* Level Bar Section */}
          <div className="bg-card border rounded-lg p-4 sm:p-6 shadow-sm">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
              Progress Kamu
            </h2>
            <LevelBar level={user?.level || 1} xp={user?.xp || 0} />
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <StatsCard
              title="Total Jawaban"
              value={dashboardStats.totalAnswers}
              icon={MessageSquare}
              description="Jawaban yang kamu berikan"
            />
            <StatsCard
              title="Jawaban Helpful"
              value={dashboardStats.totalHelpfulAnswers}
              icon={CheckCircle}
              description="Ditandai sebagai helpful"
            />
            <StatsCard
              title="Upvote Pertanyaan"
              value={dashboardStats.totalQuestionUpvotes}
              icon={TrendingUp}
              description="Total upvote yang diterima"
            />
            <StatsCard
              title="Pertanyaan Dibuat"
              value={dashboardStats.totalQuestionsAsked}
              icon={HelpCircle}
              description="Pertanyaan yang kamu buat"
            />
          </div>

          {/* Diagram garis buat terjawab bulanan */}
          <AnswersChart data={dashboardStats.monthlyAnswers} />
        </div>
      </div>
    </div>
  );
}
